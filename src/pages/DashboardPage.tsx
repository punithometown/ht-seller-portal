import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Boxes, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  FileSpreadsheet, 
  ArrowRight, 
  AlertTriangle, 
  Truck, 
  Eye, 
  Zap, 
  Sparkles,
  Layers,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import { StatsCard } from '../components/common/StatsCard';
import { Badge, getOrderStatusVariant, getProductStatusVariant } from '../components/common/Badge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { ProductDetailsModal } from '../components/products/ProductDetailsModal';
import { Order, Product } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    products, 
    orders, 
    inquiries, 
    clients, 
    currency, 
    triggerSimulatedSale,
    inventoryLogs
  } = useSeller();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Computed metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'In Production / Carpentry');
  const lowStockProducts = products.filter(p => p.stock <= p.minStockThreshold);
  const activeInquiries = inquiries.filter(i => i.status === 'New' || i.status === 'In Progress');
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  // Revenue chart data (Last 7 days trend)
  const salesTrendData = [
    { day: 'Mon', revenue: 4200, orders: 4 },
    { day: 'Tue', revenue: 6800, orders: 6 },
    { day: 'Wed', revenue: 5100, orders: 5 },
    { day: 'Thu', revenue: 8900, orders: 8 },
    { day: 'Fri', revenue: 11400, orders: 9 },
    { day: 'Sat', revenue: 14200, orders: 12 },
    { day: 'Sun', revenue: Math.round(totalRevenue * 0.28), orders: orders.length }
  ];

  // Category revenue split
  const categorySplitData = [
    { name: 'Living Room', value: 42, color: '#4F46E5' },
    { name: 'Dining Room', value: 26, color: '#6366F1' },
    { name: 'Bedroom', value: 18, color: '#818CF8' },
    { name: 'Decor & Lighting', value: 14, color: '#94A3B8' }
  ];

  return (
    <div className="space-y-4">
      
      {/* Top Banner: Brand Overview & Live Action Strip */}
      <div className="bg-[#1E140E] text-[#EDE0D4] rounded-xl p-5 border border-[#3E2B20] shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">HomeTown Operations Control</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D84C1C]/20 text-[#FFA88B] border border-[#D84C1C]/40">
                Enterprise Seller Hub
              </span>
            </div>
            <p className="text-[#B5A191] text-xs max-w-xl">
              Real-time inventory synchronization, bulk CSV catalog matrix, white-glove carpentry fulfillment, and customer inquiries.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/products/add')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D84C1C] hover:bg-[#C03E12] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => navigate('/products/add?tab=csv')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D1E16] hover:bg-[#3D2A1F] text-[#E0D2C3] text-xs font-semibold border border-[#4A3427] transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#FFA88B]" />
              <span>Bulk CSV</span>
            </button>
            <button
              onClick={triggerSimulatedSale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D1E16] hover:bg-[#3D2A1F] text-amber-300 text-xs font-semibold border border-[#4A3427] transition-all"
              title="Test real-time store purchase simulation"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Test Sale</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatsCard
          title="Gross Revenue"
          value={`${currency}${totalRevenue.toLocaleString()}`}
          change="+18.4% this mo"
          subtitle="Net verified earnings"
          icon={DollarSign}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          onClick={() => navigate('/analytics')}
        />
        <StatsCard
          title="Active Orders"
          value={totalOrdersCount}
          change="+6 this week"
          subtitle={`${pendingOrders.length} in production`}
          icon={ShoppingBag}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-700"
          onClick={() => navigate('/orders')}
        />
        <StatsCard
          title="Inventory Items"
          value={totalStockUnits}
          subtitle={`${lowStockProducts.length} low stock alerts`}
          change={lowStockProducts.length > 0 ? `${lowStockProducts.length} Reorder` : 'Healthy'}
          isPositive={lowStockProducts.length === 0}
          icon={Boxes}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
          onClick={() => navigate('/inventory')}
        />
        <StatsCard
          title="Customer Inquiries"
          value={activeInquiries.length}
          subtitle="Avg response: 24m"
          change="98% satisfaction"
          icon={MessageSquare}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-700"
          onClick={() => navigate('/inquiries')}
        />
      </div>

      {/* Visual Analytics Row: Sales Curve & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Sales Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Weekly Revenue Trend</h3>
              <p className="text-[11px] text-slate-400">Storefront sales and designer trade orders</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Revenue ($)</span>
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#indigoGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Share & Low Stock Quick Alert */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Revenue by Category</h3>
            <p className="text-[11px] text-slate-400">Product performance split</p>
          </div>

          <div className="space-y-2.5">
            {categorySplitData.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium text-[11px]">{cat.name}</span>
                  <span className="text-slate-800 font-bold text-[11px]">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stock Alert Box */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800 text-[11px]">{lowStockProducts.length} Items Low Stock</p>
                <p className="text-[10px] text-slate-500">Reorder threshold hit</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/inventory')}
              className="px-2 py-1 bg-amber-600 text-white rounded font-semibold text-[10px] hover:bg-amber-700 transition-colors"
            >
              Restock
            </button>
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Client Orders & Live Inventory Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Recent Client Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Orders</h3>
              <p className="text-[11px] text-slate-400">Latest client orders & logistics status</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3.5">Order #</th>
                  <th className="py-2.5 px-3.5">Client</th>
                  <th className="py-2.5 px-3.5">Items</th>
                  <th className="py-2.5 px-3.5">Total</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-800">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="font-semibold text-slate-800">{ord.clientName}</p>
                      <p className="text-[10px] text-slate-400">{ord.shippingAddress.city}</p>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-medium text-slate-700">{ord.items.length} item(s)</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{ord.items[0]?.productName}</p>
                    </td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-800">
                      {currency}{ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <Badge variant={getOrderStatusVariant(ord.status)} size="sm">
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Real-time Inventory Audit Ticker */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Inventory Feed</h3>
              <p className="text-[11px] text-slate-400">Live warehouse movement</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {inventoryLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                    log.type === 'SALE' ? 'bg-amber-100 text-amber-800' :
                    log.type === 'RESTOCK' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {log.type}
                  </span>
                  <span className={`font-bold text-[11px] ${log.change < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {log.change > 0 ? `+${log.change}` : log.change}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 truncate text-[11px]">{log.productName}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[120px]">{log.warehouse}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/inventory')}
            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors text-center"
          >
            Inventory Manager
          </button>
        </div>

      </div>

      {/* Interactive Modals */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

    </div>
  );
};
