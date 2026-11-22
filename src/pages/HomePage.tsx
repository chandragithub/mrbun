import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Star, PartyPopper } from 'lucide-react';
import { Hero } from '../components/Hero';
import { FoodCard } from '../components/FoodCard';
import { MENU_PRODUCTS } from '../data/menuData';
import { Product } from '../types';

interface HomePageProps {
  onCustomizeProduct: (product: Product) => void;
  onOpenPartyModal: () => void;
}

const CATEGORY_CARDS = [
  { id: 'burgers', title: 'Smash Burgers', icon: '🍔', tag: 'Brioche Buns', desc: 'Smashed patties with melted cheddar & smoky sauce' },
  { id: 'pizzas', title: 'Cheesy Pizzas', icon: '🍕', tag: 'Cheese Burst', desc: 'Hand-stretched sourdough with overflowing mozzarella' },
  { id: 'sandwiches', title: 'Club Sandwiches', icon: '🥪', tag: 'Toasted Grill', desc: 'Multigrain triple deckers & Bombay street masala' },
  { id: 'mocktails', title: 'Chilled Mocktails', icon: '🍹', tag: 'Fizzy Sips', desc: 'Electric blue lagoon, virgin mojitos & thick shakes' },
  { id: 'combos', title: 'Feast Combos', icon: '🎉', tag: 'Save up to ₹150', desc: 'Party boxes for gamers, friends & family get-togethers' },
];

export const HomePage: React.FC<HomePageProps> = ({ onCustomizeProduct, onOpenPartyModal }) => {
  const navigate = useNavigate();

  // Bestsellers selection
  const bestsellers = MENU_PRODUCTS.filter((p) => p.isPopular).slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <Hero
        onExploreMenu={() => navigate('/menu')}
        onOpenPartyModal={() => navigate('/parties')}
      />

      {/* Quick Category Showcase Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full">
              Explore By Craving
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              What Are You Hungry For Today?
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORY_CARDS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/menu?category=${cat.id}`)}
              className="group p-5 bg-white rounded-3xl border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 transition flex items-center justify-center text-2xl shadow-inner mb-3">
                  {cat.icon}
                </div>
                <span className="inline-block text-[10px] font-extrabold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded uppercase">
                  {cat.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5 group-hover:text-amber-700 transition">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers Section */}
      <section className="py-12 bg-amber-50/40 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 uppercase tracking-widest bg-red-100/80 px-3 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-red-600" />
                <span>Chef's Hall of Fame</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Top Rated Mr Bun Specials
              </h2>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
            >
              <span>See All Items</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <FoodCard
                key={product.id}
                product={product}
                onCustomize={onCustomizeProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Party & Bulk Catering Teaser Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <PartyPopper className="w-4 h-4 text-amber-200" />
              <span>Bulk Party Catering &amp; Events</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Hosting a Party? Let Mr Bun Handle the Feast!
            </h2>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Order hot burgers, cheese burst pizzas and chilled mocktail barrels for 10 to 200+ guests. Get up to <strong>20% OFF</strong> and free delivery in thermal warmer boxes.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/parties')}
                className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-7 py-3.5 rounded-2xl text-sm shadow-lg transition transform hover:scale-105"
              >
                Explore Party Packages
              </button>
              <a
                href="tel:9476088111"
                className="bg-black/30 hover:bg-black/40 text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-white/30 transition flex items-center gap-2"
              >
                <span>Call Catering Desk: 9476088111</span>
              </a>
            </div>
          </div>

          <div className="relative group shrink-0">
            <div className="w-64 h-64 sm:w-72 sm:h-72 bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Mr Bun Mascot Party"
                className="w-full h-full object-contain animate-float"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
