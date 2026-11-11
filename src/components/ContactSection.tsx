import React, { useState } from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { submitGeneralEnquiry } from '../services/api';
import { Phone, Mail, Instagram, MapPin, MessageCircle, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { MagneticButton } from './motion/MagneticButton';
import { StaggeredText } from './motion/StaggeredText';

interface ContactSectionProps {
  initialCategory?: string;
  initialFlavorName?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialCategory = 'wholesale',
  initialFlavorName = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    category: initialCategory,
    quantity: '396',
    message: initialFlavorName ? `Interested in ordering ${initialFlavorName}.` : '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const res = await submitGeneralEnquiry({
      customer_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      business_name: formData.businessName,
      enquiry_type: formData.category,
      quantity: formData.quantity,
      message: formData.message || 'General enquiry from website contact desk',
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setSubmissionId(res.data.id || 'ENQ-DB');
      setSubmitted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#073B2B', '#D9A52B', '#F2B544', '#FFF4D6'],
        });
      } catch (err) {}
    } else {
      setErrorMessage(res.error || 'Failed to connect to backend server. Please try again or use WhatsApp.');
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
    <section id="contact" className="py-24 bg-[#FAF5E9] text-[#17130C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Contact Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#073B2B]/10 text-[#073B2B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A52B]" />
              <span>Get In Touch With Cup2Eat</span>
            </div>

            <StaggeredText
              text="Ready to Rethink Your Cup?"
              className="text-3xl sm:text-4xl font-display font-black text-[#073B2B]"
            />

            <p className="text-sm sm:text-base text-[#17130C]/80 leading-relaxed">
              We welcome wholesale orders, cafe partnerships, event inquiries, and product sample requests across India. Reach out to founder <strong>Varun Khera</strong> directly.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              <a
                href={`tel:${BRAND_DETAILS.phone}`}
                className="p-4.5 bg-white rounded-2xl border border-[#073B2B]/15 flex items-center gap-4 hover:border-[#D9A52B] transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#073B2B] text-[#F2B544] flex items-center justify-center shrink-0 shadow">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Phone & Direct Orders</div>
                  <div className="text-base font-bold text-[#073B2B] group-hover:text-[#D9A52B] transition-colors">
                    {BRAND_DETAILS.phoneDisplay}
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${BRAND_DETAILS.email}`}
                className="p-4.5 bg-white rounded-2xl border border-[#073B2B]/15 flex items-center gap-4 hover:border-[#D9A52B] transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#073B2B] text-[#F2B544] flex items-center justify-center shrink-0 shadow">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Email Enquiries</div>
                  <div className="text-base font-bold text-[#073B2B] group-hover:text-[#D9A52B] transition-colors">
                    {BRAND_DETAILS.email}
                  </div>
                </div>
              </a>

              <a
                href={BRAND_DETAILS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4.5 bg-white rounded-2xl border border-[#073B2B]/15 flex items-center gap-4 hover:border-[#E1306C] transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shrink-0 shadow">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Instagram Direct</div>
                  <div className="text-base font-bold text-[#073B2B] group-hover:text-[#E1306C] transition-colors">
                    {BRAND_DETAILS.instagramHandle}
                  </div>
                </div>
              </a>

              <div className="p-4.5 bg-white rounded-2xl border border-[#073B2B]/15 flex items-center gap-4 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-[#073B2B] text-[#F2B544] flex items-center justify-center shrink-0 shadow">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">FSSAI Registered Location</div>
                  <div className="text-xs font-bold text-[#073B2B]">
                    {BRAND_DETAILS.fssaiLocation}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Banner */}
            <div className="p-5 bg-gradient-to-r from-[#25D366]/20 to-[#073B2B]/10 rounded-2xl border border-[#25D366]/40 flex items-center justify-between gap-4 shadow-md">
              <div>
                <div className="text-xs font-bold text-[#073B2B]">Prefer Instant Chat?</div>
                <div className="text-xs text-[#17130C]/75">Connect on WhatsApp for immediate response.</div>
              </div>
              <MagneticButton onClick={handleWhatsAppRedirect}>
                <span className="px-4 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0">
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Open WhatsApp</span>
                </span>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right Interactive Form Column with DB Persistence */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-[#073B2B]/15 p-6 sm:p-10 shadow-xl"
          >
            {submitted ? (
              <div className="text-center py-12 space-y-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#073B2B] text-[#F2B544] mx-auto flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-black text-[#073B2B]">
                  Enquiry Successfully Recorded in Database!
                </h3>
                <div className="inline-block bg-[#FAF5E9] border border-[#D9A52B]/40 px-4 py-1.5 rounded-full text-xs font-mono text-[#073B2B] font-bold shadow-sm">
                  Reference ID: {submissionId}
                </div>
                <p className="text-sm text-[#17130C]/80 max-w-md mx-auto">
                  Thank you for reaching out to Cup2Eat. Founder Varun Khera and our team will get back to you shortly.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="px-6 py-3 text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-white" />
                    <span>Continue on WhatsApp with Ref ID</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        businessName: '',
                        email: '',
                        phone: '',
                        category: 'wholesale',
                        quantity: '396',
                        message: '',
                      });
                    }}
                    className="px-5 py-3 text-xs font-bold text-[#073B2B] bg-[#FAF5E9] hover:bg-[#073B2B]/10 rounded-xl"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-display font-black text-[#073B2B] mb-2">
                  Send Product or Wholesale Enquiry
                </h3>

                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Business / Cafe Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Artisan Coffee Works"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98181XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Enquiry Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                    >
                      <option value="wholesale">Wholesale Deal (396 Cups @ ₹3,999)</option>
                      <option value="b2b">Cafe / Restaurant Partnership</option>
                      <option value="product">Specific Flavour Enquiry</option>
                      <option value="samples">Sample Box Request</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Quantity Required
                    </label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                    >
                      <option value="396">1 Box (396 Cups)</option>
                      <option value="792">2 Boxes (792 Cups)</option>
                      <option value="1584">4 Boxes (1,584 Cups)</option>
                      <option value="3000+">3,000+ Cups (Large Bulk)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#073B2B] mb-1">
                    Message / Special Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your beverage menu, event date, or delivery location..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] bg-[#FAF5E9]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073B2B]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-xs font-extrabold text-[#073B2B] bg-gradient-to-r from-[#D9A52B] to-[#F2B544] hover:from-[#F2B544] hover:to-[#D9A52B] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving to Database...' : 'Submit to Database'}</span>
                  </MagneticButton>

                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="py-3.5 px-5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-white" />
                    <span>Quick WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
