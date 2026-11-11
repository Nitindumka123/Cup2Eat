import React, { useState } from 'react';
import { submitB2BEnquiry } from '../services/api';
import { X, Building2, Send, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import confetti from 'canvas-confetti';

interface B2BModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBusinessType?: string;
}

export const B2BModal: React.FC<B2BModalProps> = ({
  isOpen,
  onClose,
  initialBusinessType = 'Cafes & Specialty Coffee',
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    businessType: initialBusinessType,
    phone: '',
    email: '',
    city: '',
    monthlyVolume: '396',
    customBranding: false,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const res = await submitB2BEnquiry({
      customer_name: formData.contactName,
      business_name: formData.businessName,
      business_type: formData.businessType,
      email: formData.email,
      phone: formData.phone,
      city: formData.city || 'India',
      estimated_monthly_volume: formData.monthlyVolume,
      co_branding_requested: formData.customBranding,
      message: formData.message || 'B2B commercial partnership inquiry',
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setSubmissionId(res.data.id || 'B2B-DB');
      setSubmitted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#073B2B', '#D9A52B', '#F2B544', '#FFF4D6'],
        });
      } catch (err) {}
    } else {
      setErrorMessage(res.error || 'Failed to submit B2B enquiry to database.');
    }
  };

  const handleWhatsAppB2B = () => {
    openWhatsApp({
      customerName: formData.contactName || 'Business Owner',
      businessName: formData.businessName || 'Cafe Outlet',
      businessType: formData.businessType,
      quantity: `${formData.monthlyVolume} cups / month`,
      customMessage: `Ref ID: ${submissionId || 'New B2B Query'}. City: ${formData.city || 'N/A'}. Custom Branding Requested: ${
        formData.customBranding ? 'Yes' : 'No'
      }. ${formData.message}`,
      isWholesale: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#073B2B]/20 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#073B2B] hover:bg-[#FAF5E9] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#073B2B] text-[#F2B544] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-[#073B2B]">
              B2B Partnership Record Saved!
            </h3>
            <div className="inline-block bg-[#FAF5E9] border border-[#D9A52B]/40 px-3 py-1 rounded-full text-xs font-mono text-[#073B2B] font-bold">
              Database Ref: {submissionId}
            </div>
            <p className="text-xs sm:text-sm text-[#17130C]/80 max-w-sm mx-auto">
              Founder Varun Khera will review your business requirements ({formData.businessName}) and contact you with custom wholesale terms.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleWhatsAppB2B}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Dispatch via WhatsApp Desk</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-[#073B2B] bg-[#FAF5E9] rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D9A52B] uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#D9A52B]" />
              <span>Commercial & B2B Supply Desk</span>
            </div>

            <h3 className="text-2xl font-display font-extrabold text-[#073B2B]">
              Partner With Cup2Eat
            </h3>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varun Khera"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Business / Outlet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Coffee House"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Business Type *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                >
                  <option value="Cafes & Specialty Coffee">Café / Specialty Coffee Shop</option>
                  <option value="Tea Shops & Chai Outlets">Tea Shop / Chai Outlet</option>
                  <option value="Ice Cream & Dessert Parlours">Ice Cream / Dessert Parlour</option>
                  <option value="Events, Catering & Weddings">Events, Catering & Weddings</option>
                  <option value="Food Franchise / Distributor">Food Franchise / Distributor</option>
                  <option value="Other Business">Other Commercial Entity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Estimated Monthly Volume
                </label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                >
                  <option value="396">396 Cups / Month (1 Box)</option>
                  <option value="792">792 Cups / Month (2 Boxes)</option>
                  <option value="1584">1,584 Cups / Month (4 Boxes)</option>
                  <option value="3960">3,960 Cups / Month (10 Boxes)</option>
                  <option value="10000+">10,000+ Bulk Volume</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="98181XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#073B2B] mb-1">
                Delivery City / State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Delhi NCR, Mumbai, Jaipur"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
              />
            </div>

            {/* Custom Branding Checkbox */}
            <div className="flex items-center gap-2 p-3 bg-[#FAF5E9] rounded-xl border border-[#073B2B]/15">
              <input
                type="checkbox"
                id="branding"
                checked={formData.customBranding}
                onChange={(e) => setFormData({ ...formData, customBranding: e.target.checked })}
                className="w-4 h-4 accent-[#073B2B] rounded cursor-pointer"
              />
              <label htmlFor="branding" className="text-xs font-semibold text-[#073B2B] cursor-pointer">
                Interested in custom logo embossing / co-branding on cups
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#073B2B] mb-1">
                Additional Notes
              </label>
              <textarea
                rows={3}
                placeholder="Details about your menu, serving style, or launch schedule..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 text-xs font-bold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving to Database...' : 'Submit B2B Enquiry'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppB2B}
                className="py-3 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center justify-center gap-1 shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp B2B</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
