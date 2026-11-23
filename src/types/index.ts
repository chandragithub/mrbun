export type CategoryType = 'all' | 'burgers' | 'pizzas' | 'sandwiches' | 'mocktails' | 'sides' | 'combos';

export interface Product {
  id: string;
  name: string;
  category: 'burgers' | 'pizzas' | 'sandwiches' | 'mocktails' | 'sides' | 'combos';
  description: string;
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  rating: number;
  reviewsCount: number;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  tags?: string[];
  options?: {
    size?: { name: string; extraPrice: number }[];
    crustOrBun?: { name: string; extraPrice: number }[];
    addCheeseBurst?: number;
    extraPattyOrTopping?: number;
  };
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedBun?: string;
  cheeseBurst?: boolean;
  extraTopping?: boolean;
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type UserRole = 'owner' | 'manager' | 'waiter' | 'delivery_partner' | 'cleaner' | 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatarUrl?: string;
  role: UserRole;
  assignedOutlet?: string;
  status?: 'active' | 'inactive' | 'on_leave';
  createdAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'baking' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'received';

export interface NotificationDispatch {
  sentToPhone: string;
  sentToEmail: string;
  dispatchedAt: string;
  message: string;
  type: 'order_placed_to_owner' | 'owner_approved_to_customer';
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'upi' | 'card';
  paymentStatus: 'pending' | 'paid';
  orderStatus: OrderStatus;
  orderNotes?: string;
  fssaiLicense: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  adminNotification?: NotificationDispatch;
  customerConfirmation?: NotificationDispatch;
  approvedAt?: string;
  approvedBy?: string;
}

export interface PartyPackage {
  id: string;
  title: string;
  tagline: string;
  minGuests: number;
  price: number;
  priceType: 'per_plate' | 'fixed'; // 'per_plate' (e.g. ₹299/person) or 'fixed' (e.g. ₹4,999 lump sum)
  pricePerGuest?: number; // legacy backward compatibility
  badge?: string;
  image: string;
  includes: string[]; // List of package features / inclusions
  recommendedFor?: string;
  popularItems?: string[];
}

export interface PartyOrderBooking {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  guestCount: number;
  eventDate: string;
  eventTime: string;
  venueAddress: string;
  packageId?: string;
  packageName?: string;
  customNotes?: string;
  budgetEstimate: number;
  paymentMethod?: 'online' | 'upi' | 'cash_before_prep';
  paymentStatus?: 'pending' | 'paid';
  status: 'pending' | 'confirmed' | 'catering_scheduled' | 'inquiry_received' | 'completed' | 'cancelled';
  createdAt: string;
  adminNotification?: NotificationDispatch;
  customerConfirmation?: NotificationDispatch;
  approvedAt?: string;
  approvedBy?: string;
}

export interface StorePaymentOptions {
  cashEnabled: boolean;
  cashPolicyNotice: string;
  upiEnabled: boolean;
  upiId: string;
  upiName: string;
  cardEnabled: boolean;
  cardGateway: 'cashfree' | 'razorpay' | 'direct';
  cashfreeAppId?: string;
  cashfreeSecretKey?: string;
  isTestMode: boolean;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  aboutStory: string;
  aboutHeroTitle: string;
  aboutHeroDescription: string;
  fssaiLicense: string;
  msg91AuthKey?: string;
  msg91TemplateId?: string;
  msg91WidgetId?: string;
  msg91TokenAuth?: string;
  paymentOptions: StorePaymentOptions;
}

export interface StoreOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat'; // 'percentage' e.g. 20% OFF or 'flat' direct cash benefit e.g. ₹50 OFF
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  isActive: boolean;
}

export interface Outlet {
  id: string;
  name: string;
  type: string;
  address: string;
  landmark: string;
  phone: string;
  timings: string;
  status: 'Open Now' | 'Late Night Available' | 'Coming Soon' | 'Renovating';
  image: string;
  features: string[];
  seatingCapacity: string;
  isFlagship?: boolean;
}

export interface FranchiseModel {
  id: string;
  title: string;
  badge: string;
  area: string; // Space Required (e.g. '250 – 450 sq ft')
  investment: string; // Approx. Investment (e.g. '₹12 – 18 Lakhs')
  roi: string; // Expected ROI (e.g. '10 – 14 Months')
  desc: string; // Description
  highlights: string[]; // List of bullet points
  orderIndex?: number;
  isActive?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  sentToEmail: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

