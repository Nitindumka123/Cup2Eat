import { app, ensureDbReady } from './app';
import http from 'http';

async function runBackendTests() {
  console.log('🧪 Starting Cup2Eat Automated Backend & Database Persistence Tests...\n');

  await ensureDbReady();

  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(3009, () => {
      console.log('📡 Test HTTP Server listening on port 3009');
      resolve();
    });
  });

  const baseUrl = 'http://127.0.0.1:3009';
  let passedCount = 0;
  let failedCount = 0;
  let adminToken = '';
  let createdOrderId = '';

  async function assertTest(name: string, fn: () => Promise<boolean>) {
    try {
      const success = await fn();
      if (success) {
        console.log(`  ✅ [PASS] ${name}`);
        passedCount++;
      } else {
        console.log(`  ❌ [FAIL] ${name}`);
        failedCount++;
      }
    } catch (err: any) {
      console.log(`  ❌ [FAIL] ${name}: ${err.message}`);
      failedCount++;
    }
  }

  // Test 1: Health Endpoint
  await assertTest('GET /api/health should return ok & database status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    return res.status === 200 && data.status === 'ok' && data.database === 'connected';
  });

  // Test 2: Product Retrieval
  await assertTest('GET /api/products should return database product records', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.count >= 3;
  });

  // Test 3: Single Product Retrieval
  await assertTest('GET /api/products/chocolate-edible-cup should return Chocolate Cup details', async () => {
    const res = await fetch(`${baseUrl}/api/products/chocolate-edible-cup`);
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.slug === 'chocolate-edible-cup';
  });

  // Test 4: General Enquiry Persistence
  await assertTest('POST /api/enquiries should insert & record general enquiry in DB', async () => {
    const payload = {
      customer_name: 'Test Customer',
      email: 'test.customer@example.com',
      phone: '9818192575',
      message: 'Automated backend persistence test enquiry.',
      enquiry_type: 'product',
      quantity: '396',
    };
    const res = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 201 && data.success === true && data.data.id && data.data.customer_name === 'Test Customer';
  });

  // Test 5: Wholesale Enquiry Persistence
  await assertTest('POST /api/wholesale-enquiries should insert wholesale record in DB', async () => {
    const payload = {
      customer_name: 'Wholesale Buyer Test',
      business_name: 'Test Cafe Chain',
      email: 'wholesale.test@example.com',
      phone: '9818192575',
      quantity_boxes: 2,
      quantity_cups: 792,
      message: 'Wholesale automated test box order.',
    };
    const res = await fetch(`${baseUrl}/api/wholesale-enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 201 && data.success === true && data.data.id && data.data.quantity_boxes === 2;
  });

  // Test 6: B2B Enquiry Persistence
  await assertTest('POST /api/b2b-enquiries should insert commercial B2B record in DB', async () => {
    const payload = {
      customer_name: 'B2B Partner Test',
      business_name: 'Artisan Chai Lounge',
      business_type: 'Tea Shops & Chai Outlets',
      email: 'b2b.test@example.com',
      phone: '9818192575',
      city: 'Delhi NCR',
      estimated_monthly_volume: '1584',
      co_branding_requested: true,
      message: 'B2B automated co-branding test enquiry.',
    };
    const res = await fetch(`${baseUrl}/api/b2b-enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 201 && data.success === true && data.data.id && data.data.co_branding_requested === true;
  });

  // Test 7: Customer Direct Order Creation & DB Persistence
  await assertTest('POST /api/orders should insert customer order and assign unique reference ID', async () => {
    const payload = {
      customer_name: 'Direct Order Customer',
      phone: '9818192575',
      email: 'order.customer@example.com',
      delivery_address: '104 Connaught Place, Inner Circle',
      city: 'New Delhi',
      pincode: '110001',
      flavor: 'Chocolate',
      number_of_boxes: 2,
      order_category: 'wholesale',
      notes: 'Automated test order creation',
    };
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.data.order_reference) {
      createdOrderId = data.data.id;
      return true;
    }
    return false;
  });

  // Test 8: Unauthorized Admin Endpoint Protection
  await assertTest('GET /api/admin/orders without Auth token should return 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders`);
    const data = await res.json();
    return res.status === 401 && data.success === false;
  });

  // Test 9: Secure Admin Authentication with Varun@123 Demo Password & Token Generation
  await assertTest('POST /api/admin/login with Varun@123 credentials should return session token', async () => {
    const payload = {
      email: 'dumkanitin0@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'Varun@123',
    };
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.token) {
      adminToken = data.token;
      return true;
    }
    return false;
  });

  // Test 9b: Incorrect password rejection
  await assertTest('POST /api/admin/login with incorrect password should return 401 Unauthorized', async () => {
    const payload = {
      email: 'dumkanitin0@gmail.com',
      password: 'WrongInvalidPassword123!',
    };
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 401 && data.success === false;
  });

  // Test 10: Protected Admin Order Fetching with Token
  await assertTest('GET /api/admin/orders with Bearer token should return recorded orders', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 1;
  });

  // Test 11: Protected Admin Order Status Update
  await assertTest('PUT /api/admin/orders/:id should update order status and payment status in DB', async () => {
    if (!createdOrderId) return false;
    const payload = {
      status: 'CONFIRMED',
      payment_status: 'PAID',
      internal_notes: 'Verified payment via bank transfer.',
    };
    const res = await fetch(`${baseUrl}/api/admin/orders/${createdOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.status === 'CONFIRMED';
  });

  // Test 12: Admin Dashboard Metrics Calculation
  await assertTest('GET /api/admin/dashboard-stats should return calculated revenue & counts', async () => {
    const res = await fetch(`${baseUrl}/api/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && typeof data.data.calculated_revenue === 'number';
  });

  // ----------------------------------------------------
  // Phase 10: Customer Authentication & Order Linking Tests
  // ----------------------------------------------------
  let customerToken = '';
  let customerDevOtp = '';
  const testCustomerEmail = `qa.customer.${Date.now()}@cup2eat.com`;

  // Test 13: Request Customer OTP
  await assertTest('POST /api/auth/send-otp should generate and return 6-digit OTP code', async () => {
    const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: testCustomerEmail, target_type: 'email' }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.data?.dev_code) {
      customerDevOtp = data.data.dev_code;
      return true;
    }
    return false;
  });

  // Test 14: Reject Invalid OTP
  await assertTest('POST /api/auth/verify-otp with incorrect 6-digit code should return 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: testCustomerEmail, target_type: 'email', code: '000000' }),
    });
    const data = await res.json();
    return res.status === 400 && data.success === false;
  });

  // Test 15: Verify OTP & Issue Customer Session Bearer Token
  await assertTest('POST /api/auth/verify-otp with valid dev OTP should register customer & return usr-sec token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: testCustomerEmail,
        target_type: 'email',
        code: customerDevOtp,
        full_name: 'QA Cup2Eat Customer',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.token && (data.customer?.id || data.user?.id)) {
      customerToken = data.token;
      return data.token.startsWith('usr-sec-');
    }
    return false;
  });

  // Test 16: Retrieve Authenticated Customer Profile
  await assertTest('GET /api/customer/me with customer Bearer token should return profile details', async () => {
    const res = await fetch(`${baseUrl}/api/customer/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.email === testCustomerEmail;
  });

  // Test 17: Update Customer Profile Data
  await assertTest('PUT /api/customer/me should update profile address & details in database', async () => {
    const res = await fetch(`${baseUrl}/api/customer/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        full_name: 'QA Cup2Eat Customer Updated',
        default_address: 'Suite 502, Sector 62',
        default_city: 'Noida',
        default_pincode: '201301',
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && data.data.default_city === 'Noida';
  });

  // Test 18: Submit Customer Order with Authorization Token (Automatic Customer Linking)
  await assertTest('POST /api/orders with customer Bearer token should attach customer_id to order record', async () => {
    const payload = {
      customer_name: 'QA Cup2Eat Customer Updated',
      phone: '9818192575',
      email: testCustomerEmail,
      delivery_address: 'Suite 502, Sector 62',
      city: 'Noida',
      pincode: '201301',
      flavor: 'Elaichi',
      number_of_boxes: 3,
      order_category: 'wholesale',
      notes: 'Customer portal linked order test',
    };
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 201 && data.success === true && !!data.data.customer_id;
  });

  // Test 19: Private Customer Order History Timeline
  await assertTest('GET /api/customer/orders should return all private orders for authenticated customer', async () => {
    const res = await fetch(`${baseUrl}/api/customer/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 1;
  });

  // Test 20: Customer Logout & Token Revocation
  await assertTest('POST /api/auth/logout should revoke customer Bearer token', async () => {
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const logoutData = await logoutRes.json();

    const meRes = await fetch(`${baseUrl}/api/customer/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });

    return logoutRes.status === 200 && logoutData.success === true && meRes.status === 401;
  });

  // ----------------------------------------------------
  // Phase 11: Invoicing, PDF Generation & Email Delivery Tests
  // ----------------------------------------------------
  let generatedInvoiceId = '';

  // Test 21: Automatic Invoice Creation on Order Submission
  await assertTest('POST /api/orders should automatically generate an invoice with INV-2026 format', async () => {
    const payload = {
      customer_name: 'Invoicing Test Customer',
      phone: '9818192575',
      email: 'invoice.customer@cup2eat.com',
      delivery_address: 'Plot 10, Sector 18',
      city: 'Gurugram',
      pincode: '122001',
      flavor: 'Chocolate',
      number_of_boxes: 1,
      order_category: 'wholesale',
      notes: 'Automated invoice generation test',
    };
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.status === 201 && data.success === true && typeof data.data.invoice_number === 'string' && data.data.invoice_number.startsWith('INV-');
  });

  // Test 22: Protected Admin Invoices List & Retrieval
  await assertTest('GET /api/admin/invoices with admin token should list all generated invoices', async () => {
    const res = await fetch(`${baseUrl}/api/admin/invoices`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success === true && Array.isArray(data.data) && data.data.length >= 1) {
      generatedInvoiceId = data.data[0].id;
      return true;
    }
    return false;
  });

  // Test 23: PDF Invoice Stream Generation
  await assertTest('GET /api/invoices/:id/download should generate & stream binary PDF document', async () => {
    if (!generatedInvoiceId) return false;
    const res = await fetch(`${baseUrl}/api/invoices/${generatedInvoiceId}/download`);
    const contentType = res.headers.get('content-type');
    const buffer = await res.arrayBuffer();
    return res.status === 200 && contentType === 'application/pdf' && buffer.byteLength > 500;
  });

  // Test 24: Admin Resend Transactional Email with PDF Attachment
  await assertTest('POST /api/admin/invoices/:id/resend-email should retry email delivery and record log', async () => {
    if (!generatedInvoiceId) return false;
    const res = await fetch(`${baseUrl}/api/admin/invoices/${generatedInvoiceId}/resend-email`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.success === true;
  });

  // Test 25: Sync Invoice Document Type on Order Status Transition to PAID
  await assertTest('PUT /api/admin/orders/:id updating payment to PAID should convert invoice to TAX_INVOICE', async () => {
    if (!createdOrderId) return false;
    const res = await fetch(`${baseUrl}/api/admin/orders/${createdOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'CONFIRMED',
        payment_status: 'PAID',
      }),
    });
    const data = await res.json();

    const invRes = await fetch(`${baseUrl}/api/admin/invoices`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const invData = await invRes.json();
    const matchedInvoice = invData.data?.find((i: any) => i.order_id === createdOrderId);

    return res.status === 200 && matchedInvoice && matchedInvoice.document_type === 'TAX_INVOICE' && matchedInvoice.payment_status === 'PAID';
  });

  console.log(`\n📊 Backend Test Summary: ${passedCount} Passed, ${failedCount} Failed.`);

  server.close();

  if (failedCount > 0) {
    process.exit(1);
  }
}

runBackendTests().catch((err) => {
  console.error('❌ Test suite runner error:', err);
  process.exit(1);
});
