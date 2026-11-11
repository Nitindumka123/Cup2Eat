import { Router } from 'express';
import { insertB2BEnquiry } from '../db';
import { validateB2BInput, sanitizeText } from '../validators';
import { B2BEnquiryRecord } from '../types';

export const b2bRouter = Router();

// POST /api/b2b-enquiries - Submit commercial / cafe partnership enquiry
b2bRouter.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      business_name,
      business_type,
      email,
      phone,
      city,
      estimated_monthly_volume,
      co_branding_requested,
      message,
    } = req.body;

    const validation = validateB2BInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const id = `b2b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: B2BEnquiryRecord = {
      id,
      customer_name: sanitizeText(customer_name),
      business_name: sanitizeText(business_name),
      business_type: sanitizeText(business_type || 'Cafe'),
      email: sanitizeText(email),
      phone: sanitizeText(phone),
      city: sanitizeText(city || 'India'),
      estimated_monthly_volume: sanitizeText(estimated_monthly_volume || '396'),
      co_branding_requested: Boolean(co_branding_requested),
      message: sanitizeText(message || 'B2B commercial inquiry'),
      status: 'pending',
      created_at: now,
      updated_at: now,
    };

    const savedRecord = await insertB2BEnquiry(record);

    console.log(`✅ Stored B2B Enquiry [${id}] for ${business_name} (${customer_name})`);

    res.status(201).json({
      success: true,
      message: 'B2B Commercial enquiry recorded successfully in database.',
      data: savedRecord,
    });
  } catch (error: any) {
    console.error('❌ Error storing B2B enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store B2B enquiry.',
    });
  }
});
