import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShoppingBag, 
  PartyPopper, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Flame, 
  Bike, 
  TrendingUp, 
  RefreshCw,
  Phone,
  Server,
  Lock,
  Search,
  Filter,
  AlertTriangle,
  Mail,
  Check,
  XCircle,
  BellRing,
  Image as ImageIcon,
  Upload,
  Tag,
  Percent,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Save,
  CreditCard,
  QrCode,
  Banknote,
  RotateCcw,
  Sliders,
  Building2,
  Sparkles,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { dbService, DEFAULT_STORE_SETTINGS } from '../services/db';
import { 
  Order, 
  PartyOrderBooking, 
  OrderStatus, 
  Product, 
  CategoryType, 
  StoreOffer, 
  Outlet, 
  StoreSettings 
} from '../types';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, login } = useAuth();
  const { 
    settings, 
    updateSettings, 
    products, 
    saveProduct, 
    deleteProduct, 
    offers, 
    saveOffer, 
    deleteOffer, 
    outlets, 
    saveOutlet, 
    deleteOutlet 
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'parties' | 'brand' | 'menu' | 'offers' | 'outlets' | 'payments' | 'db'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [parties, setParties] = useState<PartyOrderBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Quick login state if user is not admin
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Brand Form State
  const [brandForm, setBrandForm] = useState<StoreSettings>(settings);

  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'burgers',
    price: 199,
    originalPrice: 249,
    isVeg: true,
    spicyLevel: 1,
    description: '',
    image: '',
    isPopular: false,
    isNew: true,
    tags: []
  });
  const [productTagInput, setProductTagInput] = useState('');

  // Offer Form Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<StoreOffer | null>(null);
  const [offerForm, setOfferForm] = useState<Partial<StoreOffer>>({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 299,
    maxDiscount: 150,
    isActive: true
  });

  // Outlet Form Modal State
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);
  const [outletForm, setOutletForm] = useState<Partial<Outlet>>({
    name: '',
    type: 'Dine-In • Takeaway • Live Counter',
    address: '',
    landmark: '',
    phone: '9476088111',
    timings: '11:00 AM – 11:00 PM (All Days)',
    status: 'Open Now',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    features: ['Air Conditioned', 'Free Wi-Fi', 'Contactless UPI'],
    seatingCapacity: '40 Guests',
    isFlagship: false
  });
  const [outletFeaturesInput, setOutletFeaturesInput] = useState('');

  // Payment Options Form State
  const [paymentForm, setPaymentForm] = useState(settings.paymentOptions);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setBrandForm(settings);
    setPaymentForm(settings.paymentOptions);
  }, [settings]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allOrders = await dbService.getAllOrders();
      setOrders(allOrders);
      const allParties = await dbService.getAllPartyOrders();
      setParties(allParties);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // 1. Owner Approval of Order
  const handleApproveOrder = async (orderId: string) => {
    const updated = await dbService.approveOrder(orderId);
    if (updated) {
      showNotification(`Order #${orderId} Approved! Confirmation SMS sent to ${updated.customerPhone} and email to ${updated.customerEmail}. Customer dashboard updated to Confirmed!`);
      loadData();
    }
  };

  // 2. Owner Approval of Party Booking
  const handleApproveParty = async (partyId: string) => {
    const updated = await dbService.approvePartyOrder(partyId);
    if (updated) {
      showNotification(`Party Booking #${partyId} Approved! Confirmation message sent to ${updated.phone} & ${updated.email}.`);
      loadData();
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await dbService.updateOrderStatus(orderId, status);
    loadData();
  };

  const handleUpdatePartyStatus = async (partyId: string, status: PartyOrderBooking['status']) => {
    await dbService.updatePartyOrderStatus(partyId, status);
    loadData();
  };

  const handleAdminQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await login('admin@mrbun.in', adminPassword || 'admin123');
    if (!res.success) {
      setAuthError('Invalid credentials. (Hint: password is "admin123")');
    } else {
      loadData();
    }
  };

  // --- BRAND & LOGO HANDLERS ---
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file is larger than 2MB. Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBrandForm(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrandSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(brandForm);
    showNotification('✨ Brand Identity & Logo updated successfully! Changes are live across the entire website.');
  };

  const handleResetLogo = () => {
    setBrandForm(prev => ({ ...prev, logoUrl: '/logo.png' }));
  };

  // --- MENU CRUD HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'burgers',
      price: 199,
      originalPrice: 249,
      isVeg: true,
      spicyLevel: 1,
      description: '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      isPopular: false,
      isNew: true,
      tags: ['Chef Special']
    });
    setProductTagInput('Chef Special');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setProductTagInput(prod.tags ? prod.tags.join(', ') : '');
    setIsProductModalOpen(true);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductForm(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please fill product name and price.');
      return;
    }

    const tagsArray = productTagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: productForm.name || '',
      category: (productForm.category || 'burgers') as Product['category'],
      description: productForm.description || '',
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      isVeg: !!productForm.isVeg,
      spicyLevel: (productForm.spicyLevel ?? 1) as 0 | 1 | 2 | 3,
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 12,
      image: productForm.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      isPopular: !!productForm.isPopular,
      isNew: !!productForm.isNew,
      tags: tagsArray
    };

    await saveProduct(productToSave);
    setIsProductModalOpen(false);
    showNotification(`🍔 Menu item "${productToSave.name}" ${editingProduct ? 'updated' : 'added'} successfully!`);
  };

  const handleDeleteProductItem = async (prod: Product) => {
    if (confirm(`Are you sure you want to delete "${prod.name}" from the menu?`)) {
      await deleteProduct(prod.id);
      showNotification(`🗑️ Menu item "${prod.name}" removed.`);
    }
  };

  // --- OFFERS CRUD HANDLERS ---
  const handleOpenAddOffer = () => {
    setEditingOffer(null);
    setOfferForm({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 299,
      maxDiscount: 150,
      isActive: true
    });
    setIsOfferModalOpen(true);
  };

  const handleOpenEditOffer = (offer: StoreOffer) => {
    setEditingOffer(offer);
    setOfferForm({ ...offer });
    setIsOfferModalOpen(true);
  };

  const handleSaveOfferForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.code || !offerForm.title || !offerForm.discountValue) {
      alert('Please fill coupon code, title, and discount value.');
      return;
    }

    const offerToSave: StoreOffer = {
      id: editingOffer ? editingOffer.id : `off-${Date.now()}`,
      code: (offerForm.code || '').trim().toUpperCase(),
      title: offerForm.title || '',
      description: offerForm.description || '',
      discountType: (offerForm.discountType || 'percentage') as 'percentage' | 'flat',
      discountValue: Number(offerForm.discountValue),
      minOrderAmount: Number(offerForm.minOrderAmount || 0),
      maxDiscount: offerForm.maxDiscount ? Number(offerForm.maxDiscount) : undefined,
      isActive: offerForm.isActive ?? true
    };

    saveOffer(offerToSave);
    setIsOfferModalOpen(false);
    showNotification(`🏷️ Coupon code "${offerToSave.code}" ${editingOffer ? 'updated' : 'created'}!`);
  };

  const handleToggleOfferActive = (offer: StoreOffer) => {
    const updated = { ...offer, isActive: !offer.isActive };
    saveOffer(updated);
    showNotification(`Coupon "${offer.code}" is now ${updated.isActive ? 'Active' : 'Disabled'}.`);
  };

  const handleDeleteOfferItem = (offer: StoreOffer) => {
    if (confirm(`Delete offer "${offer.code}"?`)) {
      deleteOffer(offer.id);
      showNotification(`Offer "${offer.code}" deleted.`);
    }
  };

  // --- OUTLET CRUD HANDLERS ---
  const handleOpenAddOutlet = () => {
    setEditingOutlet(null);
    setOutletForm({
      name: '',
      type: 'Dine-In • Takeaway • Live Counter',
      address: '',
      landmark: '',
      phone: settings.phone || '9476088111',
      timings: '11:00 AM – 11:00 PM (All Days)',
      status: 'Open Now',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      features: ['Air Conditioned', 'Free Wi-Fi', 'Contactless UPI'],
      seatingCapacity: '40 Guests',
      isFlagship: false
    });
    setOutletFeaturesInput('Air Conditioned, Free Wi-Fi, Contactless UPI');
    setIsOutletModalOpen(true);
  };

  const handleOpenEditOutlet = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    setOutletForm({ ...outlet });
    setOutletFeaturesInput(outlet.features ? outlet.features.join(', ') : '');
    setIsOutletModalOpen(true);
  };

  const handleSaveOutletForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletForm.name || !outletForm.address) {
      alert('Please fill outlet name and address.');
      return;
    }

    const featuresArray = outletFeaturesInput
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    const outletToSave: Outlet = {
      id: editingOutlet ? editingOutlet.id : `outlet-${Date.now()}`,
      name: outletForm.name || '',
      type: outletForm.type || 'Dine-In • Takeaway',
      address: outletForm.address || '',
      landmark: outletForm.landmark || '',
      phone: outletForm.phone || settings.phone || '9476088111',
      timings: outletForm.timings || '11:00 AM – 11:00 PM',
      status: (outletForm.status || 'Open Now') as Outlet['status'],
      image: outletForm.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      features: featuresArray,
      seatingCapacity: outletForm.seatingCapacity || '30 Guests',
      isFlagship: !!outletForm.isFlagship
    };

    await saveOutlet(outletToSave);
    setIsOutletModalOpen(false);
    showNotification(`📍 Outlet "${outletToSave.name}" saved successfully!`);
  };

  const handleDeleteOutletItem = async (outlet: Outlet) => {
    if (confirm(`Delete outlet "${outlet.name}"?`)) {
      await deleteOutlet(outlet.id);
      showNotification(`Outlet "${outlet.name}" removed.`);
    }
  };

  // --- PAYMENT SETTINGS HANDLER ---
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      paymentOptions: paymentForm
    });
    showNotification('💳 Payment gateway settings & cash policies saved and active!');
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const pendingParties = parties.filter((p) => p.status === 'pending');
  const activeOrders = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');

  // If user is not admin, show dedicated Admin Login Gateway
  if (!isAdmin && user?.email !== 'admin@mrbun.in') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display">
              {settings.brandName} Kitchen &amp; Owner Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Restricted access for store owner (<strong>{settings.phone}</strong>) &amp; kitchen head.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminQuickLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                defaultValue="admin@mrbun.in"
                readOnly
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Passcode
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg"
            >
              Unlock Owner Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setAdminPassword('admin123');
              }}
              className="text-[11px] font-bold text-amber-700 hover:underline"
            >
              Fill Demo Owner Password (admin123)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  // Filtered products list for Menu tab
  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner & Company Compliance Info */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Owner Phone: {settings.phone}
            </span>
            <span className="font-mono text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full font-bold">
              Email: {settings.email}
            </span>
            <span className="font-mono text-xs bg-black/40 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full">
              FSSAI: {settings.fssaiLicense}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight mt-2 flex items-center justify-center md:justify-start gap-3">
            <img 
              src={settings.logoUrl || '/logo.png'} 
              alt={settings.brandName} 
              className="w-10 h-10 object-contain rounded-xl bg-white p-1"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
            <span>{settings.brandName} Owner &amp; Kitchen Control Desk</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time management for live orders, party feasts, logo &amp; brand identity, dynamic menu items, offers, outlets, and payment options.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live DB</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert Toast */}
      {successToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Urgent Pending Action Banner */}
      {(pendingOrders.length > 0 || pendingParties.length > 0) && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-black">
                🚨 ACTION REQUIRED: {pendingOrders.length} Food Order(s) &amp; {pendingParties.length} Party Inquiry Pending Approval!
              </p>
              <p className="text-xs text-amber-100 mt-0.5">
                Approving will automatically send a confirmation SMS &amp; Email to the customer and update their status to Confirmed.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('pending');
            }}
            className="shrink-0 bg-white text-slate-950 hover:bg-amber-100 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition"
          >
            Review Pending Orders
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Owner Approval</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-display">
            {pendingOrders.length} Orders
          </p>
          <p className="text-[11px] text-amber-700 font-bold mt-1">Pending approval</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed &amp; Cooking</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-display">
            {activeOrders.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Kitchen in progress</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Menu Items</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 font-display">
            {products.length} Items
          </p>
          <p className="text-[11px] text-blue-600 font-bold mt-1">Dynamically editable</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders Revenue</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-display">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across all tickets</p>
        </div>
      </div>

      {/* Management Navigation Tabs (All 6 Features + Live Orders + DB) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
          
          {/* Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Food Orders ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>

          {/* Party Bookings */}
          <button
            onClick={() => setActiveTab('parties')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'parties'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PartyPopper className="w-4 h-4" />
            <span>Parties ({parties.length})</span>
            {pendingParties.length > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingParties.length}
              </span>
            )}
          </button>

          {/* 1 & 2. Logo & Brand Identity */}
          <button
            onClick={() => setActiveTab('brand')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'brand'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1 &amp; 2. Logo &amp; Brand</span>
          </button>

          {/* 3. Upload Menu Dynamically */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>3. Dynamic Menu ({products.length})</span>
          </button>

          {/* 4. Set Offers Dynamically */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'offers'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>4. Offers &amp; Promos ({offers.length})</span>
          </button>

          {/* 5. Add Multiple Outlets */}
          <button
            onClick={() => setActiveTab('outlets')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'outlets'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>5. Outlets ({outlets.length})</span>
          </button>

          {/* 6. Cash & Payment Gateways */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>6. Cash &amp; Payments</span>
          </button>

          {/* Edge Architecture */}
          <button
            onClick={() => setActiveTab('db')}
            className={`py-2.5 px-3.5 rounded-2xl transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'db'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Cloudflare D1</span>
          </button>
        </div>

        {/* TAB 1: FOOD ORDERS */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6 space-y-4">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search by order ID, name, phone..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending">⏳ Pending Owner Approval ({pendingOrders.length})</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="preparing">🔥 Preparing</option>
                  <option value="out_for_delivery">🛵 Out For Delivery</option>
                  <option value="delivered">🎉 Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm">No orders matching your criteria.</p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className={`p-5 rounded-3xl border transition shadow-xs space-y-3.5 ${
                      ord.orderStatus === 'pending'
                        ? 'border-2 border-amber-400 bg-amber-50/40'
                        : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded-xl">
                          {ord.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{ord.customerName}</h3>
                        <a href={`tel:${ord.customerPhone}`} className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{ord.customerPhone}</span>
                        </a>
                        <span className="text-xs text-slate-400">({ord.customerEmail})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-amber-950 font-display">
                          ₹{ord.totalAmount}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ord.paymentMethod.toUpperCase()} • {ord.paymentStatus}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          ord.orderStatus === 'pending' 
                            ? 'bg-amber-500 text-white animate-pulse'
                            : ord.orderStatus === 'confirmed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}>
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Details row */}
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-100 space-y-1.5">
                      <p><strong>Destination:</strong> {ord.deliveryAddress}</p>
                      <p>
                        <strong>Items:</strong> {ord.items.map((i) => `${i.quantity}x ${i.product.name}${i.cheeseBurst ? ' (+Cheese)' : ''}`).join(', ')}
                      </p>
                      {ord.orderNotes && (
                        <p className="text-amber-900 font-semibold italic"><strong>Instructions:</strong> {ord.orderNotes}</p>
                      )}
                    </div>

                    {/* Notification Audit Trail */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>Owner Alert: Sent to <strong>{settings.phone}</strong> &amp; <strong>{settings.email}</strong></span>
                        </span>
                        <span className="text-emerald-700 font-bold">✓ Dispatched</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Customer Notification: <strong>{ord.customerPhone}</strong> &amp; <strong>{ord.customerEmail}</strong></span>
                        </span>
                        <span className={`font-bold ${ord.customerConfirmation ? 'text-emerald-700' : 'text-amber-600'}`}>
                          {ord.customerConfirmation ? `✓ Confirmation SMS/Email Sent` : 'Pending Owner Approval'}
                        </span>
                      </div>
                    </div>

                    {/* Cash on Delivery Notice */}
                    {ord.paymentMethod === 'cod' && (
                      <div className="text-[11px] bg-red-50 text-red-800 p-2 rounded-xl border border-red-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span><strong>Policy Enforced:</strong> {settings.paymentOptions.cashPolicyNotice}</span>
                      </div>
                    )}

                    {/* Owner Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      {ord.orderStatus === 'pending' ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleApproveOrder(ord.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve &amp; Confirm Order (Dispatches SMS &amp; Email)</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition border border-red-200"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 mr-1">Advance Kitchen Stage:</span>
                          
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              ord.orderStatus === 'preparing'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            🔥 1. Start Prepping
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'out_for_delivery')}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              ord.orderStatus === 'out_for_delivery'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            🛵 2. Out For Delivery
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            🎉 3. Mark Delivered
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PARTY ORDERS */}
        {activeTab === 'parties' && (
          <div className="p-4 sm:p-6 space-y-4">
            {parties.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm">No party inquiries recorded yet.</p>
            ) : (
              parties.map((pt) => (
                <div
                  key={pt.id}
                  className={`p-5 rounded-3xl border transition shadow-xs space-y-3.5 ${
                    pt.status === 'pending'
                      ? 'border-2 border-red-400 bg-red-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-red-600 text-white px-2.5 py-1 rounded-xl">
                        {pt.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{pt.fullName}</h3>
                      <a href={`tel:${pt.phone}`} className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{pt.phone}</span>
                      </a>
                      <span className="text-xs text-slate-500">({pt.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-red-700 font-display">
                        ₹{pt.budgetEstimate.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        pt.status === 'pending' ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {pt.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                    <p><strong>Occasion:</strong> {pt.eventType} • <strong>Guests:</strong> {pt.guestCount} Persons</p>
                    <p><strong>Package:</strong> {pt.packageName}</p>
                    <p><strong>Date &amp; Time:</strong> {pt.eventDate} @ {pt.eventTime}</p>
                    <p><strong>Venue Address:</strong> {pt.venueAddress}</p>
                    <p><strong>Payment Mode:</strong> {pt.paymentMethod ? pt.paymentMethod.toUpperCase() : 'ONLINE'}</p>
                    {pt.customNotes && (
                      <p className="text-amber-900 font-semibold"><strong>Dietary &amp; Special Notes:</strong> {pt.customNotes}</p>
                    )}
                  </div>

                  {/* Owner Approval for Party */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    {pt.status === 'pending' ? (
                      <button
                        onClick={() => handleApproveParty(pt.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Party Booking (Sends Confirmation SMS &amp; Email)</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Update Booking Status:</span>
                        {(['confirmed', 'catering_scheduled', 'completed'] as PartyOrderBooking['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdatePartyStatus(pt.id, st)}
                            className={`text-xs font-bold px-3 py-1 rounded-xl uppercase transition ${
                              pt.status === st
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: 1. LOGO IMAGE UPLOAD & 2. NAME / BRAND IDENTITY */}
        {activeTab === 'brand' && (
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                Brand Customization &amp; Identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your official restaurant logo, brand name, statutory contact numbers, and FSSAI license.
              </p>
            </div>

            <form onSubmit={handleSaveBrandSettings} className="space-y-6 max-w-4xl">
              
              {/* Feature 1: Logo Upload & Live Preview */}
              <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200 space-y-4">
                <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>1. Official Logo Image Customizer</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Current Logo Preview */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-dashed border-amber-300 p-2 flex items-center justify-center shadow-inner overflow-hidden">
                      <img 
                        src={brandForm.logoUrl || '/logo.png'} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain drop-shadow"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Logo Preview</span>
                  </div>

                  {/* Logo Upload Inputs */}
                  <div className="space-y-3 flex-1 w-full">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Upload Logo File (PNG, JPG, SVG, WebP)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600 cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Recommended size: 512x512 square transparent PNG.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Or Enter Image URL
                      </label>
                      <input 
                        type="url"
                        value={brandForm.logoUrl}
                        onChange={(e) => setBrandForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="text-xs text-amber-800 hover:text-amber-950 underline font-bold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Default Mascot (/logo.png)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Name & Statutory Information */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. Brand Name &amp; Legal Statutory Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brand / Store Name
                    </label>
                    <input 
                      type="text"
                      value={brandForm.brandName}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, brandName: e.target.value }))}
                      placeholder="e.g. Mr Bun"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tagline / Motto
                    </label>
                    <input 
                      type="text"
                      value={brandForm.tagline}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="e.g. Pizzas • Burgers • Mocktails"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Owner Helpline Phone Number
                    </label>
                    <input 
                      type="tel"
                      value={brandForm.phone}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. 9476088111"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Used for order alerts &amp; customer customer support.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Contact Email
                    </label>
                    <input 
                      type="email"
                      value={brandForm.email}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. contact@mrbun.in"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      FSSAI Food Safety License Number
                    </label>
                    <input 
                      type="text"
                      value={brandForm.fssaiLicense}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, fssaiLicense: e.target.value }))}
                      placeholder="e.g. 22926112000173"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Displayed prominently in footer, header, and order invoices for regulatory compliance.</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Logo &amp; Brand Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: 3. UPLOAD MENU DYNAMICALLY (CRUD) */}
        {activeTab === 'menu' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">
                  3. Dynamic Menu Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload food items dynamically, update prices, veg/nonveg markings, and bestsellers.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food Item</span>
              </button>
            </div>

            {/* Menu Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Category:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="burgers">🍔 Burgers</option>
                  <option value="pizzas">🍕 Pizzas</option>
                  <option value="sandwiches">🥪 Sandwiches</option>
                  <option value="mocktails">🍹 Mocktails</option>
                  <option value="sides">🍟 Sides</option>
                  <option value="combos">🎉 Combos</option>
                </select>
              </div>
            </div>

            {/* Product Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition"
                >
                  <div className="flex gap-3">
                    <img 
                      src={prod.image} 
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center p-0.5 border ${
                          prod.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${prod.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{prod.category}</span>
                        {prod.isPopular && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded">BESTSELLER</span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-black text-amber-950 font-display text-sm">₹{prod.price}</span>
                        {prod.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProductItem(prod)}
                      className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 4. SET OFFERS DYNAMICALLY (PERCENTAGE & FLAT CASH BENEFIT) */}
        {activeTab === 'offers' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">
                  4. Dynamic Offers &amp; Promo Coupons
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set up dynamic discounts: either <strong>Percentage OFF (% discount)</strong> or <strong>Direct Cash Benefit (Flat ₹ discount)</strong>.
                </p>
              </div>

              <button
                onClick={handleOpenAddOffer}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Offer</span>
              </button>
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between space-y-4 ${
                    offer.isActive ? 'border-amber-300 bg-white' : 'border-slate-200 bg-slate-50 opacity-70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-black bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl">
                        {offer.code}
                      </span>
                      <button
                        onClick={() => handleToggleOfferActive(offer)}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full transition ${
                          offer.isActive 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {offer.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{offer.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{offer.description}</p>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-amber-950">
                        <span>Benefit Type:</span>
                        <span className="capitalize text-emerald-700">
                          {offer.discountType === 'percentage' 
                            ? `${offer.discountValue}% OFF` 
                            : `Flat ₹${offer.discountValue} Cash Discount`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Min Order:</span>
                        <span>₹{offer.minOrderAmount}</span>
                      </div>
                      {offer.maxDiscount && (
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Max Discount Cap:</span>
                          <span>₹{offer.maxDiscount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditOffer(offer)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOfferItem(offer)}
                      className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: 5. ADD MULTIPLE OUTLET */}
        {activeTab === 'outlets' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">
                  5. Multiple Outlets &amp; Kitchen Locations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, edit, or configure your physical diners, express cloud kitchens, and takeaway outlets.
                </p>
              </div>

              <button
                onClick={handleOpenAddOutlet}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Outlet</span>
              </button>
            </div>

            {/* Outlets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outlets.map((outlet) => (
                <div
                  key={outlet.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-amber-300 transition"
                >
                  <div className="relative h-44 bg-slate-100">
                    <img 
                      src={outlet.image} 
                      alt={outlet.name}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {outlet.isFlagship && (
                        <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                          FLAGSHIP DINER
                        </span>
                      )}
                      <span className="bg-slate-900 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        {outlet.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="text-base font-bold text-slate-900">{outlet.name}</h4>
                    <p className="text-xs font-semibold text-amber-700">{outlet.type}</p>
                    <p className="text-xs text-slate-600 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{outlet.address} (Landmark: {outlet.landmark})</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{outlet.timings}</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{outlet.phone}</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-1 pt-1">
                      {outlet.features.map((feat, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditOutlet(outlet)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOutletItem(outlet)}
                      className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: 6. PROVIDE CASH OPTIONS (CASH, UPI, CARD LIKE CASHFREE) */}
        {activeTab === 'payments' && (
          <div className="p-6 space-y-8 max-w-4xl">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                6. Payment Gateways &amp; Cash Policy Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enable or disable Cash on Delivery, UPI Online QR, and Card payments powered by Cashfree Payments.
              </p>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="space-y-6">
              
              {/* Option A: Cash on Delivery / Counter Cash */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Cash on Delivery / Counter Cash</h4>
                      <p className="text-[11px] text-slate-500">Subject to mandatory pre-preparation collection policy.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={paymentForm.cashEnabled}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cashEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {paymentForm.cashEnabled && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Mandatory Cash Acceptance Policy Notice:
                    </label>
                    <textarea
                      value={paymentForm.cashPolicyNotice}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cashPolicyNotice: e.target.value }))}
                      rows={2}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500 font-medium"
                      required
                    />
                    <p className="text-[10px] text-red-700 font-bold">
                      ⚠️ Note: This exact policy warning is displayed on checkout and customer receipts.
                    </p>
                  </div>
                )}
              </div>

              {/* Option B: UPI Online Payment */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Instant UPI Payments</h4>
                      <p className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={paymentForm.upiEnabled}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, upiEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {paymentForm.upiEnabled && (
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Merchant UPI ID
                      </label>
                      <input 
                        type="text"
                        value={paymentForm.upiId}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, upiId: e.target.value }))}
                        placeholder="e.g. mrbun@upi"
                        className="w-full text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Merchant Display Name
                      </label>
                      <input 
                        type="text"
                        value={paymentForm.upiName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, upiName: e.target.value }))}
                        placeholder="e.g. Mr Bun Central Kitchen"
                        className="w-full text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Option C: Card & Online Gateway (Cashfree) */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Credit / Debit Card &amp; Online Gateway</h4>
                      <p className="text-[11px] text-slate-500">Supports Visa, Mastercard, RuPay, NetBanking &amp; Wallets.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={paymentForm.cardEnabled}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {paymentForm.cardEnabled && (
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Payment Gateway Provider
                        </label>
                        <select
                          value={paymentForm.cardGateway}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cardGateway: e.target.value as 'cashfree' | 'razorpay' | 'direct' }))}
                          className="w-full text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                        >
                          <option value="cashfree">Cashfree Payments (Recommended)</option>
                          <option value="razorpay">Razorpay</option>
                          <option value="direct">Direct Bank Payment</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cashfree App ID / Client Key
                        </label>
                        <input 
                          type="text"
                          value={paymentForm.cashfreeAppId || ''}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cashfreeAppId: e.target.value }))}
                          placeholder="e.g. CF_LIVE_MRBUN_2026"
                          className="w-full text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input 
                        type="checkbox"
                        id="testMode"
                        checked={paymentForm.isTestMode}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, isTestMode: e.target.checked }))}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="testMode" className="text-xs text-slate-700 font-bold">
                        Enable Sandbox / Test Mode (No real charges will be deducted)
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Payment Settings Button */}
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment &amp; Gateway Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: CLOUDFLARE D1 ARCHITECTURE */}
        {activeTab === 'db' && (
          <div className="p-6 space-y-4 font-mono text-xs">
            <div className="bg-slate-900 text-amber-300 p-4 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-white text-sm">Edge D1 SQLite &amp; Worker Connection</p>
              <p>Database: <strong>mrbun</strong> (ID: 0b367436-034c-462f-8811-c1ac76ea2023)</p>
              <p>Binding: <strong>DB</strong> (env.DB.prepare)</p>
              <p>Subdomain: <strong>mrbun.ceansystech.workers.dev</strong></p>
              <p>Owner Contact: <strong>{settings.phone}</strong> • Email: <strong>{settings.email}</strong></p>
              <p>FSSAI License: <strong>{settings.fssaiLicense}</strong></p>
            </div>
          </div>
        )}

      </div>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 font-display">
                {editingProduct ? 'Edit Food Item' : 'Add New Food Item to Menu'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
                  <input 
                    type="text"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Truffle Mushroom Smash Burger"
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category || 'burgers'}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="burgers">🍔 Burgers</option>
                    <option value="pizzas">🍕 Pizzas</option>
                    <option value="sandwiches">🥪 Sandwiches</option>
                    <option value="mocktails">🍹 Mocktails</option>
                    <option value="sides">🍟 Sides</option>
                    <option value="combos">🎉 Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Type</label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="dietary"
                        checked={productForm.isVeg === true}
                        onChange={() => setProductForm(prev => ({ ...prev, isVeg: true }))}
                      />
                      <span>🟢 Veg</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-red-700 cursor-pointer ml-3">
                      <input 
                        type="radio"
                        name="dietary"
                        checked={productForm.isVeg === false}
                        onChange={() => setProductForm(prev => ({ ...prev, isVeg: false }))}
                      />
                      <span>🔴 Non-Veg</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input 
                    type="number"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹ - Optional strike)</label>
                  <input 
                    type="number"
                    value={productForm.originalPrice || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Image URL or File</label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      value={productForm.image || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer shrink-0 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                  <input 
                    type="text"
                    value={productTagInput}
                    onChange={(e) => setProductTagInput(e.target.value)}
                    placeholder="Brioche, Melted Cheese, Spicy"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={!!productForm.isPopular}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                    />
                    <span>Bestseller / Hot</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={!!productForm.isNew}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow"
                >
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT OFFER MODAL --- */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 font-display">
                {editingOffer ? 'Edit Offer Coupon' : 'Create New Offer Coupon'}
              </h3>
              <button 
                onClick={() => setIsOfferModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfferForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Promo Code</label>
                  <input 
                    type="text"
                    value={offerForm.code || ''}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. MRBUN50"
                    className="w-full text-xs font-mono font-black uppercase px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={offerForm.discountType || 'percentage'}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'flat' }))}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="percentage">Percentage OFF (%)</option>
                    <option value="flat">Direct Cash Benefit (Flat ₹)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Offer Title</label>
                  <input 
                    type="text"
                    value={offerForm.title || ''}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Flat ₹50 Instant Cash Discount"
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {offerForm.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Flat Cash Benefit (₹)'}
                  </label>
                  <input 
                    type="number"
                    value={offerForm.discountValue || ''}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    placeholder={offerForm.discountType === 'percentage' ? '20' : '50'}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Amount (₹)</label>
                  <input 
                    type="number"
                    value={offerForm.minOrderAmount || ''}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                    placeholder="299"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                {offerForm.discountType === 'percentage' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Discount Cap (₹ - Optional)</label>
                    <input 
                      type="number"
                      value={offerForm.maxDiscount || ''}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, maxDiscount: e.target.value ? Number(e.target.value) : undefined }))}
                      placeholder="e.g. 200"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={offerForm.description || ''}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="e.g. Save ₹50 direct cash on orders above ₹299"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox"
                    id="offerActiveCheck"
                    checked={offerForm.isActive ?? true}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="offerActiveCheck" className="text-xs font-bold text-slate-800">
                    Active immediately for customers
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT OUTLET MODAL --- */}
      {isOutletModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 font-display">
                {editingOutlet ? 'Edit Outlet' : 'Add New Outlet Location'}
              </h3>
              <button 
                onClick={() => setIsOutletModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutletForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Outlet Name</label>
                  <input 
                    type="text"
                    value={outletForm.name || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Mr Bun Express - Cyber Tech Hub"
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Format / Service Type</label>
                  <input 
                    type="text"
                    value={outletForm.type || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="e.g. Dine-In • Takeaway • Live Counter"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={outletForm.status || 'Open Now'}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, status: e.target.value as Outlet['status'] }))}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Open Now">Open Now</option>
                    <option value="Late Night Available">Late Night Available</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Renovating">Renovating</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                  <input 
                    type="text"
                    value={outletForm.address || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. Plot 42, Food Court Boulevard, Sector 4"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Landmark</label>
                  <input 
                    type="text"
                    value={outletForm.landmark || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="e.g. Opposite City Center Mall"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input 
                    type="tel"
                    value={outletForm.phone || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 9476088111"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operating Timings</label>
                  <input 
                    type="text"
                    value={outletForm.timings || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, timings: e.target.value }))}
                    placeholder="e.g. 11:00 AM – 01:00 AM"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input 
                    type="text"
                    value={outletForm.seatingCapacity || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, seatingCapacity: e.target.value }))}
                    placeholder="e.g. 65 Guests"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amenities / Features (Comma-separated)</label>
                  <input 
                    type="text"
                    value={outletFeaturesInput}
                    onChange={(e) => setOutletFeaturesInput(e.target.value)}
                    placeholder="Free Wi-Fi, Valet Parking, Private Party Hall, Live Grill"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Outlet Photo URL</label>
                  <input 
                    type="url"
                    value={outletForm.image || ''}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox"
                    id="flagshipOutletCheck"
                    checked={!!outletForm.isFlagship}
                    onChange={(e) => setOutletForm(prev => ({ ...prev, isFlagship: e.target.checked }))}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="flagshipOutletCheck" className="text-xs font-bold text-slate-800">
                    Mark as Flagship Diner (Featured on Outlets Page)
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOutletModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow"
                >
                  Save Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
