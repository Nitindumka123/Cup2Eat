import React, { useState, useEffect } from 'react';
import { getCustomerOrders, updateCustomerProfileData, customerLogout } from '../services/api';
import { BRAND_DETAILS } from '../data/cup2eatData';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  FileText,
  LogOut,
  Edit2,
  Save,
  X,
  ShieldCheck,
  Printer,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  customer: any;
  onUpdateCustomer?: (updated: any) => void;
  onLogout: () => void;
  onOpenOrderModal?: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  token,
  customer,
  onUpdateCustomer,
  onLogout,
  onOpenOrderModal,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(customer?.full_name || '');
  const [editEmail, setEditEmail] = useState(customer?.email || '');
  const [editPhone, setEditPhone] = useState(customer?.phone || '');
  const [editAddress, setEditAddress] = useState(customer?.default_address || '');
  const [editCity, setEditCity] = useState(customer?.default_city || '');
  const [editPincode, setEditPincode] = useState(customer?.default_pincode || '');

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (customer) {
      setEditName(customer.full_name || '');
      setEditEmail(customer.email || '');
      setEditPhone(customer.phone || '');
      setEditAddress(customer.default_address || '');
      setEditCity(customer.default_city || '');
      setEditPincode(customer.default_pincode || '');
    }
  }, [customer]);

  const authToken = token || localStorage.getItem('cup2eat_customer_token') || '';

  useEffect(() => {
    if (isOpen && (authToken || customer)) {
      loadCustomerOrders();
    }
  }, [isOpen, authToken, customer]);

  const loadCustomerOrders = async () => {
    setIsLoading(true);
    const res = await getCustomerOrders(authToken);
    setIsLoading(false);
    if (res.success && res.data) {
      setOrders(res.data);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving profile changes...');
    const res = await updateCustomerProfileData(authToken, {
      full_name: editName,
      email: editEmail,
      phone: editPhone,
      default_address: editAddress,
      default_city: editCity,
      default_pincode: editPincode,
    });

    if (res.success && res.data) {
      setStatusMessage('Profile updated successfully.');
      if (onUpdateCustomer) onUpdateCustomer(res.data);
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      setStatusMessage(res.error || 'Failed to update profile.');
    }
  };

  const handleLogoutAction = async () => {
    if (authToken) {
      await customerLogout(authToken);
    }
    onLogout();
    onClose();
  };

  const handleDownloadPdf = (id: string) => {
    const url = `/api/invoices/${id}/download${authToken ? `?token=${encodeURIComponent(authToken)}` : ''}`;
    window.open(url, '_blank');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#17130C] border border-[#D9A52B]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative text-[#FAF5E9] max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#FAF5E9]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Customer Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#073B2B] border-2 border-[#D9A52B] flex items-center justify-center text-[#F2B544] font-black text-lg shadow-md">
              {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-[#FFF4D6] flex items-center gap-2">
                <span>{customer.full_name || 'Cup2Eat Patron'}</span>
                <span className="text-[10px] font-bold bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 px-2 py-0.5 rounded-full">
                  VERIFIED ACCOUNT
                </span>
              </h2>
              <div className="text-xs text-[#FAF5E9]/70 flex flex-wrap items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#D9A52B]" /> {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#D9A52B]" /> {customer.phone}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogoutAction}
            className="px-3.5 py-2 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-900/50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Feedback Message Toast */}
        {statusMessage && (
          <div className="mt-3 p-3 bg-amber-950/90 border border-amber-800/60 text-amber-200 text-xs rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{statusMessage}</span>
            </span>
            <button onClick={() => setStatusMessage('')} className="text-amber-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-white/10 pt-4 pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-[#FAF5E9]/60 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My Orders & Invoices ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#073B2B] text-[#F2B544] border border-[#D9A52B]/40 shadow'
                : 'text-[#FAF5E9]/60 hover:text-white'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile & Address</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="py-4 space-y-4 overflow-y-auto flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#FFF4D6] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F2B544]" />
                <span>Your Registered Purchase History</span>
              </h3>
              <button
                onClick={loadCustomerOrders}
                className="text-xs text-[#F2B544] hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-[#073B2B]/30 rounded-2xl border border-white/10 p-6">
                <Package className="w-10 h-10 text-[#D9A52B] mx-auto" />
                <h4 className="text-base font-bold text-[#FFF4D6]">No Recorded Purchases Yet</h4>
                <p className="text-xs text-[#FAF5E9]/70 max-w-sm mx-auto">
                  Place an order for our signature 100ml edible cups to view live tracking and invoices here!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#073B2B]/40 border border-white/10 space-y-3 hover:border-[#D9A52B]/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#F2B544] text-xs">
                          {order.order_reference}
                        </span>
                        <span className="text-[10px] font-bold bg-[#073B2B] text-[#FFF4D6] px-2 py-0.5 rounded-full border border-[#D9A52B]/30">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#FAF5E9]/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[#FAF5E9]/60 block text-[10px]">Item & Quantity:</span>
                        <span className="font-bold text-white">{order.flavor}</span>
                        <span className="block text-[11px] text-[#D9A52B]">
                          {order.number_of_boxes} Box ({order.quantity_cups} Cups)
                        </span>
                      </div>

                      <div>
                        <span className="text-[#FAF5E9]/60 block text-[10px]">Delivery City:</span>
                        <span className="font-bold text-white">{order.city}</span>
                        <span className="block text-[11px] text-[#FAF5E9]/70 truncate max-w-[180px]">
                          {order.delivery_address}
                        </span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[#FAF5E9]/60 block text-[10px]">Total Amount Paid:</span>
                        <span className="text-base font-black text-emerald-400 tabular-nums">
                          ₹{order.total_amount?.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-amber-300 font-bold uppercase">
                          Payment: {order.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                      <button
                        onClick={() => handleDownloadPdf(order.id)}
                        className="px-3 py-1.5 text-xs font-bold text-[#FFF4D6] bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Download Official PDF Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#F2B544]" />
                        <span>Download PDF</span>
                      </button>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3.5 py-1.5 text-xs font-bold text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Address Editor */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="py-4 space-y-4 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#D9A52B] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D9A52B] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#D9A52B] mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D9A52B] mb-1">City / Region *</label>
                <input
                  type="text"
                  required
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D9A52B] mb-1">Default Delivery Address</label>
              <textarea
                rows={2}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Street address, shop number, building, landmark..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D9A52B] mb-1">Pincode</label>
              <input
                type="text"
                value={editPincode}
                onChange={(e) => setEditPincode(e.target.value)}
                placeholder="e.g. 110001"
                className="w-full px-4 py-2.5 rounded-xl bg-[#073B2B]/60 border border-[#D9A52B]/30 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F2B544]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-xs font-black text-[#073B2B] bg-[#F2B544] hover:bg-[#D9A52B] rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Delivery Details</span>
            </button>
          </form>
        )}
      </div>

      {/* Official Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Invoice Header */}
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#073B2B] flex flex-col items-center justify-center text-[8px] font-bold text-[#FFF4D6]">
                    C2E
                  </div>
                  <span className="text-xl font-black text-[#073B2B]">CUP2EAT</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {BRAND_DETAILS.fssaiRegNo}<br />
                  FSSAI Location: {BRAND_DETAILS.fssaiLocation}<br />
                  Founder: {BRAND_DETAILS.founder} · Phone: {BRAND_DETAILS.phoneDisplay}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase block">
                  TAX INVOICE
                </span>
                <span className="text-sm font-mono font-black text-slate-900 block">
                  {selectedInvoiceOrder.order_reference}
                </span>
                <span className="text-xs text-slate-500 block">
                  Date: {new Date(selectedInvoiceOrder.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Customer Billed To Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Billed To Customer:</span>
                <span className="font-bold text-slate-900 text-sm block">{selectedInvoiceOrder.customer_name}</span>
                <span className="text-slate-600 block">{selectedInvoiceOrder.phone}</span>
                <span className="text-slate-600 block">{selectedInvoiceOrder.email}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Shipping Destination:</span>
                <span className="font-semibold text-slate-800 block">{selectedInvoiceOrder.delivery_address}</span>
                <span className="text-slate-600 block">{selectedInvoiceOrder.city} {selectedInvoiceOrder.pincode}</span>
              </div>
            </div>

            {/* Item Table */}
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
                <tr>
                  <th className="p-3">Product Item</th>
                  <th className="p-3">Box Quantity</th>
                  <th className="p-3">Cup Count</th>
                  <th className="p-3 text-right">Total Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-3 font-bold text-[#073B2B]">{selectedInvoiceOrder.flavor}</td>
                  <td className="p-3">{selectedInvoiceOrder.number_of_boxes} Box</td>
                  <td className="p-3">{selectedInvoiceOrder.quantity_cups} Cups</td>
                  <td className="p-3 text-right font-black tabular-nums">
                    ₹{selectedInvoiceOrder.total_amount?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Summary */}
            <div className="flex justify-between items-center pt-2 text-xs">
              <div className="text-slate-500 font-medium">
                Payment Status: <strong className="text-emerald-700">{selectedInvoiceOrder.payment_status}</strong><br />
                Delivery Status: <strong className="text-amber-700">{selectedInvoiceOrder.delivery_status}</strong>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Amount Paid (Incl. Delivery):</span>
                <span className="text-2xl font-black text-[#073B2B] tabular-nums">
                  ₹{selectedInvoiceOrder.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close Invoice
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 bg-slate-200 text-slate-800 hover:bg-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => handleDownloadPdf(selectedInvoiceOrder.id)}
                  className="px-5 py-2 bg-[#073B2B] text-[#FFF4D6] hover:bg-[#0B5D43] font-bold text-xs rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#F2B544]" />
                  <span>Download PDF Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
