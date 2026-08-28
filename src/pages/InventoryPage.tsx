import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle, 
  Upload, 
  Download, 
  Search, 
  Warehouse, 
  Zap, 
  RefreshCw, 
  Clock, 
  Plus, 
  Minus, 
  FileSpreadsheet,
  TrendingDown
} from 'lucide-react';
import { useSeller, WAREHOUSES } from '../context/SellerContext';
import { Product } from '../types';
import { Badge, getProductStatusVariant } from '../components/common/Badge';
import { QuickRestockModal } from '../components/inventory/QuickRestockModal';

export const InventoryPage: React.FC = () => {
  const { 
    products, 
    updateProductStock, 
    importInventoryFromCSV, 
    inventoryLogs, 
    triggerSimulatedSale,
    triggerSimulatedRestock,
    activeWarehouse,
    setActiveWarehouse,
    currency 
  } = useSeller();

  const [activeTab, setActiveTab] = useState<'monitor' | 'csv-upload' | 'audit-logs'>('monitor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Low Stock' | 'Out of Stock' | 'Active'>('All');
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

  // CSV Inventory State
  const [csvRawText, setCsvRawText] = useState('');
  const [csvRowsPreview, setCsvRowsPreview] = useState<{ sku: string; newStock: number; warehouse?: string; reason?: string }[]>([]);
  const [csvFeedback, setCsvFeedback] = useState<{ updated: number; failed: string[] } | null>(null);

  // Statistics
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= p.minStockThreshold);
  const outOfStockItems = products.filter(p => p.stock === 0);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (activeWarehouse !== 'All Warehouses' && p.warehouse !== activeWarehouse) {
      return false;
    }
    if (selectedStatusFilter !== 'All' && p.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.warehouse.toLowerCase().includes(q);
    }
    return true;
  });

  // Download Sample Inventory CSV
  const downloadSampleInventoryCsv = () => {
    const csvContent = `sku,newStock,warehouse,reason
HT-LIV-SOF-001,25,Central Warehouse - Hub A,Factory Inbound Shipment
HT-DIN-TBL-002,15,North Hub - Sector 4,Cycle Count Correction
HT-BED-KNG-003,12,Central Warehouse - Hub A,Seasonal Restock
HT-LIV-ARM-004,30,West Depot - Unit 2,Batch Production PO-882
HT-DEC-COF-005,10,Central Warehouse - Hub A,Restocked from Master Mill
HT-STU-DSK-007,8,North Hub - Sector 4,Restock Backordered Desk`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'HomeTown_Bulk_Inventory_Update.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvRawText(text);
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length > 1) {
          const rows: any[] = [];
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim());
            if (parts[0] && parts[1]) {
              rows.push({
                sku: parts[0],
                newStock: parseInt(parts[1]) || 0,
                warehouse: parts[2] || 'Central Warehouse - Hub A',
                reason: parts[3] || 'Bulk Inventory CSV Update'
              });
            }
          }
          setCsvRowsPreview(rows);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleApplyInventoryCsv = () => {
    if (csvRowsPreview.length === 0) return;
    const result = importInventoryFromCSV(csvRowsPreview);
    setCsvFeedback(result);
    setTimeout(() => {
      setActiveTab('monitor');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      
      {/* Header with Live Sync Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Inventory Command Center</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Live Sync</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time stock deduction, warehouse reorder alerts, batch CSV inventory syncing, and audit trail.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerSimulatedSale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-semibold transition-all shadow-xs"
            title="Simulate storefront customer order"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>Simulate Sale (-Stock)</span>
          </button>

          <button
            onClick={triggerSimulatedRestock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold transition-all shadow-xs"
            title="Simulate warehouse inbound batch"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulate Inbound (+10)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Units in Stock</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-slate-800">{totalUnits}</h3>
            <span className="text-[10px] text-slate-400">{products.length} SKUs Listed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Stock Value</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-slate-800">{currency}{totalValuation.toLocaleString()}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Retail Valuation</span>
          </div>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Low Stock' ? 'All' : 'Low Stock')}
          className={`rounded-xl p-3.5 border shadow-sm space-y-1 cursor-pointer transition-all ${
            lowStockItems.length > 0 ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/70' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Low Stock Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-amber-800">{lowStockItems.length}</h3>
            <span className="text-[10px] text-amber-700 font-semibold">Filter</span>
          </div>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Out of Stock' ? 'All' : 'Out of Stock')}
          className={`rounded-xl p-3.5 border shadow-sm space-y-1 cursor-pointer transition-all ${
            outOfStockItems.length > 0 ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/70' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Out of Stock</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-black text-rose-800">{outOfStockItems.length}</h3>
            <span className="text-[10px] text-rose-700 font-semibold">Filter</span>
          </div>
        </div>
      </div>

      {/* Mode Tabs: 1. Live Stock Monitor, 2. Inventory CSV Upload, 3. Audit Logs */}
      <div className="bg-slate-100 p-1 rounded-lg flex flex-wrap gap-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'monitor'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-indigo-600" />
          <span>Live Stock Table</span>
        </button>

        <button
          onClick={() => setActiveTab('csv-upload')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'csv-upload'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
          <span>CSV Batch Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'audit-logs'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Audit Log ({inventoryLogs.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: LIVE STOCK TABLE & INLINE ADJUSTER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'monitor' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inventory by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Stock Levels</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Active">Healthy Stock</option>
              </select>

              <select
                value={activeWarehouse}
                onChange={(e) => setActiveWarehouse(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {WAREHOUSES.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3.5">Furniture Item & SKU</th>
                  <th className="py-2.5 px-3.5">Warehouse Location</th>
                  <th className="py-2.5 px-3.5 text-center">Alert Threshold</th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                  <th className="py-2.5 px-3.5 text-center">Quick Stock Adjuster</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={prod.images[0]} 
                          alt="" 
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{prod.name}</p>
                          <span className="font-mono text-[10px] text-slate-400">{prod.sku} • {prod.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Warehouse className="w-3 h-3 text-slate-400" />
                        <span>{prod.warehouse}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-medium text-slate-500 text-[11px]">
                      &le; {prod.minStockThreshold} units
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge variant={getProductStatusVariant(prod.status)} size="sm">
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {/* Inline Quick Counter Adjuster */}
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateProductStock(prod.id, Math.max(0, prod.stock - 1), 'Quick Inline Stock Decrement')}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                          title="Decrease Stock"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className={`w-10 text-center font-bold text-xs ${
                          prod.stock === 0 ? 'text-rose-600' :
                          prod.stock <= prod.minStockThreshold ? 'text-amber-600' :
                          'text-emerald-700'
                        }`}>
                          {prod.stock}
                        </span>
                        <button
                          onClick={() => updateProductStock(prod.id, prod.stock + 1, 'Quick Inline Stock Increment')}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                          title="Increase Stock"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={() => setRestockProduct(prod)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] shadow-xs"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: INVENTORY CSV BATCH UPLOAD */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'csv-upload' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upload Inventory Stock CSV</h3>
              <p className="text-[11px] text-slate-400">
                Bulk overwrite or reconcile warehouse inventory counts by matching SKUs.
              </p>
            </div>
            <button
              onClick={downloadSampleInventoryCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 rounded-xl p-6 text-center transition-colors relative">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleCsvFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Select your Inventory Update CSV
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Required columns: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">sku, newStock, warehouse, reason</code>
                </p>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-semibold"
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Parsed Preview */}
          {csvRowsPreview.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Parsed Batch ({csvRowsPreview.length} Items to Reconcile)
                </span>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[10px] font-bold uppercase sticky top-0">
                    <tr>
                      <th className="py-2 px-3">SKU</th>
                      <th className="py-2 px-3 text-center">New Stock Count</th>
                      <th className="py-2 px-3">Target Warehouse</th>
                      <th className="py-2 px-3">Audit Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 bg-white">
                    {csvRowsPreview.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">{row.sku}</td>
                        <td className="py-2 px-3 text-center font-bold text-indigo-600">{row.newStock}</td>
                        <td className="py-2 px-3 text-slate-600">{row.warehouse}</td>
                        <td className="py-2 px-3 text-slate-400">{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyInventoryCsv}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Execute Bulk Inventory Update</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: LIVE AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'audit-logs' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Inventory Modification Audit Trail</h3>
              <p className="text-[11px] text-slate-400">Immutable ledger of orders, restocks, and warehouse counts</p>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Auto-recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Event Type</th>
                  <th className="py-2 px-3">Product & SKU</th>
                  <th className="py-2 px-3 text-center">Previous &rarr; New</th>
                  <th className="py-2 px-3 text-center">Delta</th>
                  <th className="py-2 px-3">Audit Reason</th>
                  <th className="py-2 px-3">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap text-[10px]">{log.timestamp}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                        log.type === 'SALE' ? 'bg-amber-100 text-amber-800' :
                        log.type === 'RESTOCK' ? 'bg-emerald-100 text-emerald-800' :
                        log.type === 'CSV_BATCH_UPDATE' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      <p className="truncate max-w-[180px] text-xs">{log.productName}</p>
                      <span className="font-mono text-[9px] text-slate-400">{log.sku}</span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[11px]">
                      {log.previousStock} &rarr; <strong className="text-slate-800">{log.newStock}</strong>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-xs">
                      <span className={log.change > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[10px] max-w-xs truncate">{log.reason}</td>
                    <td className="py-2 px-3 text-slate-400 text-[10px] whitespace-nowrap">{log.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      <QuickRestockModal
        product={restockProduct}
        onClose={() => setRestockProduct(null)}
      />

    </div>
  );
};
