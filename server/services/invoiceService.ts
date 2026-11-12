import {
  getOrderById,
  getInvoiceByOrderId,
  getInvoiceById,
  insertInvoice,
  updateInvoiceRecord,
  getAllInvoices,
} from '../db';
import { InvoiceRecord, OrderRecord } from '../types';
import { sendInvoiceEmail } from './emailService';
import { generateInvoicePdfBuffer } from './pdfService';

/**
 * Generates an idempotent invoice for an order.
 * Prevents duplicate invoice creation for the same order.
 */
export async function generateInvoiceForOrder(orderId: string): Promise<InvoiceRecord | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;

  // Idempotency check: return existing invoice if already created
  const existing = await getInvoiceByOrderId(orderId);
  if (existing) {
    return existing;
  }

  const allInvoices = await getAllInvoices();
  const nextSeq = allInvoices.length + 101;
  const year = new Date().getFullYear();
  const invoiceNumber = `INV-${year}-${nextSeq.toString().padStart(5, '0')}`;

  const totalAmount = order.total_amount || 3999;
  // Calculate 18% GST (Intra-state CGST 9% + SGST 9%)
  // Taxable Value + (Taxable Value * 0.18) = Total Amount
  // Taxable Value = Total Amount / 1.18
  const taxableValue = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalTax = Math.round((totalAmount - taxableValue) * 100) / 100;
  const cgstAmount = Math.round((totalTax / 2) * 100) / 100;
  const sgstAmount = Math.round((totalTax - cgstAmount) * 100) / 100;
  const unitPricePerBox = Math.round((totalAmount / order.number_of_boxes) * 100) / 100;

  const docType =
    order.payment_status === 'PAID'
      ? 'TAX_INVOICE'
      : order.status === 'CANCELLED'
      ? 'CREDIT_NOTE'
      : 'PROFORMA_INVOICE';

  const paymentStatus =
    order.payment_status === 'PAID'
      ? 'PAID'
      : order.payment_status === 'COD'
      ? 'COD_PENDING'
      : 'PENDING';

  const now = new Date().toISOString();

  const invoiceRecord: InvoiceRecord = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    invoice_number: invoiceNumber,
    order_id: order.id,
    order_reference: order.order_reference,
    customer_id: order.customer_id,
    customer_name: order.customer_name,
    customer_email: order.email || `${order.phone}@customer.cup2eat.com`,
    customer_phone: order.phone,
    billing_address: order.delivery_address,
    shipping_address: order.delivery_address,
    city: order.city,
    pincode: order.pincode,
    flavor: order.flavor,
    number_of_boxes: order.number_of_boxes,
    quantity_cups: order.quantity_cups,
    unit_price_per_box: unitPricePerBox,
    subtotal: totalAmount,
    discount_amount: 0,
    taxable_value: taxableValue,
    gst_rate: 18,
    cgst_amount: cgstAmount,
    sgst_amount: sgstAmount,
    igst_amount: 0,
    total_tax: totalTax,
    shipping_charge: 0,
    total_amount: totalAmount,
    document_type: docType,
    payment_status: paymentStatus,
    payment_method: order.payment_status === 'COD' ? 'Cash on Delivery (COD)' : 'Online / UPI',
    email_status: 'PENDING',
    email_sent_at: null,
    email_error: null,
    email_retry_count: 0,
    created_at: now,
    updated_at: now,
  };

  const saved = await insertInvoice(invoiceRecord);

  // Trigger transactional email asynchronously if email is present
  if (saved.customer_email && saved.customer_email.includes('@') && !saved.customer_email.endsWith('@customer.cup2eat.com')) {
    sendInvoiceEmail(saved).catch((err) => {
      console.error(`❌ Background email dispatch error for ${saved.invoice_number}:`, err);
    });
  }

  return saved;
}

/**
 * Synchronizes an invoice when an order status or payment status updates.
 */
export async function syncInvoiceWithOrderUpdate(order: OrderRecord): Promise<InvoiceRecord | null> {
  let invoice = await getInvoiceByOrderId(order.id);
  if (!invoice) {
    return generateInvoiceForOrder(order.id);
  }

  const updatedDocType =
    order.payment_status === 'PAID'
      ? 'TAX_INVOICE'
      : order.status === 'CANCELLED'
      ? 'CREDIT_NOTE'
      : 'PROFORMA_INVOICE';

  const updatedPaymentStatus =
    order.payment_status === 'PAID'
      ? 'PAID'
      : order.status === 'CANCELLED'
      ? 'REFUNDED'
      : order.payment_status === 'COD'
      ? 'COD_PENDING'
      : 'PENDING';

  const updated = await updateInvoiceRecord(invoice.id, {
    document_type: updatedDocType,
    payment_status: updatedPaymentStatus,
    customer_name: order.customer_name,
    customer_email: order.email || invoice.customer_email,
    customer_phone: order.phone,
    billing_address: order.delivery_address,
    city: order.city,
    pincode: order.pincode,
  });

  // Re-dispatch updated tax invoice email if payment status just transitioned to PAID
  if (updated && updatedPaymentStatus === 'PAID' && invoice.payment_status !== 'PAID') {
    sendInvoiceEmail(updated).catch((e) => console.error(e));
  }

  return updated;
}

/**
 * Admin retry trigger for sending invoice email.
 */
export async function resendInvoiceEmail(invoiceId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    return { success: false, error: 'Invoice not found' };
  }

  const pdfBuffer = await generateInvoicePdfBuffer(invoice);
  const result = await sendInvoiceEmail(invoice, pdfBuffer);

  return result;
}
