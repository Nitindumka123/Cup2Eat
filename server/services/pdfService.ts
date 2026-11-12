import PDFDocument from 'pdfkit';
import { InvoiceRecord } from '../types';

/**
 * Generates a professional server-side PDF invoice Buffer using pdfkit.
 */
export function generateInvoicePdfBuffer(invoice: InvoiceRecord): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Brand Palette
      const forestGreen = '#073B2B';
      const warmGold = '#D9A52B';
      const darkText = '#17130C';
      const lightBg = '#FAF5E9';
      const slateGray = '#555555';

      // 1. Header & Brand Wordmark
      doc.rect(0, 0, doc.page.width, 110).fill(forestGreen);

      doc.fillColor('#FFF4D6').fontSize(24).font('Helvetica-Bold').text('CUP2EAT', 40, 30);
      doc.fillColor(warmGold).fontSize(10).font('Helvetica-Bold').text('EAT YOUR DRINK!', 40, 58);
      doc.fillColor('#E2E8F0').fontSize(9).font('Helvetica').text('Ancient Wisdom. Modern Sustainability.', 40, 72);

      // Document Title Badge on right side
      const docTitle =
        invoice.document_type === 'TAX_INVOICE'
          ? 'OFFICIAL TAX INVOICE'
          : invoice.document_type === 'CREDIT_NOTE'
          ? 'CREDIT NOTE / REFUND'
          : 'PROFORMA INVOICE';

      doc.fillColor(warmGold).fontSize(14).font('Helvetica-Bold').text(docTitle, 320, 32, { align: 'right' });
      doc.fillColor('#FFF4D6').fontSize(10).font('Helvetica').text(`Invoice #: ${invoice.invoice_number}`, 320, 52, { align: 'right' });
      doc.text(`Order Ref: ${invoice.order_reference}`, 320, 66, { align: 'right' });
      doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 320, 80, { align: 'right' });

      // 2. Company Info & Customer Info Grid
      let y = 130;

      // Seller Block (Left)
      doc.fillColor(forestGreen).fontSize(10).font('Helvetica-Bold').text('SELLER & MANUFACTURER:', 40, y);
      y += 15;
      doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text('CUP2EAT (A Brand by Varun Khera)');
      doc.font('Helvetica').fillColor(slateGray);
      doc.text('Plot 42, Industrial Area, Site 4, Sahibabad');
      doc.text('Ghaziabad, Uttar Pradesh — 201010, India');
      doc.text('FSSAI Reg. No: 22724005000492');
      doc.text('Email: varun@cup2eat.com | Support: natveda.care@gmail.com');
      doc.text('Phone / WhatsApp: +91 98181 92575');

      // Customer Block (Right)
      const customerY = 130;
      doc.fillColor(forestGreen).fontSize(10).font('Helvetica-Bold').text('BILLED & SHIPPED TO:', 320, customerY);
      doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text(invoice.customer_name, 320, customerY + 15);
      doc.font('Helvetica').fillColor(slateGray);
      doc.text(`Address: ${invoice.billing_address}`, 320, customerY + 28, { width: 235 });
      doc.text(`City: ${invoice.city} ${invoice.pincode ? `- ${invoice.pincode}` : ''}`, 320, customerY + 54);
      doc.text(`Email: ${invoice.customer_email || 'N/A'}`, 320, customerY + 67);
      doc.text(`Phone: ${invoice.customer_phone}`, 320, customerY + 80);

      y = 235;

      // Payment Status Banner
      const statusBg = invoice.payment_status === 'PAID' ? '#DCFCE7' : '#FEF3C7';
      const statusText = invoice.payment_status === 'PAID' ? '#166534' : '#92400E';

      doc.rect(40, y, 515, 26).fillAndStroke(statusBg, warmGold);
      doc.fillColor(statusText).fontSize(9).font('Helvetica-Bold').text(
        `PAYMENT STATUS: ${invoice.payment_status}  |  PAYMENT METHOD: ${invoice.payment_method || 'Online / COD'}`,
        50,
        y + 8
      );

      y += 40;

      // 3. Itemized Table Header
      doc.rect(40, y, 515, 22).fill(forestGreen);
      doc.fillColor('#FFF4D6').fontSize(9).font('Helvetica-Bold');
      doc.text('S.No.', 48, y + 6);
      doc.text('Item Description & Specs', 85, y + 6);
      doc.text('HSN', 270, y + 6);
      doc.text('Qty (Boxes)', 320, y + 6);
      doc.text('Rate/Box', 400, y + 6);
      doc.text('Total (₹)', 485, y + 6, { align: 'right' });

      y += 22;

      // Table Row
      doc.rect(40, y, 515, 45).fillAndStroke(lightBg, '#E2E8F0');
      doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text('1', 48, y + 10);

      const itemTitle = `Cup2Eat Edible Waffle Cup (100ml) — ${invoice.flavor} Flavour`;
      doc.text(itemTitle, 85, y + 10, { width: 175 });
      doc.fillColor(slateGray).fontSize(8).font('Helvetica').text(`Total ${invoice.quantity_cups} Cups (100ml Capacity)`, 85, y + 25);

      doc.fillColor(darkText).fontSize(9).font('Helvetica');
      doc.text('19053100', 270, y + 10);
      doc.text(`${invoice.number_of_boxes} Box (${invoice.quantity_cups} Pcs)`, 320, y + 10);
      doc.text(`₹${invoice.unit_price_per_box.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 400, y + 10);
      doc.font('Helvetica-Bold').text(`₹${(invoice.number_of_boxes * invoice.unit_price_per_box).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 485, y + 10, { align: 'right' });

      y += 55;

      // 4. Financial Calculations & Tax Breakdown Table
      const calcX = 300;
      doc.rect(calcX, y, 255, 120).fillAndStroke('#FFFFFF', '#CBD5E1');

      let rowY = y + 8;
      doc.fillColor(slateGray).fontSize(9).font('Helvetica').text('Subtotal (Inclusive Tax):', calcX + 10, rowY);
      doc.fillColor(darkText).text(`₹${invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, calcX + 140, rowY, { align: 'right', width: 105 });

      rowY += 16;
      doc.fillColor(slateGray).text('Taxable Value:', calcX + 10, rowY);
      doc.fillColor(darkText).text(`₹${invoice.taxable_value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, calcX + 140, rowY, { align: 'right', width: 105 });

      rowY += 16;
      doc.fillColor(slateGray).text('CGST (9%):', calcX + 10, rowY);
      doc.fillColor(darkText).text(`₹${invoice.cgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, calcX + 140, rowY, { align: 'right', width: 105 });

      rowY += 16;
      doc.fillColor(slateGray).text('SGST (9%):', calcX + 10, rowY);
      doc.fillColor(darkText).text(`₹${invoice.sgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, calcX + 140, rowY, { align: 'right', width: 105 });

      rowY += 16;
      doc.fillColor(slateGray).text('Shipping & Delivery:', calcX + 10, rowY);
      doc.fillColor('#166534').font('Helvetica-Bold').text('FREE (Included)', calcX + 140, rowY, { align: 'right', width: 105 });

      rowY += 20;
      doc.rect(calcX, rowY - 4, 255, 26).fill(forestGreen);
      doc.fillColor(warmGold).fontSize(11).font('Helvetica-Bold').text('GRAND TOTAL PAID:', calcX + 10, rowY + 2);
      doc.fillColor('#FFF4D6').fontSize(11).font('Helvetica-Bold').text(`₹${invoice.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, calcX + 140, rowY + 2, { align: 'right', width: 105 });

      // Left Side Declaration & Notes
      doc.fillColor(forestGreen).fontSize(9).font('Helvetica-Bold').text('TERMS & DECLARATION:', 40, y);
      doc.fillColor(slateGray).fontSize(8).font('Helvetica');
      doc.text('1. Edible cups are 100% vegetarian, FSSAI registered, and zero-waste.', 40, y + 15, { width: 240 });
      doc.text('2. Store in a cool, dry place away from direct sunlight.', 40, y + 30, { width: 240 });
      doc.text('3. Goods once sold are covered under standard quality warranty.', 40, y + 45, { width: 240 });
      doc.text('4. Computer generated tax invoice. No signature required.', 40, y + 60, { width: 240 });

      // Signatory Box
      const sigY = y + 80;
      doc.fillColor(darkText).fontSize(8).font('Helvetica-Bold').text('For CUP2EAT (Authorized Signatory)', 40, sigY);
      doc.fillColor(slateGray).fontSize(8).font('Helvetica').text('Founder & CEO: Varun Khera', 40, sigY + 12);

      // 5. Footer Bar
      const footerY = doc.page.height - 40;
      doc.rect(0, footerY, doc.page.width, 40).fill(forestGreen);
      doc.fillColor('#FFF4D6').fontSize(8).font('Helvetica').text(
        'Cup2Eat — Ancient Wisdom. Modern Sustainability. | www.cup2eat.com | Ghaziabad, UP, India',
        0,
        footerY + 14,
        { align: 'center' }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
