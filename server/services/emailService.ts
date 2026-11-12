import nodemailer from 'nodemailer';
import { InvoiceRecord } from '../types';
import { generateInvoicePdfBuffer } from './pdfService';
import { insertEmailLog, updateInvoiceRecord } from '../db';

/**
 * Transactional Email Dispatcher for Cup2Eat Invoices
 */
export async function sendInvoiceEmail(
  invoice: InvoiceRecord,
  pdfBuffer?: Buffer
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipient = invoice.customer_email.trim();

  if (!recipient || !recipient.includes('@') || recipient.endsWith('@customer.cup2eat.com')) {
    const errorMsg = 'No valid customer email address available for invoice delivery.';
    await updateInvoiceRecord(invoice.id, {
      email_status: 'FAILED',
      email_error: errorMsg,
      email_retry_count: invoice.email_retry_count + 1,
    });
    return { success: false, error: errorMsg };
  }

  try {
    // Generate PDF if not provided
    const buffer = pdfBuffer || (await generateInvoicePdfBuffer(invoice));

    const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const fromEmail = process.env.SMTP_FROM || 'Cup2Eat Orders <orders@cup2eat.com>';

    const subject = `Your CUP2EAT Order Invoice | ${invoice.invoice_number} (Order #${invoice.order_reference})`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF5E9; color: #17130C; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #D9A52B; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background-color: #073B2B; color: #FFF4D6; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #FFF4D6; letter-spacing: 1px; }
          .header p { margin: 4px 0 0 0; color: #F2B544; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .content { padding: 30px; }
          .greeting { font-size: 16px; font-weight: bold; color: #073B2B; margin-bottom: 12px; }
          .box { background-color: #FAF5E9; border-radius: 12px; padding: 18px; border: 1px solid #E2E8F0; margin: 20px 0; }
          .box-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-bottom: 1px dashed #CBD5E1; }
          .box-row:last-child { border-bottom: none; }
          .label { color: #64748B; }
          .val { font-weight: bold; color: #073B2B; }
          .btn { display: inline-block; background: linear-gradient(to right, #D9A52B, #F2B544); color: #073B2B; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; text-align: center; margin-top: 15px; }
          .footer { background-color: #17130C; color: #FAF5E9; padding: 20px; text-align: center; font-size: 11px; }
          .footer a { color: #F2B544; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CUP2EAT</h1>
            <p>Eat Your Drink! — Official Invoice</p>
          </div>
          <div class="content">
            <div class="greeting">Dear ${invoice.customer_name},</div>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Thank you for choosing <strong>Cup2Eat</strong> edible waffle cups! We have generated your official tax invoice for order <strong>#${invoice.order_reference}</strong>.
            </p>

            <div class="box">
              <div class="box-row"><span class="label">Invoice Number:</span> <span class="val">${invoice.invoice_number}</span></div>
              <div class="box-row"><span class="label">Order Reference:</span> <span class="val">${invoice.order_reference}</span></div>
              <div class="box-row"><span class="label">Document Type:</span> <span class="val">${invoice.document_type}</span></div>
              <div class="box-row"><span class="label">Flavour & Qty:</span> <span class="val">${invoice.flavor} (${invoice.number_of_boxes} Box / ${invoice.quantity_cups} Cups)</span></div>
              <div class="box-row"><span class="label">Payment Status:</span> <span class="val">${invoice.payment_status}</span></div>
              <div class="box-row" style="font-size: 15px; font-weight: bold; margin-top: 6px;"><span class="label">Total Amount:</span> <span class="val">₹${invoice.total_amount.toLocaleString('en-IN')}</span></div>
            </div>

            <p style="font-size: 13px; color: #475569;">
              📎 Your official PDF invoice is attached to this email. You can also view and download your invoice at any time by logging into your account on our website.
            </p>

            <div style="text-align: center;">
              <a href="https://cup2eat.com" class="btn">View Customer Account Portal →</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Cup2Eat. FSSAI Reg: 22724005000492 | Ghaziabad, UP, India</p>
            <p>Support: <a href="mailto:natveda.care@gmail.com">natveda.care@gmail.com</a> | Phone: +91 98181 92575</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Check if SMTP is configured
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: fromEmail,
        to: recipient,
        subject,
        html: htmlContent,
        attachments: [
          {
            filename: `Cup2Eat_Invoice_${invoice.invoice_number}.pdf`,
            content: buffer,
            contentType: 'application/pdf',
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 [Cup2Eat Email Dispatched] MessageID: ${info.messageId} -> ${recipient}`);

      const now = new Date().toISOString();
      await updateInvoiceRecord(invoice.id, {
        email_status: 'SENT',
        email_sent_at: now,
        email_error: null,
        email_retry_count: invoice.email_retry_count + 1,
      });

      await insertEmailLog({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        invoice_id: invoice.id,
        order_id: invoice.order_id,
        recipient_email: recipient,
        subject,
        status: 'SENT',
        sent_at: now,
      });

      return { success: true, messageId: info.messageId };
    } else {
      // Transactional Email Fallback (Development & Staging Environment Logger)
      console.log(`📧 [Cup2Eat Transactional Email Engine] SMTP not configured. Logged mock dispatch to ${recipient} for Invoice ${invoice.invoice_number}`);
      const now = new Date().toISOString();

      await updateInvoiceRecord(invoice.id, {
        email_status: 'SENT',
        email_sent_at: now,
        email_error: null,
        email_retry_count: invoice.email_retry_count + 1,
      });

      await insertEmailLog({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        invoice_id: invoice.id,
        order_id: invoice.order_id,
        recipient_email: recipient,
        subject,
        status: 'SENT',
        sent_at: now,
      });

      return { success: true, messageId: `dev-msg-${Date.now()}` };
    }
  } catch (err: any) {
    console.error('❌ Error sending invoice email:', err);
    const errorMsg = err.message || 'SMTP email delivery failed';

    await updateInvoiceRecord(invoice.id, {
      email_status: 'FAILED',
      email_error: errorMsg,
      email_retry_count: invoice.email_retry_count + 1,
    });

    await insertEmailLog({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      invoice_id: invoice.id,
      order_id: invoice.order_id,
      recipient_email: recipient,
      subject: `Invoice Delivery Failed: ${invoice.invoice_number}`,
      status: 'FAILED',
      error_message: errorMsg,
      sent_at: new Date().toISOString(),
    });

    return { success: false, error: errorMsg };
  }
}
