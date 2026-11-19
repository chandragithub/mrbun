import React, { useState } from 'react';
import { 
  PartyPopper, 
  Users, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  Gift, 
  Calculator,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { PARTY_PACKAGES } from '../data/partyPackages';
import { PartyPackage } from '../types';
import { PartyOrderModal } from '../components/PartyOrderModal';

export const PartyPage: React.FC = () => {
  const [calculatorGuests, setCalculatorGuests] = useState(25);
  const [modalPackage, setModalPackage] = useState<PartyPackage>(PARTY_PACKAGES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGuests, setModalGuests] = useState(25);

  const handleOpenPackageDialog = (pkg: PartyPackage) => {
    setModalPackage(pkg);
    setModalGuests(Math.max(pkg.minGuests, calculatorGuests));
    setIsModalOpen(true);
  };

  const handleOpenCalculatorDialog = () => {
    setModalGuests(calculatorGuests);
    setIsModalOpen(true);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-amber-500/10 via-amber-100/20 to-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-sm">
            <PartyPopper className="w-4 h-4 text-red-600" />
            <span>Grand Fast Food Catering &amp; Bulk Feasts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Host Unforgettable Parties With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Mr Bun</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Birthdays, corporate events, game screenings, and reunions. Hot brioche burgers, bubbling cheese burst pizzas, and cool mocktails served in insulated warming setups!
          </p>
        </div>

        {/* Interactive Instant Party Budget Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-amber-100">
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wide">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Instant Party Cost Estimator</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                How many guests are attending?
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-black text-amber-600 font-display">
                {calculatorGuests}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase">Guests</span>
            </div>
          </div>

          <div className="py-6 space-y-4">
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={calculatorGuests}
              onChange={(e) => setCalculatorGuests(Number(e.target.value))}
              className="w-full h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>10 Guests (Cozy Gathering)</span>
              <span>30 Guests (Birthday Bash)</span>
              <span>75+ Guests (Corporate / College Fest)</span>
              <span>150+ Guests (Grand Event)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Estimated Budget</p>
              <p className="text-2xl font-black text-amber-950 mt-1">
                ₹{(calculatorGuests * 249).toLocaleString()} - ₹{(calculatorGuests * 299).toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">Starting @ ₹249/guest</p>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Bulk Discount</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {calculatorGuests >= 30 ? '20% OFF' : calculatorGuests >= 20 ? '15% OFF' : '10% OFF'}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Applied on final total</p>
            </div>

            <div className="bg-red-50/80 p-4 rounded-2xl border border-red-200 text-center flex flex-col justify-center">
              <button
                type="button"
                onClick={handleOpenCalculatorDialog}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Book For {calculatorGuests} Guests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Party Packages Grid */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Curated Celebration Packages
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Click any package to open the <strong>Booking Dialog Box</strong> with preselected items and pricing!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTY_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleOpenPackageDialog(pkg)}
                className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-amber-100">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {pkg.badge && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow">
                        {pkg.badge}
                      </span>
                    )}
                    <div className="absolute bottom-2 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-300">
                      Min {pkg.minGuests} Guests
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                      {pkg.title}
                    </h3>
                    
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-amber-600 font-display">
                        ₹{pkg.pricePerGuest}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">/ person</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {pkg.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Package Includes:
                      </p>
                      {pkg.includes.slice(0, 4).map((inc, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPackageDialog(pkg);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <PartyPopper className="w-4 h-4" />
                    <span>Select Package &amp; Book</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Booking Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Book Your Food Feast?</h3>
            <p className="text-amber-100 text-xs sm:text-sm max-w-lg">
              Click the button to open the instant booking dialog, or call our catering manager directly for custom live counter inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenPackageDialog(modalPackage)}
              className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:scale-105"
            >
              Open Booking Dialog
            </button>
            <a
              href="tel:9476088111"
              className="bg-black/30 hover:bg-black/40 text-white font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>Call: 9476088111</span>
            </a>
          </div>
        </div>

      </div>

      {/* The Booking Dialog Box Modal */}
      <PartyOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedPackage={modalPackage}
        initialGuests={modalGuests}
      />
    </div>
  );
};

export default PartyPage;
