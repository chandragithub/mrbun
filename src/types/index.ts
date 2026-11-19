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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'customer' | 'admin';
}

export type OrderStatus = 'received' | 'preparing' | 'baking' | 'out_for_delivery' | 'delivered' | 'cancelled';

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
}

export interface PartyPackage {
  id: string;
  title: string;
  tagline: string;
  minGuests: number;
  pricePerGuest: number;
  badge?: string;
  image: string;
  includes: string[];
  recommendedFor: string;
  popularItems: string[];
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
  status: 'inquiry_received' | 'confirmed' | 'catering_scheduled' | 'completed';
  createdAt: string;
}
