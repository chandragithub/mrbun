import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  Send, 
  Sparkles, 
  Store, 
  ChefHat, 
  DollarSign, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { FranchiseModal } from '../components/FranchiseModal';
import { useSettings } from '../context/SettingsContext';
import { INITIAL_FRANCHISE_MODELS } from '../data/franchiseModels';

export const FranchisePage: React.FC = () => {
  const { settings, franchiseModels } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Express Delivery & Takeaway Hub');

  const availableModels = (franchiseModels && franchiseModels.length > 0) ? franchiseModels : INITIAL_FRANCHISE_MODELS;
  const activeModels = availableModels
    .filter(m => m.isActive !== false)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const handleOpenModelDialog = (modelName: string) => {
    setSelectedModel(modelName);
    setIsModalOpen(true);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 border border-amber-500/30">
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Franchise Opportunity 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display">
            Own a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">Mr Bun</span> Franchise
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Partner with India’s beloved fast food brand. Serve mouthwatering smash burgers, cheese burst pizzas, and signature mocktails with industry-leading ROI and end-to-end operational support.
          </p>

          <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3">
            <button
              onClick={() => handleOpenModelDialog('Express Delivery & Takeaway Hub')}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-slate-950" />
              <span>Open Franchise Application Dialog</span>
            </button>

            <a
              href="tel:9476088111"
              className="bg-black/40 hover:bg-black/60 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-amber-400/30 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call: 9476088111</span>
            </a>
          </div>

          <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Up to 40% Gross Margin</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>12 - 18 Months Payback</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>FSSAI: 22926112000173</span>
            </span>
          </div>
        </div>

        <div className="relative group shrink-0">
          <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-amber-400/30 shadow-2xl flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Mr Bun Franchise Partner"
              className="w-full h-full object-contain animate-float"
            />
          </div>
        </div>
      </div>

      {/* Why Franchise With Mr Bun Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full">
            The Business Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Why Invest in a Mr Bun Franchise?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            We provide a battle-tested blueprint so you hit profitability from Month 1.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              📦
            </div>
            <h3 className="text-base font-bold text-slate-900">Central Supply Chain</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Proprietary spice blends, frozen fresh patties, signature burger sauces, and branded packaging shipped directly to your store.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              👨‍🍳
            </div>
            <h3 className="text-base font-bold text-slate-900">Comprehensive Chef Training</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              15 days on-site kitchen training for your culinary team with step-by-step Standard Operating Procedures (SOPs).
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              💻
            </div>
            <h3 className="text-base font-bold text-slate-900">Cloudflare Tech &amp; POS</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrated online ordering website, Cloudflare edge inventory management, and direct billing integration.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              📢
            </div>
            <h3 className="text-base font-bold text-slate-900">National Brand Marketing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              High-converting social media campaigns, food influencer collaborations, and local marketing support for grand opening.
            </p>
          </div>
        </div>
      </div>

      {/* Franchise Formats / Models */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full">
            Flexible Formats
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Choose Your Franchise Model
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Click any model below to open the <strong>Application Dialog Box</strong> with that format pre-selected!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {activeModels.map((model) => (
            <div
              key={model.id}
              onClick={() => handleOpenModelDialog(model.title)}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
                  {model.badge}
                </span>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">{model.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{model.desc}</p>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Space Required:</span>
                    <strong className="text-slate-800 font-bold">{model.area}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approx. Investment:</span>
                    <strong className="text-amber-800 font-bold">{model.investment}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expected ROI:</span>
                    <strong className="text-emerald-700 font-bold">{model.roi}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Model Highlights:
                  </p>
                  {model.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModelDialog(model.title);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Store className="w-4 h-4" />
                  <span>Apply for this Model</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Callout Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-black">Ready to Start Your F&amp;B Business?</h3>
          <p className="text-amber-100 text-xs sm:text-sm max-w-lg">
            Submit your expression of interest via our quick dialog form, or call our franchise development manager directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenModelDialog(selectedModel)}
            className="bg-white hover:bg-amber-50 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:scale-105"
          >
            Open Application Dialog
          </button>
          <a
            href={`tel:${settings.phone}`}
            className="bg-black/30 hover:bg-black/40 text-white font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>Hotline: {settings.phone}</span>
          </a>
        </div>
      </div>

      {/* The Franchise Modal Dialog Box matching user screenshot */}
      <FranchiseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialModel={selectedModel}
      />

    </div>
  );
};

export default FranchisePage;
