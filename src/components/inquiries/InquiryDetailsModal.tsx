import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ExternalLink
} from 'lucide-react';
import { CustomerInquiry, InquiryPriority, InquiryStatus } from '../../types';
import { useSeller } from '../../context/SellerContext';
import { Badge, getInquiryStatusVariant, getPriorityVariant } from '../common/Badge';
import { useNavigate } from 'react-router-dom';

interface InquiryDetailsModalProps {
  inquiry: CustomerInquiry | null;
  onClose: () => void;
}

export const InquiryDetailsModal: React.FC<InquiryDetailsModalProps> = ({ inquiry, onClose }) => {
  const { replyToInquiry, updateInquiryStatus, updateInquiryPriority } = useSeller();
  const navigate = useNavigate();

  if (!inquiry) return null;

  const [replyText, setReplyText] = useState('');
  const [currentStatus, setCurrentStatus] = useState<InquiryStatus>(inquiry.status);
  const [currentPriority, setCurrentPriority] = useState<InquiryPriority>(inquiry.priority);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyToInquiry(inquiry.id, replyText);
    setReplyText('');
    setCurrentStatus('Awaiting Client');
  };

  const smartTemplates = [
    {
      title: '🪵 Wood & Finish Care Guide',
      text: 'Dear client, thank you for reaching out to HomeTown! Our solid wood pieces are sealed with food-grade protective oils. We recommend dusting with a dry microfiber cloth and avoiding direct sunlight or acidic cleaners. A complimentary bottle of HomeTown Timber Shield is included with your order.'
    },
    {
      title: '📐 Custom Sizing Feasibility',
      text: 'Hello! Our custom carpentry bay can modify dimension specifications for select furniture pieces. Please allow 4-6 additional business days for master artisan calibration. A minor bespoke adjustment fee of 12-15% applies.'
    },
    {
      title: '🚚 White-Glove Delivery Notice',
      text: 'Greetings from HomeTown Logistics! Your order is scheduled with our dedicated 2-person white-glove transport crew. Our drivers will call 1 hour prior to arrival and will assist with unboxing and room-of-choice placement.'
    },
    {
      title: '🧵 Swatch Kit Dispatch',
      text: 'We are delighted to dispatch our complimentary Designer Swatch Box (including Italian Velvet, Bouclé, and Solid Wood timber blocks) to your studio address via courier within 24 hours.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">{inquiry.inquiryNumber}</h3>
                <Badge variant={getInquiryStatusVariant(currentStatus)} dot size="sm">
                  {currentStatus}
                </Badge>
                <Badge variant={getPriorityVariant(currentPriority)} size="sm">
                  {currentPriority} Priority
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{inquiry.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Client & Order Context Banner */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3 text-slate-600 text-[11px]">
            <span>Client: <strong className="text-slate-800">{inquiry.clientName}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Email: <strong className="text-slate-800">{inquiry.clientEmail}</strong></span>
            {inquiry.relatedProductName && (
              <>
                <span className="text-slate-300">•</span>
                <span>Product: <strong className="text-slate-800">{inquiry.relatedProductName}</strong></span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/clients?clientId=${inquiry.clientId}`);
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
            >
              <span>View Client Profile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Subject</span>
            <h4 className="text-xs font-bold text-slate-800">{inquiry.subject}</h4>
          </div>

          {/* Conversation history */}
          <div className="space-y-3 pt-1">
            {inquiry.messages.map((msg) => {
              const isSeller = msg.sender === 'Seller Support';
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-xl max-w-xl text-xs leading-relaxed ${
                    isSeller 
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                  }`}>
                    <p>{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Smart AI / Furniture Quick Response Presets */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>One-Click Smart Response Presets</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to insert snippet</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {smartTemplates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReplyText(tpl.text)}
                  className="p-2 rounded-lg text-left bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-200 transition-all text-xs group"
                >
                  <p className="font-semibold text-slate-800 group-hover:text-indigo-700 text-xs">{tpl.title}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{tpl.text}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Reply Box & Status Selector */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-2.5">
          
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600 text-xs">Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => {
                  const s = e.target.value as InquiryStatus;
                  setCurrentStatus(s);
                  updateInquiryStatus(inquiry.id, s);
                }}
                className="px-2 py-1 rounded bg-white border border-slate-300 font-medium text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Client">Awaiting Client</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600 text-xs">Priority:</span>
              <select
                value={currentPriority}
                onChange={(e) => {
                  const p = e.target.value as InquiryPriority;
                  setCurrentPriority(p);
                  updateInquiryPriority(inquiry.id, p);
                }}
                className="px-2 py-1 rounded bg-white border border-slate-300 font-medium text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSendReply} className="flex gap-2">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the customer or select a preset above..."
              className="flex-1 text-xs p-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

