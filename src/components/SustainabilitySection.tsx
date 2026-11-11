import React from 'react';
import { Leaf, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { StaggeredText } from './motion/StaggeredText';

export const SustainabilitySection: React.FC = () => {
  return (
    <section id="sustainability" className="py-24 bg-[#073B2B] text-[#FAF5E9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5D43] text-[#F2B544] text-xs font-bold uppercase tracking-wider border border-[#D9A52B]/30"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Responsible Eco-Friendly Foodware</span>
          </motion.div>

          <StaggeredText
            text="Rethinking the Single-Use Cup"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#FFF4D6] justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#FAF5E9]/80 max-w-2xl mx-auto"
          >
            Conventional disposable paper cups are often lined with hidden plastic films (polyethylene) that prevent recycling and take decades to break down. Cup2Eat offers an edible alternative.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SpatialTiltContainer maxTilt={6} className="h-full">
              <div className="bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-3xl p-7 space-y-4 h-full flex flex-col justify-between hover:border-[#F2B544] transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#073B2B] flex items-center justify-center text-[#F2B544] border border-[#D9A52B]/30 shadow-md">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-black text-[#FFF4D6]">
                    Consumable Packaging
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF5E9]/75 leading-relaxed">
                    When your cup is eaten, zero waste remains. Even if unconsumed, organic baked ingredients degrade naturally without microplastic residue.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#F2B544] pt-4 border-t border-white/10">
                  0% Plastic Residue
                </div>
              </div>
            </SpatialTiltContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <SpatialTiltContainer maxTilt={6} className="h-full">
              <div className="bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-3xl p-7 space-y-4 h-full flex flex-col justify-between hover:border-[#F2B544] transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#073B2B] flex items-center justify-center text-[#F2B544] border border-[#D9A52B]/30 shadow-md">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-black text-[#FFF4D6]">
                    Eliminates Plastic Liners
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF5E9]/75 leading-relaxed">
                    Standard coffee cups rely on non-biodegradable wax and plastic inner coatings. Cup2Eat uses natural grain barrier technology for heat resistance up to 85°C.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#F2B544] pt-4 border-t border-white/10">
                  Natural Grain Barrier
                </div>
              </div>
            </SpatialTiltContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SpatialTiltContainer maxTilt={6} className="h-full">
              <div className="bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-3xl p-7 space-y-4 h-full flex flex-col justify-between hover:border-[#F2B544] transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#073B2B] flex items-center justify-center text-[#F2B544] border border-[#D9A52B]/30 shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-black text-[#FFF4D6]">
                    Delicious Sustainability
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF5E9]/75 leading-relaxed">
                    Going green shouldn’t feel like a compromise. Cup2Eat turns environmental consciousness into a memorable, crunchy dessert experience.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#F2B544] pt-4 border-t border-white/10">
                  Crunchy Waffle Finish
                </div>
              </div>
            </SpatialTiltContainer>
          </motion.div>
        </div>

        {/* Responsible Disclaimer Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-[#0B5D43]/50 border border-[#D9A52B]/30 rounded-2xl p-6 max-w-3xl mx-auto flex items-start gap-4 text-xs text-[#FAF5E9]/80 shadow-xl"
        >
          <CheckCircle className="w-5 h-5 text-[#F2B544] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Responsible Environmental Commitment:</strong> Cup2Eat is designed to reduce reliance on conventional single-use disposable cups. We prioritize honest food safety and real edible alternatives over exaggerated environmental metrics.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
