import { Order, PartyOrderBooking, Product, User, NotificationDispatch } from '../types';
import { MENU_PRODUCTS } from '../data/menuData';

const USERS_STORAGE_KEY = 'mrbun_users_db_v2';
const ORDERS_STORAGE_KEY = 'mrbun_orders_db_v2';
const PARTY_ORDERS_STORAGE_KEY = 'mrbun_party_orders_db_v2';
const CURRENT_USER_KEY = 'mrbun_active_session_v2';

// Pre-seeded initial users
const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Mr Bun Owner',
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

// Pre-seeded initial orders demonstrating the exact workflow:
// 1. Pending (Awaiting Owner Approval)
// 2. Confirmed (Approved by Owner, confirmation sent)
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-91204',
    userId: 'user_foodie',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '9876543210',
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Green Glen Heights, Park Street',
    items: [
      {
        cartItemId: 'item-1',
        product: MENU_PRODUCTS[0], // Mr Bun Brioche Smash Burger
        quantity: 2,
        selectedSize: 'Double Patty Deluxe',
        cheeseBurst: true,
        unitPrice: 289,
        totalPrice: 578
      },
      {
        cartItemId: 'item-2',
        product: MENU_PRODUCTS[8], // Electric Blue Lagoon Mocktail
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
    orderStatus: 'pending', // Awaiting owner approval!
    orderNotes: 'Deliver hot, please call on arrival',
    fssaiLicense: '22926112000173',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '25-30 mins',
    adminNotification: {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'order_placed_to_owner',
      message: '[NEW ORDER #ORD-91204] Rahul Sharma (9876543210) paid ₹806.80 via UPI. Address: Flat 402, Green Glen Heights. Status: PENDING OWNER APPROVAL.'
    }
  },
  {
    id: 'ORD-88210',
    userId: 'user_foodie',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '9876543210',
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Green Glen Heights, Park Street',
    items: [
      {
        cartItemId: 'item-3',
        product: MENU_PRODUCTS[3], // Cheesy Overload Margherita
        quantity: 1,
        selectedSize: 'Medium (10" - 6 Slices)',
        cheeseBurst: true,
        unitPrice: 389,
        totalPrice: 389
      }
    ],
    subtotal: 389,
    discount: 0,
    tax: 19.45,
    deliveryFee: 40,
    totalAmount: 448.45,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'confirmed', // Already approved!
    fssaiLicense: '22926112000173',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '20 mins',
    approvedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    approvedBy: 'Mr Bun Owner (9476088111)',
    adminNotification: {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'order_placed_to_owner',
      message: '[NEW ORDER #ORD-88210] Rahul Sharma (9876543210) paid ₹448.45 via CARD.'
    },
    customerConfirmation: {
      sentToPhone: '9876543210',
      sentToEmail: 'rahul@example.com',
      dispatchedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      type: 'owner_approved_to_customer',
      message: '[MR BUN CONFIRMED] Your order #ORD-88210 was APPROVED by Owner! Kitchen is preparing your hot cheesy meal.'
    }
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
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'pending',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    adminNotification: {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      type: 'order_placed_to_owner',
      message: '[NEW PARTY BOOKING #PARTY-401] Birthday Party for 25 guests by Rahul Sharma (9876543210). Est: ₹7,475. Awaiting Owner Approval.'
    }
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
    const users = getStoredData<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
    const normalizedEmail = email.trim().toLowerCase();
    
    // Quick demo handling: if admin
    if (normalizedEmail === 'admin@mrbun.in' && (password === 'admin123' || !password)) {
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
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();

    const itemsSummary = orderData.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ');

    // Automatic message dispatch to Owner Phone (9476088111) and Email (contact@mrbun.in)
    const adminNotification: NotificationDispatch = {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: now,
      type: 'order_placed_to_owner',
      message: `[NEW MR BUN ORDER #${orderId}] Customer: ${orderData.customerName} (${orderData.customerPhone}) placed an order for ₹${orderData.totalAmount} via ${orderData.paymentMethod.toUpperCase()} (${orderData.paymentStatus}). Items: ${itemsSummary}. Address: ${orderData.deliveryAddress}. STATUS: PENDING OWNER APPROVAL. Please log in to approve.`
    };

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      fssaiLicense: '22926112000173',
      orderStatus: 'pending', // Starts in pending until owner approves!
      createdAt: now,
      estimatedDeliveryTime: '25-30 mins',
      adminNotification
    };

    orders.unshift(newOrder);
    setStoredData(ORDERS_STORAGE_KEY, orders);
    return newOrder;
  },

  // Owner Approval action:
  // Changes status from pending -> confirmed, and sends confirmation message to customer phone and email
  approveOrder: async (orderId: string): Promise<Order | null> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    order.orderStatus = 'confirmed';
    order.approvedAt = now;
    order.approvedBy = 'Mr Bun Owner (9476088111)';

    // Confirmation message sent to customer phone and email
    order.customerConfirmation = {
      sentToPhone: order.customerPhone,
      sentToEmail: order.customerEmail,
      dispatchedAt: now,
      type: 'owner_approved_to_customer',
      message: `[MR BUN CONFIRMED] Congratulations ${order.customerName}! Your order #${order.id} (₹${order.totalAmount}) has been APPROVED by the Mr Bun Owner. Fresh kitchen preparation will start shortly. Track live at mrbun.in/orders. Helpline: 9476088111.`
    };

    setStoredData(ORDERS_STORAGE_KEY, orders);
    return order;
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
    const partyId = 'PARTY-' + Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();

    // Automatic message dispatch to Owner Phone (9476088111) and Email (contact@mrbun.in)
    const adminNotification: NotificationDispatch = {
      sentToPhone: '9476088111',
      sentToEmail: 'contact@mrbun.in',
      dispatchedAt: now,
      type: 'order_placed_to_owner',
      message: `[NEW MR BUN PARTY BOOKING #${partyId}] ${data.fullName} (${data.phone}) booked ${data.eventType} for ${data.guestCount} guests. Package: ${data.packageName || 'Custom Feasts'}. Est Budget: ₹${data.budgetEstimate} via ${data.paymentMethod || 'ONLINE'}. STATUS: PENDING OWNER APPROVAL.`
    };

    const newBooking: PartyOrderBooking = {
      ...data,
      id: partyId,
      status: 'pending',
      createdAt: now,
      adminNotification
    };

    bookings.unshift(newBooking);
    setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);
    return newBooking;
  },

  approvePartyOrder: async (partyId: string): Promise<PartyOrderBooking | null> => {
    const bookings = getStoredData<PartyOrderBooking[]>(PARTY_ORDERS_STORAGE_KEY, INITIAL_PARTY_ORDERS);
    const booking = bookings.find(b => b.id === partyId);
    if (!booking) return null;

    const now = new Date().toISOString();
    booking.status = 'confirmed';
    booking.approvedAt = now;
    booking.approvedBy = 'Mr Bun Catering Desk (9476088111)';

    booking.customerConfirmation = {
      sentToPhone: booking.phone,
      sentToEmail: booking.email,
      dispatchedAt: now,
      type: 'owner_approved_to_customer',
      message: `[MR BUN PARTY CONFIRMED] Dear ${booking.fullName}, your party booking #${booking.id} (${booking.eventType} for ${booking.guestCount} guests on ${booking.eventDate}) is APPROVED by Mr Bun Owner! Our Head Chef will coordinate directly at ${booking.phone}. Helpline: 9476088111.`
    };

    setStoredData(PARTY_ORDERS_STORAGE_KEY, bookings);
    return booking;
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
