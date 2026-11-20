import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Clock, 
  Award, 
  Flame, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  ChefHat,
  Users,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Showcase */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>The Story of {settings.brandName}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {settings.aboutHeroTitle || 'Crafting Happiness in Every Bite & Sip'}
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            {settings.aboutHeroDescription || `Born from a deep obsession with buttery brioche buns, molten cheese burst crusts, and ice-cold artisan mocktails, ${settings.brandName} is on a mission to elevate fast food into a culinary celebration.`}
          </p>
          <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:scale-105"
            >
              Taste The Menu
            </button>
            <button
              onClick={() => navigate('/parties')}
              className="bg-black/30 hover:bg-black/40 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm border border-white/30 transition"
            >
              Bulk &amp; Party Catering
            </button>
          </div>
        </div>

        <div className="relative group shrink-0">
          <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center">
            <img
              src={settings.logoUrl || '/logo.png'}
              alt={`${settings.brandName} Mascot Character`}
              className="w-full h-full object-contain animate-float drop-shadow-xl"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
          </div>
        </div>
      </div>

      {/* Mascot Lore Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-xl max-w-sm">
            <img
              src={settings.logoUrl || '/logo.png'}
              alt={`${settings.brandName} Character`}
              className="w-full h-auto object-contain rounded-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
            <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
              Official Mascot
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
            <span>🎩 The Gentleman Burger</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Who is <span className="text-amber-600">{settings.brandName}</span>?
          </h2>
          <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {settings.aboutStory ? (
              <p className="whitespace-pre-line">{settings.aboutStory}</p>
            ) : (
              <>
                <p>
                  With his dapper bowler hat, signature mustache, dashing red bow-tie, and enthusiastic thumbs-up, {settings.brandName} is the embodiment of fast food perfection. Coming straight out of a warm pizza box holding a fresh slice of cheese burst pizza, he reminds us that great food should always be fun, generous, and served with a wink!
                </p>
                <p>
                  Whether it&apos;s a quick midnight craving or a 100-guest birthday bash, {settings.brandName} brings the party to your table with steaming hot patties, freshly toasted sesame buns, and handcrafted dips.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
              <p className="text-2xl font-black text-amber-950 font-display">10,000+</p>
              <p className="text-[11px] font-semibold text-slate-500">Orders Delivered</p>
            </div>
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
              <p className="text-2xl font-black text-amber-950 font-display">4.9 ★</p>
              <p className="text-[11px] font-semibold text-slate-500">Google Rating</p>
            </div>
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 col-span-2 sm:col-span-1">
              <p className="text-2xl font-black text-amber-950 font-display">250+</p>
              <p className="text-[11px] font-semibold text-slate-500">Parties Catered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our 4 Core Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full">
            Our Quality Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            The {settings.brandName} Quality Oath
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Every pizza, burger, and mocktail adheres to strict hygiene, taste, and temperature guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              🍞
            </div>
            <h3 className="text-base font-bold text-slate-900">Baked Fresh Daily</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never use frozen or stale buns. Our brioche rolls and sourdough pizza bases are baked fresh every morning with pure dairy butter.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              🧀
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Real Dairy Cheese</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No artificial cheese analogues or vegetable oils. We exclusively source rich mozzarella and aged yellow cheddar for authentic stringy stretch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <h3 className="text-base font-bold text-slate-900">Thermal Express Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dispatched in specialized insulated heating carriers so your cheese arrives bubbling hot and crinkle fries remain crunchy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              🛡️
            </div>
            <h3 className="text-base font-bold text-slate-900">FSSAI Certified Safety</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fully compliant with FSSAI standards under license <strong>{settings.fssaiLicense}</strong>. Daily kitchen sanitization and regular ingredient audits.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory / Compliance Highlight Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold">Government Certified Food Operation</h3>
          </div>
          <p className="text-xs text-slate-300">
            Company Name: <strong className="text-white">{settings.brandName}</strong> • FSSAI License: <span className="font-mono text-amber-400 font-bold">{settings.fssaiLicense}</span>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-amber-400 transition">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Helpline: <strong className="text-white font-mono">{settings.phone}</strong></span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-amber-400 transition">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Email: <strong className="text-white">{settings.email}</strong></span>
            </a>
            {settings.address && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/contact')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shrink-0"
        >
          Contact Our Headquarters
        </button>
      </div>

    </div>
  );
};

export default AboutPage;
