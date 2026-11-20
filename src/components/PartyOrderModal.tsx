import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  PartyPopper, 
  MapPin, 
  PhoneCall, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  QrCode,
  CreditCard,
  Banknote,
  AlertTriangle,
  Mail
} from 'lucide-react';
import { PartyPackage } from '../types';
import { PARTY_PACKAGES } from '../data/partyPackages';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface PartyOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedPackage?: PartyPackage | null;
  initialGuests?: number;
}

export const PartyOrderModal: React.FC<PartyOrderModalProps> = ({
  isOpen,
  onClose,
  preSelectedPackage,
  initialGuests = 25
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { packages: dynamicPackages, settings } = useSettings();
  const availablePackages = dynamicPackages && dynamicPackages.length > 0 ? dynamicPackages : PARTY_PACKAGES;

  const [eventType, setEventType] = useState('Birthday Party');
  const [guestCount, setGuestCount] = useState(initialGuests);
  const [selectedPackageId, setSelectedPackageId] = useState(preSelectedPackage?.id || availablePackages[0].id);
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('07:30 PM');
  const [venueAddress, setVenueAddress] = useState(user?.address || '');
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [vegRatio, setVegRatio] = useState('50% Veg / 50% Non-Veg');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'online' | 'cash_before_prep'>('upi');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (preSelectedPackage) {
      setSelectedPackageId(preSelectedPackage.id);
    }
  }, [preSelectedPackage]);

  useEffect(() => {
    if (initialGuests) {
      setGuestCount(initialGuests);
    }
  }, [initialGuests]);

  useEffect(() => {
    if (user) {
      if (!fullName && user.name) setFullName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
      if (!venueAddress && user.address) setVenueAddress(user.address);
    }
  }, [user]);

  if (!isOpen) return null;

  // 1. Authentication Gate: User MUST be logged in to book party catering
  if (!isAuthenticated || !user) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
        <div 
          className="relative bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 text-center space-y-5 animate-in zoom-in-95 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              Login Required for Party Booking
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Mr Bun requires users to be authenticated to select party feast packages, pay advance, and receive direct confirmation dispatch from the owner.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <span>Sign In to Continue Party Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                openAuthModal('register');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition"
            >
              Create New Mr Bun Account
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            FSSAI Lic: {settings.fssaiLicense} • Phone Support: {settings.phone}
          </p>
        </div>
      </div>
    );
  }

  const currentPkg = availablePackages.find((p) => p.id === selectedPackageId) || availablePackages[0];
  const isFixedPrice = currentPkg.priceType === 'fixed';
  const unitPrice = currentPkg.price ?? currentPkg.pricePerGuest ?? 299;
  const rawTotal = isFixedPrice ? unitPrice : guestCount * unitPrice;
  const discountRate = isFixedPrice ? 0 : (guestCount >= 30 ? 0.2 : guestCount >= 20 ? 0.15 : 0.1);
  const discountAmount = Math.round(rawTotal * discountRate);
  const estimatedTotal = rawTotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !venueAddress) {
      alert('Please fill in your name, contact phone number, and party venue address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await dbService.createPartyOrder({
        userId: user.id,
        fullName,
        phone,
        email: email || user.email,
        eventType,
        guestCount,
        eventDate,
        eventTime,
        venueAddress,
        packageId: currentPkg.id,
        packageName: currentPkg.title,
        customNotes: `Dietary: ${vegRatio}. Notes: ${specialNotes}`,
        budgetEstimate: estimatedTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_before_prep' ? 'pending' : 'paid'
      });

      setConfirmedBookingId(booking.id);
    } catch (err) {
      console.error(err);
      alert('Failed to submit booking. Please call 9476088111.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBookingId(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200/80 animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button at top right */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBookingId ? (
          /* Confirmation State detailing owner message dispatch and pending status */
          <div className="p-6 sm:p-10 text-center space-y-6 overflow-y-auto flex-1">
            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Clock className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Booking Reference: {confirmedBookingId}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-display">
                Party Request Sent to Owner!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
                Thank you <strong>{fullName}</strong>! Your party booking status is <strong className="text-amber-700 uppercase">PENDING OWNER APPROVAL</strong>.
              </p>
            </div>

            {/* Notification Dispatch Receipt */}
            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200 text-left max-w-lg mx-auto text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-950 font-bold border-b border-amber-200/80 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Party Details Dispatched to Mr Bun Owner</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-100">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Owner Phone / SMS: <strong className="font-mono text-slate-800">{settings.phone}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-100">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Owner Email: <strong className="font-mono text-slate-800">{settings.email}</strong></span>
                </div>
              </div>

              <div className="flex justify-between border-b border-amber-200/60 pb-1.5 pt-1">
                <span className="text-slate-500 font-semibold">Event:</span>
                <span className="font-bold text-slate-800">{eventType} ({guestCount} Guests)</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-500 font-semibold">Package:</span>
                <span className="font-bold text-amber-800">{currentPkg.title}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-500 font-semibold">Date &amp; Time:</span>
                <span className="font-bold text-slate-800">{eventDate} @ {eventTime}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-500 font-semibold">Payment Mode:</span>
                <span className="font-bold text-slate-800 uppercase">{paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-slate-900">
                <span>Estimated Total:</span>
                <span className="text-amber-700">₹{estimatedTotal.toLocaleString()}</span>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                • <strong>Approval Workflow:</strong> Once the owner approves your booking in the admin dashboard, a confirmation message will be sent to <strong>{phone}</strong> &amp; <strong>{email}</strong>, and status will update to <strong className="text-emerald-700">CONFIRMED</strong>!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Owner Directly ({settings.phone})</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition"
              >
                Close Dialog
              </button>
            </div>
          </div>
        ) : (
          /* Form Dialog Box Matching User Screenshot */
          <form onSubmit={handleSubmit} className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-4">
            
            {/* Header */}
            <div className="pr-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                Complete Your Party Booking
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Selected: <span className="font-bold text-amber-700">{currentPkg.title}</span>{' '}
                <span className="text-slate-600 font-semibold">
                  ({isFixedPrice ? `₹${unitPrice.toLocaleString()} Fixed Lump Sum` : `₹${unitPrice}/person`})
                </span>
              </p>
            </div>

            {/* Quick package changer pill */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase shrink-0">Switch Package:</span>
              {availablePackages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
                    selectedPackageId === pkg.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pkg.title}
                </button>
              ))}
            </div>

            {/* Row 1: Occasion / Event Type & Number of Guests (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Occasion / Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="Birthday Party">🎂 Birthday Party</option>
                  <option value="Corporate / Office Lunch">💼 Corporate / Office Lunch</option>
                  <option value="College / School Gathering">🎓 College / School Gathering</option>
                  <option value="House Party & Family Feast">🏠 House Party &amp; Family Feast</option>
                  <option value="Anniversary Celebration">🥂 Anniversary Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Row 2: Event Date, Serving Time & Dietary Split (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Serving Time
                </label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 07:30 PM"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dietary Split
                </label>
                <select
                  value={vegRatio}
                  onChange={(e) => setVegRatio(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="50% Veg / 50% Non-Veg">50% Veg / 50% Non-Veg</option>
                  <option value="100% Pure Veg Feast">100% Pure Veg Feast</option>
                  <option value="30% Veg / 70% Non-Veg">30% Veg / 70% Non-Veg</option>
                  <option value="70% Veg / 30% Non-Veg">70% Veg / 30% Non-Veg</option>
                </select>
              </div>
            </div>

            {/* Row 3: Venue / Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Venue / Delivery Address
              </label>
              <textarea
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Complete address of party hall, apartment clubhouse, office floor, landmark..."
                rows={2}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Row 4: Name, Contact Phone & Email ID (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone (For Owner Approval SMS)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID (For Confirmation Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-900">📱 UPI Online Pay</p>
                  <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    paymentMethod === 'online' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-900">💳 Card / NetBanking</p>
                  <p className="text-[10px] text-slate-500">Online payment</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_before_prep')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    paymentMethod === 'cash_before_prep' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-900">💵 Cash Payment</p>
                  <p className="text-[10px] text-red-600 font-semibold">Pay before prep starts</p>
                </button>
              </div>

              {paymentMethod === 'cash_before_prep' && (
                <div className="mt-2 bg-red-50 p-2.5 rounded-xl border border-red-300 text-[11px] text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Mandatory Policy: Cash payment is accepted strictly <strong>BEFORE food preparation begins</strong>.</span>
                </div>
              )}
            </div>

            {/* Row 5: Special Custom Requests */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Custom Requests (Optional)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Require custom birthday mascot banner, extra cheesy garlic bread, spicy dips"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Row 6: Estimated Total with Green Savings & Action Button */}
            <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Estimated Total ({guestCount} Guests):</p>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-amber-950 font-display">
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                  {discountAmount > 0 && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                      Saved ₹{discountAmount.toLocaleString()} ({discountRate * 100}% Bulk Off)
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black px-7 py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-red-600/20 transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Dispatching to owner...</span>
                ) : (
                  <>
                    <span>Confirm Party Booking &amp; Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Footer notice */}
            <p className="text-[11px] text-center text-slate-400">
              {settings.brandName} Catering • Helpline: {settings.phone} • FSSAI Lic: {settings.fssaiLicense} • Zero advance cancellation policy
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
export default PartyOrderModal;
