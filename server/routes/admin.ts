import { Request, Response, NextFunction } from 'express';
import {
  authenticateAdmin,
  verifyAdminToken,
  revokeAdminToken,
  getDashboardMetrics,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getProducts,
  updateProduct,
  getSiteSettings,
  updateSiteSettings,
  updateB2BEnquiryStatus,
  updateWholesaleEnquiryStatus,
} from '../db';
import { sanitizeText } from '../validators';
import fs from 'fs';
import path from 'path';

// Auth Middleware protecting /api/admin/* routes
export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const user = await verifyAdminToken(token);

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired admin session token',
    });
    return;
  }

  (req as any).adminUser = user;
  (req as any).adminToken = token;
  next();
}

// 1. Admin Login
export async function handleAdminLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const authResult = await authenticateAdmin(email, password);

    if (!authResult) {
      res.status(401).json({
        success: false,
        error: 'Invalid administrator email or password',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Admin authentication successful',
      token: authResult.token,
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.role,
      },
    });
  } catch (err: any) {
    console.error('❌ Admin login error:', err);
    res.status(500).json({
      success: false,
      error: 'Admin authentication failed',
    });
  }
}

// 2. Admin Logout
export async function handleAdminLogout(req: Request, res: Response): Promise<void> {
  try {
    const token = (req as any).adminToken;
    if (token) {
      await revokeAdminToken(token);
    }
    res.json({
      success: true,
      message: 'Admin session logged out successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to logout session' });
  }
}

// 3. Admin Profile
export async function handleGetAdminMe(req: Request, res: Response): Promise<void> {
  const user = (req as any).adminUser;
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}

// 4. Admin Dashboard Metrics & Real Stats
export async function handleGetDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const metrics = await getDashboardMetrics();
    res.json({
      success: true,
      data: metrics,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to calculate dashboard statistics' });
  }
}

// 5. Orders Management APIs
export async function handleGetAdminOrders(req: Request, res: Response): Promise<void> {
  try {
    const { search, status, category } = req.query;
    let orders = await getOrders();

    if (status && typeof status === 'string' && status !== 'ALL') {
      orders = orders.filter((o) => o.status === status);
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      orders = orders.filter((o) => o.order_category === category);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.order_reference.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch admin orders' });
  }
}

import { syncInvoiceWithOrderUpdate } from '../services/invoiceService';

export async function handleUpdateAdminOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, payment_status, delivery_status, internal_notes } = req.body;

    const updated = await updateOrderStatus(id, {
      ...(status ? { status } : {}),
      ...(payment_status ? { payment_status } : {}),
      ...(delivery_status ? { delivery_status } : {}),
      ...(internal_notes !== undefined ? { internal_notes: sanitizeText(internal_notes) } : {}),
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'Order record not found' });
      return;
    }

    // Synchronize invoice document type, payment status & transactional email
    try {
      await syncInvoiceWithOrderUpdate(updated);
    } catch (invErr) {
      console.error('⚠️ Error syncing invoice on order update:', invErr);
    }

    res.json({
      success: true,
      message: `Order ${updated.order_reference} updated successfully in database`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
}

// 6. B2B & Wholesale Status Management APIs
export async function handleUpdateAdminB2B(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, internal_notes } = req.body;

    const updated = await updateB2BEnquiryStatus(id, status, sanitizeText(internal_notes));
    if (!updated) {
      res.status(404).json({ success: false, error: 'B2B Enquiry record not found' });
      return;
    }

    res.json({
      success: true,
      message: 'B2B Enquiry status updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update B2B enquiry status' });
  }
}

export async function handleUpdateAdminWholesale(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateWholesaleEnquiryStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Wholesale enquiry record not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Wholesale enquiry status updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update wholesale enquiry status' });
  }
}

// 7. Products & Configuration Management APIs
export async function handleGetAdminProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await getProducts(true);
    res.json({ success: true, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch products for admin' });
  }
}

export async function handleUpdateAdminProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { price, active, description, name } = req.body;

    const updated = await updateProduct(id, {
      ...(price !== undefined ? { price: price === null ? null : parseFloat(price) } : {}),
      ...(active !== undefined ? { active: Boolean(active) } : {}),
      ...(description ? { description: sanitizeText(description) } : {}),
      ...(name ? { name: sanitizeText(name) } : {}),
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Product configuration updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
}

// 8. Site Settings APIs
export async function handleGetAdminSettings(req: Request, res: Response): Promise<void> {
  try {
    const settings = await getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch site settings' });
  }
}

export async function handleUpdateAdminSettings(req: Request, res: Response): Promise<void> {
  try {
    const { promotional_wholesale_price, promotional_wholesale_cups, contact_phone, contact_email } = req.body;

    const updated = await updateSiteSettings({
      ...(promotional_wholesale_price !== undefined
        ? { promotional_wholesale_price: parseInt(promotional_wholesale_price, 10) }
        : {}),
      ...(promotional_wholesale_cups !== undefined
        ? { promotional_wholesale_cups: parseInt(promotional_wholesale_cups, 10) }
        : {}),
      ...(contact_phone ? { contact_phone: sanitizeText(contact_phone) } : {}),
      ...(contact_email ? { contact_email: sanitizeText(contact_email) } : {}),
    });

    res.json({
      success: true,
      message: 'Site promotional settings updated successfully in database',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update site settings' });
  }
}
