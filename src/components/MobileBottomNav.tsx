import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, PartyPopper, MapPin, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all select-none ${
      isActive 
        ? 'text-amber-700 font-bold scale-105' 
        : 'text-slate-500 hover:text-amber-600 font-medium'
    }`;
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1 flex items-center justify-between safe-area-inset-bottom"
    >
      {/* 1. Home */}
      <NavLink to="/" className={() => navItemClass('/')}>
        <div className="relative">
          <Home className="w-5 h-5 mb-0.5" />
          {location.pathname === '/' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full" />
          )}
        </div>
        <span className="text-[10px] leading-tight tracking-tight">Home</span>
      </NavLink>

      {/* 2. Menu */}
      <NavLink to="/menu" className={() => navItemClass('/menu')}>
        <div className="relative">
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          {location.pathname === '/menu' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full" />
          )}
        </div>
        <span className="text-[10px] leading-tight tracking-tight">Menu</span>
      </NavLink>

      {/* 3. Bulk & Parties */}
      <NavLink to="/parties" className={() => navItemClass('/parties')}>
        <div className="relative">
          <div className="relative">
            <PartyPopper className="w-5 h-5 mb-0.5 text-red-500" />
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] font-black px-1 rounded-full uppercase">
              20%
            </span>
          </div>
          {location.pathname === '/parties' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
          )}
        </div>
        <span className="text-[10px] leading-tight tracking-tight text-red-600 font-bold">Parties</span>
      </NavLink>

      {/* 4. Outlets */}
      <NavLink to="/outlets" className={() => navItemClass('/outlets')}>
        <div className="relative">
          <MapPin className="w-5 h-5 mb-0.5" />
          {location.pathname === '/outlets' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full" />
          )}
        </div>
        <span className="text-[10px] leading-tight tracking-tight">Outlets</span>
      </NavLink>

      {/* 5. Cart Drawer Trigger */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-slate-700 hover:text-amber-600 transition-all select-none group"
        aria-label="View Cart"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 transition transform active:scale-95">
            <ShoppingBag className="w-4 h-4" />
          </div>
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow animate-bounce">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] leading-tight tracking-tight font-bold text-amber-900 mt-0.5">
          {totalItemsCount > 0 ? `Cart (${totalItemsCount})` : 'Cart'}
        </span>
      </button>
    </nav>
  );
};
export default MobileBottomNav;
