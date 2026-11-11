export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function sanitizeText(text?: string | null): string {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function validateEnquiryInput(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.customer_name || typeof data.customer_name !== 'string' || data.customer_name.trim().length < 2) {
    errors.push('Customer name is required and must be at least 2 characters.');
  }

  if (!validateEmail(data.email)) {
    errors.push('A valid email address is required.');
  }

  if (!validatePhone(data.phone)) {
    errors.push('A valid 10-digit phone number is required.');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 3) {
    errors.push('Message or enquiry detail is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateWholesaleInput(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.customer_name || typeof data.customer_name !== 'string' || data.customer_name.trim().length < 2) {
    errors.push('Customer name is required.');
  }

  if (!validateEmail(data.email)) {
    errors.push('A valid email address is required.');
  }

  if (!validatePhone(data.phone)) {
    errors.push('A valid phone number is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateB2BInput(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.customer_name || typeof data.customer_name !== 'string' || data.customer_name.trim().length < 2) {
    errors.push('Contact person name is required.');
  }

  if (!data.business_name || typeof data.business_name !== 'string' || data.business_name.trim().length < 2) {
    errors.push('Business / Outlet name is required.');
  }

  if (!validateEmail(data.email)) {
    errors.push('A valid email address is required.');
  }

  if (!validatePhone(data.phone)) {
    errors.push('A valid phone number is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateOrderInput(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.customer_name || typeof data.customer_name !== 'string' || data.customer_name.trim().length < 2) {
    errors.push('Customer name is required.');
  }

  if (!validatePhone(data.phone)) {
    errors.push('A valid 10-digit phone number is required.');
  }

  if (!data.delivery_address || typeof data.delivery_address !== 'string' || data.delivery_address.trim().length < 5) {
    errors.push('Full delivery address is required.');
  }

  if (!data.city || typeof data.city !== 'string' || data.city.trim().length < 2) {
    errors.push('City is required.');
  }

  if (!data.flavor || typeof data.flavor !== 'string') {
    errors.push('Please select a flavor option.');
  }

  if (!data.number_of_boxes || typeof data.number_of_boxes !== 'number' || data.number_of_boxes < 1) {
    errors.push('Number of boxes must be at least 1.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
