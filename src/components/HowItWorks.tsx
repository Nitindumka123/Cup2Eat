import React from 'react';
import { Coffee, Flame, Utensils, Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { StaggeredText } from './motion/StaggeredText';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'SERVE',
      subtitle: 'Pour Hot or Cold',
      description: 'Fill the 100ml edible cup with your favourite hot masala chai, specialty espresso latte, or scoops of gourmet ice cream.',
      icon: Coffee,
      badge: '100ml Capacity',
      color: 'from-[#D9A52B]/20 to-transparent',
    },
    {
      step: '02',
      title: 'SIP',
      subtitle: 'Leak-Proof Refreshment',
      description: 'Sip your beverage at leisure. The crisp wafer structure stays leak-proof and heat-resistant up to 85°C for over 45 minutes.',
      icon: Flame,
      badge: 'Holds Heat 85°C',
      color: 'from-[#F2B544]/20 to-transparent',
    },
    {
      step: '03',
      title: 'CRUNCH',
      subtitle: 'Savour the Container',
      description: 'Once your drink is finished, take your first delicious bite! Choose from Chocolate, Vanilla, or Elaichi cardamom waffle.',
      icon: Utensils,
      badge: 'Delicious Taste',
      color: 'from-[#3D2314]/40 to-transparent',
    },
    {
      step: '04',
      title: 'ZERO WASTE',
      subtitle: '100% Edible Innovation',
      description: 'No paper cups to throw away, no plastic lining. Pure culinary pleasure with absolute eco-friendly peace of mind.',
      icon: Leaf,
      badge: '0% Single-Use Waste',
      color: 'from-[#0B5D43]/40 to-transparent',
    },
  ];

  return (
    <section className="py-24 bg-[#073B2B] text-[#FAF5E9] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D9A52B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0B5D43]/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5D43] border border-[#D9A52B]/40 text-xs font-bold text-[#F2B544]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple & Revolutionary Ritual</span>
          </motion.div>

          <StaggeredText
            text="How Cup2Eat Works"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#FFF4D6] justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#FAF5E9]/85 max-w-2xl mx-auto"
          >
            A seamless 4-step ritual that delights customers and turns everyday beverages into viral, zero-waste moments.
          </motion.p>
        </div>

        {/* 4 Steps Interactive Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
              >
                <SpatialTiltContainer maxTilt={8} className="h-full">
                  <div className={`bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden group hover:border-[#F2B544] transition-all bg-gradient-to-b ${step.color}`}>
                    {/* Editorial Step Index */}
                    <div className="flex items-center justify-between text-xs font-bold text-[#D9A52B] mb-4">
                      <span>0{idx + 1}. {step.subtitle}</span>
                      <span className="text-2xl font-display font-black opacity-20 group-hover:opacity-60 transition-opacity">
                        {step.step}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-[#073B2B] border border-[#D9A52B]/40 flex items-center justify-center text-[#F2B544] shadow-md group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-2xl font-display font-extrabold text-[#FFF4D6]">
                        {step.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#FAF5E9]/75 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F2B544]">
                        {step.badge}
                      </span>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-[#D9A52B]/40 hidden lg:block group-hover:translate-x-1 transition-transform" />
                      )}
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
