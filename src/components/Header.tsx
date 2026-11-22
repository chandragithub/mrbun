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
  Sparkles,
  ChevronRight,
  UtensilsCrossed,
  UserCog
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, openProfileModal } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
    <>
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-amber-100/90 shadow-xs transition-all">
        {/* 1. Top Announcement Bar (Hidden on Mobile View) */}
        <div className="hidden md:block bg-gradient-to-r from-amber-700 via-amber-600 to-red-600 text-white text-[11px] sm:text-xs font-medium py-1 sm:py-1.5 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="flex items-center gap-1.5 shrink-0">
                <Phone className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                <span className="hidden xs:inline">Order:</span>
                <a href={`tel:${settings.phone}`} className="font-bold underline hover:text-amber-200">{settings.phone}</a>
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-200">{settings.email}</a>
              </span>
              <span className="hidden xl:flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>FSSAI Lic:</span>
                <span className="font-mono font-bold tracking-wide">{settings.fssaiLicense}</span>
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
              title={`${settings.brandName} - Home`}
            >
              <div className="relative shrink-0 flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
                <img 
                  src={settings.logoUrl || '/logo.png'} 
                  alt={`${settings.brandName} Logo`} 
                  className="w-full h-full object-contain drop-shadow-md rounded-xl transition-transform duration-200 group-hover:scale-105"
                  width="64"
                  height="64"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to default logo if image url fails
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-amber-950 font-display leading-none">
                  {settings.brandName}
                </span>
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-amber-800/80 uppercase tracking-wider mt-0.5 hidden xs:block">
                  {settings.tagline}
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
              {/* <NavLink to="/outlets" className={navLinkClass}>
                Outlets
              </NavLink> */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* User Account / Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition"
                    aria-label="User Account"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 overflow-hidden shadow-2xs">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name ? user.name[0] : 'U'
                      )}
                    </div>
                    <span className="hidden xl:inline max-w-[80px] truncate">{user?.name}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-amber-100 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {user?.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user?.name ? user.name[0] : 'U'
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email || user?.phone}</p>
                          </div>
                        </div>
                        <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {user?.role}
                        </span>
                      </div>

                      {/* User Settings & Profile Button */}
                      <button
                        onClick={() => { setUserDropdownOpen(false); openProfileModal(); }}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-800 hover:bg-amber-50 flex items-center gap-2.5 font-bold transition"
                      >
                        <UserCog className="w-4 h-4 text-amber-600 shrink-0" />
                        <div className="truncate">
                          <p className="leading-tight">Profile &amp; Settings</p>
                          <p className="text-[10px] text-slate-400 font-normal">Address, phone, email &amp; photo</p>
                        </div>
                      </button>

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

                      {/* Admin Kitchen Panel (Only visible to Admin) */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-amber-900 bg-amber-50/70 hover:bg-amber-100 flex items-center gap-2.5 font-bold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-700" />
                          <span>Admin Kitchen Panel</span>
                        </Link>
                      )}

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

              {/* Cart Button (Hidden on mobile view because MobileBottomNav has the Cart button) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden lg:flex relative items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition transform active:scale-95"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Cart</span>
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] sm:text-[11px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-800 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition"
                aria-label="Open mobile navigation menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* 3. Mobile Right-Side Drawer (when hamburger clicked) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Dark Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Right Slide-in Drawer Container */}
          <div 
            className="fixed inset-y-0 right-0 max-w-full flex pl-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl border-l border-amber-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 shrink-0">
                    <img
                      src={settings.logoUrl || '/logo.png'}
                      alt={settings.brandName}
                      className="w-full h-full object-contain drop-shadow rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                      HOT
                    </span>
                  </div>
                  <div>
                    <span className="text-xl font-black text-amber-950 font-display leading-none">
                      {settings.brandName}
                    </span>
                    <p className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider mt-0.5">
                      {settings.tagline}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition shadow-xs"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Quick Bar inside Drawer */}
              <div className="px-4 sm:px-5 py-3 bg-amber-50/70 border-b border-amber-100/80 shrink-0">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 overflow-hidden shadow-2xs">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name ? user.name[0] : 'U'
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email || user?.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => { setMobileMenuOpen(false); openProfileModal(); }}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] rounded-lg shadow-2xs transition shrink-0 flex items-center gap-1"
                    >
                      <UserCog className="w-3.5 h-3.5 text-amber-700" />
                      <span>Settings</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="text-xs text-slate-600">
                      <p className="font-bold text-slate-800">Welcome Foodie!</p>
                      <p className="text-[10px] text-slate-500">Sign in for fast re-ordering</p>
                    </div>
                    <button
                      onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Login / Register
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Scrollable Navigation Links */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2">
                
                {/* 0. User Profile & Settings (When logged in) */}
                {isAuthenticated && (
                  <button 
                    onClick={() => { setMobileMenuOpen(false); openProfileModal(); }}
                    className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition border border-amber-200 flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <UserCog className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-900">User Settings &amp; Profile</p>
                          <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 font-medium">Address, email, phone &amp; photo</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition" />
                  </button>
                )}
                
                {/* 1. Explore Menu */}
                <button 
                  onClick={() => handleNavClick('/menu')}
                  className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 transition border border-slate-100 hover:border-amber-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shadow-xs">
                      🍔
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Explore Full Menu</p>
                      <p className="text-[11px] text-amber-700 font-semibold">Pizzas, Burgers, Sides &amp; Shakes</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                </button>
                
                {/* 2. Party & Bulk Catering */}
                <button 
                  onClick={() => handleNavClick('/parties')}
                  className="w-full text-left p-3 rounded-2xl bg-red-50/50 hover:bg-red-50 transition border border-red-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                      <PartyPopper className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-red-700">Party &amp; Bulk Catering</p>
                        <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                          20% OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">Birthdays, Offices &amp; Gatherings</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 3. Apply for Franchise */}
                <button 
                  onClick={() => handleNavClick('/franchise')}
                  className="w-full text-left p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100/70 transition border border-amber-200/80 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/30 text-amber-900 flex items-center justify-center text-lg shadow-xs">
                      🤝
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-amber-950">Apply for Franchise</p>
                        <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono uppercase">
                          PARTNER
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">High ROI Fast Food Business</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 4. Outlets & Kitchens */}
                <button 
                  onClick={() => handleNavClick('/outlets')}
                  className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 transition border border-slate-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition">Our Outlets &amp; Kitchens</p>
                      <p className="text-[11px] text-slate-500">Flagship diners &amp; express counters</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 5. About Mr Bun */}
                <button 
                  onClick={() => handleNavClick('/about')}
                  className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 transition border border-slate-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
                      <Info className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition">About Mr Bun</p>
                      <p className="text-[11px] text-slate-500">Our food story &amp; quality standards</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 6. Contact Us */}
                <button 
                  onClick={() => handleNavClick('/contact')}
                  className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 transition border border-slate-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
                      <PhoneCall className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition">Contact Us</p>
                      <p className="text-[11px] text-slate-500">Helpline: {settings.phone}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 7. My Orders & Live Tracking */}
                <button 
                  onClick={() => handleNavClick('/orders')}
                  className="w-full text-left p-3 rounded-2xl hover:bg-amber-50 transition border border-slate-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
                      <ClipboardList className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition">My Orders &amp; Live Tracking</p>
                      <p className="text-[11px] text-slate-500">Track delivery status &amp; bills</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </button>

                {/* 8. Admin Kitchen Dashboard (Admin Only) */}
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className="w-full text-left p-3 rounded-2xl bg-amber-100/80 hover:bg-amber-200/90 transition border border-amber-300 flex items-center justify-between group mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Admin Kitchen Dashboard</p>
                        <p className="text-[11px] text-amber-800 font-semibold">Live orders &amp; kitchen status</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-800 group-hover:translate-x-0.5 transition" />
                  </button>
                )}

              </div>

              {/* Drawer Footer with Statutory & Contact info */}
              <div className="p-4 sm:p-5 border-t border-amber-100 bg-slate-50/70 shrink-0 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FSSAI: <strong className="text-slate-800 font-mono">{settings.fssaiLicense}</strong></span>
                  </span>
                  <a href={`tel:${settings.phone}`} className="font-bold text-amber-700 hover:underline">
                    {settings.phone}
                  </a>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
