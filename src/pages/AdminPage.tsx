import React, { useState, useEffect } from 'react';
import { 
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
  Server,
  Lock,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { Order, PartyOrderBooking, OrderStatus } from '../types';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, login, openAuthModal } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'parties' | 'db'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [parties, setParties] = useState<PartyOrderBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Quick login state if user is not admin
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

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

  const handleAdminQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await login('admin@mrbun.in', adminPassword || 'admin123');
    if (!res.success) {
      setAuthError('Invalid credentials. (Hint: password is "admin123")');
    } else {
      loadData();
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const activeOrders = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
  const todayRevenue = orders
    .filter((o) => {
      const d = new Date(o.createdAt);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    })
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // If user is not admin, show dedicated Admin Login Gateway
  if (!isAdmin && user?.email !== 'admin@mrbun.in') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Mr Bun Kitchen &amp; Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Restricted access for kitchen staff, catering managers &amp; store administrators.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminQuickLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username / Email
              </label>
              <input
                type="email"
                defaultValue="admin@mrbun.in"
                readOnly
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Passcode
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password (e.g. admin123)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg"
            >
              Unlock Admin Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setAdminPassword('admin123');
              }}
              className="text-[11px] font-bold text-amber-700 hover:underline"
            >
              Fill Demo Admin Password (admin123)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner & Company Compliance Info */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Cloudflare D1 Live Connected
            </span>
            <span className="font-mono text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full font-bold">
              FSSAI: 22926112000173
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight mt-2">
            Mr Bun Central Kitchen &amp; Store Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time kitchen order dispatch, bulk party inquiries, and Cloudflare D1 serverless database management.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live DB</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales Volume</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-display">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ Across {orders.length} orders</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Kitchen Orders</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-display">
            {activeOrders.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Pending dispatch/baking</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Party / Bulk Inquiries</p>
          <p className="text-2xl sm:text-3xl font-black text-red-600 mt-1 font-display">
            {parties.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">High-ticket bulk feasts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SQLite DB Binding</p>
          <p className="text-base font-black text-slate-800 mt-1 font-mono truncate">
            mrbun-db (D1)
          </p>
          <p className="text-[11px] text-blue-600 font-bold mt-1">Edge serverless runtime</p>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Fast Food Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('parties')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'parties'
                ? 'border-red-600 text-red-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PartyPopper className="w-4 h-4 text-red-600" />
            <span>Bulk &amp; Party Bookings ({parties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'db'
                ? 'border-blue-600 text-blue-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>Cloudflare D1 Schema &amp; SQL</span>
          </button>
        </div>

        {/* Tab 1: Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by Order ID, name or phone..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="all">All Statuses</option>
                  <option value="received">Received</option>
                  <option value="preparing">Preparing</option>
                  <option value="baking">Baking</option>
                  <option value="out_for_delivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm">No orders matching your criteria.</p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition bg-white shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                          {ord.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{ord.customerName}</h3>
                        <a href={`tel:${ord.customerPhone}`} className="text-xs text-amber-700 font-bold hover:underline">
                          📞 {ord.customerPhone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-amber-950 font-display">
                          ₹{ord.totalAmount}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                          {ord.paymentMethod.toUpperCase()} • {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Details row */}
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                      <p><strong>Destination:</strong> {ord.deliveryAddress}</p>
                      <p>
                        <strong>Items:</strong> {ord.items.map((i) => `${i.quantity}x ${i.product.name}${i.cheeseBurst ? ' (+Cheese)' : ''}`).join(', ')}
                      </p>
                      {ord.orderNotes && (
                        <p className="text-amber-900 font-semibold italic"><strong>Instructions:</strong> {ord.orderNotes}</p>
                      )}
                    </div>

                    {/* Status updater */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400 mr-1">Kitchen Stage:</span>
                      {(['received', 'preparing', 'baking', 'out_for_delivery', 'delivered'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(ord.id, st)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-xl uppercase transition ${
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Party Orders Tab */}
        {activeTab === 'parties' && (
          <div className="p-6 space-y-4">
            {parties.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm">No party inquiries recorded yet.</p>
            ) : (
              parties.map((pt) => (
                <div
                  key={pt.id}
                  className="p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-red-600 text-white px-2.5 py-1 rounded-lg">
                        {pt.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{pt.fullName}</h3>
                      <a href={`tel:${pt.phone}`} className="text-xs text-emerald-700 font-bold hover:underline">
                        📞 {pt.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-red-700 font-display">
                        ₹{pt.budgetEstimate.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {pt.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <p><strong>Occasion:</strong> {pt.eventType} • <strong>Guests:</strong> {pt.guestCount} Persons</p>
                    <p><strong>Package:</strong> {pt.packageName}</p>
                    <p><strong>Date &amp; Time:</strong> {pt.eventDate} @ {pt.eventTime}</p>
                    <p><strong>Venue Address:</strong> {pt.venueAddress}</p>
                    {pt.customNotes && (
                      <p className="text-amber-900 font-semibold"><strong>Dietary &amp; Special Notes:</strong> {pt.customNotes}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-400">Update Booking Status:</span>
                    {(['inquiry_received', 'confirmed', 'catering_scheduled', 'completed'] as PartyOrderBooking['status'][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdatePartyStatus(pt.id, st)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-xl uppercase transition ${
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
        )}

        {/* Tab 3: Cloudflare D1 Architecture */}
        {activeTab === 'db' && (
          <div className="p-6 space-y-4 font-mono text-xs">
            <div className="bg-slate-900 text-amber-300 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Server className="w-5 h-5 text-amber-400" />
                <span>Cloudflare Wrangler &amp; D1 Database Configuration</span>
              </div>
              <p className="text-slate-300">
                Bound to D1 SQLite database <code>mrbun-db</code>. Deployable with zero server maintenance.
              </p>
              <div className="bg-black/60 p-4 rounded-xl text-slate-200 text-xs overflow-x-auto space-y-1">
                <p># Initialize D1 SQLite Database:</p>
                <p className="text-amber-400">npx wrangler d1 create mrbun-db</p>
                <p className="mt-2"># Execute Initial Tables Schema:</p>
                <p className="text-amber-400">npx wrangler d1 execute mrbun-db --file=./schema.sql</p>
                <p className="mt-2"># Deploy Edge Workers to Cloudflare Pages:</p>
                <p className="text-amber-400">npx wrangler pages deploy dist</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Active SQLite Schema Tables:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">TABLE orders</p>
                  <p className="text-[11px] text-slate-500">id, customer_name, customer_email, items_json, total_amount, order_status, fssai_license</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">TABLE party_orders</p>
                  <p className="text-[11px] text-slate-500">id, full_name, event_type, guest_count, event_date, budget_estimate, status</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">TABLE users</p>
                  <p className="text-[11px] text-slate-500">id, name, email, phone, address, role, created_at</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">TABLE products</p>
                  <p className="text-[11px] text-slate-500">id, name, category, price, is_veg, spicy_level, rating, image</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminPage;
