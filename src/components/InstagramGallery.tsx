import React from 'react';
import { BRAND_DETAILS } from '../data/cup2eatData';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { MagneticButton } from './motion/MagneticButton';
import { StaggeredText } from './motion/StaggeredText';

export const InstagramGallery: React.FC = () => {
  const posts = [
    {
      title: '396 Edible Cups for ₹3,999 Wholesale Offer',
      likes: '342',
      category: 'Wholesale Offer',
      image: '/images/wholesale_box_packaging_1794364086788.jpg',
    },
    {
      title: 'Chocolate Edible Cup with Latte Art Coffee',
      likes: '512',
      category: 'Product Spotlight',
      image: '/images/flavor_chocolate_cup_1794364085690.jpg',
    },
    {
      title: 'Masala Chai in Elaichi Cardamom Edible Cup',
      likes: '428',
      category: 'Chai Pairing',
      image: '/images/flavor_elaichi_cup_1794364086233.jpg',
    },
    {
      title: 'Founder Varun Khera at Food Tech Expo',
      likes: '619',
      category: 'Brand Story',
      image: '/images/founder_varun_khera_event_1794364087135.jpg',
    },
  ];

  return (
    <section className="py-24 bg-[#FAF5E9] text-[#17130C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1306C]/10 text-[#E1306C] text-xs font-bold uppercase tracking-wider mb-3"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Follow @cup2eat on Instagram</span>
            </motion.div>

            <StaggeredText
              text="Eat Your Drink in Action"
              className="text-3xl sm:text-4xl font-display font-black text-[#073B2B]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-[#17130C]/75 mt-1"
            >
              Explore customer highlights, cafe feature stories, and behind-the-scenes event demonstrations.
            </motion.p>
          </div>

          <MagneticButton
            as="a"
            href={BRAND_DETAILS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-95 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0">
              <Instagram className="w-4 h-4" />
              <span>Visit @cup2eat Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </MagneticButton>
        </div>

        {/* Posts Grid with SpatialTiltContainer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <SpatialTiltContainer maxTilt={6} className="h-full">
                <a
                  href={BRAND_DETAILS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-3xl overflow-hidden border border-[#073B2B]/15 shadow-md hover:shadow-2xl transition-all relative flex flex-col justify-between h-full"
                >
                  <div className="relative h-64 overflow-hidden bg-[#17130C]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                      <span className="flex items-center gap-1.5 font-extrabold text-sm">
                        <Heart className="w-4 h-4 fill-white" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1.5 font-extrabold text-sm">
                        <MessageCircle className="w-4 h-4" /> Direct
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 text-[10px] font-extrabold bg-[#073B2B] text-[#FFF4D6] px-3 py-1 rounded-full shadow-md">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-4.5 bg-white border-t border-[#073B2B]/10">
                    <p className="text-xs font-bold text-[#073B2B] line-clamp-2">
                      {post.title}
                    </p>
                    <div className="mt-2 text-[11px] text-[#D9A52B] font-extrabold flex items-center gap-1">
                      <span>View on Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              </SpatialTiltContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
