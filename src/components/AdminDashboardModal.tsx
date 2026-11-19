import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  ShoppingBag, 
  PartyPopper, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Flame, 
  Bike, 
  TrendingUp, 
  RefreshCw,
  Phone,
  Server
} from 'lucide-react';
import { dbService } from '../services/db';
import { Order, PartyOrderBooking, OrderStatus } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'parties' | 'db'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [parties, setParties] = useState<PartyOrderBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allOrders = await dbService.getAllOrders();
      setOrders(allOrders);
      const allParties = await dbService.getAllPartyOrders();
      setParties(allParties);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await dbService.updateOrderStatus(orderId, status);
    loadData();
  };

  const handleUpdatePartyStatus = async (partyId: string, status: PartyOrderBooking['status']) => {
    await dbService.updatePartyOrderStatus(partyId, status);
    loadData();
  };

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const activeOrders = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">Mr Bun Admin &amp; Kitchen Control</h2>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Cloudflare D1 SQLite Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Helpline: 9476088111 • contact@mrbun.in • FSSAI: 22926112000173
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Refresh DB"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Sales</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Active Kitchen Orders</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{activeOrders.length}</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Party Inquiries</p>
            <p className="text-xl font-black text-red-400 mt-0.5">{parties.length}</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">DB Binding</p>
            <p className="text-xs font-mono font-bold text-blue-300 mt-1">D1: mrbun-db</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Fast Food Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'parties'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PartyPopper className="w-4 h-4 text-red-500" />
            <span>Party Bookings ({parties.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'db'
                ? 'border-blue-600 text-blue-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>Cloudflare D1 SQLite Schema</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'orders' ? (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">No orders recorded in database.</p>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition bg-white shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          {ord.id}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{ord.customerName}</span>
                        <span className="text-xs text-slate-500">({ord.customerPhone})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-amber-950">₹{ord.totalAmount}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Address & Items */}
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                      <p><strong>Address:</strong> {ord.deliveryAddress}</p>
                      <p><strong>Items:</strong> {ord.items.map((i) => `${i.quantity}x ${i.product.name}${i.cheeseBurst ? ' (+Cheese)' : ''}`).join(', ')}</p>
                      {ord.orderNotes && <p className="text-amber-800 italic"><strong>Notes:</strong> {ord.orderNotes}</p>}
                    </div>

                    {/* Status Changer Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">Update Status:</span>
                      
                      {(['received', 'preparing', 'baking', 'out_for_delivery', 'delivered'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(ord.id, st)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase transition ${
                            ord.orderStatus === st
                              ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'parties' ? (
            <div className="space-y-4">
              {parties.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">No party inquiries yet.</p>
              ) : (
                parties.map((pt) => (
                  <div
                    key={pt.id}
                    className="p-4 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                          {pt.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{pt.fullName}</h4>
                        <span className="text-xs text-slate-500">({pt.phone})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-red-700">₹{pt.budgetEstimate.toLocaleString()}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {pt.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <p><strong>Occasion:</strong> {pt.eventType} • <strong>Guests:</strong> {pt.guestCount}</p>
                      <p><strong>Package:</strong> {pt.packageName}</p>
                      <p><strong>Date &amp; Time:</strong> {pt.eventDate} @ {pt.eventTime}</p>
                      <p><strong>Venue Address:</strong> {pt.venueAddress}</p>
                      {pt.customNotes && <p className="text-amber-900"><strong>Dietary / Notes:</strong> {pt.customNotes}</p>}
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Update Status:</span>
                      {(['inquiry_received', 'confirmed', 'catering_scheduled', 'completed'] as PartyOrderBooking['status'][]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdatePartyStatus(pt.id, st)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase transition ${
                            pt.status === st
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs text-slate-800">
              <div className="bg-slate-900 text-amber-300 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Server className="w-4 h-4 text-amber-400" />
                  <span>Cloudflare Wrangler &amp; D1 Database Binding</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Configured in <code>wrangler.toml</code> with D1 SQLite database <code>mrbun-db</code>.
                </p>
                <div className="bg-black/50 p-3 rounded-xl text-slate-300 text-[11px] overflow-x-auto">
                  <code>
                    npx wrangler d1 execute mrbun-db --file=./schema.sql<br />
                    npx wrangler pages deploy dist
                  </code>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Active SQLite Tables:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><code>users</code> (id, name, email, phone, role, created_at)</li>
                  <li><code>products</code> (id, name, category, price, is_veg, rating, image)</li>
                  <li><code>orders</code> (id, customer_name, items_json, total_amount, order_status, fssai_license)</li>
                  <li><code>party_orders</code> (id, full_name, event_type, guest_count, budget_estimate, status)</li>
                  <li><code>reviews</code> (id, customer_name, rating, comment)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Mr Bun Enterprise Kitchen Panel</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-xl font-bold transition"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
