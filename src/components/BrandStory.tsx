import React from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { Award, ShieldCheck, HeartHandshake, Sparkles, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { StaggeredText } from './motion/StaggeredText';

export const BrandStory: React.FC = () => {
  return (
    <section id="story" className="py-24 bg-[#FAF5E9] text-[#17130C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <SpatialTiltContainer maxTilt={7}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border-2 border-[#073B2B]/20 shadow-2xl">
                  <img
                    src="/images/founder_varun_khera_event_1794364087135.jpg"
                    alt="Founder Varun Khera at Cup2Eat Expo"
                    className="w-full h-[460px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Founder Tag */}
                <div className="absolute -bottom-6 right-6 bg-[#073B2B] text-[#FFF4D6] p-4 sm:p-5 rounded-2xl border border-[#D9A52B]/40 shadow-2xl max-w-[260px]">
                  <div className="text-xs font-bold text-[#D9A52B] uppercase tracking-wider">
                    Founder & Director
                  </div>
                  <div className="text-xl font-display font-black text-[#FFF4D6] mt-0.5">
                    {BRAND_DETAILS.founder}
                  </div>
                  <div className="text-[11px] text-[#FAF5E9]/75 mt-1 font-medium">
                    Pioneering Sustainable Foodware Across India
                  </div>
                </div>
              </div>
            </SpatialTiltContainer>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#073B2B]/10 text-[#073B2B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A52B]" />
              <span>The Cup2Eat Story</span>
            </div>

            <StaggeredText
              text="Ancient Wisdom. Modern Intelligence."
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#073B2B]"
            />

            <p className="text-base sm:text-lg text-[#17130C]/85 leading-relaxed font-normal">
              Founded by <strong>Varun Khera</strong>, Cup2Eat was born out of a simple yet transformative vision: <em>Why throw away disposable cups after drinking when the container itself can be delicious and nourishing?</em>
            </p>

            <p className="text-sm text-[#17130C]/75 leading-relaxed">
              Every day, millions of single-use paper and plastic cups end up in landfills. Cup2Eat combines artisan baking techniques with modern food processing technology to create crisp, leak-proof 100ml edible cups in Chocolate, Vanilla, and Elaichi flavours.
            </p>

            {/* Quality Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4.5 rounded-2xl border border-[#073B2B]/15 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <ShieldCheck className="w-5 h-5 text-[#073B2B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#073B2B]">FSSAI Registered</div>
                  <div className="text-[11px] text-[#17130C]/70 mt-0.5">
                    Compliant Wholesaler & Retailer based in Ghaziabad, UP.
                  </div>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#073B2B]/15 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <Award className="w-5 h-5 text-[#073B2B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#073B2B]">Exposition Highlights</div>
                  <div className="text-[11px] text-[#17130C]/70 mt-0.5">
                    Showcased at Startup Mahakumbh & leading food innovation forums.
                  </div>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#073B2B]/15 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <HeartHandshake className="w-5 h-5 text-[#073B2B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#073B2B]">Customer Proof</div>
                  <div className="text-[11px] text-[#17130C]/70 mt-0.5">
                    Trusted by cafes, college events, and dessert parlours nationwide.
                  </div>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#073B2B]/15 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <Building className="w-5 h-5 text-[#073B2B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#073B2B]">Pan-India Logistics</div>
                  <div className="text-[11px] text-[#17130C]/70 mt-0.5">
                    Secure protective packaging dispatched straight to your outlet.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
