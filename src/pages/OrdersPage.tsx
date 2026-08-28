import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Download,
  Radio,
  Zap,
  RotateCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import { Order } from '../types';
import { Badge, getOrderStatusVariant, getPaymentStatusVariant } from '../components/common/Badge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { shopifyApi } from '../services/shopifyApi';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, currency, triggerSimulatedSale } = useSeller();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  // Stats
  const inProduction = orders.filter(o => o.status === 'In Production / Carpentry' || o.status === 'Confirmed').length;
  const inTransit = orders.filter(o => o.status === 'Out for White-Glove Delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtering
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'All' && order.status !== statusFilter) return false;
    if (paymentFilter !== 'All' && order.paymentStatus !== paymentFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchClient = order.clientName.toLowerCase().includes(q);
      const matchCity = order.shippingAddress.city.toLowerCase().includes(q);
      const matchItem = order.items.some(i => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
      return matchNum || matchClient || matchCity || matchItem;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Order Management & Fulfillment</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track custom furniture fabrication, workshop carpentry, white-glove logistics, and client invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={async () => {
              setIsSimulatingWebhook(true);
              try {
                // Send simulated webhook to server
                await shopifyApi.triggerTestWebhookOrder({
                  id: Math.floor(6000000000000 + Math.random() * 1000000000),
                  name: `#HT-SHP-${Math.floor(1000 + Math.random() * 9000)}`,
                  created_at: new Date().toISOString(),
                  total_price: "1850.00",
                  currency: "USD",
                  financial_status: "paid",
                  fulfillment_status: "unfulfilled",
                  customer: {
                    first_name: "Elena",
                    last_name: "Vance",
                    email: "elena.vance@archstudio.design"
                  },
                  shipping_address: {
                    city: "San Francisco",
                    province: "California",
                    country: "United States"
                  },
                  line_items: [
                    {
                      id: 8876123,
                      title: "Artisan Solid Sheesham Credenza 6-Door",
                      quantity: 1,
                      price: "1850.00",
                      sku: "HT-LIV-CRE-01"
                    }
                  ]
                });
                triggerSimulatedSale();
              } catch (e) {
                triggerSimulatedSale();
              } finally {
                setIsSimulatingWebhook(false);
              }
            }}
            disabled={isSimulatingWebhook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold hover:bg-orange-100 transition shadow-xs disabled:opacity-60"
          >
            <Zap className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
            <span>{isSimulatingWebhook ? 'Triggering...' : 'Simulate Shopify Webhook'}</span>
          </button>

          <button
            onClick={() => navigate('/shopify')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-xs"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shopify OMS Hub</span>
          </button>

          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "HomeTown_Orders_Export.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Carpentry / Bay</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-amber-700">{inProduction}</h3>
            <span className="text-[10px] text-amber-600 font-semibold">Crafting</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">White-Glove In Transit</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-blue-700">{inTransit}</h3>
            <span className="text-[10px] text-blue-600 font-semibold">Dispatched</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivered & Assembled</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-emerald-700">{deliveredCount}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Completed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Order Volume</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-slate-800">{currency}{totalVolume.toLocaleString()}</h3>
            <span className="text-[10px] text-slate-400">Gross Value</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Client Name, City, or Furniture Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Production / Carpentry">In Production / Carpentry</option>
              <option value="Quality Checked & Packed">Quality Checked & Packed</option>
              <option value="Out for White-Glove Delivery">Out for White-Glove Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Payment Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

        </div>
      </div>

      {/* Orders Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Order ID & Date</th>
                <th className="py-2.5 px-3.5">Customer & Delivery City</th>
                <th className="py-2.5 px-3.5">Furniture Items</th>
                <th className="py-2.5 px-3.5 text-right">Amount</th>
                <th className="py-2.5 px-3.5 text-center">Payment</th>
                <th className="py-2.5 px-3.5 text-center">Fulfillment Status</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <p className="font-mono font-bold text-slate-800">{ord.orderNumber}</p>
                      <span className="text-[10px] text-slate-400">{ord.createdAt}</span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="font-semibold text-slate-800">{ord.clientName}</p>
                      <span className="text-[10px] text-slate-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-700">{ord.items.length} item(s)</span>
                        <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {ord.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                        </p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <p className="font-bold text-slate-800 text-xs">{currency}{ord.totalAmount.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400">{ord.items.reduce((s, i) => s + i.quantity, 0)} total units</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge variant={getPaymentStatusVariant(ord.paymentStatus)} size="sm">
                        {ord.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge variant={getOrderStatusVariant(ord.status)} size="sm" dot>
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

    </div>
  );
};
