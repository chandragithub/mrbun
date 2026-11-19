import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Receipt, PartyPopper, RefreshCw, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { Order, PartyOrderBooking } from '../types';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
  onOpenPartyModal: () => void;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
  onOpenPartyModal
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'parties'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [partyBookings, setPartyBookings] = useState<PartyOrderBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    }
  }, [isOpen, user]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">My Orders &amp; Celebrations</h2>
            <p className="text-xs text-amber-100">Signed in as {user?.name || user?.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
            aria-label="Close orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Food Delivery Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'parties'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5 text-red-500" />
            <span>Party Bookings ({partyBookings.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {activeTab === 'orders' ? (
            orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-4xl">🍔</p>
                <h3 className="text-base font-bold text-slate-800">No food orders found yet</h3>
                <p className="text-xs text-slate-500">Craving a hot burger or cheesy pizza? Order now!</p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <p className="text-sm font-black text-amber-950 mt-1">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-semibold text-slate-700">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                    </span>

                    <button
                      onClick={() => { onClose(); onTrackOrder(order); }}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            partyBookings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-4xl">🎉</p>
                <h3 className="text-base font-bold text-slate-800">No party bookings yet</h3>
                <p className="text-xs text-slate-500">Planning a birthday, office party or game night? Get up to 20% OFF!</p>
                <button
                  onClick={() => { onClose(); onOpenPartyModal(); }}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1.5 mx-auto"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Book Party Catering</span>
                </button>
              </div>
            ) : (
              partyBookings.map((party) => (
                <div
                  key={party.id}
                  className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        {party.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {party.eventType} • {party.guestCount} Guests
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                        {party.status.replace(/_/g, ' ')}
                      </span>
                      <p className="text-sm font-black text-amber-700 mt-1">
                        ₹{party.budgetEstimate.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl space-y-1">
                    <p><strong>Package:</strong> {party.packageName || 'Custom Buffet'}</p>
                    <p><strong>Date &amp; Time:</strong> {party.eventDate} @ {party.eventTime}</p>
                    <p><strong>Venue:</strong> {party.venueAddress}</p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px]">Contact desk: 9476088111</span>
                    <a
                      href="tel:9476088111"
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Manager</span>
                    </a>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FSSAI: 22926112000173</span>
          </span>
          <a href="mailto:contact@mrbun.in" className="hover:underline">
            contact@mrbun.in
          </a>
        </div>

      </div>
    </div>
  );
};
