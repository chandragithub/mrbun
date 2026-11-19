import React, { useState, useMemo } from 'react';
import { Search, Flame, Sparkles, Filter } from 'lucide-react';
import { CategoryType, Product } from '../types';
import { MENU_PRODUCTS } from '../data/menuData';
import { FoodCard } from './FoodCard';

interface MenuSectionProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  onCustomizeProduct: (product: Product) => void;
}

const CATEGORIES: { id: CategoryType; name: string; icon: string }[] = [
  { id: 'all', name: 'All Cravings', icon: '✨' },
  { id: 'burgers', name: 'Smash Burgers', icon: '🍔' },
  { id: 'pizzas', name: 'Cheesy Pizzas', icon: '🍕' },
  { id: 'sandwiches', name: 'Sandwiches & Wraps', icon: '🥪' },
  { id: 'mocktails', name: 'Mocktails & Shakes', icon: '🍹' },
  { id: 'sides', name: 'Fries & Sides', icon: '🍟' },
  { id: 'combos', name: 'Feast Combos', icon: '🎉' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onCustomizeProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return MENU_PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Veg / Non-veg filter
      if (vegOnly && !product.isVeg) return false;
      if (nonVegOnly && product.isVeg) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesTag = product.tags?.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTag;
      }

      return true;
    });
  }, [selectedCategory, vegOnly, nonVegOnly, searchQuery]);

  return (
    <section id="menu" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs sm:text-sm font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full">
          Mouthwatering Goodness
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
          Explore Mr Bun's <span className="text-amber-600">Fresh Menu</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          From oven-baked cheese burst crusts to double juicy burger stacks and refreshing chilled mocktails.
        </p>
      </div>

      {/* Category Pills Slider / Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 scale-105'
                  : 'bg-white text-slate-700 border border-amber-100 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, burger, mocktail..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Veg / Non-Veg toggles */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
            vegOnly ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => {
                setVegOnly(e.target.checked);
                if (e.target.checked) setNonVegOnly(false);
              }}
              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Pure Veg Only</span>
          </label>

          <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
            nonVegOnly ? 'bg-red-50 border-red-500 text-red-800' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <input
              type="checkbox"
              checked={nonVegOnly}
              onChange={(e) => {
                setNonVegOnly(e.target.checked);
                if (e.target.checked) setVegOnly(false);
              }}
              className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span>Non-Veg Only</span>
          </label>

          <span className="text-xs font-semibold text-slate-500 ml-2">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> items
          </span>
        </div>

      </div>

      {/* Food Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 mt-8">
          {filteredProducts.map((product) => (
            <FoodCard
              key={product.id}
              product={product}
              onCustomize={onCustomizeProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 shadow-sm mt-8">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-slate-800">No delicious items match your search</h3>
          <p className="text-slate-500 text-sm mt-1">Try searching for "pizza", "burger", "mojito", or resetting your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setVegOnly(false);
              setNonVegOnly(false);
              onSelectCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
};
