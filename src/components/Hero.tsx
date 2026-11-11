import React from 'react';
import { ProductPhotoViewer } from './ProductPhotoViewer';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { Sparkles, ShieldCheck, Truck, Coffee, ArrowRight, MessageCircle, Flame, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { StaggeredText } from './motion/StaggeredText';
import { MagneticButton } from './motion/MagneticButton';
import { AmbientCanvasBackground } from './motion/AmbientCanvasBackground';

interface HeroProps {
  onOpenEnquiry: (category?: string) => void;
  onSelectFlavor: (flavorId: 'chocolate' | 'vanilla' | 'elaichi') => void;
  activeFlavorId: 'chocolate' | 'vanilla' | 'elaichi' | 'wholesale';
}

export const Hero: React.FC<HeroProps> = ({
  onOpenEnquiry,
  onSelectFlavor,
  activeFlavorId,
}) => {
  return (
    <section id="home" className="relative min-h-[90vh] pt-28 pb-16 md:pt-36 md:pb-24 bg-[#073B2B] text-[#FAF5E9] overflow-hidden flex flex-col justify-center">
      {/* Dynamic Ambient Particle & Lighting Canvas */}
      <AmbientCanvasBackground theme="emerald" />

      {/* Atmospheric Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D9A52B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#0B5D43]/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column - Expressive Typography & Business CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-6 space-y-7"
          >
            {/* Eco Innovation Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B5D43]/90 border border-[#D9A52B]/40 text-xs font-bold text-[#F2B544] shadow-md backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#F2B544] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Zero-Waste Edible Beverage Innovation</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-2">
              <StaggeredText
                text="EAT YOUR"
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#FFF4D6] tracking-tight leading-[1.08]"
                delay={0.15}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D9A52B] via-[#F2B544] to-[#FFF4D6] tracking-tight leading-[1.08] block">
                  DRINK!
                </span>
              </motion.div>
            </div>

            {/* Subtitle Prose */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-base sm:text-lg text-[#FAF5E9]/90 max-w-xl font-normal leading-relaxed"
            >
              Meet the revolutionary 100ml waffle cup you enjoy twice. Sip your hot masala chai, specialty espresso, or cold dessert—and relish the delicious crispy container afterwards!
            </motion.p>

            {/* Featured Wholesale Promotional Highlight Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              whileHover={{ y: -3 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#17130C]/85 backdrop-blur-md border border-[#D9A52B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
            >
              <div>
                <div className="text-[11px] font-extrabold text-[#D9A52B] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Featured Wholesale Package</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#FFF4D6] flex flex-wrap items-center gap-2 mt-0.5">
                  <span>396 Cups for ₹3,999</span>
                  <span className="text-xs font-bold bg-[#D9A52B] text-[#073B2B] px-2.5 py-0.5 rounded-md">
                    ~₹10.1 / Cup
                  </span>
                </div>
                <div className="text-xs text-[#FAF5E9]/75 mt-1 flex items-center gap-2">
                  <span>Includes Mixed Flavours</span>
                  <span>·</span>
                  <span className="text-[#F2B544] font-semibold">Free Pan-India Delivery</span>
                </div>
              </div>

              <MagneticButton onClick={() => onOpenEnquiry('wholesale')} strength={0.3}>
                <span className="px-4 py-2.5 text-xs font-black text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md">
                  <span>Claim Deal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </MagneticButton>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <MagneticButton as="a" href="#flavours" strength={0.25}>
                <span className="px-6 py-3.5 text-sm font-extrabold text-[#073B2B] bg-gradient-to-r from-[#D9A52B] to-[#F2B544] hover:from-[#F2B544] hover:to-[#D9A52B] rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5">
                  <span>Explore 3 Flavours</span>
                  <Coffee className="w-4 h-4" />
                </span>
              </MagneticButton>

              <MagneticButton
                as="a"
                href={`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=Hello%20Cup2Eat,%20I%20am%20interested%20in%20ordering%20edible%20cups.`}
                target="_blank"
                rel="noopener noreferrer"
                strength={0.25}
              >
                <span className="px-6 py-3.5 text-sm font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 rounded-xl backdrop-blur-md transition-all flex items-center gap-2.5">
                  <MessageCircle className="w-4.5 h-4.5 fill-[#25D366]" />
                  <span>WhatsApp Order</span>
                </span>
              </MagneticButton>
            </motion.div>

            {/* Quick Metrics Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="pt-5 grid grid-cols-3 gap-4 border-t border-white/10 text-xs"
            >
              <div>
                <div className="text-xl font-extrabold text-[#F2B544] tabular-nums">100 ml</div>
                <div className="text-[#FAF5E9]/75 font-medium">Ideal Serving Capacity</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#F2B544] tabular-nums">45+ Mins</div>
                <div className="text-[#FAF5E9]/75 font-medium">Hot Beverage Dwell</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#F2B544] tabular-nums">100%</div>
                <div className="text-[#FAF5E9]/75 font-medium">Edible & Zero Plastic</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Photorealistic Spatial Product Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-6 w-full"
          >
            <ProductPhotoViewer
              activeFlavorId={activeFlavorId}
              onFlavorSelect={onSelectFlavor}
              onOpenEnquiry={onOpenEnquiry}
            />
          </motion.div>
        </div>

        {/* Hero Trust Badges Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-[#D9A52B]/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#FAF5E9]/80"
        >
          <div className="flex items-center gap-3 bg-[#0B5D43]/40 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-[#F2B544] shrink-0" />
            <div>
              <div className="font-bold text-[#FFF4D6]">FSSAI Licensed</div>
              <div className="text-[11px] text-white/70">Ghaziabad, UP, India</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0B5D43]/40 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <Coffee className="w-6 h-6 text-[#F2B544] shrink-0" />
            <div>
              <div className="font-bold text-[#FFF4D6]">Hot & Cold Ready</div>
              <div className="text-[11px] text-white/70">Chai, Coffee & Ice Cream</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0B5D43]/40 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <Truck className="w-6 h-6 text-[#F2B544] shrink-0" />
            <div>
              <div className="font-bold text-[#FFF4D6]">Pan-India Shipping</div>
              <div className="text-[11px] text-white/70">Safe Protective Box</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0B5D43]/40 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-[#F2B544] shrink-0" />
            <div>
              <div className="font-bold text-[#FFF4D6]">Zero Plastic Waste</div>
              <div className="text-[11px] text-white/70">100% Crispy & Edible</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
