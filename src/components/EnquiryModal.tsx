import React, { useState } from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { submitGeneralEnquiry, submitWholesaleEnquiry } from '../services/api';
import { X, Send, MessageCircle, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialFlavorName?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'wholesale',
  initialFlavorName = '',
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    category: initialCategory,
    quantity: '396',
    message: initialFlavorName ? `Interested in ${initialFlavorName}.` : '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    let res;
    if (formData.category === 'wholesale') {
      const boxes = Math.max(1, Math.floor(parseInt(formData.quantity) / 396) || 1);
      res = await submitWholesaleEnquiry({
        customer_name: formData.name,
        business_name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        quantity_boxes: boxes,
        quantity_cups: boxes * 396,
        product_preferences: initialFlavorName || 'Mixed Flavours',
        message: formData.message || 'Wholesale order enquiry',
      });
    } else {
      res = await submitGeneralEnquiry({
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.businessName,
        enquiry_type: formData.category,
        quantity: formData.quantity,
        message: formData.message || 'Product enquiry',
      });
    }

    setIsSubmitting(false);

    if (res.success && res.data) {
      setSubmissionId(res.data.id || 'ENQ-DB');
      setSubmitted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#073B2B', '#D9A52B', '#F2B544', '#FFF4D6'],
        });
      } catch (err) {}
    } else {
      setErrorMessage(res.error || 'Database submission failed. Please try again.');
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hello Cup2Eat!\nRef ID: ${submissionId || 'New Enquiry'}\nMy Name: ${formData.name || 'Interested Buyer'}\nBusiness: ${
        formData.businessName || 'N/A'
      }\nCategory: ${formData.category}\nQuantity: ${formData.quantity}\nMessage: ${
        formData.message || 'I would like to enquire about Cup2Eat edible cups.'
      }`
    );
    window.open(`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=${text}`, '_blank');
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
            <div className="w-14 h-14 rounded-full bg-[#073B2B] text-[#F2B544] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-bold text-[#073B2B]">
              Enquiry Saved to Database!
            </h3>
            <div className="inline-block bg-[#FAF5E9] border border-[#D9A52B]/40 px-3 py-1 rounded-full text-xs font-mono text-[#073B2B] font-bold">
              Ref ID: {submissionId}
            </div>
            <p className="text-xs sm:text-sm text-[#17130C]/80 max-w-sm mx-auto">
              Founder Varun Khera and our Cup2Eat team will reach out to you within 24 hours.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleWhatsAppRedirect}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat Now on WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-[#073B2B] bg-[#FAF5E9] rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D9A52B] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D9A52B]" />
              <span>Direct Business Desk</span>
            </div>

            <h3 className="text-2xl font-display font-extrabold text-[#073B2B]">
              Enquire With Cup2Eat
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Business / Cafe (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Cafe Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                >
                  <option value="wholesale">Wholesale Deal (396 Cups @ ₹3,999)</option>
                  <option value="b2b">Cafe / Restaurant Partnership</option>
                  <option value="product">Specific Flavour Request</option>
                  <option value="samples">Sample Box Order</option>
                  <option value="general">General Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B2B] mb-1">
                  Quantity
                </label>
                <select
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                >
                  <option value="396">1 Box (396 Cups)</option>
                  <option value="792">2 Boxes (792 Cups)</option>
                  <option value="1584">4 Boxes (1,584 Cups)</option>
                  <option value="3000+">3,000+ Bulk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#073B2B] mb-1">
                Message / Notes *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Details about your order or cafe..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/40 focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 text-xs font-bold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to DB...' : 'Submit Form'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="py-2.5 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center justify-center gap-1 shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
