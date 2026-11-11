import React, { useState, useEffect } from 'react';
import { adminLogin } from '../services/api';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, X, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('dumkanitin0@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await adminLogin(email, password);
      setIsLoading(false);

      if (res.success && res.token) {
        localStorage.setItem('cup2eat_admin_token', res.token);
        onSuccess(res.token, res.user);
        setPassword('');
        setError('');
        onClose();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative max-w-md w-full bg-[#17130C] border border-[#D9A52B]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close Admin Login"
          className="absolute top-4 right-4 p-2 rounded-full text-[#FAF5E9]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#073B2B] border-2 border-[#D9A52B] mx-auto flex items-center justify-center text-[#F2B544] shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-black text-[#FFF4D6]">
            Administrator Access
          </h2>
          <p className="text-xs text-[#FAF5E9]/70">
            Secure Control Center Sign In
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-950/90 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#D9A52B] mb-1">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dumkanitin0@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-[#FFF4D6] focus:outline-none focus:ring-2 focus:ring-[#F2B544] placeholder-[#FAF5E9]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D9A52B] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-[#FFF4D6] focus:outline-none focus:ring-2 focus:ring-[#F2B544] placeholder-[#FAF5E9]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#FAF5E9]/60 hover:text-[#F2B544] transition-colors cursor-pointer"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] disabled:opacity-50 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#073B2B]" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate & Open Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-[#FAF5E9]/40 pt-1">
          Protected System · Cup2Eat Management Platform
        </div>
      </div>
    </div>
  );
};
