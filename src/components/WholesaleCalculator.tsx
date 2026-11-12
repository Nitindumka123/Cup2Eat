import React, { useState } from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { Package, Truck, Sparkles, ArrowRight, MessageCircle, Calculator, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { MagneticButton } from './motion/MagneticButton';
import { StaggeredText } from './motion/StaggeredText';

interface WholesaleCalculatorProps {
  onOpenEnquiry: (category?: string) => void;
}

export const WholesaleCalculator: React.FC<WholesaleCalculatorProps> = ({ onOpenEnquiry }) => {
  const [cupVolume, setCupVolume] = useState<number>(396);
  const [upsellPrice, setUpsellPrice] = useState<number>(30); // ₹30 charged to customer

  const costPerCup = 3999 / 396; // ~10.10 INR
  const totalInvestment = Math.round((cupVolume / 396) * 3999);
  const totalRevenue = cupVolume * upsellPrice;
  const estimatedProfit = Math.max(0, totalRevenue - totalInvestment);

  return (
    <section id="wholesale" className="py-24 bg-[#FAF5E9] text-[#17130C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#073B2B]/10 text-[#073B2B] text-xs font-bold uppercase tracking-wider"
          >
            <Package className="w-3.5 h-3.5 text-[#D9A52B]" />
            <span>Wholesale & Commercial Supply</span>
          </motion.div>

          <StaggeredText
            text="Promotional Wholesale Offer"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#073B2B] justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#17130C]/75 max-w-2xl mx-auto"
          >
            Boost your cafe margins and delight your patrons with our nationwide bulk delivery deal.
          </motion.p>
        </div>

        {/* Featured Promotional Deal Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-[#073B2B] via-[#0B5D43] to-[#17130C] text-[#FFF4D6] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#D9A52B]/40 relative overflow-hidden transform-gpu"
        >
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#D9A52B]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Packaging Image & Offer Badge with Tilt */}
            <div className="lg:col-span-5 relative">
              <SpatialTiltContainer maxTilt={8}>
                <div className="rounded-2xl overflow-hidden border-2 border-[#D9A52B]/40 shadow-2xl relative">
                  <img
                    src="/images/wholesale_box_packaging_1794364086788.jpg"
                    alt="Cup2Eat Wholesale Packaging"
                    className="w-full h-64 sm:h-72 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#D9A52B] text-[#073B2B] text-xs font-black px-3.5 py-1 rounded-full shadow-lg">
                    PROMOTIONAL DEAL
                  </div>
                </div>
              </SpatialTiltContainer>
            </div>

            {/* Offer Specs & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#F2B544] tabular-nums">
                  ₹3,999
                </span>
                <span className="text-sm sm:text-base text-[#FAF5E9]/90 font-medium">
                  for <strong className="text-[#FFF4D6] text-lg">396 Edible Cups</strong> (~₹10.1 / cup)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#FAF5E9]/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F2B544] shrink-0" />
                  <span>100 ml Capacity Cups</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F2B544] shrink-0" />
                  <span>Assorted Chocolate, Vanilla & Elaichi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#F2B544] shrink-0" />
                  <span>Delivery Included Across India</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F2B544] shrink-0" />
                  <span>Safe Protective Carton Packaging</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <MagneticButton onClick={() => onOpenEnquiry('wholesale')}>
                  <span className="px-6 py-3.5 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl shadow-xl transition-all flex items-center gap-2">
                    <span>Enquire Wholesale Deal</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=Hello%20Cup2Eat,%20I%20want%20to%20enquire%20about%20the%20396%20cups%20for%20Rs.3999%20wholesale%20deal.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="px-6 py-3.5 text-xs font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 rounded-xl transition-all flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                    <span>WhatsApp Wholesale Desk</span>
                  </span>
                </MagneticButton>
              </div>

              <p className="text-[11px] text-[#FAF5E9]/60 italic">
                * Note: ₹3,999 represents an observed promotional package price. Availability, custom branding, and shipping timelines subject to direct confirmation with Cup2Eat.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Cafe Profitability Estimator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-white rounded-3xl border border-[#073B2B]/15 p-6 sm:p-10 shadow-xl"
        >
          <div className="flex items-center gap-3 text-[#073B2B] mb-6">
            <Calculator className="w-6 h-6 text-[#D9A52B]" />
            <h3 className="text-2xl font-display font-black">
              Cafe & Outlet Profitability Estimator
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#073B2B] mb-2">
                  <span>Monthly Cup Volume:</span>
                  <span className="tabular-nums text-[#D9A52B] font-extrabold">{cupVolume} Cups</span>
                </div>
                <input
                  type="range"
                  min="396"
                  max="3960"
                  step="396"
                  value={cupVolume}
                  onChange={(e) => setCupVolume(parseInt(e.target.value))}
                  className="w-full accent-[#073B2B] h-2.5 bg-[#FAF5E9] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 Box (396)</span>
                  <span>5 Boxes (1,980)</span>
                  <span>10 Boxes (3,960)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#073B2B] mb-2">
                  <span>Customer Upsell Charge (Per Edible Cup):</span>
                  <span className="tabular-nums text-[#D9A52B] font-extrabold">₹{upsellPrice} / Cup</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={upsellPrice}
                  onChange={(e) => setUpsellPrice(parseInt(e.target.value))}
                  className="w-full accent-[#073B2B] h-2.5 bg-[#FAF5E9] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹15 (Budget)</span>
                  <span>₹30 (Standard)</span>
                  <span>₹60 (Gourmet Dessert)</span>
                </div>
              </div>
            </div>

            {/* Live Profit Metrics Box */}
            <div className="lg:col-span-5 bg-[#073B2B] text-[#FFF4D6] rounded-2xl p-6 space-y-4 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9A52B] block">
                Estimated ROI Summary
              </span>

              <div className="space-y-3 text-xs border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-[#FAF5E9]/70">Bulk Cup Investment:</span>
                  <span className="font-bold tabular-nums">₹{totalInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF5E9]/70">Estimated Beverage Add-on Revenue:</span>
                  <span className="font-bold tabular-nums">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF5E9]/70">Effective Unit Cost:</span>
                  <span className="font-bold tabular-nums">~₹{costPerCup.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#FAF5E9]/70 block">Estimated Net Added Profit:</span>
                <div className="text-3xl font-display font-extrabold text-[#F2B544] tabular-nums">
                  +₹{estimatedProfit.toLocaleString()}
                </div>
                <p className="text-[11px] text-[#FAF5E9]/60 mt-1">
                  Plus viral social media word-of-mouth & customer retention!
                </p>
              </div>

              <button
                onClick={() => onOpenEnquiry('wholesale')}
                className="w-full py-3 text-xs font-bold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>Request Wholesale Contract</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
