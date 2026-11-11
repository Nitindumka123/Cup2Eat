import { Router } from 'express';
import { insertEnquiry } from '../db';
import { validateEnquiryInput, sanitizeText } from '../validators';
import { EnquiryRecord } from '../types';

export const enquiriesRouter = Router();

// POST /api/enquiries - Submit general / product / sample enquiry
enquiriesRouter.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      email,
      phone,
      business_name,
      business_type,
      city,
      product_id,
      flavour,
      quantity,
      message,
      enquiry_type,
    } = req.body;

    const validation = validateEnquiryInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: EnquiryRecord = {
      id,
      enquiry_type: sanitizeText(enquiry_type || 'general'),
      customer_name: sanitizeText(customer_name),
      email: sanitizeText(email),
      phone: sanitizeText(phone),
      business_name: sanitizeText(business_name),
      business_type: sanitizeText(business_type),
      city: sanitizeText(city),
      product_id: sanitizeText(product_id),
      flavour: sanitizeText(flavour),
      quantity: sanitizeText(quantity),
      message: sanitizeText(message),
      status: 'pending',
      source: 'website',
      created_at: now,
      updated_at: now,
    };

    const savedRecord = await insertEnquiry(record);

    console.log(`✅ Stored Enquiry [${id}] for ${customer_name} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Enquiry successfully submitted and recorded in persistent database.',
      data: savedRecord,
    });
  } catch (error: any) {
    console.error('❌ Error storing enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while storing enquiry. Please try again or use WhatsApp.',
    });
  }
});
