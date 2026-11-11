import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/cup2eatData';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StaggeredText } from './motion/StaggeredText';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#073B2B] text-[#FAF5E9] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5D43] text-[#F2B544] text-xs font-bold uppercase tracking-wider border border-[#D9A52B]/30"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </motion.div>

          <StaggeredText
            text="Got Questions About Cup2Eat?"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#FFF4D6] justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#FAF5E9]/80 max-w-xl mx-auto"
          >
            Find immediate answers regarding edible cup heat resistance, wholesale terms, storage, and cafe applications.
          </motion.p>
        </div>

        {/* Search Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 relative max-w-lg mx-auto"
        >
          <Search className="w-4 h-4 text-[#D9A52B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. coffee, chai, wholesale, delivery, shelf life)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#17130C]/90 border border-[#D9A52B]/40 text-xs text-[#FFF4D6] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F2B544] shadow-lg"
          />
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-2xl p-8 text-center text-xs text-[#FAF5E9]/70 space-y-3">
              <p>No exact question matched your search term "{searchQuery}".</p>
              <a
                href={`https://wa.me/919818192575?text=Hello%20Cup2Eat,%20I%20have%20a%20question:%20${encodeURIComponent(
                  searchQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white font-bold rounded-lg text-xs"
              >
                Ask Us Directly on WhatsApp
              </a>
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#17130C]/90 border border-[#D9A52B]/30 rounded-2xl overflow-hidden shadow-lg transition-all"
                >
                  <button
                    onClick={() => toggleIndex(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-[#FFF4D6] hover:text-[#F2B544] transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#D9A52B] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#F2B544]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                        className="px-5 pb-5 text-xs sm:text-sm text-[#FAF5E9]/80 leading-relaxed border-t border-white/10 pt-3.5"
                      >
                        {item.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
