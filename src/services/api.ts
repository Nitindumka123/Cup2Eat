export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  flavour: string;
  capacity_ml: number;
  price: number | null;
  active: boolean;
  image_url: string | null;
}

export interface GeneralEnquiryPayload {
  customer_name: string;
  email: string;
  phone: string;
  business_name?: string;
  business_type?: string;
  city?: string;
  product_id?: string;
  flavour?: string;
  quantity?: string;
  message: string;
  enquiry_type?: string;
}

export interface WholesaleEnquiryPayload {
  customer_name: string;
  business_name?: string;
  email: string;
  phone: string;
  city?: string;
  quantity_boxes: number;
  quantity_cups: number;
  product_preferences?: string;
  message: string;
}

export interface B2BEnquiryPayload {
  customer_name: string;
  business_name: string;
  business_type: string;
  email: string;
  phone: string;
  city: string;
  estimated_monthly_volume: string;
  co_branding_requested: boolean;
  message: string;
}

export interface CustomerOrderPayload {
  customer_name: string;
  phone: string;
  email?: string;
  delivery_address: string;
  city: string;
  pincode?: string;
  flavor: string;
  number_of_boxes: number;
  order_category?: 'individual' | 'wholesale';
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  customer?: any;
  errors?: string[];
  error?: string;
}

// Helper fetch wrapper with Auth token support
async function apiFetch<T>(endpoint: string, options?: RequestInit, token?: string): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(endpoint, {
      headers,
      ...options,
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || (data.errors ? data.errors.join(', ') : 'Server error'),
        errors: data.errors,
      };
    }

    return data;
  } catch (err: any) {
    console.error(`❌ API fetch error for ${endpoint}:`, err);
    return {
      success: false,
      error: 'Network or connection error. Please check your internet connection or use WhatsApp fallback.',
    };
  }
}

// Public API Methods
export async function getProducts(): Promise<ApiResponse<ApiProduct[]>> {
  return apiFetch<ApiProduct[]>('/api/products');
}

export async function getProductBySlug(slug: string): Promise<ApiResponse<ApiProduct>> {
  return apiFetch<ApiProduct>(`/api/products/${slug}`);
}

export async function submitGeneralEnquiry(payload: GeneralEnquiryPayload): Promise<ApiResponse> {
  return apiFetch('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitWholesaleEnquiry(payload: WholesaleEnquiryPayload): Promise<ApiResponse> {
  return apiFetch('/api/wholesale-enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitB2BEnquiry(payload: B2BEnquiryPayload): Promise<ApiResponse> {
  return apiFetch('/api/b2b-enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitCustomerOrder(payload: CustomerOrderPayload): Promise<ApiResponse> {
  const token = localStorage.getItem('cup2eat_customer_token') || undefined;
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function getOrderDetails(id: string): Promise<ApiResponse> {
  return apiFetch(`/api/orders/${id}`);
}

export async function checkBackendHealth(): Promise<ApiResponse> {
  return apiFetch('/api/health');
}

// ----------------------------------------------------
// Customer OTP & Account API Methods
// ----------------------------------------------------
export async function sendCustomerOtp(target: string, target_type: 'email' | 'phone'): Promise<ApiResponse> {
  return apiFetch('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ target, target_type }),
  });
}

export async function verifyCustomerOtp(
  target: string,
  target_type: 'email' | 'phone',
  code: string,
  full_name?: string
): Promise<ApiResponse> {
  return apiFetch('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ target, target_type, code, full_name }),
  });
}

export async function getCustomerMe(token: string): Promise<ApiResponse> {
  return apiFetch('/api/customer/me', { method: 'GET' }, token);
}

export async function updateCustomerProfileData(token: string, updates: any): Promise<ApiResponse> {
  return apiFetch('/api/customer/me', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}

export async function getCustomerOrders(token: string): Promise<ApiResponse> {
  return apiFetch('/api/customer/orders', { method: 'GET' }, token);
}

export async function getCustomerInvoices(token: string): Promise<ApiResponse> {
  return apiFetch('/api/customer/invoices', { method: 'GET' }, token);
}

export async function customerLogout(token: string): Promise<ApiResponse> {
  return apiFetch('/api/auth/logout', { method: 'POST' }, token);
}

export function getInvoiceDownloadUrl(invoiceId: string, token?: string): string {
  const queryToken = token ? `?token=${encodeURIComponent(token)}` : '';
  return `/api/invoices/${invoiceId}/download${queryToken}`;
}

// ----------------------------------------------------
// Protected Admin API Methods
// ----------------------------------------------------
export async function adminLogin(email: string, password: string): Promise<ApiResponse> {
  return apiFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function adminLogout(token: string): Promise<ApiResponse> {
  return apiFetch('/api/admin/logout', { method: 'POST' }, token);
}

export async function getAdminMe(token: string): Promise<ApiResponse> {
  return apiFetch('/api/admin/me', { method: 'GET' }, token);
}

export async function getDashboardStats(token: string): Promise<ApiResponse> {
  return apiFetch('/api/admin/dashboard-stats', { method: 'GET' }, token);
}

export async function getAdminOrders(
  token: string,
  params?: { search?: string; status?: string; category?: string }
): Promise<ApiResponse> {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/api/admin/orders${query ? `?${query}` : ''}`, { method: 'GET' }, token);
}

export async function getAdminInvoices(
  token: string,
  params?: { search?: string; status?: string }
): Promise<ApiResponse> {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/api/admin/invoices${query ? `?${query}` : ''}`, { method: 'GET' }, token);
}

export async function getAdminInvoiceDetail(token: string, id: string): Promise<ApiResponse> {
  return apiFetch(`/api/admin/invoices/${id}`, { method: 'GET' }, token);
}

export async function resendAdminInvoiceEmail(token: string, id: string): Promise<ApiResponse> {
  return apiFetch(`/api/admin/invoices/${id}/resend-email`, { method: 'POST' }, token);
}

export async function updateAdminOrder(token: string, id: string, updates: any): Promise<ApiResponse> {
  return apiFetch(`/api/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}

export async function updateAdminB2B(token: string, id: string, updates: any): Promise<ApiResponse> {
  return apiFetch(`/api/admin/b2b-enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}

export async function updateAdminWholesale(token: string, id: string, updates: any): Promise<ApiResponse> {
  return apiFetch(`/api/admin/wholesale-enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}

export async function getAdminProducts(token: string): Promise<ApiResponse> {
  return apiFetch('/api/admin/products', { method: 'GET' }, token);
}

export async function updateAdminProduct(token: string, id: string, updates: any): Promise<ApiResponse> {
  return apiFetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}

export async function getAdminSettings(token: string): Promise<ApiResponse> {
  return apiFetch('/api/admin/settings', { method: 'GET' }, token);
}

export async function updateAdminSettings(token: string, updates: any): Promise<ApiResponse> {
  return apiFetch('/api/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }, token);
}
