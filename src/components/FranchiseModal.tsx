import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModel?: string;
}

export const FranchiseModal: React.FC<FranchiseModalProps> = ({
  isOpen,
  onClose,
  initialModel = 'Express Delivery & Takeaway Hub'
}) => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [modelInterested, setModelInterested] = useState(initialModel);
  const [investmentBudget, setInvestmentBudget] = useState('₹12 Lakhs – ₹18 Lakhs');
  const [hasProperty, setHasProperty] = useState('Yes, Own Commercial Property');
  const [propertyArea, setPropertyArea] = useState('500 sq ft');
  const [experience, setExperience] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (initialModel) {
      setModelInterested(initialModel);
    }
  }, [initialModel]);

  useEffect(() => {
    if (user) {
      if (!fullName && user.name) setFullName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city) {
      alert('Please fill in your name, mobile phone number, and target city.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const refId = 'FRAN-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedRef(refId);
    }, 700);
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div 
        className="relative bg-white w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-300 animate-in zoom-in-95 duration-200 my-auto"
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

        {submittedRef ? (
          /* Confirmation View */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Application Ref: {submittedRef}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-display">
                Franchise Application Received!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{fullName}</strong>! Our Head of Franchise Development will review your application for <strong>{city}</strong> and call you at <strong>{phone}</strong> within 24 hours.
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-500 font-semibold">Candidate:</span>
                <span className="font-bold text-slate-800">{fullName} ({phone})</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-500 font-semibold">Location:</span>
                <span className="font-bold text-slate-800">{city}, {state || 'India'}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-500 font-semibold">Model Selected:</span>
                <span className="font-bold text-amber-900">{modelInterested}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-semibold">Investment Bracket:</span>
                <span className="font-bold text-emerald-700">{investmentBudget}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href="tel:9476088111"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Franchise Desk: 9476088111</span>
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
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto space-y-5">
            
            {/* Header matching screenshot */}
            <div className="pr-8">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <Store className="w-4 h-4 text-amber-600" />
                <span>CONFIDENTIAL EXPRESSION OF INTEREST</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-display tracking-tight">
                Apply for a Mr Bun Franchise
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Selected Format: <strong className="text-slate-900">{modelInterested}</strong>
              </p>
            </div>

            {/* Row 1: Applicant Full Name, Mobile Number (WhatsApp), Email Address (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicant Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9476088111"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Row 2: Target City, State, Preferred Model (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai / Bangalore / Pune"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Model
                </label>
                <select
                  value={modelInterested}
                  onChange={(e) => setModelInterested(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Express Delivery & Takeaway Hub">Express Delivery &amp; Takeaway Hub (₹12 - 18L)</option>
                  <option value="Flagship Diner & Cafe">Flagship Diner &amp; Cafe (₹28 - 40L)</option>
                  <option value="Mall Food Court Kiosk">Mall Food Court Kiosk (₹18 - 25L)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Investment Capacity, Property Availability, Carpet Area (sq ft) (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Investment Capacity
                </label>
                <select
                  value={investmentBudget}
                  onChange={(e) => setInvestmentBudget(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="₹12 Lakhs – ₹18 Lakhs">₹12 Lakhs – ₹18 Lakhs</option>
                  <option value="₹18 Lakhs – ₹28 Lakhs">₹18 Lakhs – ₹28 Lakhs</option>
                  <option value="₹28 Lakhs – ₹45 Lakhs">₹28 Lakhs – ₹45 Lakhs</option>
                  <option value="₹45+ Lakhs (Multi-unit)">₹45+ Lakhs (Multi-Unit Master Franchise)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property Availability
                </label>
                <select
                  value={hasProperty}
                  onChange={(e) => setHasProperty(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Yes, Own Commercial Property">Yes, Own Commercial Property</option>
                  <option value="Yes, Rented Commercial Space">Yes, Rented Commercial Space</option>
                  <option value="Searching for Location">Searching for Location</option>
                  <option value="Need Assistance with Site Selection">Need Assistance with Site Selection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Carpet Area (sq ft)
                </label>
                <input
                  type="text"
                  value={propertyArea}
                  onChange={(e) => setPropertyArea(e.target.value)}
                  placeholder="500 sq ft"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Row 4: Prior Business / Restaurant Experience (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prior Business / Restaurant Experience (Optional)
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Tell us briefly about your background, existing business ventures, or preferred timeline to launch..."
                rows={3}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 resize-none bg-white"
              />
            </div>

            {/* Row 5: Action banner matching screenshot */}
            <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Direct Franchise Support Desk</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Call our Franchise Manager directly at <strong className="text-slate-900 font-bold">9476088111</strong> or email <strong className="text-slate-900 font-bold">contact@mrbun.in</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 transform active:scale-95"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Franchise Application</span>
                  </>
                )}
              </button>
            </div>

            {/* Statutory Footer */}
            <p className="text-[10px] text-center text-slate-400">
              Company Name: Mr Bun • Helpline: 9476088111 • Email: contact@mrbun.in • FSSAI License: 22926112000173 • All applications are treated with strict confidentiality.
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
