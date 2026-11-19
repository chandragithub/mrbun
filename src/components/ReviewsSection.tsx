import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ananya Deshmukh',
    role: 'Birthday Host (Ordered for 35 Guests)',
    rating: 5,
    comment: 'Booked the Birthday Bash package for my brother’s 21st! The smash burgers and cheese burst pizzas arrived sizzling hot in insulated trays. All 35 guests were raving about the Electric Blue Lagoon mocktails!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    item: 'Birthday Bash Mega Feast'
  },
  {
    name: 'Vikramaditya Roy',
    role: 'Tech Lead @ CyberSquare (Office Party)',
    rating: 5,
    comment: 'We ordered 60 burger-pizza meal boxes for our hackathon. Perfectly labelled, on-time delivery at 11:30 PM, and corporate GST billing was instantaneous. Mr Bun is now our official team catering partner.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    item: 'Corporate Hangout Platter'
  },
  {
    name: 'Pooja & Rohan',
    role: 'Regular Weekend Foodies',
    rating: 5,
    comment: 'The Truffle Mushroom burger and Bombay Masala sandwich are out of this world. Super soft toasted brioche buns and generous melted cheese! Plus the live tracker showed the delivery partner arriving in 22 minutes.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    item: 'Classic Smash Burger & Cheese Pizza'
  }
];

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 / 5.0 Star Rated (1,500+ Reviews)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Loved by Foodies &amp; Party Hosts Alike
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            See why people choose Mr Bun for late night cravings, family dinners, and large office celebrations.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-amber-50/40 rounded-3xl p-6 sm:p-7 border border-amber-200/60 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic relative">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author info */}
              <div className="mt-6 pt-4 border-t border-amber-200/50 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500">{rev.role}</p>
                  <p className="text-[10px] text-amber-800 font-semibold mt-0.5">Ordered: {rev.item}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Live food quality guarantee banner */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Our 100% Bite-Back Guarantee</h3>
            <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
              If your pizza arrives cold or your burger isn't sizzling fresh, we'll replace it immediately or refund your money. That's the Mr Bun promise!
            </p>
          </div>

          <a
            href="tel:9476088111"
            className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md transition transform hover:scale-105 shrink-0"
          >
            Hotline: 9476088111
          </a>
        </div>

      </div>
    </section>
  );
};
