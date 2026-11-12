import React from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { Phone, Mail, Instagram, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin?: () => void;
  onOpenCustomerAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin, onOpenCustomerAuth }) => {
  return (
    <footer className="bg-[#17130C] text-[#FAF5E9] pt-16 pb-8 border-t border-[#D9A52B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#073B2B] border-2 border-[#D9A52B] flex flex-col items-center justify-center shadow-md">
                <span className="text-[10px] font-extrabold text-[#FFF4D6] tracking-tighter leading-none">CUP</span>
                <span className="text-[12px] font-black text-[#F2B544] leading-none my-0.5">2</span>
                <span className="text-[9px] font-extrabold text-[#FFF4D6] tracking-tighter leading-none">EAT</span>
              </div>
              <div>
                <span className="text-xl font-display font-extrabold text-[#FFF4D6] tracking-wide">
                  CUP<span className="text-[#F2B544]">2</span>EAT
                </span>
                <span className="text-[10px] font-medium text-[#D9A52B] tracking-widest uppercase block -mt-1">
                  Eat Your Drink!
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FAF5E9]/75 max-w-sm leading-relaxed">
              Cup2Eat is an innovative edible-cup business promoting a delicious and sustainable alternative to conventional single-use plastic & wax-coated beverage cups.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#D9A52B]">
              <ShieldCheck className="w-4 h-4 text-[#F2B544]" />
              <span>{BRAND_DETAILS.fssaiRegNo}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F2B544] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF5E9]/80">
              <li><a href="#home" className="hover:text-[#F2B544] transition-colors">Home & Product Showcase</a></li>
              <li><a href="#flavours" className="hover:text-[#F2B544] transition-colors">Product Flavours</a></li>
              <li><a href="#solutions" className="hover:text-[#F2B544] transition-colors">Business Solutions</a></li>
              <li><a href="#wholesale" className="hover:text-[#F2B544] transition-colors">Wholesale Offer</a></li>
              <li><a href="#story" className="hover:text-[#F2B544] transition-colors">About & Founder</a></li>
              <li><a href="#sustainability" className="hover:text-[#F2B544] transition-colors">Sustainability Story</a></li>
              {onOpenCustomerAuth && (
                <li>
                  <button
                    onClick={onOpenCustomerAuth}
                    className="hover:text-[#F2B544] text-[#F2B544] font-bold transition-colors cursor-pointer"
                  >
                    Customer Account / Login
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Flavours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F2B544] uppercase tracking-wider">
              Flavours (100ml)
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF5E9]/80">
              <li><a href="#flavours" className="hover:text-[#F2B544] transition-colors">Chocolate Waffle Cup</a></li>
              <li><a href="#flavours" className="hover:text-[#F2B544] transition-colors">Vanilla Bean Waffle Cup</a></li>
              <li><a href="#flavours" className="hover:text-[#F2B544] transition-colors">Elaichi Cardamom Cup</a></li>
              <li><a href="#wholesale" className="hover:text-[#F2B544] transition-colors">Wholesale Mixed Box (396)</a></li>
            </ul>
          </div>

          {/* Business Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F2B544] uppercase tracking-wider">
              Contact Desk
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF5E9]/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D9A52B]" />
                <a href={`tel:${BRAND_DETAILS.phone}`} className="hover:text-[#F2B544] transition-colors">
                  {BRAND_DETAILS.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D9A52B]" />
                <a href={`mailto:${BRAND_DETAILS.email}`} className="hover:text-[#F2B544] transition-colors">
                  {BRAND_DETAILS.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <a href={BRAND_DETAILS.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F2B544] transition-colors">
                  {BRAND_DETAILS.instagramHandle}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=Hello%20Cup2Eat!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-bold inline-flex items-center gap-1.5 hover:bg-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                  <span>WhatsApp Enquiries</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF5E9]/60">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Cup2Eat. All Rights Reserved. Founded by {BRAND_DETAILS.founder}.</span>
            {/* Hidden Admin Entry Point - Subtle miniature cup icon */}
            <button
              onClick={onOpenAdminLogin}
              type="button"
              aria-label="Cup2Eat Portal"
              title="Cup2Eat System"
              className="opacity-20 hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/5 inline-flex items-center justify-center cursor-pointer text-[#D9A52B]"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 5v2h2v9a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V7h2V5H2zm16 11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7h12v9z"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span>FSSAI Registered: Ghaziabad, UP</span>
            <span>·</span>
            <span>Tagline: "EAT YOUR DRINK!"</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
