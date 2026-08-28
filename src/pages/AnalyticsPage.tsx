import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Boxes, 
  ArrowUpRight, 
  BarChart3, 
  PieChart as PieIcon, 
  Truck, 
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { useSeller } from '../context/SellerContext';
import { StatsCard } from '../components/common/StatsCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { products, orders, currency } = useSeller();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.costPrice * p.salesCount), 0);
  const estimatedGrossProfit = totalRevenue - totalCost;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Monthly revenue data
  const monthlyRevenueData = [
    { month: 'Oct', revenue: 24500, profit: 12200 },
    { month: 'Nov', revenue: 38200, profit: 19800 },
    { month: 'Dec', revenue: 54100, profit: 28400 },
    { month: 'Jan', revenue: 41200, profit: 21600 },
    { month: 'Feb', revenue: 49800, profit: 26300 },
    { month: 'Mar (Current)', revenue: totalRevenue + 12000, profit: estimatedGrossProfit + 6000 }
  ];

  // Category distribution
  const categoryData = [
    { name: 'Living Room', value: 42, color: '#92400E' },
    { name: 'Dining Room', value: 24, color: '#B45309' },
    { name: 'Bedroom', value: 18, color: '#D97706' },
    { name: 'Lighting & Decor', value: 16, color: '#78716C' }
  ];

  // Top Products
  const topProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Commercial Intelligence & Analytics</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              Live BI Metrics
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Analyze profit margins, category demand curves, average basket sizes, and warehouse fulfillment metrics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Gross Revenue"
          value={`${currency}${totalRevenue.toLocaleString()}`}
          change="+24.2% YOY"
          subtitle="Direct & Studio B2B Sales"
          icon={DollarSign}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-800"
        />
        <StatsCard
          title="Estimated Gross Profit"
          value={`${currency}${estimatedGrossProfit.toLocaleString()}`}
          change="~52% Margin"
          subtitle="Net product margin"
          icon={TrendingUp}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-800"
        />
        <StatsCard
          title="Average Order Value (AOV)"
          value={`${currency}${avgOrderValue.toLocaleString()}`}
          change="+8.4% vs industry"
          subtitle="High-ticket furniture orders"
          icon={ShoppingBag}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-800"
        />
        <StatsCard
          title="Fulfillment Rate"
          value="98.6%"
          change="White-Glove Fleet"
          subtitle="On-time delivery index"
          icon={Truck}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-800"
        />
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Sales & Profit Bars */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-stone-900">Revenue & Profit Margins</h3>
              <p className="text-xs text-stone-500">6-Month historical performance across all collections</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A8A29E" fontSize={12} tickLine={false} />
                <YAxis stroke="#A8A29E" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="revenue" name="Gross Revenue" fill="#B45309" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Gross Margin" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Category Revenue Pie */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Sales Volume by Room</h3>
            <p className="text-xs text-stone-500">Distribution across furniture categories</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(v) => [`${v}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-stone-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span>{cat.name}</span>
                </span>
                <span className="font-bold text-stone-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 5 Best-Selling Furniture Pieces */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">Best-Selling Furniture Pieces</h3>
          <p className="text-xs text-stone-500">Ranked by volume orders & revenue velocity</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
              <tr>
                <th className="p-3">Rank & Product</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-center">Lifetime Units Sold</th>
                <th className="p-3 text-right">Generated Revenue</th>
                <th className="p-3 text-center">Stock Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topProducts.map((prod, idx) => (
                <tr key={prod.id} className="hover:bg-stone-50/70">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </span>
                      <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
                      <div>
                        <p className="font-bold text-stone-900">{prod.name}</p>
                        <span className="font-mono text-[10px] text-stone-400">{prod.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-stone-700">{prod.category}</td>
                  <td className="p-3 text-right font-bold text-stone-900">{currency}{prod.price.toLocaleString()}</td>
                  <td className="p-3 text-center font-bold text-amber-900">{prod.salesCount} units</td>
                  <td className="p-3 text-right font-bold text-emerald-800">{currency}{(prod.salesCount * prod.price).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      prod.stock > prod.minStockThreshold ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {prod.stock} in stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
