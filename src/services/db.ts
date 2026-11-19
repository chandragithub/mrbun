import { Order, PartyOrderBooking, Product, User } from '../types';
import { MENU_PRODUCTS } from '../data/menuData';

const USERS_STORAGE_KEY = 'mrbun_users_db';
const ORDERS_STORAGE_KEY = 'mrbun_orders_db';
const PARTY_ORDERS_STORAGE_KEY = 'mrbun_party_orders_db';
const CURRENT_USER_KEY = 'mrbun_active_session';

// Pre-seeded initial users
const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Mr Bun Admin',
    email: 'admin@mrbun.in',
    phone: '9476088111',
    address: 'Mr Bun Central Kitchen, Main Food Court',
    role: 'admin'
  },
  {
    id: 'user_foodie',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    address: 'Flat 402, Green Glen Heights, Park Street',
    role: 'customer'
  }
];

// Pre-seeded initial orders for demo tracking
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-89421',
    userId: 'user_foodie',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '9876543210',
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Green Glen Heights, Park Street',
    items: [
      {
        cartItemId: 'item-1',
        product: MENU_PRODUCTS[0],
        quantity: 2,
        selectedSize: 'Double Patty Deluxe',
        cheeseBurst: true,
        unitPrice: 289,
        totalPrice: 578
      },
      {
        cartItemId: 'item-2',
        product: MENU_PRODUCTS[8], // Electric Blue Lagoon
        quantity: 2,
        unitPrice: 119,
        totalPrice: 238
      }
    ],
    subtotal: 816,
    discount: 50,
    tax: 40.8,
    deliveryFee: 0,
    totalAmount: 806.8,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'out_for_delivery',
    orderNotes: 'Please ring bell and leave with security if unavailable',
    fssaiLicense: '22926112000173',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '15 mins'
  }
];

const INITIAL_PARTY_ORDERS: PartyOrderBooking[] = [
  {
    id: 'PARTY-401',
    userId: 'user_foodie',
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@example.com',
    eventType: 'Birthday Party',
    guestCount: 25,
    eventDate: '2026-11-28',
    eventTime: '07:30 PM',
    venueAddress: 'Clubhouse Banquet Hall, Park Street',
    packageId: 'pkg-birthday',
    packageName: 'Birthday Bash Mega Feast',
    customNotes: 'Require 10 veg burgers and 15 non-veg burgers with custom Mr Bun banner.',
    budgetEstimate: 7475,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString()
  }
];

// Helper to get local data safely
function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Unified SQLite / Storage API
export const dbService = {
  // Product queries
  getProducts: async (category?: string): Promise<Product[]> => {
    // In production Cloudflare Workers with D1, this can query: `env.DB.prepare('SELECT * FROM products').all()`
    if (!category || category === 'all') {
      return MENU_PRODUCTS;
    }
    return MENU_PRODUCTS.filter(p => p.category === category);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    return MENU_PRODUCTS.find(p => p.id === id);
  },

  // Auth & User operations
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Demo logic: works with stored users or auto-allows login for quick customer test
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const normalizedEmail = email.trim().toLowerCase();
    
    // Quick demo handling: if admin
    if (normalizedEmail === 'admin@mrbun.in' && password === 'admin123') {
      const adminUser = users.find(u => u.email.toLowerCase() === normalizedEmail) || INITIAL_USERS[0];
      setStoredData(CURRENT_USER_KEY, adminUser);
      return { success: true, user: adminUser };
    }

    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      setStoredData(CURRENT_USER_KEY, existing);
      return { success: true, user: existing };
    }

    // Auto-create customer user if valid email for frictionless fast food order
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email: normalizedEmail,
      phone: '9476088111',
      role: 'customer'
    };
    users.push(newUser);
    setStoredData(USERS_STORAGE_KEY, users);
    setStoredData(CURRENT_USER_KEY, newUser);
    return { success: true, user: newUser };
  },

  register: async (name: string, email: string, phone: string, address?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const normalizedEmail = email.trim().toLowerCase();
    
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      existing.name = name;
      existing.phone = phone;
      if (address) existing.address = address;
      setStoredData(USERS_STORAGE_KEY, users);
      setStoredData(CURRENT_USER_KEY, existing);
      return { success: true, user: existing };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email: normalizedEmail,
      phone,
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
    
    // Also update in all users array
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx] = merged;
      setStoredData(USERS_STORAGE_KEY, users);
    }
    return merged;
  },

  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Orders operations
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'fssaiLicense'>): Promise<Order> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      fssaiLicense: '22926112000173',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-30 mins'
    };
    orders.unshift(newOrder);
    setStoredData(ORDERS_STORAGE_KEY, orders);
    return newOrder;
  },

  getUserOrders: async (emailOrUserId: string): Promise<Order[]> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const search = emailOrUserId.toLowerCase();
    return orders.filter(o => 
      (o.userId && o.userId.toLowerCase() === search) || 
      (o.customerEmail && o.customerEmail.toLowerCase() === search)
    );
  },

  getAllOrders: async (): Promise<Order[]> => {
    return getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
  },

  updateOrderStatus: async (orderId: string, status: Order['orderStatus']): Promise<Order | null> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      setStoredData(ORDERS_STORAGE_KEY, orders);
      return order;
    }
    return null;
  },

  // Party & Bulk Orders operations
  createPartyOrder: async (data: Omit<PartyOrderBooking, 'id' | 'createdAt' | 'status'>): Promise<PartyOrderBooking> => {
    const bookings = getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
    const newBooking: PartyOrderBooking = {
      ...data,
      id: 'PARTY-' + Math.floor(100 + Math.random() * 900),
      status: 'inquiry_received',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);
    return newBooking;
  },

  getAllPartyOrders: async (): Promise<PartyOrderBooking[]> => {
    return getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
  },

  updatePartyOrderStatus: async (id: string, status: PartyOrderBooking['status']): Promise<PartyOrderBooking | null> => {
    const bookings = getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);
      return booking;
    }
    return null;
  }
};
