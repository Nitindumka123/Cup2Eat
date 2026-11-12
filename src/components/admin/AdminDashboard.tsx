import React, { useState, useEffect } from 'react';
import {
  adminLogin,
  adminLogout,
  getAdminMe,
  getDashboardStats,
  getAdminOrders,
  updateAdminOrder,
  updateAdminB2B,
  updateAdminWholesale,
  getAdminProducts,
  updateAdminProduct,
  getAdminSettings,
  updateAdminSettings,
  getAdminInvoices,
  resendAdminInvoiceEmail,
} from '../../services/api';
import {
  Lock,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Package,
  Settings,
  DollarSign,
  UserCheck,
  Edit,
  Save,
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Send,
  Printer,
  MailCheck,
  MailX
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cup2eat_admin_token'));
  const [adminUser, setAdminUser] = useState<any>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('dumkanitin0@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'invoices' | 'b2b' | 'wholesale' | 'products' | 'settings'>('overview');

  // Data state
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [b2bEnquiries, setB2bEnquiries] = useState<any[]>([]);
  const [wholesaleEnquiries, setWholesaleEnquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Settings editing state
  const [editPrice, setEditPrice] = useState(3999);
  const [editCups, setEditCups] = useState(396);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Verify token on mount
  useEffect(() => {
    if (token) {
      getAdminMe(token).then((res) => {
        if (res.success && res.data) {
          setAdminUser(res.data);
          loadAllAdminData(token);
        } else {
          // Token expired or invalid
          setToken(null);
          localStorage.removeItem('cup2eat_admin_token');
        }
      });
    }
  }, [token]);

  const loadAllAdminData = async (authToken: string) => {
    setIsLoading(true);
    try {
      const [statsRes, ordersRes, invoicesRes, productsRes, settingsRes] = await Promise.all([
        getDashboardStats(authToken),
        getAdminOrders(authToken),
        getAdminInvoices(authToken),
        getAdminProducts(authToken),
        getAdminSettings(authToken),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (invoicesRes.success) setInvoices(invoicesRes.data || []);
      if (productsRes.success) setProducts(productsRes.data || []);
      if (settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data);
        setEditPrice(settingsRes.data.promotional_wholesale_price || 3999);
        setEditCups(settingsRes.data.promotional_wholesale_cups || 396);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const res = await adminLogin(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (res.success && res.token) {
      setToken(res.token);
      setAdminUser(res.user);
      localStorage.setItem('cup2eat_admin_token', res.token);
      loadAllAdminData(res.token);
    } else {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleLogout = async () => {
    if (token) {
      await adminLogout(token);
    }
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('cup2eat_admin_token');
  };

  const handleResendInvoiceEmail = async (invoiceId: string) => {
    if (!token) return;
    setStatusMessage('Re-sending transactional email with PDF invoice attachment...');
    const res = await resendAdminInvoiceEmail(token, invoiceId);
    if (res.success) {
      setStatusMessage('Invoice email dispatched successfully!');
      loadAllAdminData(token);
    } else {
      setStatusMessage(res.error || 'Failed to dispatch email.');
    }
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, paymentStatus?: string, deliveryStatus?: string) => {
    if (!token) return;
    setStatusMessage('Updating order status in database...');
    const res = await updateAdminOrder(token, orderId, {
      status: newStatus,
      ...(paymentStatus ? { payment_status: paymentStatus } : {}),
      ...(deliveryStatus ? { delivery_status: deliveryStatus } : {}),
      internal_notes: editingNotes,
    });

    if (res.success) {
      setStatusMessage('Order status updated successfully.');
      loadAllAdminData(token);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.data);
      }
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleSaveSettings = async () => {
    if (!token) return;
    setStatusMessage('Saving promotional settings to database...');
    const res = await updateAdminSettings(token, {
      promotional_wholesale_price: editPrice,
      promotional_wholesale_cups: editCups,
    });

    if (res.success) {
      setSettings(res.data);
      setStatusMessage('Site promotional pricing updated successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // If unauthenticated, render Administrator Login Screen
  if (!token || !adminUser) {
    return (
      <div className="min-h-screen bg-[#073B2B] text-[#FAF5E9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#17130C] border border-[#D9A52B]/40 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#073B2B] border-2 border-[#D9A52B] mx-auto flex items-center justify-center text-[#F2B544] shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-display font-black text-[#FFF4D6]">
              Cup2Eat Admin Desk
            </h2>
            <p className="text-xs text-[#FAF5E9]/70">
              Restricted Administrative Control Center
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#D9A52B] mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-[#FFF4D6] focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D9A52B] mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-[#FFF4D6] focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#FAF5E9]/60 hover:text-[#F2B544] transition-colors cursor-pointer"
                  title={showLoginPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Desk'}</span>
            </button>
          </form>

          <div className="text-center pt-2 text-[11px] text-[#FAF5E9]/50">
            FSSAI Registered Operations · Cup2Eat Business Engine
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Interface
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#073B2B] border border-[#D9A52B] flex items-center justify-center text-[#F2B544] font-bold text-xs">
            C2E
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Cup2Eat Business Control Center</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                LIVE PERSISTENT DB
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Authenticated: {adminUser.name} ({adminUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAllAdminData(token)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div className="bg-amber-950/90 border-b border-amber-800/60 px-6 py-2 text-xs text-amber-200 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{statusMessage}</span>
          </span>
          <button onClick={() => setStatusMessage('')} className="text-amber-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoices & Email Logs ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('b2b')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'b2b'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B Commercial Leads</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Wholesale Pricing Config</span>
          </button>
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Calculated Order Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">
                  ₹{stats.calculated_revenue?.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">From recorded non-cancelled customer orders</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Total Recorded Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#F2B544]" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {stats.total_orders}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  {stats.new_orders} New · {stats.pending_orders} Processing
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Delivered Orders</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {stats.delivered_orders}
                </div>
                <div className="text-[11px] text-slate-500">Fully completed customer orders</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>B2B Commercial Leads</span>
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {stats.total_b2b_enquiries_count}
                </div>
                <div className="text-[11px] text-amber-400 font-bold">
                  {stats.new_b2b_enquiries_count} Uncontacted New Leads
                </div>
              </div>
            </div>

            {/* Quick Orders List Preview */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F2B544]" />
                  <span>Recent Recorded Orders</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#F2B544] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No orders recorded yet. Place a test order from the website!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Flavour</th>
                        <th className="p-3">Boxes / Cups</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/60">
                          <td className="p-3 font-mono font-bold text-[#F2B544]">{o.order_reference}</td>
                          <td className="p-3 font-semibold text-white">{o.customer_name} ({o.phone})</td>
                          <td className="p-3">{o.flavor}</td>
                          <td className="p-3">{o.number_of_boxes} Box ({o.quantity_cups} Cups)</td>
                          <td className="p-3 font-bold text-emerald-400 tabular-nums">₹{o.total_amount?.toLocaleString()}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#073B2B] text-[#F2B544]">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">{new Date(o.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by customer name, ref ID, phone, or city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Ref ID</th>
                      <th className="p-3.5">Customer & Contact</th>
                      <th className="p-3.5">Delivery Address</th>
                      <th className="p-3.5">Item & Qty</th>
                      <th className="p-3.5">Total Payable</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {orders
                      .filter((o) => {
                        if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
                        if (orderSearch.trim()) {
                          const q = orderSearch.toLowerCase();
                          return (
                            o.order_reference.toLowerCase().includes(q) ||
                            o.customer_name.toLowerCase().includes(q) ||
                            o.phone.includes(q) ||
                            o.city.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-slate-900/60">
                          <td className="p-3.5 font-mono font-bold text-[#F2B544]">{order.order_reference}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{order.customer_name}</div>
                            <div className="text-[11px] text-slate-400">{order.phone} · {order.email || 'No email'}</div>
                          </td>
                          <td className="p-3.5 max-w-[200px] truncate text-slate-300">
                            {order.delivery_address}, {order.city} {order.pincode}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{order.flavor}</div>
                            <div className="text-[11px] text-slate-400">{order.number_of_boxes} Box ({order.quantity_cups} Cups)</div>
                          </td>
                          <td className="p-3.5 font-black text-emerald-400 text-sm tabular-nums">
                            ₹{order.total_amount?.toLocaleString()}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-300"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="DISPATCHED">DISPATCHED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setEditingNotes(order.internal_notes || '');
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Invoices & Email Delivery Control */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {/* Search Header */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by invoice #, order ref, customer name or email..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                />
              </div>

              <div className="text-xs text-slate-400 font-bold">
                Total Invoices Persisted: <span className="text-[#F2B544]">{invoices.length}</span>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Invoice #</th>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Doc Type</th>
                      <th className="p-3.5">Customer & Email</th>
                      <th className="p-3.5">Amount (₹)</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Email Delivery</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No invoices generated yet. Invoices are automatically generated when customer orders are placed or updated.
                        </td>
                      </tr>
                    ) : (
                      invoices
                        .filter((i) => {
                          if (!invoiceSearch.trim()) return true;
                          const s = invoiceSearch.toLowerCase();
                          return (
                            i.invoice_number.toLowerCase().includes(s) ||
                            i.order_reference.toLowerCase().includes(s) ||
                            i.customer_name.toLowerCase().includes(s) ||
                            i.customer_email.toLowerCase().includes(s)
                          );
                        })
                        .map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-900/60">
                            <td className="p-3.5 font-mono font-bold text-[#F2B544]">{inv.invoice_number}</td>
                            <td className="p-3.5 font-mono text-slate-300">{inv.order_reference}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 border border-slate-700 text-amber-300">
                                {inv.document_type}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-white">{inv.customer_name}</div>
                              <div className="text-[11px] text-slate-400">{inv.customer_email}</div>
                            </td>
                            <td className="p-3.5 font-black text-emerald-400 text-sm tabular-nums">
                              ₹{inv.total_amount?.toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inv.payment_status === 'PAID' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                                {inv.payment_status}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {inv.email_status === 'SENT' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                                  <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Sent ({inv.email_retry_count})</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px]" title={inv.email_error || 'Pending delivery'}>
                                  <MailX className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{inv.email_status} ({inv.email_retry_count})</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 flex items-center gap-2">
                              <a
                                href={`/api/invoices/${inv.id}/download?token=${token}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                                title="Download Official PDF Invoice"
                              >
                                <Printer className="w-3 h-3 text-[#F2B544]" />
                                <span>PDF</span>
                              </a>

                              <button
                                onClick={() => handleResendInvoiceEmail(inv.id)}
                                className="px-2.5 py-1 bg-[#073B2B] hover:bg-[#0B5D43] text-[#F2B544] border border-[#D9A52B]/40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="Resend Transactional Invoice Email"
                              >
                                <Send className="w-3 h-3" />
                                <span>Resend</span>
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: B2B Commercial Leads */}
        {activeTab === 'b2b' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>B2B Commercial Leads & Partnerships</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Business Outlet</th>
                      <th className="p-3">Contact Person</th>
                      <th className="p-3">Phone & Email</th>
                      <th className="p-3">City & Volume</th>
                      <th className="p-3">Co-Branding</th>
                      <th className="p-3">Lead Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {b2bEnquiries.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/60">
                        <td className="p-3 font-bold text-white">{b.business_name} ({b.business_type})</td>
                        <td className="p-3 text-slate-300">{b.customer_name}</td>
                        <td className="p-3 text-slate-400">{b.phone}<br/>{b.email}</td>
                        <td className="p-3 text-slate-300">{b.city} · {b.estimated_monthly_volume}</td>
                        <td className="p-3">
                          {b.co_branding_requested ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">YES</span>
                          ) : (
                            <span className="text-slate-500">NO</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-900 text-amber-400 border border-amber-900/60">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">{new Date(b.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Product Catalog & Pricing */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Centralized Product Catalog Management</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-base">{p.name}</div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.active ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                        {p.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Flavour Spec:</span>
                        <span className="font-bold text-amber-300">{p.flavour}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Base Price:</span>
                        <span className="font-extrabold text-emerald-400">{p.price ? `₹${p.price}` : 'Promotional'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Site Promotional Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 max-w-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#F2B544]" />
                <span>Wholesale Promotional Pricing Configuration</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Promotional Wholesale Box Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Currently set to ₹{editPrice} per box (Calculates unit rate ~₹{(editPrice / editCups).toFixed(2)} / cup).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Cups Per Wholesale Box
                  </label>
                  <input
                    type="number"
                    value={editCups}
                    onChange={(e) => setEditCups(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Currently set to {editCups} cups per carton.
                  </span>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-3 text-xs font-extrabold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-colors shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Promotional Config to Database</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 text-xs text-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#F2B544] font-bold uppercase">
                {selectedOrder.order_reference}
              </span>
              <h3 className="text-xl font-bold text-white">Order Details & Status Control</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Customer</span>
                <span className="font-bold text-white">{selectedOrder.customer_name}</span>
                <span className="text-slate-400 block">{selectedOrder.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery City</span>
                <span className="font-bold text-white">{selectedOrder.city}</span>
                <span className="text-slate-400 block">{selectedOrder.pincode}</span>
              </div>
              <div className="col-span-2 border-t border-slate-800 pt-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Address</span>
                <span className="text-slate-200">{selectedOrder.delivery_address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-300">Update Internal Admin Notes:</label>
              <textarea
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                placeholder="Record courier tracking number, payment notes, dispatch status..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status);
                  setSelectedOrder(null);
                }}
                className="px-5 py-2 bg-[#F2B544] text-[#073B2B] font-black rounded-xl hover:bg-[#D9A52B]"
              >
                Save Notes & Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
