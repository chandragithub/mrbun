import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Flame, Sparkles, Filter, SlidersHorizontal, MoreVertical, Check } from 'lucide-react';
import { CategoryType, Product } from '../types';
import { MENU_PRODUCTS } from '../data/menuData';
import { FoodCard } from '../components/FoodCard';
import { useSettings } from '../context/SettingsContext';

interface MenuPageProps {
  onCustomizeProduct: (product: Product) => void;
}

const CATEGORIES: { id: CategoryType; name: string; icon: string }[] = [
  { id: 'all', name: 'All Menu', icon: '✨' },
  { id: 'burgers', name: 'Smash Burgers', icon: '🍔' },
  { id: 'pizzas', name: 'Cheesy Pizzas', icon: '🍕' },
  { id: 'sandwiches', name: 'Sandwiches & Wraps', icon: '🥪' },
  { id: 'mocktails', name: 'Mocktails & Shakes', icon: '🍹' },
  { id: 'sides', name: 'Fries & Sides', icon: '🍟' },
  { id: 'combos', name: 'Feast Combos', icon: '🎉' },
];

export const MenuPage: React.FC<MenuPageProps> = ({ onCustomizeProduct }) => {
  const { products: contextProducts } = useSettings();
  const availableProducts = contextProducts && contextProducts.length > 0 ? contextProducts : MENU_PRODUCTS;

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = (searchParams.get('category') as CategoryType) || 'all';

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const kebabRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close kebab dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(event.target as Node)) {
        setIsKebabOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsKebabOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync state if URL search param changes
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategorySelect = (cat: CategoryType) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: cat }, { replace: true });
    }
  };

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) => {
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
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full">
          Fresh From Our Kitchen
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
          The <span className="text-amber-600">Mr Bun</span> Menu
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Hand-stretched cheese burst pizzas, double-smashed brioche burgers, loaded toasties &amp; ice-cold mocktails made fresh to order.
        </p>
      </div>

      {/* Category Filter Pills & Kebab Menu */}
      <div className="relative flex items-center gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth flex-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  categoryRefs.current[cat.id] = el;
                }}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 scale-105 ring-2 ring-amber-400/40'
                    : 'bg-white text-slate-700 border border-amber-100 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Kebab Menu at the end */}
        <div className="relative shrink-0" ref={kebabRef}>
          <button
            type="button"
            onClick={() => setIsKebabOpen((prev) => !prev)}
            aria-expanded={isKebabOpen}
            aria-haspopup="true"
            title="More Categories"
            className={`flex items-center justify-center p-3 rounded-2xl border transition-all duration-200 shadow-sm ${
              isKebabOpen
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-700 border-amber-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Kebab Dropdown List */}
          {isKebabOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-amber-100 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-amber-50 flex items-center justify-between">
                <span>All Categories</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {CATEGORIES.length}
                </span>
              </div>
              <div className="mt-1 space-y-1 max-h-72 overflow-y-auto no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategorySelect(cat.id);
                        setIsKebabOpen(false);
                        categoryRefs.current[cat.id]?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                          inline: 'center',
                        });
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-sm'
                          : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      {isActive && <Check className="w-4 h-4 shrink-0 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-sm mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, burger, mojito..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
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

        {/* Veg / Non-Veg Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <label className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
            vegOnly ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-600'
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
            <span>Pure Veg</span>
          </label>

          <label className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
            nonVegOnly ? 'bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500' : 'bg-slate-50 border-slate-200 text-slate-600'
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
            <span>Non-Veg</span>
          </label>

          <span className="text-xs font-semibold text-slate-500 ml-2">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
          </span>
        </div>

      </div>

      {/* Food Cards Grid */}
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
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 shadow-sm mt-8">
          <p className="text-5xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-slate-800">No items match your criteria</h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Try resetting filters or searching for something else.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setVegOnly(false);
              setNonVegOnly(false);
              handleCategorySelect('all');
            }}
            className="mt-4 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow-sm"
          >
            Show All Menu
          </button>
        </div>
      )}

    </div>
  );
};

export default MenuPage;
