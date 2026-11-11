import { Router } from 'express';
import { insertWholesaleEnquiry } from '../db';
import { validateWholesaleInput, sanitizeText } from '../validators';
import { WholesaleEnquiryRecord } from '../types';

export const wholesaleRouter = Router();

// POST /api/wholesale-enquiries - Submit wholesale deal enquiry
wholesaleRouter.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      business_name,
      email,
      phone,
      city,
      quantity_boxes,
      quantity_cups,
      product_preferences,
      message,
    } = req.body;

    const validation = validateWholesaleInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const id = `whl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const boxes = parseInt(quantity_boxes) || 1;
    const cups = parseInt(quantity_cups) || boxes * 396;

    const record: WholesaleEnquiryRecord = {
      id,
      customer_name: sanitizeText(customer_name),
      business_name: sanitizeText(business_name),
      email: sanitizeText(email),
      phone: sanitizeText(phone),
      city: sanitizeText(city),
      quantity_boxes: boxes,
      quantity_cups: cups,
      product_preferences: sanitizeText(product_preferences || 'Mixed Assortment'),
      message: sanitizeText(message || 'Wholesale package enquiry'),
      status: 'pending',
      created_at: now,
      updated_at: now,
    };

    const savedRecord = await insertWholesaleEnquiry(record);

    console.log(`✅ Stored Wholesale Enquiry [${id}] - ${boxes} Box (${cups} cups) for ${customer_name}`);

    res.status(201).json({
      success: true,
      message: 'Wholesale enquiry recorded successfully in persistent database.',
      data: savedRecord,
    });
  } catch (error: any) {
    console.error('❌ Error storing wholesale enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record wholesale enquiry.',
    });
  }
});
