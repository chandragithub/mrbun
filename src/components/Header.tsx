import React, { useState, useEffect } from 'react';
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
  LayoutDashboard,
  MapPin,
  Info,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition whitespace-nowrap ${
      isActive 
        ? 'text-amber-800 bg-amber-100/80 font-bold shadow-xs' 
        : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-amber-100/90 shadow-xs transition-all">
      {/* 1. Top Announcement Bar - compact on mobile, hides on landscape phones to maximize screen space */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-red-600 text-white text-[11px] sm:text-xs font-medium py-1 sm:py-1.5 px-3 sm:px-6 landscape:hidden md:landscape:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 shrink-0">
              <Phone className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span className="hidden xs:inline">Order:</span>
              <a href="tel:9476088111" className="font-bold underline hover:text-amber-200">9476088111</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <a href="mailto:contact@mrbun.in" className="hover:text-amber-200">contact@mrbun.in</a>
            </span>
            <span className="hidden xl:flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>FSSAI Lic:</span>
              <span className="font-mono font-bold tracking-wide">22926112000173</span>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <Link 
              to="/parties"
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold transition transform hover:scale-105 shadow-xs whitespace-nowrap"
            >
              <PartyPopper className="w-3.5 h-3.5 shrink-0" />
              <span>Bulk &amp; Parties <span className="font-extrabold text-red-700">(20% OFF)</span></span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Fixed Logo */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4">
          
          {/* Fixed Logo & Brand Identity */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group shrink-0 select-none py-1"
            title="Mr Bun - Home"
          >
            {/* Mascot Image Container with Fixed Dimensions & No Layout Shift */}
            <div className="relative shrink-0 flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
              <img 
                src="/logo.png" 
                alt="Mr Bun Mascot Logo" 
                className="w-full h-full object-contain drop-shadow-md rounded-xl transition-transform duration-200 group-hover:scale-105"
                width="64"
                height="64"
                loading="eager"
              />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                HOT
              </span>
            </div>
            
            {/* Brand Title */}
            <div className="flex flex-col justify-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-amber-950 font-display leading-none">
                Mr <span className="text-amber-600">Bun</span>
              </span>
              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-amber-800/80 uppercase tracking-wider mt-0.5 hidden xs:block">
                Pizzas • Burgers • Mocktails
              </p>
            </div>
          </Link>

          {/* Desktop Menu Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            <NavLink to="/parties" className={({ isActive }) => `px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold flex items-center gap-1 transition whitespace-nowrap ${
              isActive ? 'text-red-700 bg-red-50' : 'text-red-600 hover:bg-red-50'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Bulk &amp; Parties</span>
            </NavLink>
            <NavLink to="/outlets" className={navLinkClass}>
              Outlets
            </NavLink>
            <NavLink to="/franchise" className={navLinkClass}>
              Franchise
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Action Buttons: User, Cart, Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition"
                  aria-label="User Account"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden xl:inline max-w-[80px] truncate">{user?.name}</span>
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
                      <span>My Orders &amp; Tracking</span>
                    </Link>

                    <Link
                      to="/parties"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-amber-50 flex items-center gap-2.5 font-medium"
                    >
                      <PartyPopper className="w-4 h-4 text-red-500" />
                      <span>Party &amp; Bulk Catering</span>
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
                className="flex items-center gap-1 sm:gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                <span>Login</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition transform active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] sm:text-[11px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* 3. Mobile Drawer Menu - Scrollable in landscape mode */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-amber-100 px-5 py-4 space-y-2 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in slide-in-from-top duration-200">
          <button 
            onClick={() => handleNavClick('/menu')}
            className="w-full text-left py-2.5 text-sm font-semibold text-slate-800 hover:text-amber-600 border-b border-slate-100 flex items-center justify-between"
          >
            <span>🍔 Explore Full Menu</span>
            <span className="text-xs text-amber-600 font-bold">Pizza, Burgers &amp; Sides →</span>
          </button>
          
          <button 
            onClick={() => handleNavClick('/parties')}
            className="w-full text-left py-2.5 text-sm font-bold text-red-600 flex items-center justify-between border-b border-slate-100"
          >
            <div className="flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-red-600" />
              <span>Party &amp; Bulk Catering</span>
            </div>
            <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              20% OFF
            </span>
          </button>

          <button 
            onClick={() => handleNavClick('/franchise')}
            className="w-full text-left py-2.5 text-sm font-bold text-amber-900 hover:text-amber-700 border-b border-slate-100 flex items-center justify-between bg-amber-50/70 px-2.5 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🤝</span>
              <span>Apply for Franchise</span>
            </div>
            <span className="bg-amber-500 text-white text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
              Partner
            </span>
          </button>

          <button 
            onClick={() => handleNavClick('/outlets')}
            className="w-full text-left py-2.5 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Our Outlets &amp; Kitchens</span>
          </button>

          <button 
            onClick={() => handleNavClick('/about')}
            className="w-full text-left py-2.5 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span>About Mr Bun</span>
          </button>

          <button 
            onClick={() => handleNavClick('/contact')}
            className="w-full text-left py-2.5 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-amber-600" />
            <span>Contact Us (9476088111)</span>
          </button>

          <button 
            onClick={() => handleNavClick('/orders')}
            className="w-full text-left py-2.5 text-sm font-semibold text-slate-700 hover:text-amber-600 border-b border-slate-100 flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4 text-amber-600" />
            <span>My Orders &amp; Live Tracking</span>
          </button>

          <button
            onClick={() => handleNavClick('/admin')}
            className="w-full text-left py-2.5 text-sm font-bold text-slate-900 flex items-center gap-2 bg-amber-100/80 px-3 rounded-xl mt-2 hover:bg-amber-200 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-800" />
            <span>Admin Kitchen Dashboard</span>
          </button>
        </div>
      )}
    </header>
  );
};
export default Header;
