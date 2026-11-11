import React, { useState } from 'react';
import { FLAVORS, ProductFlavor } from '../data/cup2eatData';
import { Sparkles, Check, Coffee, ArrowRight, MessageCircle, Eye, Flame, ShieldCheck } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { MagneticButton } from './motion/MagneticButton';

interface FlavorShowcaseProps {
  onOpenEnquiry: (category?: string, flavorName?: string) => void;
  onSelect3DFlavor: (flavorId: 'chocolate' | 'vanilla' | 'elaichi') => void;
  onOpenProductDetail: (product: ProductFlavor) => void;
}

export const FlavorShowcase: React.FC<FlavorShowcaseProps> = ({
  onOpenEnquiry,
  onSelect3DFlavor,
  onOpenProductDetail,
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor>(FLAVORS[0]);

  const handleWhatsAppProduct = (flavor: ProductFlavor) => {
    openWhatsApp({
      productName: flavor.name,
      flavor: flavor.name,
      quantity: '396 cups (1 Wholesale Box)',
    });
  };

  return (
    <section id="flavours" className="py-24 bg-[#FAF5E9] text-[#17130C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#073B2B]/10 text-[#073B2B] text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9A52B]" />
            <span>Signature Edible Range</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#073B2B]">
            Three Unforgettable Flavours
          </h2>
          <p className="text-base sm:text-lg text-[#17130C]/75">
            Every 100ml cup is baked with natural food-grade ingredients to deliver a crunchy, delicious finish after your favorite hot chai, espresso, or cold ice cream.
          </p>
        </div>

        {/* Interactive Selector Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {FLAVORS.map((flavor) => (
            <button
              key={flavor.id}
              onClick={() => {
                setSelectedFlavor(flavor);
                onSelect3DFlavor(flavor.id as 'chocolate' | 'vanilla' | 'elaichi');
              }}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2.5 ${
                selectedFlavor.id === flavor.id
                  ? 'bg-[#073B2B] text-[#FFF4D6] shadow-xl ring-2 ring-[#D9A52B] scale-105'
                  : 'bg-white text-[#073B2B] border border-[#073B2B]/15 hover:bg-[#073B2B]/5 shadow-sm'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20"
                style={{ backgroundColor: flavor.color }}
              />
              {flavor.name}
            </button>
          ))}
        </div>

        {/* Featured Flavor Dynamic Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFlavor.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-12 bg-white rounded-3xl border border-[#073B2B]/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Image Column */}
            <div
              onClick={() => onOpenProductDetail(selectedFlavor)}
              className="lg:col-span-6 relative min-h-[340px] lg:min-h-[500px] cursor-pointer group overflow-hidden bg-[#17130C]"
            >
              <img
                src={selectedFlavor.image}
                alt={selectedFlavor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#073B2B]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F2B544] border border-[#D9A52B]/40 shadow-lg">
                100 ml Serving Capacity
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs text-[#FFF4D6] flex items-center justify-between">
                <div className="font-bold flex items-center gap-2 text-[#F2B544]">
                  <Flame className="w-4 h-4" /> 85°C Heat Resistance
                </div>
                <div className="text-white/80 font-medium">45+ Mins Dwell</div>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-5 py-2.5 bg-white text-[#073B2B] text-xs font-bold rounded-full shadow-2xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                  <Eye className="w-4 h-4" /> Expand Details & Specs
                </span>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D9A52B]">
                  {selectedFlavor.tagline}
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-black text-[#073B2B]">
                  {selectedFlavor.name}
                </h3>

                <p className="text-sm sm:text-base text-[#17130C]/80 leading-relaxed">
                  {selectedFlavor.description}
                </p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#073B2B]/10 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Heat Tolerance</span>
                    <span className="font-bold text-[#073B2B] text-sm">{selectedFlavor.heatResistance}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Leak-Proof Dwell</span>
                    <span className="font-bold text-[#073B2B] text-sm">{selectedFlavor.leakProofTime}</span>
                  </div>
                </div>

                {/* Taste Notes */}
                <div>
                  <span className="text-xs font-bold text-[#073B2B] uppercase tracking-wider block mb-2">
                    Taste Profile:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedFlavor.tasteNotes.map((note) => (
                      <span
                        key={note}
                        className="text-xs bg-[#FAF5E9] text-[#073B2B] px-3.5 py-1.5 rounded-lg border border-[#073B2B]/10 font-bold"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best Paired With */}
                <div>
                  <span className="text-xs font-bold text-[#073B2B] uppercase tracking-wider block mb-2">
                    Recommended Beverage Pairings:
                  </span>
                  <ul className="grid grid-cols-2 gap-2 text-xs text-[#17130C]/80">
                    {selectedFlavor.bestPairedWith.map((pair) => (
                      <li key={pair} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#073B2B] shrink-0" />
                        <span>{pair}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#073B2B]/10">
                <button
                  onClick={() => onOpenProductDetail(selectedFlavor)}
                  className="px-5 py-3 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Full Product Specs</span>
                </button>

                <button
                  onClick={() => handleWhatsAppProduct(selectedFlavor)}
                  className="px-5 py-3 text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Order</span>
                </button>

                <button
                  onClick={() => {
                    onSelect3DFlavor(selectedFlavor.id as 'chocolate' | 'vanilla' | 'elaichi');
                    const elem = document.getElementById('home');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-3 text-xs font-bold text-[#073B2B] bg-[#FAF5E9] hover:bg-[#073B2B]/10 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Coffee className="w-4 h-4 text-[#D9A52B]" />
                  <span>View Photo Studio</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Grid View of all 3 Flavours with SpatialTiltContainer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {FLAVORS.map((flavor, idx) => (
            <motion.div
              key={flavor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <SpatialTiltContainer maxTilt={6} className="h-full">
                <div className="bg-white rounded-3xl border border-[#073B2B]/15 overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full flex flex-col justify-between group">
                  <div
                    onClick={() => onOpenProductDetail(flavor)}
                    className="cursor-pointer"
                  >
                    <div className="relative h-56 overflow-hidden bg-[#17130C]">
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute top-3 left-3 text-[11px] font-extrabold px-3 py-1 rounded-full shadow ${flavor.badgeColor}`}>
                        {flavor.capacity} Serving
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 bg-white text-[#073B2B] text-xs font-bold rounded-full shadow-lg">
                          Inspect Specs
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h4 className="text-xl font-display font-black text-[#073B2B]">
                        {flavor.name}
                      </h4>
                      <p className="text-xs text-[#17130C]/75 line-clamp-3 leading-relaxed">
                        {flavor.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2.5">
                    <button
                      onClick={() => onOpenProductDetail(flavor)}
                      className="w-full py-3 text-xs font-bold text-[#FFF4D6] bg-[#073B2B] hover:bg-[#0B5D43] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <span>Product Details & Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleWhatsAppProduct(flavor)}
                      className="w-full py-2.5 text-xs font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                      <span>WhatsApp Order</span>
                    </button>
                  </div>
                </div>
              </SpatialTiltContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
