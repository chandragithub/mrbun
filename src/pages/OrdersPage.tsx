import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Receipt, 
  PartyPopper, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  ShoppingBag, 
  CheckCircle2, 
  Mail, 
  AlertTriangle,
  UserCog
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { Order, PartyOrderBooking } from '../types';

interface OrdersPageProps {
  onTrackOrder: (order: Order) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onTrackOrder }) => {
  const { user, openAuthModal, openProfileModal } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'parties'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [partyBookings, setPartyBookings] = useState<PartyOrderBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userOrders = await dbService.getUserOrders(user.email);
      setOrders(userOrders);

      const allParties = await dbService.getAllPartyOrders();
      const userParties = allParties.filter(
        (p) => (p.email && p.email.toLowerCase() === user.email.toLowerCase()) || p.userId === user.id
      );
      setPartyBookings(userParties);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-amber-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
            🍔
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign in to View Your Orders</h2>
          <p className="text-xs text-slate-500">
            Track your freshly baked pizzas, smash burgers, and party bookings in real-time.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md"
          >
            Sign In with Email / Mobile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-amber-100 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-display">
            My Orders &amp; Celebrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{user.name || user.email}</strong> • Helpline: 9476088111
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 bg-white hover:bg-amber-50 text-slate-600 border border-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/menu')}
            className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition shadow-xs"
          >
            Order More Food
          </button>
        </div>
      </div>

      {/* User Profile & Settings Summary Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/40 shadow-inner flex items-center justify-center font-black text-xl shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name[0] : 'U'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">{user.name}</h2>
              <span className="text-[10px] bg-white/25 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                {user.role}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-amber-100 mt-0.5">
              <span>📞 +91 {user.phone}</span>
              <span>✉️ {user.email}</span>
            </div>
            {user.address && (
              <p className="text-[11px] text-amber-100/90 truncate max-w-md mt-0.5">
                📍 {user.address}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={openProfileModal}
          className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-1.5 shrink-0"
        >
          <UserCog className="w-4 h-4 text-amber-700" />
          <span>Edit Profile &amp; Address</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl shadow-xs p-1.5 gap-2 max-w-md text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Food Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('parties')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'parties'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PartyPopper className="w-4 h-4" />
          <span>Party Feasts ({partyBookings.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'orders' ? (
        orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 shadow-xs space-y-3">
            <p className="text-5xl">🍔</p>
            <h3 className="text-lg font-bold text-slate-800">You haven't placed an order yet!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Treat yourself to a delicious burger, hot cheesy pizza, or fresh mocktail.
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-3 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow"
            >
              Explore Delicious Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition space-y-4 shadow-xs ${
                  ord.orderStatus === 'pending'
                    ? 'border-2 border-amber-400 bg-amber-50/20'
                    : 'border-amber-100'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                        {ord.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus === 'paid' ? 'Paid Online' : 'Cash before prep'})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(ord.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase shadow-xs ${
                      ord.orderStatus === 'pending'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : ord.orderStatus === 'confirmed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-white'
                    }`}>
                      {ord.orderStatus === 'pending' ? '⏳ Pending Owner Approval' : ord.orderStatus === 'confirmed' ? '✅ Confirmed by Owner' : ord.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <p className="text-lg font-black text-amber-950 mt-1 font-display">
                      ₹{ord.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Workflow Status Explanation */}
                {ord.orderStatus === 'pending' ? (
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Awaiting Owner Approval &amp; Verification</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Order details have been dispatched to Owner Phone (9476088111) &amp; Email (contact@mrbun.in). As soon as the owner approves, your status will change to <strong>Confirmed</strong> and you will receive confirmation SMS!
                      </p>
                    </div>
                  </div>
                ) : ord.orderStatus === 'confirmed' ? (
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Order Approved by Owner!</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Confirmation message sent to your mobile ({ord.customerPhone}) &amp; email ({ord.customerEmail}). Kitchen staff is preparing your hot meal.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Items */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <span className="font-medium">
                        {item.quantity}x {item.product.name}
                        {item.selectedSize ? ` (${item.selectedSize})` : ''}
                        {item.cheeseBurst ? ' + Cheese Burst 🧀' : ''}
                      </span>
                      <span className="font-bold text-slate-800">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Footer details & Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate max-w-sm">{ord.deliveryAddress}</span>
                  </div>

                  <button
                    onClick={() => onTrackOrder(ord)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Track Live Delivery &amp; Messages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        partyBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100 shadow-xs space-y-3">
            <p className="text-5xl">🎉</p>
            <h3 className="text-lg font-bold text-slate-800">No party bookings registered yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Plan your next birthday, office party, or game night with Mr Bun and get up to 20% volume discounts!
            </p>
            <button
              onClick={() => navigate('/parties')}
              className="mt-3 bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-700 transition shadow flex items-center gap-1.5 mx-auto"
            >
              <PartyPopper className="w-4 h-4" />
              <span>Book Party Catering</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {partyBookings.map((pt) => (
              <div
                key={pt.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-red-100 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-50 pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs bg-red-100 text-red-800 px-2.5 py-1 rounded-lg">
                      {pt.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {pt.eventType} ({pt.guestCount} Guests)
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase shadow-xs ${
                      pt.status === 'pending'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {pt.status === 'pending' ? '⏳ Pending Owner Approval' : pt.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-lg font-black text-red-700 mt-1 font-display">
                      ₹{pt.budgetEstimate.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/60 p-3.5 rounded-2xl text-xs text-slate-600 space-y-1">
                  <p><strong>Package:</strong> {pt.packageName}</p>
                  <p><strong>Date &amp; Time:</strong> {pt.eventDate} @ {pt.eventTime}</p>
                  <p><strong>Venue Address:</strong> {pt.venueAddress}</p>
                  <p><strong>Payment Mode:</strong> {pt.paymentMethod ? pt.paymentMethod.toUpperCase() : 'ONLINE'}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Mr Bun Catering Desk: 9476088111</span>
                  <a
                    href="tel:9476088111"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Owner / Catering Manager</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
};
export default OrdersPage;
