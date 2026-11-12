import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Phone, Sparkles, User, UserCheck, ShoppingBag } from 'lucide-react';
import { BRAND_DETAILS } from '../data/cup2eatData';

interface NavbarProps {
  onOpenEnquiry: (category?: string) => void;
  activeSection?: string;
  customer?: any;
  onOpenAuthModal?: () => void;
  onOpenAccountModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  activeSection = 'home',
  customer,
  onOpenAuthModal,
  onOpenAccountModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Flavours', href: '#flavours' },
    { label: 'Business Solutions', href: '#solutions' },
    { label: 'Wholesale Deal', href: '#wholesale' },
    { label: 'About & Story', href: '#story' },
    { label: 'Sustainability', href: '#sustainability' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#073B2B]/95 backdrop-blur-md shadow-lg border-b border-[#D9A52B]/30 py-3'
          : 'bg-gradient-to-b from-[#073B2B]/90 via-[#073B2B]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single text/emblem brand wordmark */}
        <a href="#home" className="flex items-center gap-3 group shrink-0">
          {/* Circular Emblem Logo matching original Instagram design */}
          <div className="w-10 h-10 rounded-full bg-[#073B2B] border-2 border-[#D9A52B] flex flex-col items-center justify-center shadow-md group-hover:border-[#F2B544] transition-all">
            <span className="text-[10px] font-extrabold text-[#FFF4D6] tracking-tighter leading-none">CUP</span>
            <span className="text-[12px] font-black text-[#F2B544] leading-none my-0.5">2</span>
            <span className="text-[9px] font-extrabold text-[#FFF4D6] tracking-tighter leading-none">EAT</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-extrabold text-[#FFF4D6] tracking-wide whitespace-nowrap shrink-0 group-hover:text-[#F2B544] transition-colors">
              CUP<span className="text-[#F2B544]">2</span>EAT
            </span>
            <span className="text-[10px] font-medium text-[#D9A52B] tracking-widest uppercase whitespace-nowrap -mt-1">
              Eat Your Drink!
            </span>
          </div>
        </a>

        {/* Zone 2: Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#FAF5E9]/90">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#F2B544] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#F2B544]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions + Customer Account/Login Button */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Customer Auth / Account Entry Point */}
          {customer ? (
            <button
              onClick={onOpenAccountModal}
              className="px-3.5 py-2 text-xs font-bold text-[#F2B544] bg-[#073B2B] hover:bg-[#0B5D43] border border-[#D9A52B]/50 rounded-lg shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#F2B544]" />
              <span>{customer.full_name?.split(' ')[0] || 'Account'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 text-xs font-bold text-[#FFF4D6] hover:text-[#F2B544] bg-[#073B2B]/80 hover:bg-[#073B2B] border border-[#D9A52B]/30 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#D9A52B]" />
              <span>Sign In / Register</span>
            </button>
          )}

          <a
            href={`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=Hello%20Cup2Eat,%20I%20am%20interested%20in%20your%20edible%20cups%20and%20wholesale%20pricing.`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-full border border-[#25D366]/30 transition-all shrink-0"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-[#25D366]" />
          </a>

          <button
            onClick={() => onOpenEnquiry('wholesale')}
            className="px-4 py-2 text-xs font-bold text-[#073B2B] bg-gradient-to-r from-[#D9A52B] to-[#F2B544] hover:from-[#F2B544] hover:to-[#D9A52B] rounded-lg shadow-md hover:shadow-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Wholesale Enquiry
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#FFF4D6] hover:text-[#F2B544] transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#073B2B] border-t border-[#D9A52B]/30 px-4 pt-4 pb-6 mt-3 space-y-3 animate-fadeIn">
          {/* Customer Auth / Account Entry in Mobile Menu */}
          <div className="pb-2 border-b border-white/10">
            {customer ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAccountModal) onOpenAccountModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0B5D43] border border-[#D9A52B]/40 text-xs font-bold text-[#FFF4D6] flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#F2B544]" />
                  <span>Account: {customer.full_name || 'My Profile'}</span>
                </span>
                <span className="text-[10px] text-[#D9A52B] font-extrabold uppercase">My Orders →</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0B5D43] border border-[#D9A52B]/40 text-xs font-bold text-[#FFF4D6] flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#F2B544]" />
                  <span>Customer Login / Register</span>
                </span>
                <span className="text-[10px] text-[#F2B544] font-extrabold">OTP Login →</span>
              </button>
            )}
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#FAF5E9] hover:text-[#F2B544] border-b border-white/5"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry('wholesale');
              }}
              className="w-full py-2.5 text-center font-bold text-xs text-[#073B2B] bg-[#F2B544] rounded-lg"
            >
              Wholesale Enquiry (396 Cups @ ₹3,999)
            </button>

            <a
              href={`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=Hello%20Cup2Eat,%20I%20am%20interested%20in%20your%20edible%20cups.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center text-xs font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us: {BRAND_DETAILS.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
