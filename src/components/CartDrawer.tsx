import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Check, 
  Bike, 
  Store,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discount,
    deliveryFee,
    tax,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryType,
    setDeliveryType
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (code: string) => {
    setCouponError(null);
    setCouponSuccess(null);
    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setInputCoupon('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-amber-100">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Your Fast Food Bag</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in craving list
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery or Pickup Toggle */}
          <div className="px-5 pt-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
                  deliveryType === 'delivery'
                    ? 'bg-white text-amber-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-4 h-4 text-amber-600" />
                <span>Express Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
                  deliveryType === 'pickup'
                    ? 'bg-white text-amber-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4 text-amber-600" />
                <span>Store Takeaway</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                  🍔
                </div>
                <h3 className="text-base font-bold text-slate-800">Your bag is empty!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add some delicious pizza, smash burgers, or mocktails from our menu to get started.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3 p-3 bg-amber-50/40 rounded-2xl border border-amber-100 hover:border-amber-200 transition"
                >
                  {/* Item Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-red-500 transition p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Custom options pills */}
                    <div className="text-[11px] text-slate-500 space-y-0.5 mt-0.5">
                      {item.selectedSize && <div>Size: <span className="font-semibold text-slate-700">{item.selectedSize}</span></div>}
                      {item.selectedBun && <div>Bun/Crust: <span className="font-semibold text-slate-700">{item.selectedBun}</span></div>}
                      {item.cheeseBurst && (
                        <span className="inline-block bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded text-[10px]">
                          + Cheese Burst 🧀
                        </span>
                      )}
                      {item.notes && <div className="italic text-slate-400 text-[10px]">"{item.notes}"</div>}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-amber-200/40">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-amber-950 font-display">
                        ₹{item.totalPrice}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}

            {/* Coupons Section */}
            {items.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Promo Codes &amp; Offers</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2 rounded-xl text-xs text-emerald-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon <strong>{appliedCoupon}</strong> Applied!</span>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="Enter MRBUN50 or FIRSTBITE"
                      className="flex-1 text-xs px-3 py-1.5 uppercase font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleApplyCoupon(inputCoupon)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponError && <p className="text-[11px] text-red-500 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}

                {/* Quick chip suggestions */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      onClick={() => handleApplyCoupon('MRBUN50')}
                      className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md transition"
                    >
                      MRBUN50 (₹50 OFF)
                    </button>
                    <button
                      onClick={() => handleApplyCoupon('FIRSTBITE')}
                      className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md transition"
                    >
                      FIRSTBITE (₹75 OFF)
                    </button>
                    <button
                      onClick={() => handleApplyCoupon('PARTY20')}
                      className="text-[10px] font-bold bg-red-100 hover:bg-red-200 text-red-900 px-2 py-0.5 rounded-md transition"
                    >
                      PARTY20 (20% OFF)
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Drawer Footer & Bill Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-amber-100 bg-white space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Savings</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-black text-slate-900">
                  <span>To Pay:</span>
                  <span className="text-amber-700 font-display">₹{totalAmount}</span>
                </div>
              </div>

              {subtotal < 399 && deliveryType === 'delivery' && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-lg text-center font-medium">
                  Add ₹{399 - subtotal} more to get <strong>FREE delivery</strong>! 🚀
                </p>
              )}

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black">₹{totalAmount}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
