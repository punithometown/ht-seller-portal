import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Truck, 
  Printer, 
  FileText, 
  Save, 
  Building,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useSeller } from '../../context/SellerContext';
import { Badge, getOrderStatusVariant } from '../common/Badge';
import { useNavigate } from 'react-router-dom';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus, updateOrderNotes, currency, clients } = useSeller();
  const navigate = useNavigate();

  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [internalNotes, setInternalNotes] = useState(order.internalSellerNotes || '');

  const clientInfo = clients.find(c => c.id === order.clientId);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    updateOrderStatus(order.id, newStatus, 'Seller Staff', `Status changed to ${newStatus}`);
  };

  const handleSaveNotes = () => {
    updateOrderNotes(order.id, internalNotes);
  };

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'In Production / Carpentry',
    'Quality Check',
    'Packed & Ready',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">{order.orderNumber}</h3>
                <Badge variant={getOrderStatusVariant(currentStatus)} dot size="sm">
                  {currentStatus}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-2.5 h-2.5" />
                <span>Placed on {new Date(order.placedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Status Workflow Progress Stepper */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment Lifecycle</span>
                <p className="text-[11px] text-slate-500">Update manufacturing and delivery status</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Change Status:</span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="text-xs font-semibold px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {statusOptions.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick status pill tracker */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-2 border-t border-slate-200">
              {['Confirmed', 'In Production / Carpentry', 'Packed & Ready', 'Shipped', 'Delivered'].map((step, idx) => {
                const isCurrent = currentStatus === step;
                const isPassed = statusOptions.indexOf(currentStatus) >= statusOptions.indexOf(step as OrderStatus);
                return (
                  <div 
                    key={step}
                    className={`px-2 py-1.5 rounded-lg text-center text-xs font-medium border transition-all ${
                      isCurrent ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' :
                      isPassed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      'bg-white text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-[9px] opacity-80">Step 0{idx + 1}</div>
                    <div className="truncate text-[11px]">{step}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client & Shipping Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Client Info Card with Drilldown Button */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Profile</span>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/clients?clientId=${order.clientId}`);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                >
                  <span>See all orders</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-start gap-2.5">
                <img 
                  src={clientInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                  alt={order.clientName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{order.clientName}</h4>
                  {clientInfo?.company && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building className="w-2.5 h-2.5 text-slate-400" />
                      <span>{clientInfo.company}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5 text-slate-400" />
                      <span>{order.clientEmail}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-slate-400" />
                      <span>{order.clientPhone}</span>
                    </span>
                  </div>
                </div>
              </div>

              {clientInfo && (
                <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] flex items-center justify-between">
                  <span className="text-slate-500">Tier: <strong className="text-slate-800">{clientInfo.tier}</strong></span>
                  <span className="text-slate-500">LTV: <strong className="text-slate-800">{currency}{clientInfo.totalSpent.toLocaleString()}</strong></span>
                </div>
              )}
            </div>

            {/* Delivery & Logistics Card */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logistics & Freight</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-slate-400" />
                  <span>{order.courierService || 'Standard Freight'}</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px]">{order.shippingAddress.street}</p>
                    <p className="text-slate-500 text-[11px]">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode} ({order.shippingAddress.country})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Tracking ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{order.trackingNumber || 'Awaiting Dispatch'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Estimated Arrival:</span>
                    <span className="font-semibold text-slate-800">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Ordered Furniture Items Table */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Ordered ({order.items.length})</span>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Product & Spec</th>
                    <th className="py-2.5 px-3">SKU / Category</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=120&q=80'} 
                            alt={item.productName} 
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                          />
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{item.productName}</p>
                            {item.customFinish && (
                              <p className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5 border border-indigo-100">
                                Custom: {item.customFinish}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-slate-600 text-xs">{item.sku}</span>
                        <p className="text-slate-400 text-[10px]">{item.category}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-800 text-xs">
                        {currency}{item.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 text-xs">
                        x{item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800 text-xs">
                        {currency}{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Calculation Bar */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-500 text-[11px]">
                    Payment Method: <strong className="text-slate-800">{order.paymentMethod}</strong> ({order.paymentStatus})
                  </p>
                  {order.customerNotes && (
                    <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 max-w-md text-[11px]">
                      <strong className="text-slate-800">Customer Note:</strong> {order.customerNotes}
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-60 space-y-1 text-slate-600 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span>Subtotal:</span>
                    <span className="font-medium text-slate-800">{currency}{order.subtotal.toLocaleString()}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium text-[11px]">
                      <span>Discount:</span>
                      <span>-{currency}{order.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px]">
                    <span>GST (9%):</span>
                    <span>{currency}{order.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Freight:</span>
                    <span>{order.shippingFee === 0 ? 'Free' : `${currency}${order.shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200 text-xs font-bold text-slate-800">
                    <span>Total Amount:</span>
                    <span className="text-sm font-black text-indigo-700">{currency}{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes & Timeline Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Internal Seller Notes */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal Staff Notes</span>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add private workshop or delivery notes..."
                className="w-full text-xs p-2 rounded bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <Save className="w-3 h-3" />
                <span>Save Notes</span>
              </button>
            </div>

            {/* Timeline Audit Logs */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Event Timeline</span>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {order.timeline.map((log) => (
                  <div key={log.id} className="flex items-start gap-1.5 text-xs">
                    <Clock className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-slate-800 text-[11px]">{log.status}</strong>
                        <span className="text-[10px] text-slate-400">• {log.timestamp}</span>
                      </div>
                      <p className="text-slate-500 text-[10px]">{log.description} ({log.actor})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[10px]">HomeTown Merchant Order Engine</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

