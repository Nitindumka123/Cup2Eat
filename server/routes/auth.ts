import { Request, Response, NextFunction } from 'express';
import {
  createOrGetOtpRequest,
  verifyOtpCode,
  getOrCreateCustomer,
  createCustomerSession,
  verifyCustomerToken,
  revokeCustomerToken,
  getCustomerOrders,
  updateCustomerProfile,
} from '../db';
import { sanitizeText } from '../validators';

// Customer Auth Middleware protecting /api/customer/* routes
export async function customerAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Customer authentication required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const customer = await verifyCustomerToken(token);

  if (!customer) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired customer session',
    });
    return;
  }

  (req as any).customer = customer;
  (req as any).customerToken = token;
  next();
}

// 1. Send OTP Request (Email or Phone)
export async function handleSendOtp(req: Request, res: Response): Promise<void> {
  try {
    const { target, target_type } = req.body;

    if (!target || !target_type || (target_type !== 'email' && target_type !== 'phone')) {
      res.status(400).json({
        success: false,
        error: 'Target (email or phone) and target_type are required.',
      });
      return;
    }

    const result = await createOrGetOtpRequest(target, target_type);

    if (result.error || !result.otp) {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to dispatch OTP verification code.',
      });
      return;
    }

    res.json({
      success: true,
      message: `OTP verification code sent to ${target_type === 'email' ? 'email' : 'mobile number'}.`,
      data: {
        cooldown_seconds: 60,
        dev_code: result.otp.otp_code,
      },
      expires_in_seconds: 600,
    });
  } catch (err: any) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).json({
      success: false,
      error: 'Server error generating verification code. Please try again.',
    });
  }
}

// 2. Verify OTP Code & Authenticate Customer
export async function handleVerifyOtp(req: Request, res: Response): Promise<void> {
  try {
    const { target, target_type, code, full_name } = req.body;

    if (!target || !code) {
      res.status(400).json({
        success: false,
        error: 'Recipient target and 6-digit OTP code are required.',
      });
      return;
    }

    const verification = await verifyOtpCode(target, code);

    if (!verification.success) {
      res.status(400).json({
        success: false,
        error: verification.error || 'Invalid OTP code.',
      });
      return;
    }

    // OTP Verified -> Get or Create Customer
    const cleanTarget = target.trim();
    const isEmail = target_type === 'email' || cleanTarget.includes('@');

    const customer = await getOrCreateCustomer({
      email: isEmail ? cleanTarget : undefined,
      phone: !isEmail ? cleanTarget : undefined,
      full_name: full_name ? sanitizeText(full_name) : undefined,
    });

    const session = await createCustomerSession(customer.id);

    res.json({
      success: true,
      message: 'Authentication successful',
      token: session.token,
      customer: session.customer,
      user: session.customer,
    });
  } catch (err: any) {
    console.error('❌ Error verifying OTP:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during OTP verification.',
    });
  }
}

// 3. Get Current Customer Profile
export async function handleGetCustomerMe(req: Request, res: Response): Promise<void> {
  const customer = (req as any).customer;
  res.json({
    success: true,
    data: customer,
  });
}

// 4. Update Customer Profile
export async function handleUpdateCustomerMe(req: Request, res: Response): Promise<void> {
  try {
    const customer = (req as any).customer;
    const { full_name, email, phone, default_address, default_city, default_pincode } = req.body;

    const updated = await updateCustomerProfile(customer.id, {
      ...(full_name ? { full_name: sanitizeText(full_name) } : {}),
      ...(email ? { email: sanitizeText(email).toLowerCase() } : {}),
      ...(phone ? { phone: sanitizeText(phone) } : {}),
      ...(default_address ? { default_address: sanitizeText(default_address) } : {}),
      ...(default_city ? { default_city: sanitizeText(default_city) } : {}),
      ...(default_pincode ? { default_pincode: sanitizeText(default_pincode) } : {}),
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update customer profile' });
  }
}

// 5. Get Customer Specific Orders
export async function handleGetCustomerOrders(req: Request, res: Response): Promise<void> {
  try {
    const customer = (req as any).customer;
    const orders = await getCustomerOrders(customer.id, customer.email, customer.phone);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch customer orders' });
  }
}

// 6. Customer Logout
export async function handleCustomerLogout(req: Request, res: Response): Promise<void> {
  try {
    const token = (req as any).customerToken;
    if (token) {
      await revokeCustomerToken(token);
    }
    res.json({
      success: true,
      message: 'Customer session logged out successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to logout session' });
  }
}
