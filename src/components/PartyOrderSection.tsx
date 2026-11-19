import React, { useState } from 'react';
import { PartyPopper, Users, Sparkles, Check, ArrowRight, ShieldCheck, PhoneCall, Gift, Calculator } from 'lucide-react';
import { PARTY_PACKAGES } from '../data/partyPackages';
import { PartyPackage } from '../types';
import { useSettings } from '../context/SettingsContext';

interface PartyOrderSectionProps {
  onSelectPackageForBooking: (pkg: PartyPackage, guests: number) => void;
  onOpenCustomBooking: (guests: number) => void;
}

export const PartyOrderSection: React.FC<PartyOrderSectionProps> = ({
  onSelectPackageForBooking,
  onOpenCustomBooking
}) => {
  const { packages } = useSettings();
  const displayPackages = packages && packages.length > 0 ? packages : PARTY_PACKAGES;
  const [calculatorGuests, setCalculatorGuests] = useState(25);

  return (
    <section id="parties" className="py-16 sm:py-24 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-[#FFFDF7] border-y border-amber-200/60 relative overflow-hidden">
      
      {/* Decorative shapes */}
      <div className="absolute -top-10 right-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-red-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-sm mb-3">
            <PartyPopper className="w-4 h-4 text-red-600" />
            <span>Grand Celebrations Made Easy</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Host Unforgettable Parties With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Mr Bun</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Birthdays, Office Lunches, House Parties or College Fests — our sizzling hot burgers, cheesy pizzas, and chilled mocktail bars will leave your guests cheering!
          </p>
        </div>

        {/* Interactive Instant Party Budget Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl max-w-4xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-amber-100">
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm uppercase tracking-wide">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Instant Party Estimate Calculator</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                How many hungry guests are coming?
              </h3>
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
              <span>10 Guests (Small House Party)</span>
              <span>30 Guests (Birthday Bash)</span>
              <span>75+ Guests (Corporate / College Fest)</span>
              <span>150+ Guests (Grand Event)</span>
            </div>
          </div>

          {/* Quick Package Snapshot for this Guest Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Estimated Budget</p>
              <p className="text-2xl font-black text-amber-950 mt-1">
                ₹{(calculatorGuests * 249).toLocaleString()} - ₹{(calculatorGuests * 299).toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">Starting @ just ₹249/guest</p>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Party Discount</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {calculatorGuests >= 30 ? '20% OFF' : calculatorGuests >= 15 ? '15% OFF' : '10% OFF'}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Auto-applied at checkout</p>
            </div>

            <div className="bg-red-50/80 p-4 rounded-2xl border border-red-200 text-center flex flex-col justify-center">
              <button
                onClick={() => onOpenCustomBooking(calculatorGuests)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Book For {calculatorGuests} Guests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-500 mt-1.5">Free delivery &amp; custom party banner</p>
            </div>
          </div>
        </div>

        {/* Pre-designed Party Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
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

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                      {pkg.title}
                    </h4>
                  </div>
                  
                  <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-black text-amber-600 font-display">
                      ₹{(pkg.price ?? pkg.pricePerGuest ?? 299).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      {pkg.priceType === 'fixed' ? 'Fixed Lump Sum' : '/ person'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {pkg.tagline}
                  </p>

                  {/* Included items */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Package Includes:
                    </p>
                    {(pkg.includes || []).map((inc, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{inc}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectPackageForBooking(pkg, Math.max(pkg.minGuests, calculatorGuests))}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Choose Package</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Assurance Row */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/60 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Customized Live Food Stations Available</p>
              <p className="text-xs text-slate-500">Live burger toasting, pizza baking and mocktail counters for your venue.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 hidden sm:inline">Have custom party requirements?</span>
            <a
              href="tel:9476088111"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Catering Desk: 9476088111</span>
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
