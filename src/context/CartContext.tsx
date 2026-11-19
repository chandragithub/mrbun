import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      selectedSize?: string;
      selectedBun?: string;
      cheeseBurst?: boolean;
      extraTopping?: boolean;
      notes?: string;
      extraPrice?: number;
    }
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  couponCode: string;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mrbun_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [couponFlatDiscount, setCouponFlatDiscount] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    options?: {
      quantity?: number;
      selectedSize?: string;
      selectedBun?: string;
      cheeseBurst?: boolean;
      extraTopping?: boolean;
      notes?: string;
      extraPrice?: number;
    }
  ) => {
    const qty = options?.quantity || 1;
    const basePrice = product.price;
    const extraPrice = options?.extraPrice || 0;
    const unitPrice = basePrice + extraPrice;

    // Unique key for same product with exact same customizations
    const customKey = `${product.id}_${options?.selectedSize || 'def'}_${options?.selectedBun || 'def'}_${options?.cheeseBurst ? 'cb' : 'ncb'}_${options?.extraTopping ? 'xt' : 'nxt'}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === customKey);
      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        const newQty = existing.quantity + qty;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.unitPrice
        };
        return next;
      } else {
        const newItem: CartItem = {
          cartItemId: customKey,
          product,
          quantity: qty,
          selectedSize: options?.selectedSize,
          selectedBun: options?.selectedBun,
          cheeseBurst: options?.cheeseBurst,
          extraTopping: options?.extraTopping,
          notes: options?.notes,
          unitPrice,
          totalPrice: qty * unitPrice
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: nextQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setCouponFlatDiscount(0);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'MRBUN50') {
      if (subtotal < 299) {
        return { success: false, message: 'MRBUN50 requires a minimum order of ₹299' };
      }
      setAppliedCoupon('MRBUN50');
      setCouponFlatDiscount(50);
      setCouponDiscountPercent(0);
      return { success: true, message: 'Woohoo! ₹50 flat discount applied!' };
    } else if (normalized === 'PARTY20') {
      if (subtotal < 800) {
        return { success: false, message: 'PARTY20 requires minimum order of ₹800' };
      }
      setAppliedCoupon('PARTY20');
      setCouponDiscountPercent(20);
      setCouponFlatDiscount(0);
      return { success: true, message: 'Party Mode On! 20% discount applied!' };
    } else if (normalized === 'FIRSTBITE') {
      setAppliedCoupon('FIRSTBITE');
      setCouponFlatDiscount(75);
      setCouponDiscountPercent(0);
      return { success: true, message: 'Welcome to Mr Bun! ₹75 discount applied!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try MRBUN50 or FIRSTBITE' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponFlatDiscount(0);
    setCouponDiscountPercent(0);
  };

  const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  let discount = 0;
  if (couponFlatDiscount > 0) {
    discount = Math.min(subtotal, couponFlatDiscount);
  } else if (couponDiscountPercent > 0) {
    discount = Math.round((subtotal * couponDiscountPercent) / 100);
  }

  const deliveryFee = deliveryType === 'pickup' || subtotal >= 399 || items.length === 0 ? 0 : 35;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const tax = taxableSubtotal > 0 ? Math.round(taxableSubtotal * 0.05) : 0; // 5% GST
  const totalAmount = Math.max(0, taxableSubtotal + tax + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        subtotal,
        discount,
        deliveryFee,
        tax,
        totalAmount,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryType,
        setDeliveryType
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
