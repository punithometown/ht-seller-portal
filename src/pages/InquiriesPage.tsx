import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search
} from 'lucide-react';
import { useSeller } from '../context/SellerContext';
import { CustomerInquiry } from '../types';
import { Badge, getInquiryStatusVariant, getPriorityVariant } from '../components/common/Badge';
import { InquiryDetailsModal } from '../components/inquiries/InquiryDetailsModal';
import { useSearchParams } from 'react-router-dom';

export const InquiriesPage: React.FC = () => {
  const { inquiries } = useSeller();
  const [searchParams] = useSearchParams();

  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Stats
  const newTickets = inquiries.filter(i => i.status === 'New').length;
  const inProgressTickets = inquiries.filter(i => i.status === 'In Progress').length;
  const urgentTickets = inquiries.filter(i => i.priority === 'Urgent').length;
  const resolvedTickets = inquiries.filter(i => i.status === 'Resolved').length;

  // Filter
  const filteredInquiries = inquiries.filter(inq => {
    if (statusFilter !== 'All' && inq.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && inq.priority !== priorityFilter) return false;
    if (categoryFilter !== 'All' && inq.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inq.inquiryNumber.toLowerCase().includes(q) ||
        inq.clientName.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        (inq.relatedProductName && inq.relatedProductName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Customer Inquiries & Concierge</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {inquiries.length} Inquiries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Resolve buyer questions regarding custom sizing, timber care, white-glove transport, and designer swatch dispatches.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unassigned / New</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-amber-700">{newTickets}</h3>
            <span className="text-[10px] text-amber-600 font-semibold">Needs Reply</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active In Progress</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-blue-700">{inProgressTickets}</h3>
            <span className="text-[10px] text-blue-600 font-semibold">In Dialogue</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgent Attention</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-rose-700">{urgentTickets}</h3>
            <span className="text-[10px] text-rose-600 font-semibold">High Priority</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Rate</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-emerald-700">{resolvedTickets}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Closed</span>
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
              placeholder="Search by Ticket #, Client, Subject or Product..."
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
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Client">Awaiting Client</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Custom Sizing & Bespoke">Custom Sizing & Bespoke</option>
              <option value="Assembly & White-Glove">Assembly & White-Glove</option>
              <option value="Wood & Fabric Care">Wood & Fabric Care</option>
              <option value="Swatch Sample Request">Swatch Sample Request</option>
              <option value="Warranty & Service">Warranty & Service</option>
            </select>
          </div>

        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Ticket # & Time</th>
                <th className="py-2.5 px-3.5">Client</th>
                <th className="py-2.5 px-3.5">Subject & Category</th>
                <th className="py-2.5 px-3.5">Related Product</th>
                <th className="py-2.5 px-3.5 text-center">Priority</th>
                <th className="py-2.5 px-3.5 text-center">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No customer inquiries found with current filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <p className="font-mono font-bold text-slate-800">{inq.inquiryNumber}</p>
                      <span className="text-[10px] text-slate-400">{inq.createdAt}</span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="font-semibold text-slate-800">{inq.clientName}</p>
                      <span className="text-[10px] text-slate-400">{inq.clientEmail}</span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="font-medium text-slate-800 leading-snug">{inq.subject}</p>
                      <span className="text-[10px] text-indigo-600 font-semibold">{inq.category}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      {inq.relatedProductName ? (
                        <span className="truncate max-w-[160px] block font-medium text-[11px]">
                          {inq.relatedProductName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">General Catalog</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge variant={getPriorityVariant(inq.priority)} size="sm">
                        {inq.priority}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge variant={getInquiryStatusVariant(inq.status)} size="sm" dot>
                        {inq.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryDetailsModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
      />

    </div>
  );
};
