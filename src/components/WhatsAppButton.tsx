import React from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href={`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=Hello%20Cup2Eat,%20I%20am%20interested%20in%20your%20100ml%20edible%20cups%20and%20wholesale%20deal.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/40 transition-all flex items-center justify-center border-2 border-white group"
      aria-label="Contact Cup2Eat on WhatsApp"
      title="Chat with Cup2Eat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
        WhatsApp Cup2Eat
      </span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2B544] rounded-full border-2 border-[#17130C]" />
    </a>
  );
};
