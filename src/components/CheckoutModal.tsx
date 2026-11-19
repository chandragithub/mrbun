import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { user } = useAuth();
  const {
    items,
    subtotal,
    discount,
    tax,
    deliveryFee,
    totalAmount,
    deliveryType,
    clearCart
  } = useCart();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (deliveryType === 'delivery' && !address)) {
      alert('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    setIsPlacing(true);
    try {
      const fullAddress = deliveryType === 'pickup' 
        ? 'Store Takeaway - Mr Bun Central Counter' 
        : `${address} ${landmark ? `(Landmark: ${landmark})` : ''}`.trim();

      const createdOrder = await dbService.createOrder({
        userId: user?.id,
        customerName: name,
        customerEmail: email || 'guest@mrbun.in',
        customerPhone: phone,
        deliveryType,
        deliveryAddress: fullAddress,
        items,
        subtotal,
        discount,
        tax,
        deliveryFee,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'received',
        orderNotes: orderNotes.trim() || undefined
      });

      clearCart();
      onOrderSuccess(createdOrder);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please call 9476088111.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black">Checkout &amp; Delivery Details</h2>
            <p className="text-xs text-amber-100">Mr Bun Fast Food • FSSAI: 22926112000173</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Customer Info */}
          <div>
            <h3 className="text-xs font-extrabold uppercase text-amber-800 tracking-wider mb-2">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone (For Delivery SMS / Call)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="mt-2.5">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address (For Invoice Copy)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryType === 'delivery' && (
            <div>
              <h3 className="text-xs font-extrabold uppercase text-amber-800 tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>2. Delivery Destination</span>
              </h3>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address / House or Flat No.
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Green Glen Heights, 12th Main Road"
                    rows={2}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite City Park, Behind Apollo Pharmacy"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Special Delivery Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Delivery &amp; Cooking Instructions
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Do not ring bell, leave at security desk, send extra oregano"
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <h3 className="text-xs font-extrabold uppercase text-amber-800 tracking-wider mb-2">
              3. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Fastest</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900">UPI / QR Scan</p>
                  <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                </div>
              </button>

              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">Cash</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-500">Pay at doorstep</p>
                </div>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">Cards</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
                  <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
              </button>

            </div>

            {/* UPI Simulated QR Code preview if UPI selected */}
            {paymentMethod === 'upi' && (
              <div className="mt-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-sm border border-amber-200 flex items-center justify-center shrink-0">
                  <QrCode className="w-10 h-10 text-amber-800" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Mr Bun Instant UPI Verified</p>
                  <p className="text-slate-500 text-[11px]">UPI ID: <span className="font-mono font-bold text-amber-900">mrbun@upi</span></p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">✓ Zero transaction charges</p>
                </div>
              </div>
            )}
          </div>

          {/* Total Pay & Place Order Button */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-slate-600 font-medium">Final Amount to Pay:</span>
              <span className="text-xl font-black text-amber-950 font-display">
                ₹{totalAmount}
              </span>
            </div>

            <button
              type="submit"
              disabled={isPlacing}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/25 transition transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPlacing ? (
                <span>Baking your order in kitchen...</span>
              ) : (
                <>
                  <span>Place Order • ₹{totalAmount}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FSSAI Lic: 22926112000173 • Helpline: 9476088111 • contact@mrbun.in</span>
          </div>

        </form>
      </div>
    </div>
  );
};
