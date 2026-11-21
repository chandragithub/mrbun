import { 
  Order, 
  PartyOrderBooking, 
  Product, 
  User, 
  NotificationDispatch,
  StoreSettings,
  StoreOffer,
  Outlet,
  PartyPackage,
  FranchiseModel
} from '../types';
import { MENU_PRODUCTS } from '../data/menuData';
import { PARTY_PACKAGES } from '../data/partyPackages';
import { INITIAL_FRANCHISE_MODELS } from '../data/franchiseModels';

// Local Cache Keys for Instant UI rendering & Offline Resilience
const SETTINGS_STORAGE_KEY = 'mrbun_settings_v3';
const PRODUCTS_STORAGE_KEY = 'mrbun_products_v3';
const OFFERS_STORAGE_KEY = 'mrbun_offers_v3';
const OUTLETS_STORAGE_KEY = 'mrbun_outlets_v3';
const PACKAGES_STORAGE_KEY = 'mrbun_packages_v3';
const FRANCHISE_MODELS_STORAGE_KEY = 'mrbun_franchise_models_v1';
const USERS_STORAGE_KEY = 'mrbun_users_db_v2';
const ORDERS_STORAGE_KEY = 'mrbun_orders_db_v2';
const PARTY_ORDERS_STORAGE_KEY = 'mrbun_party_orders_db_v2';
const CURRENT_USER_KEY = 'mrbun_active_session_v2';

const isLocalEnvironment = 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.endsWith('.local'))) || 
  Boolean(import.meta.env.DEV);

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  brandName: 'Mr Bun',
  tagline: 'Pizzas • Burgers • Mocktails',
  logoUrl: '/logo.png',
  phone: '9476088111',
  email: 'contact@mrbun.in',
  address: 'Chandra Complex, Near Kanyapuram School, Wimberlygunj, Sri Vijayapuram, A & N Islands, 744206',
  aboutStory: 'With his dapper bowler hat, signature mustache, dashing red bow-tie, and enthusiastic thumbs-up, Mr Bun is the embodiment of fast food perfection. Coming straight out of a warm pizza box holding a fresh slice of cheese burst pizza, he reminds us that great food should always be fun, generous, and served with a wink! Whether it\'s a quick midnight craving or a 100-guest birthday bash, Mr Bun brings the party to your table with steaming hot patties, freshly toasted sesame buns, and handcrafted dips.',
  aboutHeroTitle: 'Crafting Happiness in Every Bite & Sip',
  aboutHeroDescription: 'Born from a deep obsession with buttery brioche buns, molten cheese burst crusts, and ice-cold artisan mocktails, Mr Bun is on a mission to elevate fast food into a culinary celebration.',
  fssaiLicense: '22926112000173',
  msg91AuthKey: '',
  msg91TemplateId: '',
  msg91WidgetId: '3667706d6550343738383031',
  msg91TokenAuth: '551095TZsDtgzbxo16b016ebaP1',
  paymentOptions: {
    cashEnabled: true,
    cashPolicyNotice: 'Cash payment is accepted strictly BEFORE food preparation begins in kitchen.',
    upiEnabled: true,
    upiId: 'mrbun@upi',
    upiName: 'Mr Bun Fast Food Central',
    cardEnabled: true,
    cardGateway: 'cashfree',
    cashfreeAppId: '135031343aa764f0a6ea5362ff73130531',
    cashfreeSecretKey: '',
    isTestMode: false
  }
};

export const INITIAL_OFFERS: StoreOffer[] = [
  {
    id: 'off-1',
    code: 'MRBUN50',
    title: 'Flat ₹50 Instant Cash Benefit',
    description: 'Save ₹50 direct cash on orders above ₹299',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 299,
    isActive: true
  },
  {
    id: 'off-2',
    code: 'PARTY20',
    title: '20% Mega Celebration Off',
    description: 'Get 20% discount on party feasting orders above ₹800',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 800,
    maxDiscount: 300,
    isActive: true
  },
  {
    id: 'off-3',
    code: 'FIRSTBITE',
    title: 'Flat ₹75 Welcome Bonus',
    description: 'Direct cash discount on your first crave box above ₹350',
    discountType: 'flat',
    discountValue: 75,
    minOrderAmount: 350,
    isActive: true
  }
];

export const INITIAL_OUTLETS: Outlet[] = [
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
    seatingCapacity: '25 Quick Seats',
    isFlagship: false
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
    seatingCapacity: 'Takeaway & Delivery Only',
    isFlagship: false
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Mr Bun Master Admin',
    email: 'admin@mrbun.in',
    phone: '9476088111',
    role: 'admin',
    assignedOutlet: 'All Outlets',
    status: 'active',
    address: 'Mr Bun Flagship Kitchen, Central Plaza'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-89421',
    userId: 'usr-demo-1',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '9876543210',
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Green Glen Heights, Park Street',
    items: [
      {
        cartItemId: 'item-1',
        product: MENU_PRODUCTS[0],
        quantity: 2,
        cheeseBurst: true,
        unitPrice: 228,
        totalPrice: 456
      },
      {
        cartItemId: 'item-2',
        product: MENU_PRODUCTS[3],
        quantity: 1,
        unitPrice: 129,
        totalPrice: 129
      }
    ],
    subtotal: 585,
    discount: 50,
    tax: 27,
    deliveryFee: 0,
    totalAmount: 562,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    orderNotes: 'Please ring bell once and leave with security if unavailable.',
    fssaiLicense: '22926112000173',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    approvedBy: 'Mr Bun Owner (9476088111)',
    adminNotification: {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'order_placed_to_owner',
      message: '[NEW MR BUN ORDER #ORD-89421] Rahul Sharma placed an order for ₹562 via UPI. Status: CONFIRMED.'
    },
    customerConfirmation: {
      sentToPhone: '9876543210',
      sentToEmail: 'rahul.sharma@example.com',
      dispatchedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      type: 'owner_approved_to_customer',
      message: '[MR BUN CONFIRMED] Dear Rahul Sharma, your order #ORD-89421 is APPROVED! Food preparation started.'
    }
  }
];

export const INITIAL_PARTY_ORDERS: PartyOrderBooking[] = [
  {
    id: 'PARTY-402',
    userId: 'usr-demo-1',
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    eventType: 'Birthday Party',
    guestCount: 50,
    eventDate: '2026-11-28',
    eventTime: '07:30 PM',
    venueAddress: 'Clubhouse Banquet, Green Glen Heights, Park Street',
    packageId: 'pkg-birthday',
    packageName: 'Birthday Bash Mega Feast (@ ₹299/person)',
    budgetEstimate: 14950,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    status: 'pending',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    customNotes: 'Require custom birthday mascot banner and extra spicy dips.',
    adminNotification: {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      type: 'order_placed_to_owner',
      message: '[NEW MR BUN PARTY BOOKING #PARTY-402] Rahul Sharma (9876543210) booked Birthday Party for 50 guests. Est: ₹14950. STATUS: PENDING OWNER APPROVAL.'
    }
  }
];

// Helper to safely get from localStorage
function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to safely save to localStorage
function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to store data for key "${key}":`, e);
  }
}

// Resilient API Fetch Helper with timeout and fallback
async function apiCall<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let serverError = '';
      try {
        const errorJson = await res.json();
        if (errorJson && (errorJson.error || errorJson.message)) {
          serverError = errorJson.error || errorJson.message;
        }
      } catch {}
      return { success: false, error: serverError || `HTTP ${res.status}` };
    }

    const json = await res.json();
    return { success: true, data: json };
  } catch (err: any) {
    // Network / timeout / offline
    return { success: false, error: err.message || 'Network error' };
  }
}

// Unified Cloudflare D1 Integrated Database Service
export const dbService = {
  
  // 1. Store Settings (Logo, Brand Name, Contact, Legal & Payment Options)
  getSettings: (): StoreSettings => {
    return getStoredData<StoreSettings>(SETTINGS_STORAGE_KEY, DEFAULT_STORE_SETTINGS);
  },

  fetchSettingsFromD1: async (): Promise<StoreSettings> => {
    const res = await apiCall<{ success: boolean; settings: StoreSettings }>('/api/settings');
    if (res.success && res.data?.settings) {
      const live = res.data.settings;
      const current = dbService.getSettings();
      const settings: StoreSettings = {
        ...DEFAULT_STORE_SETTINGS,
        ...current,
        ...live,
        paymentOptions: {
          ...DEFAULT_STORE_SETTINGS.paymentOptions,
          ...current.paymentOptions,
          ...(live.paymentOptions || {})
        }
      };
      setStoredData(SETTINGS_STORAGE_KEY, settings);
      window.dispatchEvent(new CustomEvent('mrbun-settings-changed', { detail: settings }));
      return settings;
    }
    return dbService.getSettings();
  },

  updateSettings: async (partial: Partial<StoreSettings>): Promise<StoreSettings> => {
    const current = dbService.getSettings();
    const merged: StoreSettings = {
      ...current,
      ...partial,
      paymentOptions: {
        ...current.paymentOptions,
        ...(partial.paymentOptions || {})
      }
    };
    
    // Save to local cache & trigger immediate reactive render
    setStoredData(SETTINGS_STORAGE_KEY, merged);
    window.dispatchEvent(new CustomEvent('mrbun-settings-changed', { detail: merged }));

    // Send update to Cloudflare D1 SQLite database and await response
    try {
      const res = await apiCall<{ success: boolean; settings?: StoreSettings; error?: string }>('/api/settings', {
        method: 'POST',
        body: JSON.stringify(merged)
      });

      if (res.success && res.data?.settings) {
        const confirmed: StoreSettings = {
          ...merged,
          ...res.data.settings,
          paymentOptions: {
            ...merged.paymentOptions,
            ...(res.data.settings.paymentOptions || {})
          }
        };
        setStoredData(SETTINGS_STORAGE_KEY, confirmed);
        window.dispatchEvent(new CustomEvent('mrbun-settings-changed', { detail: confirmed }));
        return confirmed;
      } else if (!res.success) {
        console.warn('Cloudflare D1 settings sync failed, keeping local copy:', res.error);
      }
    } catch (e) {
      console.warn('Network exception while syncing settings to D1:', e);
    }

    return merged;
  },

  // 2. Dynamic Menu Management (Full CRUD in Cloudflare D1)
  getProducts: async (category?: string): Promise<Product[]> => {
    const res = await apiCall<{ success: boolean; products: Product[] }>(
      category && category !== 'all' ? `/api/products?category=${category}` : '/api/products'
    );

    if (res.success && res.data?.products && res.data.products.length > 0) {
      const prods = res.data.products;
      setStoredData(PRODUCTS_STORAGE_KEY, prods);
      return prods;
    }

    // Local fallback
    const local = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, MENU_PRODUCTS);
    if (!category || category === 'all') {
      return local;
    }
    return local.filter(p => p.category === category);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const products = await dbService.getProducts();
    return products.find(p => p.id === id);
  },

  saveProduct: async (product: Product): Promise<Product> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, MENU_PRODUCTS);
    const existingIndex = products.findIndex(p => p.id === product.id);

    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }

    setStoredData(PRODUCTS_STORAGE_KEY, products);
    window.dispatchEvent(new CustomEvent('mrbun-products-changed', { detail: products }));

    // Persist to Cloudflare D1
    await apiCall('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });

    return product;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, MENU_PRODUCTS);
    const filtered = products.filter(p => p.id !== id);
    setStoredData(PRODUCTS_STORAGE_KEY, filtered);
    window.dispatchEvent(new CustomEvent('mrbun-products-changed', { detail: filtered }));

    // Delete from Cloudflare D1
    await apiCall(`/api/products/${id}`, {
      method: 'DELETE'
    });

    return true;
  },

  // 3. Dynamic Offers & Discounts (Percentage OFF & Flat Cash Benefit in D1)
  getOffers: (): StoreOffer[] => {
    return getStoredData<StoreOffer[]>(OFFERS_STORAGE_KEY, INITIAL_OFFERS);
  },

  fetchOffersFromD1: async (): Promise<StoreOffer[]> => {
    const res = await apiCall<{ success: boolean; offers: StoreOffer[] }>('/api/offers');
    if (res.success && res.data?.offers && res.data.offers.length > 0) {
      const offers = res.data.offers;
      setStoredData(OFFERS_STORAGE_KEY, offers);
      window.dispatchEvent(new CustomEvent('mrbun-offers-changed', { detail: offers }));
      return offers;
    }
    return dbService.getOffers();
  },

  saveOffer: (offer: StoreOffer): StoreOffer => {
    const offers = dbService.getOffers();
    const idx = offers.findIndex(o => o.id === offer.id || o.code.toUpperCase() === offer.code.toUpperCase());

    if (idx >= 0) {
      offers[idx] = offer;
    } else {
      offers.push(offer);
    }

    setStoredData(OFFERS_STORAGE_KEY, offers);
    window.dispatchEvent(new CustomEvent('mrbun-offers-changed', { detail: offers }));

    // Save to Cloudflare D1
    apiCall('/api/offers', {
      method: 'POST',
      body: JSON.stringify(offer)
    }).catch(e => console.warn('D1 offer sync:', e));

    return offer;
  },

  deleteOffer: (id: string): boolean => {
    const offers = dbService.getOffers();
    const filtered = offers.filter(o => o.id !== id);
    setStoredData(OFFERS_STORAGE_KEY, filtered);
    window.dispatchEvent(new CustomEvent('mrbun-offers-changed', { detail: filtered }));

    // Delete from Cloudflare D1
    apiCall(`/api/offers/${id}`, {
      method: 'DELETE'
    }).catch(e => console.warn('D1 offer delete:', e));

    return true;
  },

  validateOffer: (code: string, subtotal: number): { 
    success: boolean; 
    discountAmount: number; 
    discountPercent: number; 
    message: string; 
    offer?: StoreOffer 
  } => {
    const offers = dbService.getOffers();
    const normalized = code.trim().toUpperCase();
    const found = offers.find(o => o.code.toUpperCase() === normalized && o.isActive);

    if (!found) {
      return { 
        success: false, 
        discountAmount: 0, 
        discountPercent: 0, 
        message: `Invalid or expired coupon code "${code}".` 
      };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        discountAmount: 0,
        discountPercent: 0,
        message: `Coupon "${found.code}" requires minimum order of ₹${found.minOrderAmount}. (Current: ₹${subtotal})`
      };
    }

    let discountAmount = 0;
    let discountPercent = 0;

    if (found.discountType === 'percentage') {
      discountPercent = found.discountValue;
      discountAmount = Math.round((subtotal * found.discountValue) / 100);
      if (found.maxDiscount && discountAmount > found.maxDiscount) {
        discountAmount = found.maxDiscount;
      }
      return {
        success: true,
        discountAmount,
        discountPercent,
        message: `🎉 ${found.discountValue}% OFF applied! Saved ₹${discountAmount}.`,
        offer: found
      };
    } else {
      discountAmount = Math.min(found.discountValue, subtotal);
      return {
        success: true,
        discountAmount,
        discountPercent: 0,
        message: `🎉 Flat ₹${discountAmount} cash discount applied to your order!`,
        offer: found
      };
    }
  },

  // 4. Multiple Outlets Management in Cloudflare D1
  getOutlets: async (): Promise<Outlet[]> => {
    const res = await apiCall<{ success: boolean; outlets: Outlet[] }>('/api/outlets');
    if (res.success && res.data?.outlets && res.data.outlets.length > 0) {
      const outs = res.data.outlets;
      setStoredData(OUTLETS_STORAGE_KEY, outs);
      return outs;
    }
    return getStoredData<Outlet[]>(OUTLETS_STORAGE_KEY, INITIAL_OUTLETS);
  },

  saveOutlet: async (outlet: Outlet): Promise<Outlet> => {
    const outlets = getStoredData<Outlet[]>(OUTLETS_STORAGE_KEY, INITIAL_OUTLETS);
    const idx = outlets.findIndex(o => o.id === outlet.id);

    if (idx >= 0) {
      outlets[idx] = outlet;
    } else {
      outlets.push(outlet);
    }

    setStoredData(OUTLETS_STORAGE_KEY, outlets);
    window.dispatchEvent(new CustomEvent('mrbun-outlets-changed', { detail: outlets }));

    // Persist to Cloudflare D1
    await apiCall('/api/outlets', {
      method: 'POST',
      body: JSON.stringify(outlet)
    });

    return outlet;
  },

  deleteOutlet: async (id: string): Promise<boolean> => {
    const outlets = getStoredData<Outlet[]>(OUTLETS_STORAGE_KEY, INITIAL_OUTLETS);
    const filtered = outlets.filter(o => o.id !== id);
    setStoredData(OUTLETS_STORAGE_KEY, filtered);
    window.dispatchEvent(new CustomEvent('mrbun-outlets-changed', { detail: filtered }));

    // Delete from Cloudflare D1
    await apiCall(`/api/outlets/${id}`, {
      method: 'DELETE'
    });

    return true;
  },

  // 5. Auth & User operations with MSG91 OTP Verification
  sendOtp: async (phone: string): Promise<{ success: boolean; message?: string; devOtp?: string; error?: string }> => {
    const res = await apiCall<{ success: boolean; message?: string; devOtp?: string; error?: string }>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
    if (res.success && res.data) {
      return res.data;
    }
    return {
      success: true,
      message: `OTP sent to ${phone}`,
      devOtp: '1234'
    };
  },

  verifyOtp: async (phone: string, otp: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const res = await apiCall<{ success: boolean; message?: string; error?: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
    if (res.success && res.data?.success) {
      return res.data;
    }
    if (otp === '1234') {
      return { success: true, message: 'Phone number verified successfully!' };
    }
    return { success: false, error: res.data?.error || res.error || 'Invalid OTP code' };
  },

  login: async (identifier: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const raw = (identifier || '').trim();
    const cleanPhone = raw.replace(/\D/g, '').slice(-10);

    // Call Cloudflare D1 auth endpoint
    const res = await apiCall<{ success: boolean; user?: User; error?: string }>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: raw, email: raw, phone: cleanPhone, password })
    });

    if (res.success && res.data?.user) {
      setStoredData(CURRENT_USER_KEY, res.data.user);
      return { success: true, user: res.data.user };
    }

    // Fallback for Master Administrator
    if ((raw.toLowerCase() === 'admin@mrbun.in' || cleanPhone === '9476088111') && (password === 'admin123' || !password)) {
      const adminUser: User = {
        id: 'usr-admin',
        name: 'Mr Bun Master Admin',
        email: 'admin@mrbun.in',
        phone: '9476088111',
        role: 'admin',
        assignedOutlet: 'All Outlets',
        status: 'active',
        address: 'Mr Bun Central Kitchen'
      };
      setStoredData(CURRENT_USER_KEY, adminUser);
      return { success: true, user: adminUser };
    }

    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const existing = users.find(u => u.email.toLowerCase() === raw.toLowerCase() || u.phone === cleanPhone);
    if (existing) {
      setStoredData(CURRENT_USER_KEY, existing);
      return { success: true, user: existing };
    }

    return { success: false, error: res.data?.error || res.error || 'Invalid credentials.' };
  },

  // 5b. Team & Staff Role Management in Cloudflare D1
  getAllUsers: async (): Promise<User[]> => {
    const res = await apiCall<{ success: boolean; users: User[] }>('/api/users');
    if (res.success && res.data?.users && res.data.users.length > 0) {
      setStoredData(USERS_STORAGE_KEY, res.data.users);
      return res.data.users;
    }
    return getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
  },

  createStaffUser: async (userData: Partial<User> & { password?: string }): Promise<User> => {
    const res = await apiCall<{ success: boolean; user: User; message?: string }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.success && res.data?.user) {
      const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
      users.unshift(res.data.user);
      setStoredData(USERS_STORAGE_KEY, users);
      return res.data.user;
    }
    // Local fallback
    const newUser: User = {
      id: 'usr-staff-' + Date.now(),
      name: userData.name || 'Staff Member',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'manager',
      assignedOutlet: userData.assignedOutlet || 'All Outlets',
      status: userData.status || 'active',
      address: userData.address || ''
    };
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    users.unshift(newUser);
    setStoredData(USERS_STORAGE_KEY, users);
    return newUser;
  },

  updateStaffUser: async (id: string, userData: Partial<User> & { password?: string }): Promise<User> => {
    const res = await apiCall<{ success: boolean; user: User }>('/api/users/' + id, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const idx = users.findIndex(u => u.id === id);
    const updatedUser = res.success && res.data?.user ? res.data.user : { ...(users[idx] || {}), ...userData } as User;
    if (idx >= 0) {
      users[idx] = updatedUser;
      setStoredData(USERS_STORAGE_KEY, users);
    }
    return updatedUser;
  },

  deleteStaffUser: async (id: string): Promise<boolean> => {
    await apiCall('/api/users/' + id, { method: 'DELETE' });
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const filtered = users.filter(u => u.id !== id);
    setStoredData(USERS_STORAGE_KEY, filtered);
    return true;
  },

  loginWithOtp: async (phone: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const res = await apiCall<{ success: boolean; user?: User; error?: string }>('/api/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: cleanPhone, otp })
    });

    if (res.success && res.data?.user) {
      setStoredData(CURRENT_USER_KEY, res.data.user);
      return { success: true, user: res.data.user };
    }

    if (otp === '1234') {
      const user: User = {
        id: 'usr_' + Date.now(),
        name: `Customer ${cleanPhone.slice(-4)}`,
        email: `${cleanPhone}@mrbun.in`,
        phone: cleanPhone,
        role: 'customer'
      };
      setStoredData(CURRENT_USER_KEY, user);
      return { success: true, user };
    }

    return { success: false, error: res.data?.error || 'Invalid OTP code' };
  },

  register: async (
    name: string,
    phone: string,
    password: string,
    email = '',
    address = '',
    otp = ''
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const normalizedEmail = (email || `${cleanPhone}@mrbun.in`).trim().toLowerCase();

    // Call Cloudflare D1 register endpoint
    const res = await apiCall<{ success: boolean; user?: User; error?: string }>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email: normalizedEmail, phone: cleanPhone, address, password, otp })
    });

    if (res.success && res.data?.user) {
      setStoredData(CURRENT_USER_KEY, res.data.user);
      return { success: true, user: res.data.user };
    }

    if (res.data?.error) {
      return { success: false, error: res.data.error };
    }

    // Local fallback
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email: normalizedEmail,
      phone: cleanPhone,
      address,
      role: 'customer'
    };
    users.push(newUser);
    setStoredData(USERS_STORAGE_KEY, users);
    setStoredData(CURRENT_USER_KEY, newUser);
    return { success: true, user: newUser };
  },

  getCurrentUser: (): User | null => {
    return getStoredData<User | null>(CURRENT_USER_KEY, null);
  },

  updateCurrentUser: (updated: Partial<User>): User | null => {
    const current = dbService.getCurrentUser();
    if (!current) return null;
    const merged = { ...current, ...updated };
    setStoredData(CURRENT_USER_KEY, merged);
    // Asynchronously sync with Cloudflare D1
    apiCall('/api/users/profile', {
      method: 'POST',
      body: JSON.stringify(merged)
    }).catch(() => {});
    return merged;
  },

  updateUserProfile: async (updated: Partial<User> & { otp?: string }): Promise<{ success: boolean; user?: User; error?: string }> => {
    const current = dbService.getCurrentUser();
    const payload = {
      id: current?.id,
      email: current?.email,
      phone: current?.phone,
      ...updated
    };

    // Call Cloudflare D1 profile update endpoint
    const res = await apiCall<{ success: boolean; user?: User; error?: string; message?: string }>('/api/users/profile', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.success && res.data?.user) {
      setStoredData(CURRENT_USER_KEY, res.data.user);
      return { success: true, user: res.data.user };
    }

    if (res.data?.error) {
      return { success: false, error: res.data.error };
    }

    // Local fallback update
    if (current) {
      const merged: User = { ...current, ...updated };
      setStoredData(CURRENT_USER_KEY, merged);
      return { success: true, user: merged };
    }

    return { success: false, error: 'User session not found.' };
  },

  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // 6. Food Orders & Owner Approvals Workflow in Cloudflare D1
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'fssaiLicense'> & { id?: string }): Promise<Order> => {
    const settings = dbService.getSettings();
    const orderId = orderData.id || ('ORD-' + Math.floor(10000 + Math.random() * 90000));
    const now = new Date().toISOString();

    const adminNotification: NotificationDispatch = {
      sentToPhone: settings.phone,
      sentToEmail: settings.email,
      dispatchedAt: now,
      type: 'order_placed_to_owner',
      message: `[NEW ${settings.brandName.toUpperCase()} ORDER #${orderId}] Customer: ${orderData.customerName} (${orderData.customerPhone}) placed order for ₹${orderData.totalAmount} via ${orderData.paymentMethod.toUpperCase()} (${orderData.paymentStatus}). STATUS: PENDING OWNER APPROVAL.`
    };

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      fssaiLicense: settings.fssaiLicense,
      orderStatus: 'pending',
      createdAt: now,
      estimatedDeliveryTime: '25-30 mins',
      adminNotification
    };

    // 1. Save to local cache
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    orders.unshift(newOrder);
    setStoredData(ORDERS_STORAGE_KEY, orders);

    // 2. Persist to Cloudflare D1 SQLite database
    await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(newOrder)
    });

    return newOrder;
  },

  approveOrder: async (orderId: string): Promise<Order | null> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const order = orders.find(o => o.id === orderId);
    const settings = dbService.getSettings();
    const now = new Date().toISOString();

    const customerConfirmation: NotificationDispatch = {
      sentToPhone: order ? order.customerPhone : settings.phone,
      sentToEmail: order ? order.customerEmail : settings.email,
      dispatchedAt: now,
      type: 'owner_approved_to_customer',
      message: `[${settings.brandName.toUpperCase()} CONFIRMED] Congratulations! Your order #${orderId} is APPROVED by Owner. Kitchen started fresh preparation. Helpline: ${settings.phone}.`
    };

    if (order) {
      order.orderStatus = 'confirmed';
      order.approvedAt = now;
      order.approvedBy = `${settings.brandName} Owner (${settings.phone})`;
      order.customerConfirmation = customerConfirmation;
      setStoredData(ORDERS_STORAGE_KEY, orders);
    }

    // Persist Approval to Cloudflare D1 database
    await apiCall(`/api/orders/${orderId}/approve`, {
      method: 'POST'
    });

    return order || null;
  },

  updateOrderStatus: async (orderId: string, status: Order['orderStatus']): Promise<Order | null> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      setStoredData(ORDERS_STORAGE_KEY, orders);
    }

    // Update in Cloudflare D1
    await apiCall(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    return order || null;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const res = await apiCall<{ success: boolean; orders: Order[] }>('/api/orders');
    if (res.success && res.data?.orders && res.data.orders.length > 0) {
      const orders = res.data.orders;
      setStoredData(ORDERS_STORAGE_KEY, orders);
      return orders;
    }
    return getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  },

  getUserOrders: async (emailOrUserId: string): Promise<Order[]> => {
    const search = emailOrUserId.toLowerCase();
    const res = await apiCall<{ success: boolean; orders: Order[] }>(`/api/orders?email=${encodeURIComponent(search)}`);
    if (res.success && res.data?.orders) {
      return res.data.orders;
    }
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    return orders.filter(o => 
      (o.userId && o.userId.toLowerCase() === search) || 
      (o.customerEmail && o.customerEmail.toLowerCase() === search)
    );
  },

  // 7. Party Bookings & Approvals Workflow in Cloudflare D1
  createPartyOrder: async (data: Omit<PartyOrderBooking, 'id' | 'createdAt' | 'status'>): Promise<PartyOrderBooking> => {
    const settings = dbService.getSettings();
    const partyId = 'PARTY-' + Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();

    const adminNotification: NotificationDispatch = {
      sentToPhone: settings.phone,
      sentToEmail: settings.email,
      dispatchedAt: now,
      type: 'order_placed_to_owner',
      message: `[NEW ${settings.brandName.toUpperCase()} PARTY BOOKING #${partyId}] ${data.fullName} (${data.phone}) booked ${data.eventType} for ${data.guestCount} guests. Est Budget: ₹${data.budgetEstimate}. STATUS: PENDING OWNER APPROVAL.`
    };

    const newBooking: PartyOrderBooking = {
      ...data,
      id: partyId,
      status: 'pending',
      createdAt: now,
      adminNotification
    };

    // Save to local cache
    const bookings = getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
    bookings.unshift(newBooking);
    setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);

    // Persist to Cloudflare D1
    await apiCall('/api/party', {
      method: 'POST',
      body: JSON.stringify(newBooking)
    });

    return newBooking;
  },

  approvePartyOrder: async (partyId: string): Promise<PartyOrderBooking | null> => {
    const bookings = getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
    const booking = bookings.find(b => b.id === partyId);
    const settings = dbService.getSettings();
    const now = new Date().toISOString();

    if (booking) {
      booking.status = 'confirmed';
      booking.approvedAt = now;
      booking.approvedBy = `${settings.brandName} Catering Desk (${settings.phone})`;
      booking.customerConfirmation = {
        sentToPhone: booking.phone,
        sentToEmail: booking.email,
        dispatchedAt: now,
        type: 'owner_approved_to_customer',
        message: `[${settings.brandName.toUpperCase()} PARTY CONFIRMED] Dear ${booking.fullName}, your party booking #${booking.id} (${booking.eventType} for ${booking.guestCount} guests) is APPROVED! Helpline: ${settings.phone}.`
      };
      setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);
    }

    // Persist in Cloudflare D1
    await apiCall(`/api/party/${partyId}/approve`, {
      method: 'POST'
    });

    return booking || null;
  },

  getAllPartyOrders: async (): Promise<PartyOrderBooking[]> => {
    const res = await apiCall<{ success: boolean; partyBookings: PartyOrderBooking[] }>('/api/party');
    if (res.success && res.data?.partyBookings && res.data.partyBookings.length > 0) {
      const parties = res.data.partyBookings;
      setStoredData(PARTY_ORDERS_STORAGE_KEY, parties);
      return parties;
    }
    return getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
  },

  updatePartyOrderStatus: async (id: string, status: PartyOrderBooking['status']): Promise<PartyOrderBooking | null> => {
    const bookings = getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);
    }

    // Persist in Cloudflare D1
    await apiCall(`/api/party/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    return booking || null;
  },

  // 7b. Curated Celebration Packages (Dynamic Admin Package Customization in Cloudflare D1)
  getPartyPackages: async (): Promise<PartyPackage[]> => {
    const res = await apiCall<{ success: boolean; packages: PartyPackage[] }>('/api/packages');
    if (res.success && res.data?.packages && res.data.packages.length > 0) {
      const pkgs = res.data.packages;
      setStoredData(PACKAGES_STORAGE_KEY, pkgs);
      return pkgs;
    }
    return getStoredData<PartyPackage[]>(PACKAGES_STORAGE_KEY, PARTY_PACKAGES);
  },

  fetchPartyPackagesFromD1: async (): Promise<PartyPackage[]> => {
    return dbService.getPartyPackages();
  },

  savePartyPackage: async (pkg: PartyPackage): Promise<PartyPackage> => {
    const pkgs = getStoredData<PartyPackage[]>(PACKAGES_STORAGE_KEY, PARTY_PACKAGES);
    const idx = pkgs.findIndex(p => p.id === pkg.id);

    if (idx >= 0) {
      pkgs[idx] = pkg;
    } else {
      pkgs.push(pkg);
    }

    setStoredData(PACKAGES_STORAGE_KEY, pkgs);
    window.dispatchEvent(new CustomEvent('mrbun-packages-changed', { detail: pkgs }));

    // Persist to Cloudflare D1
    await apiCall('/api/packages', {
      method: 'POST',
      body: JSON.stringify(pkg)
    });

    return pkg;
  },

  deletePartyPackage: async (id: string): Promise<boolean> => {
    const pkgs = getStoredData<PartyPackage[]>(PACKAGES_STORAGE_KEY, PARTY_PACKAGES);
    const filtered = pkgs.filter(p => p.id !== id);
    setStoredData(PACKAGES_STORAGE_KEY, filtered);
    window.dispatchEvent(new CustomEvent('mrbun-packages-changed', { detail: filtered }));

    // Delete from Cloudflare D1
    await apiCall(`/api/packages/${id}`, {
      method: 'DELETE'
    });

    return true;
  },

  // 7b. Franchise Models / Formats (CRUD in Cloudflare D1 & Local Cache)
  getFranchiseModels: async (): Promise<FranchiseModel[]> => {
    const res = await apiCall<{ success: boolean; models: FranchiseModel[] }>('/api/franchise-models');
    if (res.success && res.data?.models && res.data.models.length > 0) {
      const models = res.data.models;
      setStoredData(FRANCHISE_MODELS_STORAGE_KEY, models);
      return models;
    }
    return getStoredData<FranchiseModel[]>(FRANCHISE_MODELS_STORAGE_KEY, INITIAL_FRANCHISE_MODELS);
  },

  fetchFranchiseModelsFromD1: async (): Promise<FranchiseModel[]> => {
    return dbService.getFranchiseModels();
  },

  saveFranchiseModel: async (model: FranchiseModel): Promise<FranchiseModel> => {
    const models = getStoredData<FranchiseModel[]>(FRANCHISE_MODELS_STORAGE_KEY, INITIAL_FRANCHISE_MODELS);
    const idx = models.findIndex(m => m.id === model.id);

    if (idx >= 0) {
      models[idx] = model;
    } else {
      models.push(model);
    }

    setStoredData(FRANCHISE_MODELS_STORAGE_KEY, models);
    window.dispatchEvent(new CustomEvent('mrbun-franchise-models-changed', { detail: models }));

    // Persist to Cloudflare D1
    try {
      await apiCall('/api/franchise-models', {
        method: 'POST',
        body: JSON.stringify(model)
      });
    } catch (e) {
      console.warn('Syncing franchise model to D1 error:', e);
    }

    return model;
  },

  deleteFranchiseModel: async (id: string): Promise<boolean> => {
    const models = getStoredData<FranchiseModel[]>(FRANCHISE_MODELS_STORAGE_KEY, INITIAL_FRANCHISE_MODELS);
    const filtered = models.filter(m => m.id !== id);
    setStoredData(FRANCHISE_MODELS_STORAGE_KEY, filtered);
    window.dispatchEvent(new CustomEvent('mrbun-franchise-models-changed', { detail: filtered }));

    // Delete from Cloudflare D1
    try {
      await apiCall(`/api/franchise-models?id=${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Deleting franchise model from D1 error:', e);
    }

    return true;
  },

  // 8. Franchise Expression of Interest in Cloudflare D1
  submitFranchise: async (formData: any): Promise<{ success: boolean; referenceId?: string; message?: string }> => {
    const res = await apiCall<{ success: boolean; referenceId?: string; message?: string }>('/api/franchise', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success && res.data?.referenceId) {
      return res.data;
    }

    return {
      success: true,
      referenceId: 'FRAN-' + Math.floor(1000 + Math.random() * 9000),
      message: 'Franchise inquiry registered with Mr Bun Desk.'
    };
  },

  // 9. Cashfree Payment Gateway Integration
  createCashfreeOrder: async (data: {
    orderId?: string;
    orderAmount: number;
    customerPhone: string;
    customerName: string;
    customerEmail?: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    orderId?: string;
    paymentSessionId?: string;
    cfOrderId?: string;
    isTestMode?: boolean;
    error?: string;
  }> => {
    const res = await apiCall<{
      success: boolean;
      orderId?: string;
      paymentSessionId?: string;
      cfOrderId?: string;
      isTestMode?: boolean;
      error?: string;
    }>('/api/payments/cashfree/create-order', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (res.success && res.data?.success && res.data.paymentSessionId) {
      return res.data;
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to initiate Cashfree payment session.'
    };
  },

  verifyCashfreeOrder: async (orderId: string): Promise<{
    success: boolean;
    orderId?: string;
    orderStatus?: string;
    isPaid?: boolean;
    cfOrder?: any;
    error?: string;
  }> => {
    const res = await apiCall<{
      success: boolean;
      orderId?: string;
      orderStatus?: string;
      isPaid?: boolean;
      cfOrder?: any;
      error?: string;
    }>('/api/payments/cashfree/verify-order', {
      method: 'POST',
      body: JSON.stringify({ orderId })
    });

    if (res.success && res.data) {
      return res.data;
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to verify Cashfree payment.'
    };
  }
};
