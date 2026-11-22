import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User as UserIcon, Phone, MapPin, 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, 
  RotateCcw, Eye, EyeOff, KeyRound, Smartphone, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const isLocalDevelopment = 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.endsWith('.local'))) || 
  Boolean((import.meta as any).env?.DEV);

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    loginWithOtp, 
    sendOtp, 
    register, 
    authModalMode 
  } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');
  
  // Registration States
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Login States
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpStep, setLoginOtpStep] = useState<'phone' | 'otp'>('phone');
  const [loginDevOtp, setLoginDevOtp] = useState<string | null>(null);
  const [loginCountdown, setLoginCountdown] = useState(0);

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode with parent prop when modal opens
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setError(null);
      setSuccessMsg(null);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Countdown timer for Registration OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Countdown timer for Login OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loginCountdown > 0) {
      timer = setTimeout(() => setLoginCountdown(loginCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [loginCountdown]);

  if (!isAuthModalOpen) return null;

  // Clean phone string to 10 digits
  const sanitizePhone = (raw: string) => raw.replace(/\D/g, '').slice(-10);

  // ===================== REGISTRATION FLOW =====================
  // Step 1: Validate inputs and trigger MSG91 OTP
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = sanitizePhone(phone);
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendOtp(cleanPhone);
      if (res.success) {
        setDevOtp(res.devOtp || null);
        setRegStep('otp');
        setResendCountdown(30);
        setSuccessMsg(res.message || `OTP sent to +91 ${cleanPhone} via MSG91 SMS`);
      } else {
        setError(res.error || 'Failed to dispatch OTP. Please check your phone number.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with SMS service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP and Register user in Cloudflare D1
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = sanitizePhone(phone);
    if (!otp.trim()) {
      setError('Please enter the verification OTP code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(
        name.trim(),
        cleanPhone,
        password,
        email.trim(),
        address.trim(),
        otp.trim()
      );

      if (res.success) {
        setSuccessMsg('Account registered & verified successfully! Welcome to Mr Bun.');
        setTimeout(() => {
          closeAuthModal();
        }, 600);
      } else {
        setError(res.error || 'Invalid OTP code. Please enter the correct code.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend Registration OTP
  const handleResendRegOtp = async () => {
    if (resendCountdown > 0) return;
    setError(null);
    setIsSubmitting(true);
    const cleanPhone = sanitizePhone(phone);
    try {
      const res = await sendOtp(cleanPhone);
      if (res.success) {
        setDevOtp(res.devOtp || null);
        setResendCountdown(30);
        setSuccessMsg(`A new OTP has been sent to +91 ${cleanPhone}`);
      } else {
        setError(res.error || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      setError('Could not resend OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== LOGIN FLOW =====================
  // Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setError('Please enter your mobile phone number or email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(loginIdentifier.trim(), loginPassword);
      if (res.success) {
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => closeAuthModal(), 500);
      } else {
        setError(res.error || 'Invalid login credentials. Please verify your phone/email and password.');
      }
    } catch (err: any) {
      setError('Unable to log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick OTP Login: Step 1 (Send OTP)
  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = sanitizePhone(loginPhone);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number for OTP login.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendOtp(cleanPhone);
      if (res.success) {
        setLoginDevOtp(res.devOtp || null);
        setLoginOtpStep('otp');
        setLoginCountdown(30);
        setSuccessMsg(`OTP sent to +91 ${cleanPhone} via MSG91 SMS`);
      } else {
        setError(res.error || 'Failed to send login OTP.');
      }
    } catch (err: any) {
      setError('Failed to reach authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick OTP Login: Step 2 (Verify OTP)
  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = sanitizePhone(loginPhone);
    if (!loginOtp.trim()) {
      setError('Please enter the OTP sent to your phone.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithOtp(cleanPhone, loginOtp.trim());
      if (res.success) {
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => closeAuthModal(), 500);
      } else {
        setError(res.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setError('Failed to verify OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-md max-h-[94vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-4 sm:p-5 text-white text-center relative shrink-0">
          <button
            onClick={closeAuthModal}
            className="absolute top-3.5 right-3.5 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-1">
            <img 
              src="/logo.png" 
              alt="Mr Bun Logo" 
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain bg-white rounded-xl p-1 shadow-md"
            />
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">Welcome to Mr Bun</h2>
            </div>
          </div>
          <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
            {mode === 'register' 
              ? 'Create your account with SMS-verified mobile number & enjoy fast ordering!' 
              : 'Sign in to track orders, save party menus & enjoy exclusive deals!'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/25 p-1 rounded-xl mt-3 max-w-xs mx-auto text-xs font-bold border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'login' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setRegStep('form'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'register' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-100 hover:text-white'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Feedback Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{successMsg}</div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ================= NEW ACCOUNT REGISTRATION ============== */}
          {/* ========================================================= */}
          {mode === 'register' && (
            <>
              {regStep === 'form' ? (
                <form onSubmit={handleInitiateRegistration} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chandra Sekhar"
                        className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Mobile Phone Number <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-slate-500 font-bold text-xs pointer-events-none select-none border-r border-slate-200 pr-2">
                        <span>🇮🇳 +91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210 (10 digits)"
                        className="w-full text-xs pl-20 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold tracking-wider"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      We will verify this phone number via instant MSG91 SMS before creating your account.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Password <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-slate-400">Min. 4 characters</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create your account password"
                        className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Optional Details Collapsible Toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <span>{showOptionalFields ? '− Hide optional details' : '+ Add Email & Delivery Address (Optional)'}</span>
                    </button>

                    {showOptionalFields && (
                      <div className="mt-2 space-y-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 animate-in fade-in">
                        {/* Optional Email */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Email Address (Optional)
                          </label>
                          <div className="relative">
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. foodie@example.com"
                              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                            />
                          </div>
                        </div>

                        {/* Optional Address */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Delivery Address (Optional)
                          </label>
                          <div className="relative">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="e.g. Venkat Villa, Flat 402, Park Street"
                              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Sending MSG91 OTP...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Mobile &amp; Register</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Registration OTP Verification Step */
                <form onSubmit={handleVerifyAndRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-amber-950">Authenticate Phone Number</h3>
                    <p className="text-xs text-slate-600">
                      Enter the 4-digit OTP code sent via MSG91 to{' '}
                      <span className="font-bold font-mono text-slate-900">+91 {sanitizePhone(phone)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setRegStep('form')}
                      className="text-[11px] font-bold text-amber-700 hover:underline"
                    >
                      ← Change Phone Number
                    </button>
                  </div>

                  {/* OTP Input Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                      4-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 px-4 rounded-2xl border-2 border-amber-300 focus:border-amber-600 focus:outline-none bg-amber-50/20"
                      autoFocus
                      required
                    />
                  </div>

                  {/* Development / Demo Hint Helper (Rendered ONLY on local development) */}
                  {isLocalDevelopment && devOtp && (
                    <div className="bg-slate-100 border border-slate-300 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <span>Demo OTP: <strong>{devOtp}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtp)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] transition shadow-xs"
                      >
                        Auto Fill
                      </button>
                    </div>
                  )}

                  {/* Resend OTP Timer & Button */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-500">Didn&apos;t receive SMS?</span>
                    {resendCountdown > 0 ? (
                      <span className="text-slate-400 font-mono font-semibold">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendRegOtp}
                        disabled={isSubmitting}
                        className="font-bold text-amber-700 hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>

                  {/* Confirm CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !otp.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Verifying &amp; Registering...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP &amp; Complete Registration</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* ===================== SIGN IN (LOGIN) =================== */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* Login Method Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setError(null); }}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    loginMethod === 'password'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setLoginOtpStep('phone'); setError(null); }}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    loginMethod === 'otp'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Instant OTP Login
                </button>
              </div>

              {/* Password Login Method */}
              {loginMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Phone Number or Email
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210 or admin@mrbun.in"
                        className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In &amp; Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Instant OTP Login Method */}
              {loginMethod === 'otp' && (
                <>
                  {loginOtpStep === 'phone' ? (
                    <form onSubmit={handleSendLoginOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                          <span>Enter Registered Mobile Number</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            No password needed
                          </span>
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 flex items-center gap-1 text-slate-500 font-bold text-xs pointer-events-none select-none border-r border-slate-200 pr-2">
                            <span>🇮🇳 +91</span>
                          </div>
                          <input
                            type="tel"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="9876543210 (10 digits)"
                            className="w-full text-xs pl-20 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold tracking-wider"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            <span>Send Login OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyLoginOtp} className="space-y-4 animate-in fade-in">
                      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center space-y-1">
                        <p className="text-xs text-slate-600">
                          Enter OTP code sent to <strong className="font-mono text-slate-900">+91 {sanitizePhone(loginPhone)}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setLoginOtpStep('phone')}
                          className="text-[11px] font-bold text-amber-700 hover:underline"
                        >
                          ← Change Phone Number
                        </button>
                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • •"
                        className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 px-4 rounded-2xl border-2 border-amber-300 focus:border-amber-600 focus:outline-none bg-amber-50/20"
                        autoFocus
                        required
                      />

                      {/* Demo OTP Helper (Rendered ONLY on local development) */}
                      {isLocalDevelopment && loginDevOtp && (
                        <div className="bg-slate-100 border border-slate-300 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <KeyRound className="w-4 h-4 text-amber-600" />
                            <span>Demo OTP: <strong>{loginDevOtp}</strong></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLoginOtp(loginDevOtp)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] transition shadow-xs"
                          >
                            Auto Fill
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-500">Didn&apos;t get OTP?</span>
                        {loginCountdown > 0 ? (
                          <span className="text-slate-400 font-mono font-semibold">Resend in {loginCountdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await sendOtp(sanitizePhone(loginPhone));
                              if (res.success) {
                                setLoginDevOtp(res.devOtp || null);
                                setLoginCountdown(30);
                              }
                            }}
                            className="font-bold text-amber-700 hover:underline"
                          >
                            Resend
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !loginOtp.trim()}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify &amp; Sign In</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
