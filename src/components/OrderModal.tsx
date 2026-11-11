import React, { useState } from 'react';
import { FLAVORS, BRAND_DETAILS } from '../data/cup2eatData';
import { submitCustomerOrder } from '../services/api';
import { X, CheckCircle2, ShoppingBag, Truck, MessageCircle, AlertCircle, ArrowRight, ShieldCheck, MapPin, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlavorId?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialFlavorId = 'chocolate',
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'summary' | 'confirmed'>('details');
  const [flavor, setFlavor] = useState<string>(
    initialFlavorId === 'vanilla' ? 'Vanilla' : initialFlavorId === 'elaichi' ? 'Elaichi' : 'Chocolate'
  );
  const [numberOfBoxes, setNumberOfBoxes] = useState<number>(1);
  const [orderCategory, setOrderCategory] = useState<'wholesale' | 'individual'>('wholesale');

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderRecord, setOrderRecord] = useState<any>(null);

  const cupsPerBox = 396;
  const pricePerBox = 3999;
  const totalCups = numberOfBoxes * cupsPerBox;
  const totalAmount = numberOfBoxes * pricePerBox;

  const handleNextToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMessage('Please enter a complete delivery address.');
      return;
    }

    if (!city.trim()) {
      setErrorMessage('Please enter your city.');
      return;
    }

    setStep('summary');
  };

  const handleConfirmAndSubmitOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const res = await submitCustomerOrder({
      customer_name: customerName,
      phone,
      email,
      delivery_address: deliveryAddress,
      city,
      pincode,
      flavor,
      number_of_boxes: numberOfBoxes,
      order_category: orderCategory,
      notes,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setOrderRecord(res.data);
      setStep('confirmed');
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#073B2B', '#D9A52B', '#F2B544', '#25D366'],
        });
      } catch (e) {}
    } else {
      setErrorMessage(res.error || 'Failed to record order in backend database. Please try again.');
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!orderRecord) return;
    const msg = encodeURIComponent(
      `Hello Cup2Eat!\nOrder Ref: ${orderRecord.order_reference}\nCustomer: ${orderRecord.customer_name}\nPhone: ${orderRecord.phone}\nFlavour: ${orderRecord.flavor}\nBoxes: ${orderRecord.number_of_boxes} Box (${orderRecord.quantity_cups} Cups)\nTotal: ₹${orderRecord.total_amount}\nAddress: ${orderRecord.delivery_address}, ${orderRecord.city}`
    );
    window.open(`https://wa.me/${BRAND_DETAILS.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-[#073B2B]/20 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#073B2B] text-[#FFF4D6] flex items-center justify-between border-b border-[#D9A52B]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9A52B]/20 border border-[#D9A52B]/40 flex items-center justify-center text-[#F2B544]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-[#FFF4D6]">
                Place Direct Order — Cup2Eat
              </h3>
              <p className="text-xs text-[#FAF5E9]/75">
                Official FSSAI Registered Edible Beverage Cups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleNextToSummary} className="space-y-5">
              {/* Product & Flavour Selection */}
              <div className="p-4 bg-[#FAF5E9] rounded-2xl border border-[#073B2B]/15 space-y-3">
                <label className="block text-xs font-extrabold text-[#073B2B]">
                  1. Select Edible Cup Flavour:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Chocolate', 'Vanilla', 'Elaichi', 'Mixed Assortment'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlavor(f)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                        flavor === f
                          ? 'bg-[#073B2B] text-[#FFF4D6] ring-2 ring-[#D9A52B] shadow-md'
                          : 'bg-white text-[#073B2B] border border-[#073B2B]/15 hover:bg-white/80'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#073B2B]/10">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B]">
                      Wholesale Box Count (396 Cups / Box):
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Total: {totalCups} Cups · Delivery Included
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNumberOfBoxes(Math.max(1, numberOfBoxes - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-[#073B2B]/20 font-bold text-[#073B2B]"
                    >
                      -
                    </button>
                    <span className="text-sm font-extrabold text-[#073B2B] tabular-nums">
                      {numberOfBoxes} Box
                    </span>
                    <button
                      type="button"
                      onClick={() => setNumberOfBoxes(numberOfBoxes + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#073B2B]/20 font-bold text-[#073B2B]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right pt-1">
                  <span className="text-xs text-slate-500">Est. Order Amount: </span>
                  <span className="text-lg font-black text-[#073B2B] tabular-nums">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Customer & Address Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98181XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi, Mumbai, Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#073B2B] mb-1">
                    Complete Shipping Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Shop No., Street Name, Landmark..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Pincode (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 201001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B2B] mb-1">
                      Special Order Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Preferred delivery time"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#073B2B]/20 text-xs text-[#17130C] focus:ring-2 focus:ring-[#073B2B] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <span>Review Order Summary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'summary' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#073B2B] text-[#FFF4D6] rounded-2xl space-y-3 shadow-md">
                <div className="text-xs font-bold text-[#D9A52B] uppercase">Order Review Summary</div>
                <div className="grid grid-cols-2 gap-2 text-xs border-b border-white/10 pb-3">
                  <div>
                    <span className="text-white/60 block">Customer Name</span>
                    <span className="font-bold">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-white/60 block">Phone</span>
                    <span className="font-bold">{phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/60 block">Delivery Address</span>
                    <span className="font-bold">{deliveryAddress}, {city} {pincode}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#F2B544] text-base">{flavor} Edible Cups</span>
                    <span className="text-white/70 block">{totalCups} Cups ({numberOfBoxes} Box)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/60 block">Total Payable</span>
                    <span className="text-2xl font-black text-[#F2B544] tabular-nums">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Includes free Pan-India delivery in protective carton box packaging.</span>
              </div>

              <div className="pt-2 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Back to Edit
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndSubmitOrder}
                  className="px-6 py-3 text-xs font-black text-[#073B2B] bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 fill-white text-white" />
                  <span>{isSubmitting ? 'Recording Order in Database...' : 'Confirm & Place Order'}</span>
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && orderRecord && (
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#073B2B] text-[#F2B544] mx-auto flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-display font-black text-[#073B2B]">
                  Order Successfully Created & Persisted!
                </h3>
                <p className="text-xs text-[#17130C]/75 mt-1">
                  Your order has been recorded in the Cup2Eat backend database.
                </p>
              </div>

              <div className="p-4 bg-[#FAF5E9] border border-[#D9A52B]/40 rounded-2xl max-w-md mx-auto space-y-2 text-xs">
                <div className="font-mono text-sm font-bold text-[#073B2B]">
                  Order Reference: {orderRecord.order_reference}
                </div>
                <div className="text-slate-600">
                  {orderRecord.flavor} · {orderRecord.number_of_boxes} Box ({orderRecord.quantity_cups} Cups)
                </div>
                <div className="font-extrabold text-[#073B2B]">
                  Total: ₹{orderRecord.total_amount?.toLocaleString()} (Status: {orderRecord.status})
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="px-6 py-3 text-xs font-black text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Send Order to WhatsApp Desk</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
