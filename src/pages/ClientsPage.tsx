import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  MapPin, 
  Building2, 
  MessageSquare, 
  PackageCheck
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import { Order } from '../types';
import { Badge, getOrderStatusVariant } from '../components/common/Badge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';

export const ClientsPage: React.FC = () => {
  const { clients, orders, inquiries, currency } = useSeller();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryClientId = searchParams.get('clientId');
  const [selectedClientId, setSelectedClientId] = useState<string>(queryClientId || clients[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  // Sync with URL query parameter
  useEffect(() => {
    if (queryClientId && queryClientId !== selectedClientId) {
      setSelectedClientId(queryClientId);
    }
  }, [queryClientId]);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // All orders for this specific client
  const clientOrders = orders.filter(o => 
    o.clientId === selectedClient?.id || 
    o.clientName.toLowerCase() === selectedClient?.name.toLowerCase() ||
    o.clientEmail.toLowerCase() === selectedClient?.email.toLowerCase()
  );

  // Inquiries for this specific client
  const clientInquiries = inquiries.filter(i => 
    i.clientId === selectedClient?.id || 
    i.clientEmail.toLowerCase() === selectedClient?.email.toLowerCase()
  );

  // Filter clients list
  const filteredClients = clients.filter(c => {
    if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTierBadge = (tier: string) => {
    if (tier === 'Trade / B2B') return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Trade / B2B</span>;
    if (tier === 'VIP') return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">VIP</span>;
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Retail</span>;
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Client Directory & Accounts</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {clients.length} Clients
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Access complete lifetime order files, bespoke project requests, delivery addresses, and communication threads per client.
          </p>
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: Client List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-3">
          
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Registered Accounts</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients, studios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-7 pr-3 py-1.5 rounded bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
              {['All', 'Trade / B2B', 'VIP', 'Retail'].map(t => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-2 py-1 rounded font-semibold whitespace-nowrap transition-colors ${
                    tierFilter === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Client list item cards */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              const countOfOrders = orders.filter(o => o.clientId === client.id).length;

              return (
                <div
                  key={client.id}
                  onClick={() => {
                    setSelectedClientId(client.id);
                    setSearchParams({ clientId: client.id });
                  }}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer text-xs space-y-1 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="truncate">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{client.name}</h4>
                      {client.company && (
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 truncate">
                          <Building2 className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">{client.company}</span>
                        </p>
                      )}
                    </div>
                    {getTierBadge(client.tier)}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-2.5 h-2.5 text-indigo-600" />
                      <span>{countOfOrders} orders</span>
                    </span>
                    <span className="font-bold text-slate-800">
                      {currency}{client.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Selected Client's Full Order History & Profile (8 Cols) */}
        {selectedClient ? (
          <div className="lg:col-span-8 space-y-4">
            
            {/* Selected Client Profile Overview */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">{selectedClient.name}</h3>
                      {getTierBadge(selectedClient.tier)}
                    </div>
                    <p className="text-[11px] text-slate-400">{selectedClient.company || 'Private Client'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/inquiries?search=${selectedClient.name}`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Inquiries ({clientInquiries.length})</span>
                  </button>
                </div>
              </div>

              {/* Client Specs & Spend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Lifetime Spend</span>
                  <p className="text-xs font-black text-slate-800">{currency}{selectedClient.totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Orders</span>
                  <p className="text-xs font-black text-slate-800">{clientOrders.length} placed</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Contact Email</span>
                  <p className="font-medium text-slate-700 truncate text-[11px]">{selectedClient.email}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Phone</span>
                  <p className="font-medium text-slate-700 text-[11px]">{selectedClient.phone}</p>
                </div>
              </div>

              {/* Address & Notes */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  <span>Default Delivery Destination:</span>
                </div>
                <p className="text-slate-500 pl-4 text-[11px]">
                  {selectedClient.address}, {selectedClient.city}, {selectedClient.state} - {selectedClient.pincode}
                </p>
                {selectedClient.notes && (
                  <p className="text-amber-800 font-medium text-[10px] pl-4 pt-0.5">
                    Note: {selectedClient.notes}
                  </p>
                )}
              </div>

            </div>

            {/* ALL ORDERS FOR THIS CLIENT SECTION */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <PackageCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Orders Placed by {selectedClient.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Complete archive of past and ongoing furniture consignments
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {clientOrders.length} Records
                </span>
              </div>

              {/* Orders List Table */}
              {clientOrders.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No orders have been recorded yet for this client.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-2 px-3">Order Number</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Purchased Items</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Status</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold text-slate-800">
                            {ord.orderNumber}
                          </td>
                          <td className="py-2 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                            {ord.createdAt}
                          </td>
                          <td className="py-2 px-3">
                            <div className="space-y-0.5">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-slate-700 text-[11px]">
                                  <span className="w-1 h-1 rounded-full bg-indigo-600"></span>
                                  <span className="font-semibold">{item.quantity}x</span>
                                  <span className="truncate max-w-[160px]">{item.productName}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-slate-800 text-xs">
                            {currency}{ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Badge variant={getOrderStatusVariant(ord.status)} size="sm">
                              {ord.status}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => setInspectOrder(ord)}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] shadow-xs"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-400 text-xs">
            Select a client from the left directory to inspect their full order ledger.
          </div>
        )}

      </div>

      {/* Order Modal */}
      <OrderDetailsModal
        order={inspectOrder}
        onClose={() => setInspectOrder(null)}
      />

    </div>
  );
};
