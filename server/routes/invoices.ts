import { Request, Response } from 'express';
import {
  getInvoiceById,
  getAllInvoices,
  getCustomerInvoices,
  getEmailLogsByInvoiceId,
  verifyCustomerToken,
  verifyAdminToken,
} from '../db';
import { generateInvoicePdfBuffer } from '../services/pdfService';
import { resendInvoiceEmail } from '../services/invoiceService';

/**
 * 1. PDF Download Endpoint: GET /api/invoices/:id/download
 * Public or Authorized Download Stream for PDF Invoices
 */
export async function handleDownloadInvoicePdf(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice record not found' });
      return;
    }

    // Optional Authorization Check if bearer header or token param provided
    const authHeader = req.headers.authorization;
    const tokenQuery = req.query.token as string;
    const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : tokenQuery;

    if (token) {
      const admin = await verifyAdminToken(token);
      const customer = await verifyCustomerToken(token);

      if (!admin && !customer) {
        res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
        return;
      }

      if (customer && !admin) {
        const isOwner =
          invoice.customer_id === customer.id ||
          (customer.email && invoice.customer_email.toLowerCase() === customer.email.toLowerCase());
        if (!isOwner) {
          res.status(403).json({ success: false, error: 'Forbidden: You do not have permission to view this invoice' });
          return;
        }
      }
    }

    const pdfBuffer = await generateInvoicePdfBuffer(invoice);

    const fileName = `Cup2Eat_Invoice_${invoice.invoice_number}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error('❌ Error generating invoice PDF download:', err);
    res.status(500).json({ success: false, error: 'Failed to generate PDF document' });
  }
}

/**
 * 2. Customer Invoices List: GET /api/customer/invoices
 */
export async function handleGetCustomerInvoices(req: Request, res: Response): Promise<void> {
  try {
    const customer = (req as any).customer;
    if (!customer) {
      res.status(401).json({ success: false, error: 'Customer authentication required' });
      return;
    }

    const invoices = await getCustomerInvoices(customer.id, customer.email);

    res.json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  } catch (err: any) {
    console.error('❌ Error fetching customer invoices:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve customer invoices' });
  }
}

/**
 * 3. Protected Admin Invoices List: GET /api/admin/invoices
 */
export async function handleGetAdminInvoices(req: Request, res: Response): Promise<void> {
  try {
    const { search, status } = req.query;
    const invoices = await getAllInvoices({
      search: search as string,
      status: status as string,
    });

    res.json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  } catch (err: any) {
    console.error('❌ Error fetching admin invoices:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve admin invoices' });
  }
}

/**
 * 4. Protected Admin Invoice Detail & Email Logs: GET /api/admin/invoices/:id
 */
export async function handleGetAdminInvoiceDetail(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found' });
      return;
    }

    const emailLogs = await getEmailLogsByInvoiceId(invoice.id);

    res.json({
      success: true,
      data: {
        ...invoice,
        email_logs: emailLogs,
      },
    });
  } catch (err: any) {
    console.error('❌ Error getting invoice details:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve invoice details' });
  }
}

/**
 * 5. Protected Admin Retry Email: POST /api/admin/invoices/:id/resend-email
 */
export async function handleAdminResendInvoiceEmail(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await resendInvoiceEmail(id);

    if (result.success) {
      res.json({
        success: true,
        message: 'Invoice email resent successfully.',
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to resend invoice email.',
      });
    }
  } catch (err: any) {
    console.error('❌ Error resending invoice email:', err);
    res.status(500).json({ success: false, error: 'Server error while retrying invoice email delivery' });
  }
}
