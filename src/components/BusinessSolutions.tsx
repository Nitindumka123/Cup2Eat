import React from 'react';
import { BUSINESS_SOLUTIONS, BRAND_DETAILS } from '../data/cup2eatData';
import { Coffee, Utensils, Sparkles, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { MagneticButton } from './motion/MagneticButton';
import { StaggeredText } from './motion/StaggeredText';

interface BusinessSolutionsProps {
  onOpenB2BModal: (businessType?: string) => void;
}

export const BusinessSolutions: React.FC<BusinessSolutionsProps> = ({ onOpenB2BModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return Coffee;
      case 'Teacup':
        return Utensils;
      case 'IceCream':
        return Utensils;
      case 'Sparkles':
      default:
        return Sparkles;
    }
  };

  const handleWhatsAppB2B = (title: string) => {
    openWhatsApp({
      businessType: title,
      quantity: '396+ cups',
      customMessage: `Interested in B2B supply for ${title}.`,
      isWholesale: true,
    });
  };

  return (
    <section id="solutions" className="py-24 bg-[#073B2B] text-[#FAF5E9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5D43] text-[#F2B544] text-xs font-bold uppercase tracking-wider border border-[#D9A52B]/30"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B Commercial Solutions</span>
          </motion.div>

          <StaggeredText
            text="Differentiate Your Business"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#FFF4D6] justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#FAF5E9]/80 max-w-2xl mx-auto"
          >
            Whether you run an artisan coffee roastery, high-footfall chai shop, dessert lounge, or event catering firm—Cup2Eat edible cups give your customers an experience they talk about.
          </motion.p>
        </div>

        {/* 4 B2B Cards Grid with SpatialTiltContainer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {BUSINESS_SOLUTIONS.map((sol, idx) => {
            const IconComponent = getIcon(sol.icon);
            return (
              <motion.div
                key={sol.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <SpatialTiltContainer maxTilt={7} className="h-full">
                  <div className="bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-3xl p-8 flex flex-col justify-between hover:border-[#F2B544] transition-all group shadow-xl h-full">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="w-13 h-13 rounded-2xl bg-[#073B2B] border border-[#D9A52B]/40 flex items-center justify-center text-[#F2B544] group-hover:scale-110 transition-transform shadow-md">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-[#D9A52B] bg-[#073B2B] px-3.5 py-1 rounded-full border border-[#D9A52B]/30">
                          {sol.benefit}
                        </span>
                      </div>

                      <h3 className="text-2xl font-display font-black text-[#FFF4D6]">
                        {sol.title}
                      </h3>

                      <p className="text-sm text-[#FAF5E9]/80 leading-relaxed">
                        {sol.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-[#FAF5E9]/60 font-medium">Custom Branding Options</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWhatsAppB2B(sol.title)}
                          className="p-2.5 text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl transition-colors"
                          title="WhatsApp B2B Query"
                        >
                          <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                        </button>

                        <button
                          onClick={() => onOpenB2BModal(sol.title)}
                          className="px-4 py-2.5 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-colors flex items-center gap-1.5 shadow"
                        >
                          <span>Get B2B Quote</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </SpatialTiltContainer>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
