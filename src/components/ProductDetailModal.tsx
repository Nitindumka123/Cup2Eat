import React, { useState } from 'react';
import { FLAVORS, ProductFlavor, BRAND_DETAILS } from '../data/cup2eatData';
import { X, Coffee, ShieldCheck, Flame, Check, MessageCircle, ArrowRight, Sparkles, Plus, Minus } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: ProductFlavor | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiryForm: (category: string, flavorName: string) => void;
  onSync3D: (flavorId: 'chocolate' | 'vanilla' | 'elaichi') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenEnquiryForm,
  onSync3D,
}) => {
  if (!isOpen || !product) return null;

  const [selectedFlavorId, setSelectedFlavorId] = useState<string>(product.id);
  const [boxQuantity, setBoxQuantity] = useState<number>(1); // 1 box = 396 cups
  const [customNotes, setCustomNotes] = useState<string>('');

  const currentFlavor = FLAVORS.find((f) => f.id === selectedFlavorId) || product;
  const totalCups = boxQuantity * 396;
  const estimatedCost = boxQuantity * 3999;

  const handleWhatsAppOrder = () => {
    openWhatsApp({
      productName: currentFlavor.name,
      flavor: currentFlavor.name,
      quantity: `${totalCups} cups (${boxQuantity} box${boxQuantity > 1 ? 'es' : ''})`,
      customMessage: customNotes || `Interested in ${currentFlavor.name}.`,
    });
  };

  const handleEnquiryForm = () => {
    onClose();
    onOpenEnquiryForm('product', `${currentFlavor.name} (${totalCups} cups)`);
  };

  const handle3DPreview = () => {
    if (currentFlavor.id === 'chocolate' || currentFlavor.id === 'vanilla' || currentFlavor.id === 'elaichi') {
      onSync3D(currentFlavor.id);
    }
    onClose();
    const elem = document.getElementById('home');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-[#073B2B]/20 max-h-[90vh] flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Panel */}
        <div className="lg:w-1/2 relative min-h-[240px] lg:min-h-full bg-[#17130C]">
          <img
            src={currentFlavor.image}
            alt={currentFlavor.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-[#073B2B] text-[#F2B544] text-xs font-bold px-3 py-1 rounded-full border border-[#D9A52B]/40 shadow">
            100 ml Edible Cup
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs text-[#FFF4D6]">
            <div className="font-bold flex items-center gap-1 text-[#F2B544]">
              <Flame className="w-3.5 h-3.5" /> Holds Hot Liquids up to 85°C
            </div>
            <div className="text-[11px] text-white/80 mt-0.5">
              Stays crisp and leak-proof for 45+ minutes.
            </div>
          </div>
        </div>

        {/* Details & Interactive Order Panel */}
        <div className="lg:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D9A52B] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Product Deep Dive
            </div>

            <h3 className="text-2xl font-display font-extrabold text-[#073B2B]">
              {currentFlavor.name}
            </h3>

            <p className="text-xs text-[#17130C]/80 leading-relaxed">
              {currentFlavor.description}
            </p>

            {/* Flavor Switcher Buttons */}
            <div>
              <span className="text-xs font-bold text-[#073B2B] block mb-2">Select Flavour:</span>
              <div className="flex items-center gap-2">
                {FLAVORS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlavorId(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedFlavorId === f.id
                        ? 'bg-[#073B2B] text-[#FFF4D6] ring-2 ring-[#D9A52B]'
                        : 'bg-[#FAF5E9] text-[#073B2B] border border-[#073B2B]/15 hover:bg-[#073B2B]/10'
                    }`}
                  >
                    {f.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="p-4 bg-[#FAF5E9] rounded-2xl border border-[#073B2B]/15 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#073B2B]">Wholesale Box Quantity:</span>
                <span className="text-[#D9A52B] font-extrabold">{totalCups} Cups ({boxQuantity} Box)</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center border border-[#073B2B]/30 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setBoxQuantity(Math.max(1, boxQuantity - 1))}
                    className="p-2 text-[#073B2B] hover:bg-[#FAF5E9] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#073B2B] tabular-nums">
                    {boxQuantity} Box
                  </span>
                  <button
                    onClick={() => setBoxQuantity(boxQuantity + 1)}
                    className="p-2 text-[#073B2B] hover:bg-[#FAF5E9] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Est. Total Investment</div>
                  <div className="text-lg font-extrabold text-[#073B2B] tabular-nums">
                    ₹{estimatedCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Taste Notes & Pairings */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#073B2B] block">Recommended Pairings:</span>
              <ul className="grid grid-cols-2 gap-1 text-[#17130C]/80">
                {currentFlavor.bestPairedWith.map((p) => (
                  <li key={p} className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#073B2B]" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2 border-t border-[#073B2B]/10">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order {totalCups} Cups via WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleEnquiryForm}
                className="py-2.5 text-xs font-bold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <span>Form Enquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handle3DPreview}
                className="py-2.5 text-xs font-semibold text-[#073B2B] bg-[#FAF5E9] hover:bg-[#073B2B]/10 rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <Coffee className="w-3.5 h-3.5 text-[#D9A52B]" />
                <span>View Product Photography</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
