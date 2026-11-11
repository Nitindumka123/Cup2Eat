import { Request, Response } from 'express';
import { insertOrder, getOrderById, getSiteSettings } from '../db';
import { validateOrderInput, sanitizeText } from '../validators';
import { OrderRecord } from '../types';

export async function handleCreateOrder(req: Request, res: Response): Promise<void> {
  try {
    const validation = validateOrderInput(req.body);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: 'Order validation failed',
        details: validation.errors,
      });
      return;
    }

    const {
      customer_name,
      phone,
      email,
      delivery_address,
      city,
      pincode,
      flavor,
      number_of_boxes,
      order_category,
      notes,
    } = req.body;

    const settings = await getSiteSettings();
    const boxQty = Math.max(1, parseInt(number_of_boxes, 10) || 1);
    const cupsPerBox = settings.promotional_wholesale_cups || 396;
    const pricePerBox = settings.promotional_wholesale_price || 3999;
    const totalAmount = boxQty * pricePerBox;
    const totalCups = boxQty * cupsPerBox;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const order_reference = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const orderRecord: OrderRecord = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order_reference,
      customer_name: sanitizeText(customer_name),
      phone: sanitizeText(phone),
      email: sanitizeText(email || ''),
      delivery_address: sanitizeText(delivery_address),
      city: sanitizeText(city),
      pincode: sanitizeText(pincode || ''),
      flavor: sanitizeText(flavor),
      quantity_cups: totalCups,
      number_of_boxes: boxQty,
      order_category: order_category === 'individual' ? 'individual' : 'wholesale',
      total_amount: totalAmount,
      notes: sanitizeText(notes || ''),
      status: 'NEW',
      payment_status: 'PENDING',
      delivery_status: 'PENDING',
      created_at: timestamp,
      updated_at: timestamp,
    };

    const saved = await insertOrder(orderRecord);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and persisted in backend database.',
      data: saved,
    });
  } catch (err: any) {
    console.error('❌ Error creating order:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to record customer order in backend database',
    });
  }
}

export async function handleGetOrderDetails(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err: any) {
    console.error('❌ Error getting order details:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order details',
    });
  }
}
