export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  flavour: string;
  capacity_ml: number;
  price: number | null;
  active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnquiryRecord {
  id: string;
  enquiry_type: string; // general, product, wholesale, b2b, samples
  customer_name: string;
  email: string;
  phone: string;
  business_name?: string | null;
  business_type?: string | null;
  city?: string | null;
  product_id?: string | null;
  flavour?: string | null;
  quantity?: string | null;
  message: string;
  status: string; // pending, contacted, completed, cancelled
  source: string;
  created_at: string;
  updated_at: string;
}

export interface WholesaleEnquiryRecord {
  id: string;
  customer_name: string;
  business_name?: string | null;
  email: string;
  phone: string;
  city?: string | null;
  quantity_boxes: number;
  quantity_cups: number;
  product_preferences?: string | null;
  message: string;
  status: string; // NEW, CONTACTED, QUOTED, CLOSED, CANCELLED
  created_at: string;
  updated_at: string;
}

export interface B2BEnquiryRecord {
  id: string;
  customer_name: string;
  business_name: string;
  business_type: string;
  email: string;
  phone: string;
  city: string;
  estimated_monthly_volume: string;
  co_branding_requested: boolean;
  message: string;
  status: string; // NEW, CONTACTED, QUALIFIED, QUOTED, CONVERTED, CLOSED
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  order_reference: string;
  customer_id?: string | null;
  customer_name: string;
  phone: string;
  email: string;
  delivery_address: string;
  city: string;
  pincode: string;
  flavor: string;
  quantity_cups: number;
  number_of_boxes: number;
  order_category: 'individual' | 'wholesale';
  total_amount: number;
  notes?: string | null;
  status: 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'COD';
  delivery_status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsRecord {
  id: string;
  promotional_wholesale_price: number;
  promotional_wholesale_cups: number;
  promotional_wholesale_title: string;
  promotional_banner_active: boolean;
  accepting_orders: boolean;
  contact_phone: string;
  contact_email: string;
  updated_at: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  name: string;
  role: 'superadmin' | 'admin';
  created_at: string;
}

export interface AdminSessionRecord {
  token: string;
  admin_id: string;
  email: string;
  expires_at: number;
}

export interface CustomerRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  email_verified: boolean;
  phone_verified: boolean;
  default_address?: string | null;
  default_city?: string | null;
  default_pincode?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerSessionRecord {
  token: string;
  customer_id: string;
  email: string;
  phone: string;
  expires_at: number;
}

export interface OtpRequestRecord {
  id: string;
  target: string;
  target_type: 'email' | 'phone';
  otp_code: string;
  attempts: number;
  expires_at: number;
  created_at: number;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  order_id: string;
  order_reference: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  billing_address: string;
  shipping_address: string;
  city: string;
  pincode: string;
  flavor: string;
  number_of_boxes: number;
  quantity_cups: number;
  unit_price_per_box: number;
  subtotal: number;
  discount_amount: number;
  taxable_value: number;
  gst_rate: number; // 18% (9% CGST + 9% SGST)
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_tax: number;
  shipping_charge: number;
  total_amount: number;
  document_type: 'TAX_INVOICE' | 'PROFORMA_INVOICE' | 'CREDIT_NOTE';
  payment_status: 'PAID' | 'COD_PENDING' | 'PENDING' | 'REFUNDED' | 'UNPAID';
  payment_method: string;
  email_status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  email_sent_at?: string | null;
  email_error?: string | null;
  email_retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailLogRecord {
  id: string;
  invoice_id: string;
  order_id: string;
  recipient_email: string;
  subject: string;
  status: 'SENT' | 'FAILED';
  error_message?: string | null;
  sent_at: string;
}
