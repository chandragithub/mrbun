import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Outlet } from '../types';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Store, 
  Wifi, 
  Car, 
  PartyPopper, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed
} from 'lucide-react';

const FALLBACK_OUTLETS: Outlet[] = [
  {
    id: 'outlet-1',
    name: 'Mr Bun Flagship Diner & Central Kitchen',
    type: 'Dine-In • Takeaway • Live Counter • Party Hall',
    address: 'Plot 42, Food Court Boulevard, Central Plaza, Main Avenue',
    landmark: 'Opposite City Center Mall, Near Apollo Fountain',
    phone: '9476088111',
    timings: '11:00 AM – 01:00 AM (All Days)',
    status: 'Open Now',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    features: ['65+ Seating Dine-in', 'Private Party Hall', 'Live Burger Grill', 'Free Wi-Fi', 'Valet Parking', 'Kids Play Zone'],
    seatingCapacity: '65 Guests',
    isFlagship: true
  },
  {
    id: 'outlet-2',
    name: 'Mr Bun Express - Cyber Tech Hub',
    type: 'Express Lunch Boxes • Office Catering • Takeaway',
    address: 'Tower B, Ground Floor, Global Cyber Tech Park, Sector 4',
    landmark: 'Adjacent to Metro Gate 3',
    phone: '9476088111',
    timings: '10:30 AM – 11:30 PM (Mon – Sat)',
    status: 'Open Now',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    features: ['Quick 5-min Pickup Counter', 'Corporate Bento Boxes', 'Drive-Thru Lane', 'Air Conditioned', 'Contactless UPI'],
    seatingCapacity: '25 Quick Seats'
  },
  {
    id: 'outlet-3',
    name: 'Mr Bun Late Night Delivery Kitchen',
    type: 'High-Speed Express Delivery • Midnight Cravings',
    address: 'Shop 12, Metro Interchange Arcade, Railway Station Road',
    landmark: 'Behind Central Post Office',
    phone: '9476088111',
    timings: '11:00 AM – 02:00 AM (Midnight Special)',
    status: 'Late Night Available',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    features: ['Insulated Hot Warmer Depot', 'Superfast 25-min Radius', 'Late Night Burgers & Pizzas', 'Strict FSSAI Sanitization'],
    seatingCapacity: 'Takeaway & Delivery Only'
  }
];

export const OutletsPage: React.FC = () => {
  const navigate = useNavigate();
  const { outlets: contextOutlets, settings } = useSettings();
  const displayOutlets = contextOutlets && contextOutlets.length > 0 ? contextOutlets : FALLBACK_OUTLETS;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full">
          Find Us In Your City
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {settings.brandName} <span className="text-amber-600">Outlets &amp; Kitchens</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Visit our vibrant flagship diner for stone-baked pizzas and juicy smash burgers, or order takeaway from our express hubs!
        </p>
      </div>

      {/* Outlets List Cards */}
      <div className="space-y-8">
        {displayOutlets.map((outlet) => (
          <div
            key={outlet.id}
            className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-md hover:shadow-xl grid grid-cols-1 lg:grid-cols-12 ${
              outlet.isFlagship ? 'border-amber-300 ring-2 ring-amber-400/30' : 'border-amber-100'
            }`}
          >
            {/* Image (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-full bg-amber-100">
              <img
                src={outlet.image}
                alt={outlet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                {outlet.isFlagship && (
                  <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow">
                    ⭐ Flagship Outlet
                  </span>
                )}
                <span className="bg-black/70 backdrop-blur-sm text-emerald-400 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                  ● {outlet.status}
                </span>
              </div>
            </div>

            {/* Info Body (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    {outlet.type}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    {outlet.name}
                  </h3>
                </div>

                {/* Address & Timings */}
                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">{outlet.address}</p>
                      <p className="text-[11px] text-slate-500">{outlet.landmark}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Serving Hours: <strong className="text-slate-800 font-bold">{outlet.timings}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Outlet Phone: <a href={`tel:${outlet.phone}`} className="text-amber-700 font-bold hover:underline">{outlet.phone}</a></span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Outlet Highlights &amp; Facilities:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {outlet.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-50 text-amber-900 border border-amber-200/60 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Order From This Outlet</span>
                </button>

                <a
                  href={`tel:${outlet.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {outlet.phone}</span>
                </a>

                <button
                  onClick={() => navigate('/parties')}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 ml-auto"
                >
                  <PartyPopper className="w-3.5 h-3.5" />
                  <span>Book Party Space</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Statutory Licensing Assurance */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Centralized Hygiene &amp; FSSAI Compliance</h3>
            <p className="text-xs text-slate-400">
              All Mr Bun kitchens operate under licensed regulatory standards: <span className="font-mono text-amber-300 font-bold">FSSAI 22926112000173</span>
            </p>
          </div>
        </div>

        <a
          href="tel:9476088111"
          className="bg-white hover:bg-amber-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow shrink-0"
        >
          Helpline: 9476088111
        </a>
      </div>

    </div>
  );
};

export default OutletsPage;
