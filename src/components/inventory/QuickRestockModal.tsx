import React, { useState } from 'react';
import { X, Boxes, Plus, Minus, Save, Warehouse } from 'lucide-react';
import { Product } from '../../types';
import { useSeller, WAREHOUSES } from '../../context/SellerContext';

interface QuickRestockModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickRestockModal: React.FC<QuickRestockModalProps> = ({ product, onClose }) => {
  const { updateProductStock } = useSeller();
  if (!product) return null;

  const [newStock, setNewStock] = useState<number>(product.stock);
  const [reason, setReason] = useState<string>('Factory Restock PO Arrival');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(product.warehouse);

  const difference = newStock - product.stock;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProductStock(product.id, newStock, reason, selectedWarehouse);
    onClose();
  };

  const reasonsList = [
    'Factory Restock PO Arrival',
    'Warehouse Cycle Count Audit',
    'Damaged / Defective Stock Write-off',
    'Showroom / Exhibit Allocation',
    'Customer Return Restocked'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Adjust Inventory Stock</h3>
              <p className="text-[10px] text-slate-400 font-mono">{product.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-4 space-y-3 text-xs">
          
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5">
            <img 
              src={product.images[0]} 
              alt="" 
              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            />
            <div>
              <h4 className="font-bold text-slate-800 text-xs leading-tight">{product.name}</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Current Stock: <strong className="text-slate-800">{product.stock} units</strong></p>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 text-xs block">New Available Physical Stock</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewStock(prev => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 text-center font-bold text-base py-1.5 rounded bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setNewStock(prev => prev + 1)}
                className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex justify-between items-center px-1 text-[10px]">
              <span className="text-slate-400">Net Stock Change:</span>
              <span className={`font-bold ${difference > 0 ? 'text-emerald-700' : difference < 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                {difference > 0 ? `+${difference} units` : difference < 0 ? `${difference} units` : 'No change'}
              </span>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex gap-1.5">
            {[+5, +10, +25, +50].map(add => (
              <button
                key={add}
                type="button"
                onClick={() => setNewStock(prev => prev + add)}
                className="flex-1 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold text-[11px] transition-colors"
              >
                +{add}
              </button>
            ))}
          </div>

          {/* Warehouse */}
          <div className="space-y-0.5">
            <label className="font-semibold text-slate-700 text-xs block flex items-center gap-1">
              <Warehouse className="w-3 h-3 text-slate-400" />
              <span>Assigned Warehouse Node</span>
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full p-2 rounded bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-xs"
            >
              {WAREHOUSES.filter(w => w !== 'All Warehouses').map(wh => (
                <option key={wh} value={wh}>{wh}</option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-0.5">
            <label className="font-semibold text-slate-700 text-xs block">Adjustment Audit Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 rounded bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-xs"
            >
              {reasonsList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="Custom Reason">Other / Custom Note...</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Save className="w-3 h-3" />
              <span>Confirm Stock Update</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

