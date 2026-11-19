import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, authModalMode } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password || 'password123');
        if (!res.success) {
          setError(res.error || 'Failed to login');
        }
      } else {
        if (!name || !email || !phone) {
          setError('Please fill in your name, email, and mobile number');
          setIsSubmitting(false);
          return;
        }
        const res = await register(name, email, phone, address);
        if (!res.success) {
          setError(res.error || 'Failed to register');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@mrbun.in');
      setPassword('admin123');
      setMode('login');
    } else {
      setEmail('rahul@example.com');
      setPassword('foodie123');
      setName('Rahul Sharma');
      setPhone('9876543210');
      setAddress('Flat 402, Green Glen Heights, Park Street');
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-6 text-white text-center relative shrink-0">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <img 
            src="/logo.png" 
            alt="Mr Bun Logo" 
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain mx-auto bg-white rounded-2xl p-1 shadow-md mb-2"
          />
          <h2 className="text-xl sm:text-2xl font-black">Welcome to Mr Bun</h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Sign in to track orders, save party menus &amp; enjoy exclusive discounts!
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-3 max-w-xs mx-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'login' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'register' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-100 hover:text-white'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. foodie@example.com"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Flat 402, Park Street"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In & Order' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              ⚡ Instant 1-Click Demo Logins
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('customer')}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl py-2 px-2 text-xs font-semibold transition"
              >
                Foodie Customer
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin')}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl py-2 px-2 text-xs font-semibold transition"
              >
                Mr Bun Admin
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
