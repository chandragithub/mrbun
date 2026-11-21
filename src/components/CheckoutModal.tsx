import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  ArrowRight,
  AlertTriangle,
  Lock,
  PhoneCall,
  CheckCircle2,
  Mail,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
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
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { settings } = useSettings();
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

  const paymentOpts = settings.paymentOptions || {
    cashEnabled: true,
    cashPolicyNotice: 'Cash payment is accepted strictly BEFORE food preparation begins in kitchen.',
    upiEnabled: true,
    upiId: '9552030559@ybl',
    upiName: 'Mr Bun Fast Food Central',
    cardEnabled: true,
    cardGateway: 'cashfree',
    cashfreeAppId: '',
    isTestMode: false
  };

  const defaultMethod = paymentOpts.upiEnabled ? 'upi' : (paymentOpts.cardEnabled ? 'card' : 'cod');

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>(defaultMethod);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Sync with user profile whenever user details update
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
    }
  }, [user]);

  if (!isOpen) return null;

  // 1. Authentication Gate: User MUST be logged in to order
  if (!isAuthenticated || !user) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
        <div 
          className="relative bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 text-center space-y-5 animate-in zoom-in-95 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              Login Required to Order
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Mr Bun requires customers to login before ordering so the kitchen owner can verify payment, dispatch SMS/Email receipts, and send instant status updates.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <span>Sign In to Continue Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                openAuthModal('register');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition"
            >
              Create New Mr Bun Account
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            FSSAI Lic: 22926112000173 • Phone Support: 9476088111
          </p>
        </div>
      </div>
    );
  }

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
        userId: user.id,
        customerName: name,
        customerEmail: email || user.email,
        customerPhone: phone || user.phone,
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
        orderStatus: 'pending', // Starts as pending until owner approves!
        orderNotes: orderNotes.trim() || undefined
      });

      clearCart();
      setPlacedOrder(createdOrder);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please call 9476088111.');
    } finally {
      setIsPlacing(false);
    }
  };

  const handleFinish = () => {
    if (placedOrder) {
      onOrderSuccess(placedOrder);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black">
              {placedOrder ? 'Order Placed • Awaiting Owner Approval' : 'Checkout & Delivery Details'}
            </h2>
            <p className="text-xs text-amber-100">
              Customer: <strong>{user.name}</strong> • Helpline: 9476088111
            </p>
          </div>
          <button
            onClick={placedOrder ? handleFinish : onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {placedOrder ? (
          /* Confirmation View detailing owner notification and pending approval */
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full uppercase tracking-wider">
                Ticket: {placedOrder.id}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 font-display">
                Order Sent to Mr Bun Owner!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
                Thank you <strong>{placedOrder.customerName}</strong>! Your order has been placed with status <strong className="text-amber-700 uppercase">PENDING</strong>.
              </p>
            </div>

            {/* Notification Dispatch Receipt */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-left text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold border-b border-amber-200/80 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Order Details Dispatched to Owner</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-100">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Owner Phone / SMS: <strong className="font-mono text-slate-800">9476088111</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-100">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Owner Email: <strong className="font-mono text-slate-800">contact@mrbun.in</strong></span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Payment Method:</strong> {placedOrder.paymentMethod.toUpperCase()} ({placedOrder.paymentStatus === 'paid' ? 'Verified Online' : 'Cash before prep'})</p>
                <p>• <strong>Total Amount:</strong> ₹{placedOrder.totalAmount}</p>
                <p>• <strong>Next Step:</strong> As soon as the owner approves in the admin kitchen portal, a confirmation SMS will be sent to <strong>{placedOrder.customerPhone}</strong> and email to <strong>{placedOrder.customerEmail}</strong>, and status will update to <strong className="text-emerald-700">CONFIRMED</strong>!</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Track Live Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:9476088111"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Owner: 9476088111</span>
              </a>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handlePlaceOrder} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            
            {/* Customer Info */}
            <div>
              <h3 className="text-xs font-extrabold uppercase text-amber-800 tracking-wider mb-2">
                1. Recipient Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Name
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
                    Mobile Phone (For Approval SMS &amp; Delivery)
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
                  Email Address (For Confirmation &amp; Invoice)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  required
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
                      placeholder="e.g. Flat 402, Green Glen Heights, Park Street"
                      rows={2}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
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
                      placeholder="e.g. Opposite City Mall, Near Metro Gate 2"
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Cooking / Delivery Instructions
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Extra oregano, do not ring bell, deliver piping hot"
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <h3 className="text-xs font-extrabold uppercase text-amber-800 tracking-wider mb-2">
                3. Select Payment Mode
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* UPI Option */}
                {paymentOpts.upiEnabled && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Instant</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">UPI Online Pay</p>
                      <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                    </div>
                  </button>
                )}

                {/* Card Option */}
                {paymentOpts.cardEnabled && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                        {paymentOpts.cardGateway === 'cashfree' ? 'Cashfree' : 'Cards'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">
                        {paymentOpts.cardGateway === 'cashfree' ? 'Cashfree Payments' : 'Card / NetBanking'}
                      </p>
                      <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </button>
                )}

                {/* COD Option with Strict Cash Policy Notice */}
                {paymentOpts.cashEnabled && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20'
                        : 'border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Banknote className="w-5 h-5 text-red-600" />
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">Policy</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">Cash Payment</p>
                      <p className="text-[10px] text-red-700 font-semibold">Pay before prep starts</p>
                    </div>
                  </button>
                )}

              </div>

              {/* UPI Simulated QR Code preview if UPI selected */}
              {paymentMethod === 'upi' && paymentOpts.upiEnabled && (
                <div className="mt-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-xs border border-amber-200 flex items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-amber-800" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">{paymentOpts.upiName || `${settings.brandName} Instant Online UPI`}</p>
                    <p className="text-slate-500 text-[11px]">UPI ID: <span className="font-mono font-bold text-amber-900">{paymentOpts.upiId || 'mrbun@upi'}</span></p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">✓ Instant owner alert upon payment confirmation</p>
                  </div>
                </div>
              )}

              {/* Online Card preview */}
              {paymentMethod === 'card' && paymentOpts.cardEnabled && (
                <div className="mt-3 bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">
                      {paymentOpts.cardGateway === 'cashfree' ? 'Secured by Cashfree Payments' : 'Secure Online 256-Bit SSL Payment'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports all major Indian Debit &amp; Credit Cards, NetBanking{paymentOpts.isTestMode ? ' [Sandbox Test Mode Active]' : ''}.
                    </p>
                  </div>
                </div>
              )}

              {/* Strict Cash Policy Alert */}
              {paymentMethod === 'cod' && paymentOpts.cashEnabled && (
                <div className="mt-3 bg-red-50 p-3.5 rounded-2xl border-2 border-red-300 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-red-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>⚠️ Cash Payment Mandatory Policy</span>
                  </div>
                  <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                    {paymentOpts.cashPolicyNotice || 'Cash payment is accepted strictly BEFORE food preparation begins in kitchen.'}
                  </p>
                </div>
              )}
            </div>

            {/* Total Pay & Place Order Button */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-slate-600 font-medium">Final Payable Amount:</span>
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
                  <span>Dispatching order to kitchen owner...</span>
                ) : (
                  <>
                    <span>Confirm Order &amp; Pay ₹{totalAmount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>FSSAI: 22926112000173 • Owner Contact: 9476088111 • contact@mrbun.in</span>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
export default CheckoutModal;
