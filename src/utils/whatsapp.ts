import { BRAND_DETAILS } from '../data/cup2eatData';

export interface WhatsAppParams {
  productName?: string;
  flavor?: string;
  quantity?: string | number;
  businessName?: string;
  businessType?: string;
  customerName?: string;
  customMessage?: string;
  isWholesale?: boolean;
}

export function generateWhatsAppUrl(params: WhatsAppParams): string {
  const number = BRAND_DETAILS.whatsappNumber;
  let message = 'Hello Cup2Eat!\n\n';

  if (params.isWholesale) {
    message += `I am interested in your wholesale edible cups offer (396 cups for ₹3,999).\n`;
  } else if (params.productName) {
    message += `I am interested in ${params.productName}.\n`;
  } else {
    message += `I would like to enquire about Cup2Eat edible cups.\n`;
  }

  if (params.flavor) {
    message += `Selected Flavour: ${params.flavor}\n`;
  }

  if (params.quantity) {
    message += `Required Quantity: ${params.quantity} cups\n`;
  }

  if (params.businessName) {
    message += `Business Name: ${params.businessName}\n`;
  }

  if (params.businessType) {
    message += `Business Type: ${params.businessType}\n`;
  }

  if (params.customerName) {
    message += `My Name: ${params.customerName}\n`;
  }

  if (params.customMessage && params.customMessage.trim().length > 0) {
    message += `\nDetails: ${params.customMessage.trim()}\n`;
  }

  message += `\nPlease share availability, pricing, and dispatch timelines. Thank you!`;

  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function openWhatsApp(params: WhatsAppParams): void {
  const url = generateWhatsAppUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
}
