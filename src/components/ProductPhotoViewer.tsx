import React, { useState, useEffect } from 'react';
import { FLAVORS, ProductFlavor, BRAND_DETAILS } from '../data/cup2eatData';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Coffee,
  Check,
  MessageCircle,
  ArrowRight,
  Maximize2,
  X,
  Layers,
  Award,
  Box,
  Eye,
  RotateCcw
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialTiltContainer } from './motion/SpatialTiltContainer';
import { MagneticButton } from './motion/MagneticButton';
import { AmbientCanvasBackground } from './motion/AmbientCanvasBackground';
import { Cup3DCanvas } from './Cup3DCanvas';

interface ProductPhotoViewerProps {
  activeFlavorId?: 'chocolate' | 'vanilla' | 'elaichi' | 'wholesale';
  onFlavorSelect?: (flavorId: 'chocolate' | 'vanilla' | 'elaichi') => void;
  onOpenEnquiry?: (category?: string, flavorName?: string) => void;
}

export const ProductPhotoViewer: React.FC<ProductPhotoViewerProps> = ({
  activeFlavorId = 'chocolate',
  onFlavorSelect,
  onOpenEnquiry,
}) => {
  const [currentFlavorId, setCurrentFlavorId] = useState<'chocolate' | 'vanilla' | 'elaichi' | 'wholesale'>(
    activeFlavorId
  );
  const [stageMode, setStageMode] = useState<'photo' | '3d'>('photo');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [beverageServing, setBeverageServing] = useState<'latte' | 'chai' | 'chocolate'>('latte');
  const [steamEnabled, setSteamEnabled] = useState(true);
  const [autoSpin, setAutoSpin] = useState(true);

  useEffect(() => {
    setCurrentFlavorId(activeFlavorId);
  }, [activeFlavorId]);

  const currentFlavor: ProductFlavor =
    FLAVORS.find((f) => f.id === currentFlavorId) || FLAVORS[0];

  const handleSelectFlavor = (id: 'chocolate' | 'vanilla' | 'elaichi') => {
    setCurrentFlavorId(id);
    if (onFlavorSelect) onFlavorSelect(id);
  };

  const handleWhatsAppOrder = () => {
    openWhatsApp({
      productName: currentFlavorId === 'wholesale' ? '396 Mixed Wholesale Box' : currentFlavor.name,
      flavor: currentFlavorId === 'wholesale' ? 'Mixed Assortment' : currentFlavor.name,
      quantity: currentFlavorId === 'wholesale' ? '1 Wholesale Box (396 cups)' : '396 cups',
    });
  };

  const getDisplayImage = () => {
    if (currentFlavorId === 'wholesale') {
      return '/images/wholesale_box_packaging_1794364086788.jpg';
    }
    return currentFlavor.image;
  };

  // Theme mapping for ambient backdrop
  const getTheme = () => {
    switch (currentFlavorId) {
      case 'chocolate':
        return 'chocolate';
      case 'vanilla':
        return 'gold';
      case 'elaichi':
        return 'emerald';
      default:
        return 'dark';
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B5D43]/80 via-[#073B2B] to-[#17130C] border border-[#D9A52B]/40 shadow-2xl flex flex-col justify-between group transform-gpu">
      {/* Background Interactive Ambient Particles */}
      <AmbientCanvasBackground theme={getTheme()} />

      {/* Top Bar Header Badge & Dual Mode Switcher */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#17130C]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-[#073B2B]/90 px-3.5 py-1.5 rounded-full border border-[#D9A52B]/40 text-xs font-semibold text-[#FFF4D6] shadow-sm">
          <Award className="w-4 h-4 text-[#F2B544] animate-pulse" />
          <span className="font-bold">Real Commercial Product Showcase</span>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#073B2B]/90 p-1 rounded-xl border border-[#D9A52B]/30 shadow-inner">
          <button
            onClick={() => setStageMode('photo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              stageMode === 'photo'
                ? 'bg-[#F2B544] text-[#073B2B] shadow-md font-black'
                : 'text-[#FFF4D6]/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Photo Studio</span>
          </button>

          <button
            onClick={() => setStageMode('3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              stageMode === '3d'
                ? 'bg-[#F2B544] text-[#073B2B] shadow-md font-black'
                : 'text-[#FFF4D6]/80 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Studio</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 w-full min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] flex items-center justify-center p-4 overflow-hidden">
        {stageMode === '3d' ? (
          /* 3D Dimensional Interactive Studio Canvas */
          <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#D9A52B]/30 bg-gradient-to-b from-[#0B5D43]/40 to-[#140E0A] shadow-2xl">
            <Cup3DCanvas
              currentFlavor={currentFlavorId === 'wholesale' ? 'chocolate' : currentFlavorId}
              beverageType={beverageServing}
              steamEnabled={steamEnabled}
              autoRotate={autoSpin}
              liquidLevel={0.8}
            />

            {/* 3D Overlay Badge */}
            <div className="absolute top-3 left-3 bg-[#073B2B]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#F2B544] border border-[#D9A52B]/40 shadow flex items-center gap-1.5 pointer-events-none">
              <Box className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Interactive 3D Model · Drag to Rotate</span>
            </div>

            {/* 3D Quick Toggles Strip */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-20 bg-[#17130C]/90 backdrop-blur-md p-2 rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 text-[11px] font-bold">Beverage:</span>
                <button
                  onClick={() => setBeverageServing('latte')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    beverageServing === 'latte' ? 'bg-[#D9A52B] text-[#073B2B]' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Latte
                </button>
                <button
                  onClick={() => setBeverageServing('chai')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    beverageServing === 'chai' ? 'bg-[#D9A52B] text-[#073B2B]' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Chai
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSteamEnabled(!steamEnabled)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    steamEnabled ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40' : 'bg-white/10 text-white/50'
                  }`}
                >
                  Steam
                </button>
                <button
                  onClick={() => setAutoSpin(!autoSpin)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    autoSpin ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40' : 'bg-white/10 text-white/50'
                  }`}
                >
                  Spin
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Photorealistic Commercial Photography Stage */
          <SpatialTiltContainer maxTilt={10} glare={true} onClick={() => setIsZoomOpen(true)} className="w-full max-w-[440px]">
            <div className="relative w-full flex items-center justify-center p-2">
              <AnimatePresence mode="wait">
                <motion.img
                  key={getDisplayImage()}
                  src={getDisplayImage()}
                  alt={currentFlavorId === 'wholesale' ? 'Cup2Eat Wholesale Box' : currentFlavor.name}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
                  className="max-h-[300px] sm:max-h-[340px] w-auto object-contain rounded-2xl shadow-2xl border border-[#D9A52B]/40 transform-gpu"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Click to Inspect Overlay Chip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#FFF4D6] border border-white/20 shadow-lg flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>Inspect Texture</span>
              </motion.div>

              {/* Heat Resistance Floating Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute top-4 left-4 bg-[#073B2B]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#D9A52B]/40 text-xs font-extrabold text-[#F2B544] flex items-center gap-1.5 shadow-xl z-20"
              >
                <Flame className="w-3.5 h-3.5 text-[#F2B544] animate-bounce" />
                <span>Hot Liquids up to 85°C</span>
              </motion.div>
            </div>
          </SpatialTiltContainer>
        )}
      </div>

      {/* Flavour Dock & Beverage Serving Selector */}
      <div className="relative z-20 bg-[#17130C]/95 backdrop-blur-xl border-t border-[#D9A52B]/40 p-4 sm:p-5 space-y-4">
        {/* Flavour Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#FAF5E9]/80 font-bold">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D9A52B]" /> Signature Waffle Flavours:
            </span>
            <span className="text-[#D9A52B] font-semibold">100% Edible Container</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectFlavor('chocolate')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                currentFlavorId === 'chocolate'
                  ? 'bg-[#3D2314] text-[#FFF4D6] ring-2 ring-[#D9A52B] shadow-lg scale-[1.02]'
                  : 'bg-[#28180F]/60 text-[#FFF4D6]/70 hover:bg-[#3D2314]/80 border border-white/5'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#3D2314] border border-white/40 shrink-0" />
              <span>Chocolate</span>
            </button>

            <button
              onClick={() => handleSelectFlavor('vanilla')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                currentFlavorId === 'vanilla'
                  ? 'bg-[#D9A52B] text-[#073B2B] ring-2 ring-white font-extrabold shadow-lg scale-[1.02]'
                  : 'bg-[#28180F]/60 text-[#FFF4D6]/70 hover:bg-[#D9A52B]/40 border border-white/5'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#D9A52B] border border-black/40 shrink-0" />
              <span>Vanilla</span>
            </button>

            <button
              onClick={() => handleSelectFlavor('elaichi')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                currentFlavorId === 'elaichi'
                  ? 'bg-[#073B2B] text-[#F2B544] ring-2 ring-[#D9A52B] shadow-lg scale-[1.02]'
                  : 'bg-[#28180F]/60 text-[#FFF4D6]/70 hover:bg-[#073B2B]/80 border border-white/5'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#073B2B] border border-white/40 shrink-0" />
              <span>Elaichi</span>
            </button>
          </div>
        </div>

        {/* Flavour Specs Pill Grid */}
        <div className="p-3.5 rounded-xl bg-[#073B2B]/60 border border-white/10 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-white/60 block text-[10px] uppercase font-bold">Capacity</span>
            <span className="font-extrabold text-[#FFF4D6]">100 ml</span>
          </div>
          <div>
            <span className="text-white/60 block text-[10px] uppercase font-bold">Leak-Proof</span>
            <span className="font-extrabold text-[#F2B544]">45+ Minutes</span>
          </div>
          <div>
            <span className="text-white/60 block text-[10px] uppercase font-bold">Heat Proof</span>
            <span className="font-extrabold text-[#FFF4D6]">85°C Max</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 pt-1">
          <MagneticButton onClick={handleWhatsAppOrder} className="flex-1">
            <span className="w-full py-3.5 px-4 text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>Order via WhatsApp</span>
            </span>
          </MagneticButton>

          {onOpenEnquiry && (
            <button
              onClick={() => onOpenEnquiry('wholesale', currentFlavor.name)}
              className="py-3.5 px-4 text-xs font-bold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md"
            >
              <span>Enquire Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* High-Resolution Macro Detail Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative max-w-4xl w-full bg-[#17130C] rounded-3xl border border-[#D9A52B]/40 overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col space-y-5"
            >
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-30"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D9A52B]">
                  High-Resolution Commercial Photographic Inspection
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#FFF4D6]">
                  {currentFlavor.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF5E9]/80 max-w-lg mx-auto">
                  {currentFlavor.description}
                </p>
              </div>

              <div className="relative max-h-[55vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-4">
                <img
                  src={getDisplayImage()}
                  alt={currentFlavor.name}
                  className="max-h-[50vh] w-auto object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#FAF5E9]/90">
                <div className="p-3.5 bg-[#073B2B]/60 rounded-xl border border-white/10 flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#F2B544] shrink-0" />
                  <div>
                    <div className="font-bold text-[#FFF4D6]">Baked Waffle Weave</div>
                    <div className="text-[10px] text-white/70">Crispy structural grain</div>
                  </div>
                </div>
                <div className="p-3.5 bg-[#073B2B]/60 rounded-xl border border-white/10 flex items-center gap-3">
                  <Flame className="w-5 h-5 text-[#F2B544] shrink-0" />
                  <div>
                    <div className="font-bold text-[#FFF4D6]">85°C Thermal Dwell</div>
                    <div className="text-[10px] text-white/70">Holds hot liquid for 45+ mins</div>
                  </div>
                </div>
                <div className="p-3.5 bg-[#073B2B]/60 rounded-xl border border-white/10 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#F2B544] shrink-0" />
                  <div>
                    <div className="font-bold text-[#FFF4D6]">FSSAI Registered</div>
                    <div className="text-[10px] text-white/70">100% natural food grade</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  Close Inspection
                </button>
                <button
                  onClick={() => {
                    setIsZoomOpen(false);
                    handleWhatsAppOrder();
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-colors flex items-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Order {currentFlavor.name}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
