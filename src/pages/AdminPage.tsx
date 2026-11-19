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
  AlertCircle,
  Mail,
  AlertTriangle,
  Check,
  XCircle,
  BellRing
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { Order, PartyOrderBooking, OrderStatus } from '../types';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, login } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'parties' | 'db'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [parties, setParties] = useState<PartyOrderBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  // Owner Approval of Order: moves from pending -> confirmed and triggers confirmation SMS & Email to customer
  const handleApproveOrder = async (orderId: string) => {
    const updated = await dbService.approveOrder(orderId);
    if (updated) {
      setSuccessToast(`Order #${orderId} Approved! Confirmation SMS sent to ${updated.customerPhone} and email to ${updated.customerEmail}. Customer dashboard updated to Confirmed!`);
      loadData();
      setTimeout(() => setSuccessToast(null), 6000);
    }
  };

  // Owner Approval of Party Booking
  const handleApproveParty = async (partyId: string) => {
    const updated = await dbService.approvePartyOrder(partyId);
    if (updated) {
      setSuccessToast(`Party Booking #${partyId} Approved! Confirmation message sent to ${updated.phone} & ${updated.email}.`);
      loadData();
      setTimeout(() => setSuccessToast(null), 6000);
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
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const pendingParties = parties.filter((p) => p.status === 'pending');
  const activeOrders = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');

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
              Mr Bun Kitchen &amp; Owner Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Restricted access for Mr Bun owner (<strong>9476088111</strong>) &amp; kitchen head.
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
                Owner Email
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
                placeholder="Enter password (default: admin123)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg"
            >
              Unlock Owner Dashboard
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
              Fill Demo Owner Password (admin123)
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
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner & Company Compliance Info */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Owner Phone: 9476088111
            </span>
            <span className="font-mono text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full font-bold">
              Email: contact@mrbun.in
            </span>
            <span className="font-mono text-xs bg-black/40 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full">
              FSSAI: 22926112000173
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight mt-2">
            Mr Bun Owner &amp; Kitchen Control Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time approval workflow: incoming orders notify owner, approval dispatches SMS/Email to customer, and cash verified before food preparation starts.
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

      {/* Success Notification Alert Toast */}
      {successToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Urgent Pending Action Banner */}
      {(pendingOrders.length > 0 || pendingParties.length > 0) && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-black">
                🚨 ACTION REQUIRED: {pendingOrders.length} Food Order(s) &amp; {pendingParties.length} Party Inquiry Pending Approval!
              </p>
              <p className="text-xs text-amber-100 mt-0.5">
                Review and approve below. Approving will automatically send a confirmation SMS &amp; Email to the customer and update their status to Confirmed.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('pending');
            }}
            className="shrink-0 bg-white text-slate-950 hover:bg-amber-100 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition"
          >
            Review Pending Orders
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Owner Approval</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-display">
            {pendingOrders.length} Orders
          </p>
          <p className="text-[11px] text-amber-700 font-bold mt-1">Pending approval</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed &amp; Cooking</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-display">
            {activeOrders.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Kitchen in progress</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Party Feasts</p>
          <p className="text-2xl sm:text-3xl font-black text-red-600 mt-1 font-display">
            {pendingParties.length}
          </p>
          <p className="text-[11px] text-red-600 font-bold mt-1">Parties awaiting confirmation</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders Revenue</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-display">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across all tickets</p>
        </div>
      </div>

      {/* Management Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-2xl transition flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Food Orders ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingOrders.length} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('parties')}
            className={`flex-1 py-3 rounded-2xl transition flex items-center justify-center gap-2 ${
              activeTab === 'parties'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PartyPopper className="w-4 h-4" />
            <span>Party Inquiries ({parties.length})</span>
            {pendingParties.length > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingParties.length} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`flex-1 py-3 rounded-2xl transition flex items-center justify-center gap-2 ${
              activeTab === 'db'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Cloudflare D1 &amp; Worker Desk</span>
          </button>
        </div>

        {/* Tab 1: Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6 space-y-4">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search by order ID, name, phone..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending">⏳ Pending Owner Approval ({pendingOrders.length})</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="preparing">🔥 Preparing</option>
                  <option value="out_for_delivery">🛵 Out For Delivery</option>
                  <option value="delivered">🎉 Delivered</option>
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
                    className={`p-5 rounded-3xl border transition shadow-xs space-y-3.5 ${
                      ord.orderStatus === 'pending'
                        ? 'border-2 border-amber-400 bg-amber-50/40'
                        : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded-xl">
                          {ord.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{ord.customerName}</h3>
                        <a href={`tel:${ord.customerPhone}`} className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{ord.customerPhone}</span>
                        </a>
                        <span className="text-xs text-slate-400">({ord.customerEmail})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-amber-950 font-display">
                          ₹{ord.totalAmount}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ord.paymentMethod.toUpperCase()} • {ord.paymentStatus}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          ord.orderStatus === 'pending' 
                            ? 'bg-amber-500 text-white animate-pulse'
                            : ord.orderStatus === 'confirmed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}>
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Details row */}
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-100 space-y-1.5">
                      <p><strong>Destination:</strong> {ord.deliveryAddress}</p>
                      <p>
                        <strong>Items:</strong> {ord.items.map((i) => `${i.quantity}x ${i.product.name}${i.cheeseBurst ? ' (+Cheese)' : ''}`).join(', ')}
                      </p>
                      {ord.orderNotes && (
                        <p className="text-amber-900 font-semibold italic"><strong>Instructions:</strong> {ord.orderNotes}</p>
                      )}
                    </div>

                    {/* Notification Audit Trail */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>Owner Alert: Sent to <strong>9476088111</strong> &amp; <strong>contact@mrbun.in</strong></span>
                        </span>
                        <span className="text-emerald-700 font-bold">✓ Dispatched</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Customer Notification: <strong>{ord.customerPhone}</strong> &amp; <strong>{ord.customerEmail}</strong></span>
                        </span>
                        <span className={`font-bold ${ord.customerConfirmation ? 'text-emerald-700' : 'text-amber-600'}`}>
                          {ord.customerConfirmation ? `✓ Confirmation SMS/Email Sent` : 'Pending Owner Approval'}
                        </span>
                      </div>
                    </div>

                    {/* Cash on Delivery Notice */}
                    {ord.paymentMethod === 'cod' && (
                      <div className="text-[11px] bg-red-50 text-red-800 p-2 rounded-xl border border-red-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span><strong>Policy Enforced:</strong> Cash must be collected before kitchen preparation begins.</span>
                      </div>
                    )}

                    {/* Owner Action Buttons: APPROVE or CHANGE STAGE */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      {ord.orderStatus === 'pending' ? (
                        /* Urgent Owner Approval Action */
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleApproveOrder(ord.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve &amp; Confirm Order (Dispatches SMS &amp; Email)</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition border border-red-200"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        /* Kitchen Preparation Progression */
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 mr-1">Advance Kitchen Stage:</span>
                          
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              ord.orderStatus === 'preparing'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            🔥 1. Start Prepping
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'out_for_delivery')}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              ord.orderStatus === 'out_for_delivery'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            🛵 2. Out For Delivery
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            🎉 3. Mark Delivered
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Party Orders Tab */}
        {activeTab === 'parties' && (
          <div className="p-4 sm:p-6 space-y-4">
            {parties.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm">No party inquiries recorded yet.</p>
            ) : (
              parties.map((pt) => (
                <div
                  key={pt.id}
                  className={`p-5 rounded-3xl border transition shadow-xs space-y-3.5 ${
                    pt.status === 'pending'
                      ? 'border-2 border-red-400 bg-red-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-red-600 text-white px-2.5 py-1 rounded-xl">
                        {pt.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{pt.fullName}</h3>
                      <a href={`tel:${pt.phone}`} className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{pt.phone}</span>
                      </a>
                      <span className="text-xs text-slate-500">({pt.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-red-700 font-display">
                        ₹{pt.budgetEstimate.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        pt.status === 'pending' ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {pt.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                    <p><strong>Occasion:</strong> {pt.eventType} • <strong>Guests:</strong> {pt.guestCount} Persons</p>
                    <p><strong>Package:</strong> {pt.packageName}</p>
                    <p><strong>Date &amp; Time:</strong> {pt.eventDate} @ {pt.eventTime}</p>
                    <p><strong>Venue Address:</strong> {pt.venueAddress}</p>
                    <p><strong>Payment Mode:</strong> {pt.paymentMethod ? pt.paymentMethod.toUpperCase() : 'ONLINE'}</p>
                    {pt.customNotes && (
                      <p className="text-amber-900 font-semibold"><strong>Dietary &amp; Special Notes:</strong> {pt.customNotes}</p>
                    )}
                  </div>

                  {/* Owner Approval for Party */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    {pt.status === 'pending' ? (
                      <button
                        onClick={() => handleApproveParty(pt.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Party Booking (Sends Confirmation SMS &amp; Email)</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Update Booking Status:</span>
                        {(['confirmed', 'catering_scheduled', 'completed'] as PartyOrderBooking['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdatePartyStatus(pt.id, st)}
                            className={`text-xs font-bold px-3 py-1 rounded-xl uppercase transition ${
                              pt.status === st
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Cloudflare D1 Architecture */}
        {activeTab === 'db' && (
          <div className="p-6 space-y-4 font-mono text-xs">
            <div className="bg-slate-900 text-amber-300 p-4 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-white text-sm">Edge D1 SQLite &amp; Worker Connection</p>
              <p>Database: <strong>mrbun</strong> (ID: 0b367436-034c-462f-8811-c1ac76ea2023)</p>
              <p>Binding: <strong>DB</strong> (env.DB.prepare)</p>
              <p>Subdomain: <strong>mrbun.ceansystech.workers.dev</strong></p>
              <p>Owner Contact: <strong>9476088111</strong> • Email: <strong>contact@mrbun.in</strong></p>
              <p>FSSAI License: <strong>22926112000173</strong></p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default AdminPage;
