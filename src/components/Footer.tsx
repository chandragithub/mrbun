import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  PartyPopper, 
  Clock, 
  Server,
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { isAdmin } = useAuth();
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mascot Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={`${settings.brandName} Logo`}
                className="w-14 h-14 object-contain rounded-xl bg-white p-1 shadow-md transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div>
                <h3 className="text-2xl font-black text-white font-display">
                  {settings.brandName}
                </h3>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest -mt-0.5">
                  {settings.tagline}
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your favorite destination for artisan sourdough pizzas, double smash brioche burgers, grilled club toasties, thick shakes, and complete party catering packages.
            </p>

            {/* Official Statutory Badge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Food Safety &amp; Standards Authority of India</span>
              </div>
              <p className="text-[11px] text-slate-400">
                FSSAI License No: <span className="font-mono font-bold text-amber-400 tracking-wider">{settings.fssaiLicense}</span>
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">✓ 100% Certified Safe &amp; Fresh Ingredients</p>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
              Contact Details
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-slate-400">Company:</span>
                <strong className="text-white font-bold">{settings.brandName}</strong>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 font-bold transition">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 font-bold transition">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address || `${settings.brandName} Central Kitchen & Food Hub, Main Avenue`}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>11:00 AM – 01:00 AM (Open Everyday)</span>
              </li>
            </ul>
          </div>

          {/* Quick Menu & Outlets Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
              Explore Mr Bun
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/menu" className="hover:text-white transition flex items-center gap-1.5">
                  <span>🍔 Full Craving Menu</span>
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white transition flex items-center gap-1.5">
                  <span>📍 Outlet Details &amp; Dine-in</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition flex items-center gap-1.5">
                  <span>🎩 About Mr Bun &amp; Quality</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition flex items-center gap-1.5">
                  <span>📞 Contact Us &amp; FAQs</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition flex items-center gap-1.5">
                  <span>📦 My Orders &amp; Live Tracking</span>
                </Link>
              </li>
              {/* Apply for Franchise Link in Explore Menu */}
              <li>
                <Link 
                  to="/franchise" 
                  className="hover:text-amber-300 font-bold transition flex items-center gap-1.5 text-amber-400 pt-1"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Apply for Franchise</span>
                  <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                    Partner
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Party Catering, Franchise & Admin Page */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
              Business &amp; Catering
            </h4>
            <div className="space-y-2.5 text-xs">
              
              {/* Prominent Apply for Franchise Router Link */}
              <Link
                to="/franchise"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Store className="w-4 h-4 text-slate-950" />
                <span>Apply for Franchise</span>
              </Link>

              <Link
                to="/parties"
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Book Party Catering</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold py-2 px-3 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Kitchen Route</span>
                </Link>
              )}

              
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {settings.brandName}. All rights reserved. Registered Trademark.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link to="/franchise" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
              <span>Apply for Franchise</span>
            </Link>
            <span>•</span>
            <span className="font-mono text-slate-400">FSSAI: {settings.fssaiLicense}</span>
            <span>•</span>
            <a href={`tel:${settings.phone}`} className="text-amber-400 hover:underline">{settings.phone}</a>
            <span>•</span>
            <a href={`mailto:${settings.email}`} className="text-amber-400 hover:underline">{settings.email}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
