import React, { useState, useEffect } from 'react';
import { 
  X, 
  PartyPopper, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  PhoneCall,
  Check
} from 'lucide-react';
import { PartyPackage } from '../types';
import { PARTY_PACKAGES } from '../data/partyPackages';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';

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
  const { user } = useAuth();

  const [eventType, setEventType] = useState('Birthday Party');
  const [guestCount, setGuestCount] = useState(initialGuests);
  const [selectedPackageId, setSelectedPackageId] = useState(preSelectedPackage?.id || PARTY_PACKAGES[0].id);
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Synchronize when preSelectedPackage or initialGuests changes
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

  const currentPkg = PARTY_PACKAGES.find((p) => p.id === selectedPackageId) || PARTY_PACKAGES[0];
  const pricePerPerson = currentPkg.pricePerGuest;
  const rawTotal = guestCount * pricePerPerson;
  // Volume discount: 20% for 30+ guests, 15% for 20+ guests, 10% for 10+ guests
  const discountRate = guestCount >= 30 ? 0.2 : guestCount >= 20 ? 0.15 : 0.1;
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
        userId: user?.id,
        fullName,
        phone,
        email: email || 'party@mrbun.in',
        eventType,
        guestCount,
        eventDate,
        eventTime,
        venueAddress,
        packageId: currentPkg.id,
        packageName: currentPkg.title,
        customNotes: `Dietary: ${vegRatio}. Notes: ${specialNotes}`,
        budgetEstimate: estimatedTotal
      });

      setConfirmedBookingId(booking.id);
    } catch (err) {
      console.error(err);
      alert('Error creating booking. Please call 9476088111 directly.');
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
          className="absolute top-5 right-5 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition shadow-sm"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBookingId ? (
          /* Confirmation State */
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Booking Reference: {confirmedBookingId}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Party Request Confirmed!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mt-2">
                Thank you <strong>{fullName}</strong>! Our Head Chef &amp; Catering Manager will call you at <strong>{phone}</strong> within 15 minutes to confirm menu customization &amp; timing.
              </p>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b border-amber-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Event:</span>
                <span className="font-bold text-slate-800">{eventType} ({guestCount} Guests)</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Package:</span>
                <span className="font-bold text-amber-800">{currentPkg.title}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Date &amp; Time:</span>
                <span className="font-bold text-slate-800">{eventDate} @ {eventTime}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Venue:</span>
                <span className="font-bold text-slate-800 text-right max-w-[220px] truncate">{venueAddress}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-slate-900">
                <span>Estimated Total:</span>
                <span className="text-amber-700">₹{estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="tel:9476088111"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Catering Manager (9476088111)</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition"
              >
                Done &amp; Close
              </button>
            </div>
          </div>
        ) : (
          /* Form Dialog Box Matching User Screenshot */
          <form onSubmit={handleSubmit} className="p-6 sm:p-9 max-h-[85vh] overflow-y-auto space-y-5">
            
            {/* Header */}
            <div className="pr-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                Complete Your Party Booking
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Selected: <span className="font-bold text-amber-700">{currentPkg.title}</span>{' '}
                <span className="text-slate-500">(@ ₹{currentPkg.pricePerGuest}/person)</span>
              </p>
            </div>

            {/* Quick package changer pill if user wants to switch */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase shrink-0">Switch Package:</span>
              {PARTY_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
                    selectedPackageId === pkg.id
                      ? 'bg-amber-600 text-white shadow-sm'
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
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Birthday Party">🎂 Birthday Party</option>
                  <option value="Corporate Event">💼 Corporate / Office Lunch</option>
                  <option value="House Party">🏠 House Party &amp; Game Night</option>
                  <option value="College Fest">🎓 College Fest / Farewell</option>
                  <option value="Family Gathering">👨‍👩‍👧‍👦 Family Get-together</option>
                  <option value="Other Celebration">🎉 Other Celebration</option>
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
                  onChange={(e) => setGuestCount(Math.max(10, Number(e.target.value)))}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Row 2: Event Date, Serving Time & Dietary Split (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
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
                  placeholder="07:30 PM"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
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
                  className="w-full text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="50% Veg / 50% Non-Veg">50% Veg / 50% Non-Veg</option>
                  <option value="100% Pure Vegetarian">100% Pure Veg</option>
                  <option value="70% Veg / 30% Non-Veg">70% Veg / 30% Non-Veg</option>
                  <option value="100% Non-Vegetarian">100% Non-Veg</option>
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
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                required
              />
            </div>

            {/* Row 4: Name, Phone, Email (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
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

            {/* Row 6: Estimated Total with Green Savings & Red Action Button (Matching screenshot) */}
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
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Confirm Party Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Footer notice */}
            <p className="text-[11px] text-center text-slate-400">
              Mr Bun Catering • Helpline: 9476088111 • FSSAI Lic: 22926112000173 • Zero advance cancellation policy
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
