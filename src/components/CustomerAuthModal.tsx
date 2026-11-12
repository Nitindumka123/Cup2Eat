import React, { useState, useEffect } from 'react';
import { sendCustomerOtp, verifyCustomerOtp } from '../services/api';
import { Mail, Phone, Lock, Sparkles, CheckCircle2, AlertCircle, X, Loader2, ArrowRight, RefreshCw, UserCheck } from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, customer: any) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [target, setTarget] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Countdown timer for resend
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!target.trim()) {
      setError(method === 'email' ? 'Please enter a valid email address.' : 'Please enter a 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    const res = await sendCustomerOtp(target.trim(), method);
    setIsLoading(false);

    if (res.success) {
      setStep('verify');
      setResendCooldown(60);
      setSuccessMessage(`OTP sent to ${target.trim()}. (Check server log for demo code)`);
    } else {
      setError(res.error || 'Failed to send OTP verification code.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code sent to your ' + (method === 'email' ? 'email' : 'mobile number') + '.');
      return;
    }

    setIsLoading(true);
    const res = await verifyCustomerOtp(target.trim(), method, otpCode.trim(), fullName);
    setIsLoading(false);

    if (res.success && res.token && res.customer) {
      localStorage.setItem('cup2eat_customer_token', res.token);
      onSuccess(res.token, res.customer);
      onClose();
      // Reset modal state
      setStep('input');
      setOtpCode('');
      setTarget('');
      setFullName('');
    } else {
      setError(res.error || 'Invalid verification code. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative max-w-md w-full bg-[#17130C] border border-[#D9A52B]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#FAF5E9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close Authentication Modal"
          className="absolute top-4 right-4 p-2 rounded-full text-[#FAF5E9]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#073B2B] border-2 border-[#D9A52B] mx-auto flex items-center justify-center text-[#F2B544] shadow-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-black text-[#FFF4D6]">
            {step === 'input' ? 'Customer Sign In / Register' : 'Enter Verification Code'}
          </h2>
          <p className="text-xs text-[#FAF5E9]/70">
            {step === 'input'
              ? 'Passwordless OTP verification for Cup2Eat account access'
              : `Enter the 6-digit OTP code sent to ${target}`}
          </p>
        </div>

        {/* Method Switcher Tabs (Only in Step 1) */}
        {step === 'input' && (
          <div className="grid grid-cols-2 gap-2 bg-[#073B2B]/60 p-1 rounded-2xl border border-[#D9A52B]/30">
            <button
              type="button"
              onClick={() => {
                setMethod('email');
                setError('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                method === 'email'
                  ? 'bg-[#F2B544] text-[#073B2B] shadow-md font-black'
                  : 'text-[#FFF4D6]/70 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod('phone');
                setError('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                method === 'phone'
                  ? 'bg-[#F2B544] text-[#073B2B] shadow-md font-black'
                  : 'text-[#FFF4D6]/70 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <div className="p-3 bg-red-950/90 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Step 1 Form: Target Input */}
        {step === 'input' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#D9A52B] mb-1">
                Full Name (Optional for First-Time Users)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-[#FFF4D6] focus:outline-none focus:ring-2 focus:ring-[#F2B544] placeholder-[#FAF5E9]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D9A52B] mb-1">
                {method === 'email' ? 'Email Address *' : '10-Digit Mobile Number *'}
              </label>
              <input
                type={method === 'email' ? 'email' : 'tel'}
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={method === 'email' ? 'rahul@example.com' : '98181XXXXX'}
                className="w-full px-4 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-[#FFF4D6] focus:outline-none focus:ring-2 focus:ring-[#F2B544] placeholder-[#FAF5E9]/40"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] disabled:opacity-50 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#073B2B]" />
                  <span>Generating OTP Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Send {method === 'email' ? 'Email' : 'SMS'} Verification OTP</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2 Form: Verification Code */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-bold text-[#D9A52B]">6-Digit OTP Code *</label>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[11px] text-[#F2B544] hover:underline"
                >
                  Change {method}
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-center font-mono font-bold text-lg text-[#F2B544] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#F2B544] placeholder-[#FAF5E9]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] disabled:opacity-50 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#073B2B]" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Access Account</span>
                </>
              )}
            </button>

            {/* Resend Cooldown Handler */}
            <div className="text-center pt-2 text-xs text-[#FAF5E9]/60">
              Didn't receive code?{' '}
              {resendCooldown > 0 ? (
                <span className="text-[#D9A52B] font-bold">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[#F2B544] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP Now</span>
                </button>
              )}
            </div>
          </form>
        )}

        <div className="text-center text-[10px] text-[#FAF5E9]/40 pt-1">
          FSSAI Registered Operations · Cup2Eat Secure Platform
        </div>
      </div>
    </div>
  );
};
