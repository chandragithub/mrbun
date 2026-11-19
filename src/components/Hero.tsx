import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  Sparkles, 
  ArrowRight, 
  PartyPopper, 
  Flame, 
  Clock, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall
} from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenPartyModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOpenPartyModal }) => {
  const { settings } = useSettings();
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/40 to-[#FFFDF7] pt-4 pb-10 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-24 border-b border-amber-100/60">
      
      {/* Decorative background glow circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-300/20 via-orange-300/30 to-red-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/15 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300/80 text-amber-950 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
              <Flame className="w-4 h-4 text-red-600" />
              <span>Sizzling Fresh Fast Food &amp; Bulk Party Specials</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-amber-950 tracking-tight leading-[1.15]">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">{settings.brandName}</span>! <br />
              <span className="text-2xl sm:text-4xl xl:text-5xl font-extrabold text-slate-800">
                {settings.tagline}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Indulge in buttery brioche smash burgers, gooey cheese burst pizzas, toasted multigrain club sandwiches, and fizzy tropical mocktails. Perfect for a quick craving or grand party feast!
            </p>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Real Sourdough &amp; Dairy Cheese</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>30-Min Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 border border-amber-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>FSSAI Certified: {settings.fssaiLicense}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-amber-600/25 hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <span>Order Online Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenPartyModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-400 font-bold px-7 py-4 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-base"
              >
                <PartyPopper className="w-5 h-5 text-red-500" />
                <span>Book Bulk / Party Order</span>
              </button>
            </div>

            {/* Quick Contact & WhatsApp Prompt */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-600 pt-2">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Direct Hotline: <strong className="text-slate-900 font-bold">{settings.phone}</strong></span>
              </span>
              <span>•</span>
              <span>Email: <strong className="text-slate-900 font-bold">{settings.email}</strong></span>
            </div>

          </div>

          {/* Right Mascot & Hero Showcase (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-4 lg:mt-0">
            
            {/* Mascot Graphic Container */}
            <div className="relative group w-full max-w-xs sm:max-w-sm lg:max-w-md">
              
              {/* Backing decorative plate */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 to-red-400/20 rounded-3xl blur-2xl transform group-hover:scale-105 transition-transform duration-500" />
              
              <div className="relative bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-300 transition-transform duration-500 group-hover:-translate-y-1">
                <img 
                  src={settings.logoUrl || '/logo.png'} 
                  alt={`${settings.brandName} Logo`} 
                  className="w-full h-auto object-contain rounded-2xl animate-float"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                />

                {/* Floating Badge 1: Rating */}
                <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-white border border-amber-200 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm">
                    ★
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">4.9 / 5.0 Rating</p>
                    <p className="text-[10px] text-slate-500">1,500+ Happy Foodies</p>
                  </div>
                </div>

                {/* Floating Badge 2: Bulk Offer */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide">Party Discount</p>
                    <p className="text-[11px] font-medium text-amber-100">Up to 20% OFF on Bulk</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Marquee Banner */}
      <div className="mt-12 bg-amber-500 text-amber-950 font-extrabold text-sm py-2.5 overflow-hidden whitespace-nowrap shadow-inner border-y border-amber-600/30">
        <div className="inline-flex gap-8 animate-marquee">
          <span>🍕 FRESH CHEESE BURST PIZZAS</span>
          <span>•</span>
          <span>🍔 SMASHED BRIOCHE BURGERS</span>
          <span>•</span>
          <span>🥪 TOASTED GOURMET SANDWICHES</span>
          <span>•</span>
          <span>🍹 ELECTRIC BLUE MOCKTAILS</span>
          <span>•</span>
          <span>🎉 SPECIAL PARTY PACKS FOR BIRTHDAYS &amp; OFFICES</span>
          <span>•</span>
          <span>📞 CALL US DIRECTLY: 9476088111</span>
          <span>•</span>
          <span>🍕 FSSAI: 22926112000173</span>
          <span>•</span>
          <span>🍕 FRESH CHEESE BURST PIZZAS</span>
          <span>•</span>
          <span>🍔 SMASHED BRIOCHE BURGERS</span>
          <span>•</span>
          <span>🥪 TOASTED GOURMET SANDWICHES</span>
          <span>•</span>
          <span>🍹 ELECTRIC BLUE MOCKTAILS</span>
        </div>
      </div>

    </section>
  );
};
