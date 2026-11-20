import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User as UserIcon, Mail, Phone, MapPin, 
  Camera, CheckCircle2, AlertCircle, RotateCcw, 
  ShieldCheck, Sparkles, KeyRound, Smartphone, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Fun preset foodie avatars for Mr Bun lovers
const FOODIE_AVATARS = [
  { id: 'av-1', label: 'Chef Bun', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80' },
  { id: 'av-2', label: 'Burger Pro', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
  { id: 'av-3', label: 'Pizza Fan', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
  { id: 'av-4', label: 'Foodie Girl', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { id: 'av-5', label: 'Shake Lover', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { id: 'av-6', label: 'Mr Bun Mascot', url: '/logo.png' }
];

export const UserProfileModal: React.FC = () => {
  const { 
    user, 
    isProfileModalOpen, 
    closeProfileModal, 
    updateProfile, 
    sendOtp, 
    verifyOtp 
  } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Phone number change workflow
  const [currentPhone, setCurrentPhone] = useState('');
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneOtpStep, setPhoneOtpStep] = useState<'input' | 'otp' | 'verified'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Sync state when modal opens or user updates
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
      setAvatarUrl(user.avatarUrl || '');
      setCurrentPhone(user.phone || '');
      setIsChangingPhone(false);
      setNewPhone('');
      setPhoneOtpStep('input');
      setOtpCode('');
      setDevOtp(null);
      setError(null);
      setSuccess(null);
    }
  }, [user, isProfileModalOpen]);

  // Countdown timer for Phone Change OTP
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  if (!isProfileModalOpen || !user) return null;

  const sanitizePhone = (raw: string) => raw.replace(/\D/g, '').slice(-10);

  // --- Profile Image Handlers ---
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image file must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    setError(null);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
  };

  // --- Phone Number Change & MSG91 OTP Handlers ---
  const handleSendPhoneChangeOtp = async () => {
    setError(null);
    setSuccess(null);
    const clean = sanitizePhone(newPhone);
    if (clean.length !== 10) {
      setError('Please enter a valid 10-digit mobile number to verify.');
      return;
    }
    if (clean === sanitizePhone(currentPhone)) {
      setError('The new phone number must be different from your current number.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await sendOtp(clean);
      if (res.success) {
        setDevOtp(res.devOtp || null);
        setPhoneOtpStep('otp');
        setOtpCountdown(30);
        setSuccess(`Verification code dispatched to +91 ${clean} via MSG91 SMS.`);
      } else {
        setError(res.error || 'Failed to send verification SMS.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with SMS gateway.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyPhoneChangeOtp = async () => {
    setError(null);
    setSuccess(null);
    const clean = sanitizePhone(newPhone);
    if (!otpCode.trim()) {
      setError('Please enter the verification OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyOtp(clean, otpCode.trim());
      if (res.success) {
        setPhoneOtpStep('verified');
        setSuccess(`✓ Phone number +91 ${clean} verified via MSG91! Click "Save Profile Changes" to finalize.`);
      } else {
        setError(res.error || 'Invalid OTP code. Please check and try again.');
      }
    } catch (err: any) {
      setError('Failed to verify OTP code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // --- Save All Profile Settings ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Full name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Determine target phone number
    let finalPhone = currentPhone;
    let finalOtp = '';
    if (isChangingPhone && newPhone.trim()) {
      const clean = sanitizePhone(newPhone);
      if (clean.length !== 10) {
        setError('New phone number must be 10 digits.');
        return;
      }
      if (phoneOtpStep !== 'verified') {
        setError('Please verify the new phone number using the OTP before saving.');
        return;
      }
      finalPhone = clean;
      finalOtp = otpCode.trim();
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: finalPhone,
        address: address.trim(),
        avatarUrl,
        otp: finalOtp || undefined
      });

      if (res.success) {
        setSuccess('🎉 Your profile, address & account settings were updated successfully!');
        setCurrentPhone(finalPhone);
        setIsChangingPhone(false);
        setPhoneOtpStep('input');
        setOtpCode('');
        setTimeout(() => {
          closeProfileModal();
        }, 1200);
      } else {
        setError(res.error || 'Failed to update profile settings.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const appendAddressTag = (tag: string) => {
    setAddress(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return `[${tag}] `;
      if (trimmed.startsWith('[')) {
        return trimmed.replace(/^\[.*?\]\s*/, `[${tag}] `);
      }
      return `[${tag}] ${trimmed}`;
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-lg max-h-[94vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                User Settings &amp; Profile
              </h2>
              <p className="text-[11px] text-amber-100">
                Update address, email, phone number &amp; profile avatar
              </p>
            </div>
          </div>

          <button
            onClick={closeProfileModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{success}</div>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            {/* 1. Profile Image Update */}
            <div className="bg-amber-50/60 p-4 rounded-3xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-700" />
                  <span>Profile Image Update</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-white shadow-md flex items-center justify-center">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={name || 'User Avatar'} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-2xl flex items-center justify-center uppercase">
                        {name ? name[0] : 'U'}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded-xl shadow-md transition"
                    title="Upload photo from device"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageFileChange} 
                    className="hidden" 
                  />
                </div>

                {/* Upload or Remove Actions */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-700" />
                      <span>Upload Photo</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    JPG, PNG or GIF under 2MB. Or choose a Foodie Mascot below:
                  </p>
                </div>
              </div>

              {/* Preset Foodie Avatars Selection */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Choose Foodie Avatar Preset:</span>
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {FOODIE_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(av.url)}
                      className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition shrink-0 transform hover:scale-105 ${
                        avatarUrl === av.url ? 'border-amber-600 ring-2 ring-amber-400' : 'border-slate-200 hover:border-amber-300'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Full Name & Email Update */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID Update <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Order invoices and receipts go here.</p>
              </div>
            </div>

            {/* 3. Phone Number Change / Update with MSG91 OTP */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Phone Number Change &amp; Authentication</span>
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Current Verified: <strong className="font-mono text-slate-900">+91 {sanitizePhone(currentPhone)}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPhone(!isChangingPhone);
                    setPhoneOtpStep('input');
                    setOtpCode('');
                    setError(null);
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold transition"
                >
                  {isChangingPhone ? 'Cancel' : 'Change Phone'}
                </button>
              </div>

              {/* Changing phone view */}
              {isChangingPhone && (
                <div className="pt-2 border-t border-slate-200/80 space-y-3 animate-in fade-in">
                  {phoneOtpStep === 'input' && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Enter New 10-Digit Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1 flex items-center">
                          <div className="absolute left-3 text-slate-500 font-bold text-xs pointer-events-none select-none border-r border-slate-200 pr-2">
                            🇮🇳 +91
                          </div>
                          <input
                            type="tel"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Enter new 10-digit number"
                            className="w-full text-xs pl-20 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendPhoneChangeOtp}
                          disabled={isSendingOtp || sanitizePhone(newPhone).length !== 10}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                        >
                          {isSendingOtp ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Send MSG91 OTP</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        An MSG91 OTP will be sent to authenticate your new mobile phone number.
                      </p>
                    </div>
                  )}

                  {phoneOtpStep === 'otp' && (
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">
                          OTP sent to: <strong>+91 {sanitizePhone(newPhone)}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setPhoneOtpStep('input')}
                          className="text-amber-800 font-bold hover:underline text-[11px]"
                        >
                          Change Number
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter OTP"
                          className="w-36 text-center text-lg font-mono font-black tracking-widest py-1.5 rounded-xl border border-amber-300 focus:outline-none focus:border-amber-600 bg-white"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPhoneChangeOtp}
                          disabled={isVerifyingOtp || !otpCode.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1"
                        >
                          {isVerifyingOtp ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify OTP</span>
                            </>
                          )}
                        </button>
                      </div>

                      {devOtp && (
                        <div className="bg-white border border-slate-300 rounded-lg p-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 flex items-center gap-1">
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>Demo OTP: <strong>{devOtp}</strong></span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setOtpCode(devOtp)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-0.5 rounded text-[10px]"
                          >
                            Fill
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Didn&apos;t get SMS?</span>
                        {otpCountdown > 0 ? (
                          <span className="font-mono text-slate-400">Resend in {otpCountdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendPhoneChangeOtp}
                            className="text-amber-700 font-bold hover:underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {phoneOtpStep === 'verified' && (
                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold">New Phone Number Verified!</p>
                          <p className="text-[11px] font-mono text-emerald-800">+91 {sanitizePhone(newPhone)}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        Ready to Save
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Delivery Address Update */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Delivery Address Update</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => appendAddressTag('Home')}
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-1.5 py-0.5 rounded font-semibold transition"
                  >
                    + Home
                  </button>
                  <button
                    type="button"
                    onClick={() => appendAddressTag('Work')}
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-1.5 py-0.5 rounded font-semibold transition"
                  >
                    + Work
                  </button>
                  <button
                    type="button"
                    onClick={() => appendAddressTag('PG/Hostel')}
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-1.5 py-0.5 rounded font-semibold transition"
                  >
                    + Hostel
                  </button>
                </div>
              </div>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="e.g. Flat 402, Green Glen Heights, 12th Cross, Park Street, Near Metro Station, Bangalore - 560034"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                This delivery address will be auto-populated during food checkout and catering bookings.
              </p>
            </div>

            {/* Submit Action CTA */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Saving Profile Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={closeProfileModal}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
