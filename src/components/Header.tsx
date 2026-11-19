import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  ShieldCheck, 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  PartyPopper, 
  ClipboardList, 
  Menu as MenuIcon, 
  X, 
  Sparkles,
  LayoutDashboard,
  MapPin,
  Info,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal, isAdmin } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition whitespace-nowrap ${
      isActive ? 'text-amber-700 bg-amber-50 font-bold' : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      {/* Top Announcement & Compliance Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-red-600 text-white text-xs font-medium py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-200" />
              <span>Call / WhatsApp:</span>
              <a href="tel:9476088111" className="font-bold underline hover:text-amber-200">9476088111</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-200" />
              <a href="mailto:contact@mrbun.in" className="hover:text-amber-200">contact@mrbun.in</a>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>FSSAI Lic:</span>
              <span className="font-mono font-bold tracking-wide">22926112000173</span>
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link 
              to="/parties"
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full text-xs font-bold transition transform hover:scale-105 shadow-sm"
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>Party &amp; Bulk Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Mr Bun Mascot Logo" 
                className="w-13 h-13 sm:w-16 sm:h-16 object-contain drop-shadow-md rounded-xl transition-transform transform group-hover:scale-105"
              />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                HOT
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-950 font-display">
                  Mr <span className="text-amber-600">Bun</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-800/80 uppercase tracking-widest -mt-1 hidden sm:block">
                Pizzas • Burgers • Mocktails
              </p>
            </div>
          </Link>

          {/* Desktop Menu Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            {/* <NavLink to="/parties" className={({ isActive }) => `px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold flex items-center gap-1 transition whitespace-nowrap ${
              isActive ? 'text-red-700 bg-red-50' : 'text-red-600 hover:bg-red-50'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bulk &amp; Parties</span>
            </NavLink> */}
            <NavLink to="/outlets" className={navLinkClass}>
              Outlets
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact Us
            </NavLink>
            {/* <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink> */}
          </nav>

          {/* Actions: Admin, User, Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden xl:inline max-w-[90px] truncate">{user?.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-amber-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-amber-50 flex items-center gap-2.5 font-medium"
                    >
                      <ClipboardList className="w-4 h-4 text-amber-600" />
                      <span>My Orders &amp; Bookings</span>
                    </Link>

                    <Link
                      to="/parties"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-amber-50 flex items-center gap-2.5 font-medium"
                    >
                      <PartyPopper className="w-4 h-4 text-red-500" />
                      <span>Book Bulk Event / Party</span>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-amber-900 bg-amber-50/70 hover:bg-amber-100 flex items-center gap-2.5 font-bold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-700" />
                      <span>Admin Kitchen Panel</span>
                    </Link>

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={() => { setUserDropdownOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
              >
                <UserIcon className="w-4 h-4 text-amber-700" />
                <span>Login</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition transform active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-100 px-6 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <button 
            onClick={() => handleNavClick('/menu')}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100"
          >
            🍔 Explore Full Menu
          </button>
          <button 
            onClick={() => handleNavClick('/parties')}
            className="w-full text-left py-2 text-sm font-bold text-red-600 flex items-center gap-2 border-b border-slate-100"
          >
            <PartyPopper className="w-4 h-4 text-red-600" />
            <span>Party &amp; Bulk Catering (20% OFF)</span>
          </button>
          <button 
            onClick={() => handleNavClick('/outlets')}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Our Outlets &amp; Kitchens</span>
          </button>
          <button 
            onClick={() => handleNavClick('/franchise')}
            className="w-full text-left py-2 text-sm font-bold text-amber-900 hover:text-amber-700 border-b border-slate-100 flex items-center gap-2 bg-amber-50/60 px-2 rounded-lg"
          >
            <span className="text-base">🤝</span>
            <span>Apply for Franchise</span>
            <span className="ml-auto bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
              Partner
            </span>
          </button>
          <button 
            onClick={() => handleNavClick('/about')}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span>About Mr Bun</span>
          </button>
          <button 
            onClick={() => handleNavClick('/contact')}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-amber-600" />
            <span>Contact Us (9476088111)</span>
          </button>
          <button 
            onClick={() => handleNavClick('/orders')}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4 text-amber-600" />
            <span>My Orders &amp; Tracking</span>
          </button>
          <button
            onClick={() => handleNavClick('/admin')}
            className="w-full text-left py-2.5 text-sm font-bold text-slate-900 flex items-center gap-2 bg-amber-100 px-3 rounded-lg mt-2"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-800" />
            <span>Admin Kitchen Page</span>
          </button>
        </div>
      )}
    </header>
  );
};
