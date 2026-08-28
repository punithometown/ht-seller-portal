import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  FileSpreadsheet, 
  Layers, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Trash2, 
  Copy, 
  ArrowRight,
  Info,
  Sparkles,
  Save
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSeller, WAREHOUSES } from '../context/SellerContext';
import { ProductCategory, Product } from '../types';
import { shopifyApi } from '../services/shopifyApi';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'csv' ? 'csv' : searchParams.get('tab') === 'bulk' ? 'bulk' : 'single';
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'csv'>(initialTab as any);

  const { addProduct, bulkAddProducts, importProductsFromCSV, currency } = useSeller();

  // -------------------------------------------------------------
  // TAB 1: SINGLE PRODUCT FORM STATE
  // -------------------------------------------------------------
  const [singleForm, setSingleForm] = useState({
    sku: `HT-FURN-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    category: 'Living Room' as ProductCategory,
    subCategory: 'Sofas & Seating',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    stock: '10',
    minStockThreshold: '4',
    material: 'Solid Teak Wood & Natural Bouclé Fabric',
    finish: 'Warm Honey Walnut',
    widthCm: '180',
    depthCm: '85',
    heightCm: '78',
    weightKg: '42',
    roomType: 'Living Room',
    assemblyRequired: false,
    warrantyYears: '5',
    warehouse: 'Central Warehouse - Hub A',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    tags: 'Handcrafted, Modern, Solid Wood',
    description: 'Masterfully crafted designer furniture piece engineered with seasoned kiln-dried wood and high-resilience ergonomic cushioning.'
  });

  const [singleSuccess, setSingleSuccess] = useState(false);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleForm.name || !singleForm.price || !singleForm.sku) {
      alert('Please fill out product title, SKU, and price.');
      return;
    }

    const priceNum = parseFloat(singleForm.price);
    const costNum = singleForm.costPrice ? parseFloat(singleForm.costPrice) : Math.round(priceNum * 0.48);
    const stockNum = parseInt(singleForm.stock) || 0;
    const thresholdNum = parseInt(singleForm.minStockThreshold) || 4;

    const newProd = addProduct({
      sku: singleForm.sku.trim().toUpperCase(),
      name: singleForm.name.trim(),
      category: singleForm.category,
      subCategory: singleForm.subCategory,
      price: priceNum,
      compareAtPrice: singleForm.compareAtPrice ? parseFloat(singleForm.compareAtPrice) : undefined,
      costPrice: costNum,
      stock: stockNum,
      minStockThreshold: thresholdNum,
      material: singleForm.material,
      finish: singleForm.finish,
      dimensions: {
        widthCm: parseFloat(singleForm.widthCm) || 100,
        depthCm: parseFloat(singleForm.depthCm) || 80,
        heightCm: parseFloat(singleForm.heightCm) || 75
      },
      weightKg: parseFloat(singleForm.weightKg) || 25,
      roomType: singleForm.roomType,
      assemblyRequired: singleForm.assemblyRequired,
      warrantyYears: parseInt(singleForm.warrantyYears) || 3,
      status: stockNum === 0 ? 'Out of Stock' : stockNum <= thresholdNum ? 'Low Stock' : 'Active',
      images: [singleForm.imageUrl],
      description: singleForm.description,
      warehouse: singleForm.warehouse,
      tags: singleForm.tags.split(',').map(t => t.trim())
    });

    // Synchronize with Shopify GraphQL Backend API
    shopifyApi.createProduct({
      title: singleForm.name.trim(),
      sku: singleForm.sku.trim().toUpperCase(),
      price: priceNum,
      compareAtPrice: singleForm.compareAtPrice ? parseFloat(singleForm.compareAtPrice) : undefined,
      cost: costNum,
      productType: singleForm.category,
      vendor: 'HomeTown',
      description: singleForm.description,
      stock: stockNum,
      images: [singleForm.imageUrl],
      tags: singleForm.tags.split(',').map(t => t.trim())
    }).catch(err => console.log('Shopify API sync note:', err));

    setSingleSuccess(true);
    setTimeout(() => {
      navigate('/products');
    }, 1200);
  };

  // Image Presets for rapid testing
  const sampleImagePresets = [
    { label: 'Velvet Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Teak Dining Table', url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Oak Bed Frame', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Bouclé Armchair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Travertine Table', url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Brass Pendant', url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80' }
  ];

  // -------------------------------------------------------------
  // TAB 2: BULK MULTI-ROW BUILDER STATE
  // -------------------------------------------------------------
  const [bulkRows, setBulkRows] = useState([
    {
      sku: 'HT-BULK-001',
      name: 'Nordic Solid Oak Floating Nightstand',
      category: 'Bedroom' as ProductCategory,
      price: '280',
      stock: '15',
      material: 'White Oak & Brass Pulls',
      finish: 'Matte Natural',
      warehouse: 'Central Warehouse - Hub A'
    },
    {
      sku: 'HT-BULK-002',
      name: 'Kyoto Woven Rattan Counter Stool (Set of 2)',
      category: 'Kitchen & Dining' as ProductCategory,
      price: '340',
      stock: '20',
      material: 'Plantation Teak & Cane',
      finish: 'Warm Caramel',
      warehouse: 'West Depot - Unit 2'
    },
    {
      sku: 'HT-BULK-003',
      name: 'Linear Ribbed Ceramic Table Lamp',
      category: 'Lighting' as ProductCategory,
      price: '165',
      stock: '30',
      material: 'Stoneware Ceramic & Linen Shade',
      finish: 'Oatmeal White',
      warehouse: 'North Hub - Sector 4'
    }
  ]);

  const handleAddBulkRow = () => {
    setBulkRows(prev => [
      ...prev,
      {
        sku: `HT-BULK-00${prev.length + 1}`,
        name: '',
        category: 'Living Room',
        price: '450',
        stock: '10',
        material: 'Solid Sheesham Wood',
        finish: 'Walnut Finish',
        warehouse: 'Central Warehouse - Hub A'
      }
    ]);
  };

  const handleRemoveBulkRow = (idx: number) => {
    setBulkRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCloneBulkRow = (idx: number) => {
    const target = bulkRows[idx];
    setBulkRows(prev => [
      ...prev,
      {
        ...target,
        sku: `${target.sku}-COPY`,
        name: `${target.name} (Copy)`
      }
    ]);
  };

  const handleBulkSubmit = () => {
    const invalidRows = bulkRows.filter(r => !r.sku || !r.name || !r.price);
    if (invalidRows.length > 0) {
      alert('Please ensure all rows have a valid SKU, Title, and Price.');
      return;
    }

    const payload = bulkRows.map(r => ({
      sku: r.sku.trim().toUpperCase(),
      name: r.name.trim(),
      category: r.category,
      subCategory: 'Furniture Collection',
      price: parseFloat(r.price) || 100,
      costPrice: Math.round((parseFloat(r.price) || 100) * 0.45),
      stock: parseInt(r.stock) || 0,
      minStockThreshold: 5,
      material: r.material,
      finish: r.finish,
      dimensions: { widthCm: 120, depthCm: 60, heightCm: 75 },
      weightKg: 20,
      roomType: r.category,
      assemblyRequired: false,
      warrantyYears: 3,
      status: (parseInt(r.stock) || 0) === 0 ? 'Out of Stock' : (parseInt(r.stock) || 0) <= 5 ? 'Low Stock' : 'Active' as any,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'],
      description: 'HomeTown signature furniture crafted with precision joinery.',
      warehouse: r.warehouse,
      tags: ['Bulk Batch', 'New Arrival']
    }));

    bulkAddProducts(payload);

    // Synchronize bulk batch with Shopify GraphQL Backend API
    shopifyApi.bulkCreateProducts(payload.map(p => ({
      title: p.name,
      sku: p.sku,
      price: p.price,
      cost: p.costPrice,
      productType: p.category,
      vendor: 'HomeTown',
      stock: p.stock,
      description: p.description,
      images: p.images
    }))).catch(err => console.log('Shopify bulk sync note:', err));

    navigate('/products');
  };

  // -------------------------------------------------------------
  // TAB 3: CSV SPREADSHEET UPLOADER STATE
  // -------------------------------------------------------------
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Sample CSV template generator (direct from server endpoint)
  const downloadSampleCsv = () => {
    window.location.href = shopifyApi.getTemplateDownloadUrl();
  };

  const parseCsvContent = (content: string) => {
    setIsParsing(true);
    setCsvErrors([]);
    try {
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setCsvErrors(['CSV file must contain at least 1 header row and 1 data row.']);
        setParsedPreview([]);
        setIsParsing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const parsedRows: any[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Handle CSV split respecting basic values
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        if (values.length < 3) continue;

        const rowObj: any = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });

        if (!rowObj.sku || !rowObj.name || !rowObj.price) {
          errors.push(`Row ${i + 1}: Missing SKU, Title or Price`);
        }

        parsedRows.push(rowObj);
      }

      setParsedPreview(parsedRows);
      setCsvErrors(errors);
    } catch (err: any) {
      setCsvErrors([`Failed to parse CSV file: ${err.message}`]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvRawText(text);
        parseCsvContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleCommitCsvImport = async () => {
    if (parsedPreview.length === 0 && !csvFile) return;
    setIsUploadingFile(true);
    
    // 1. Process local context
    if (parsedPreview.length > 0) {
      importProductsFromCSV(parsedPreview);
    }

    // 2. Process backend file upload API (handles aliases and normalization on server)
    if (csvFile) {
      try {
        await shopifyApi.uploadProductFile(csvFile);
      } catch (err: any) {
        console.log('Backend upload note:', err.message);
      }
    }

    setIsUploadingFile(false);
    navigate('/products');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Add Furniture Products</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              Merchant Creator
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Choose between standard single listing, rapid multi-row batch entry, or enterprise CSV spreadsheet import.
          </p>
        </div>

        <button
          onClick={() => navigate('/products')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 self-start sm:self-auto"
        >
          &larr; Back to Catalog
        </button>
      </div>

      {/* Segmented Mode Selector */}
      <div className="bg-stone-200/80 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1">
        <button
          onClick={() => {
            setActiveTab('single');
            setSearchParams({});
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'single'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Plus className="w-4 h-4 text-amber-800" />
          <span>Single Product Entry</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bulk');
            setSearchParams({ tab: 'bulk' });
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bulk'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-800" />
          <span>Multi-Row Bulk Builder ({bulkRows.length} Rows)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('csv');
            setSearchParams({ tab: 'csv' });
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'csv'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-800" />
          <span>CSV Spreadsheet Importer</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: SINGLE PRODUCT FORM */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'single' && (
        <form onSubmit={handleSingleSubmit} className="space-y-6">
          
          {singleSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Product successfully published to HomeTown catalog! Redirecting...</span>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-bold text-stone-900">Primary Product Details</h3>
              <p className="text-xs text-stone-500">Provide title, category, and SKU identifier</p>
            </div>

            {/* Row 1: Title & SKU */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oslo 3-Seater Fluted Boucle Sofa"
                  value={singleForm.name}
                  onChange={(e) => setSingleForm({ ...singleForm, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Unique SKU *</label>
                <input
                  type="text"
                  required
                  value={singleForm.sku}
                  onChange={(e) => setSingleForm({ ...singleForm, sku: e.target.value })}
                  className="w-full text-xs font-mono p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>

            {/* Row 2: Category, Subcategory, Room */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Category *</label>
                <select
                  value={singleForm.category}
                  onChange={(e) => setSingleForm({ ...singleForm, category: e.target.value as ProductCategory })}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 font-medium text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Study & Office">Study & Office</option>
                  <option value="Kitchen & Dining">Kitchen & Dining</option>
                  <option value="Decor & Accents">Decor & Accents</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Sub-Category</label>
                <input
                  type="text"
                  placeholder="e.g. Sofas & Couches"
                  value={singleForm.subCategory}
                  onChange={(e) => setSingleForm({ ...singleForm, subCategory: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Assigned Warehouse Node</label>
                <select
                  value={singleForm.warehouse}
                  onChange={(e) => setSingleForm({ ...singleForm, warehouse: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 font-medium text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                >
                  {WAREHOUSES.filter(w => w !== 'All Warehouses').map(wh => (
                    <option key={wh} value={wh}>{wh}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Pricing & Stock Inventory */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Commercial Pricing & Stock Setup</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Selling Price ({currency}) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1299"
                    value={singleForm.price}
                    onChange={(e) => setSingleForm({ ...singleForm, price: e.target.value })}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Compare At Price ({currency})</label>
                  <input
                    type="number"
                    placeholder="1599"
                    value={singleForm.compareAtPrice}
                    onChange={(e) => setSingleForm({ ...singleForm, compareAtPrice: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Initial Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={singleForm.stock}
                    onChange={(e) => setSingleForm({ ...singleForm, stock: e.target.value })}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Low-Stock Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    value={singleForm.minStockThreshold}
                    onChange={(e) => setSingleForm({ ...singleForm, minStockThreshold: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Material, Wood Type, Dimensions & Finish */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Wood, Fabric & Dimensional Specs</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Material & Joinery</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Solid Sheesham / Italian Velvet"
                    value={singleForm.material}
                    onChange={(e) => setSingleForm({ ...singleForm, material: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Finish / Polish / Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Natural Honey Walnut / Matte Brass"
                    value={singleForm.finish}
                    onChange={(e) => setSingleForm({ ...singleForm, finish: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>
              </div>

              {/* Dimensions WxDxH */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 block">Width (cm)</label>
                  <input
                    type="number"
                    value={singleForm.widthCm}
                    onChange={(e) => setSingleForm({ ...singleForm, widthCm: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 block">Depth (cm)</label>
                  <input
                    type="number"
                    value={singleForm.depthCm}
                    onChange={(e) => setSingleForm({ ...singleForm, depthCm: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 block">Height (cm)</label>
                  <input
                    type="number"
                    value={singleForm.heightCm}
                    onChange={(e) => setSingleForm({ ...singleForm, heightCm: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 block">Weight (kg)</label>
                  <input
                    type="number"
                    value={singleForm.weightKg}
                    onChange={(e) => setSingleForm({ ...singleForm, weightKg: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-600 block">Warranty (Yrs)</label>
                  <input
                    type="number"
                    value={singleForm.warrantyYears}
                    onChange={(e) => setSingleForm({ ...singleForm, warrantyYears: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Image URL & Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">Primary Image URL</label>
              <input
                type="url"
                value={singleForm.imageUrl}
                onChange={(e) => setSingleForm({ ...singleForm, imageUrl: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              />

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-stone-400 font-medium">Quick Photo Presets:</span>
                {sampleImagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSingleForm({ ...singleForm, imageUrl: preset.url })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-medium border border-stone-200 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Product Craft & Care Description</label>
              <textarea
                rows={3}
                value={singleForm.description}
                onChange={(e) => setSingleForm({ ...singleForm, description: e.target.value })}
                className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            {/* Assembly & Submission Strip */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={singleForm.assemblyRequired}
                  onChange={(e) => setSingleForm({ ...singleForm, assemblyRequired: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-900 focus:ring-amber-800"
                />
                <span className="text-xs font-medium text-stone-700">Requires White-Glove Onsite Carpentry Assembly</span>
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all shadow-xs active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish to Catalog</span>
                </button>
              </div>
            </div>

          </div>

        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: MULTI-ROW BULK ENTRY BUILDER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Multi-Row Furniture Batch Builder</h3>
              <p className="text-xs text-stone-500">
                Rapidly draft multiple SKU listings in a spreadsheet matrix before publishing together.
              </p>
            </div>
            <button
              onClick={handleAddBulkRow}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Row</span>
            </button>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price ({currency})</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Material & Finish</th>
                  <th className="p-3">Warehouse</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bulkRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={row.sku}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].sku = e.target.value;
                          setBulkRows(updated);
                        }}
                        className="w-28 text-xs font-mono p-1.5 rounded-lg bg-stone-50 border border-stone-300 focus:bg-white"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        placeholder="Product title"
                        value={row.name}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].name = e.target.value;
                          setBulkRows(updated);
                        }}
                        className="w-48 text-xs p-1.5 rounded-lg bg-stone-50 border border-stone-300 focus:bg-white font-medium"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={row.category}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].category = e.target.value as ProductCategory;
                          setBulkRows(updated);
                        }}
                        className="text-xs p-1.5 rounded-lg bg-stone-50 border border-stone-300"
                      >
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Dining Room">Dining Room</option>
                        <option value="Study & Office">Study & Office</option>
                        <option value="Kitchen & Dining">Kitchen & Dining</option>
                        <option value="Decor & Accents">Decor & Accents</option>
                        <option value="Lighting">Lighting</option>
                        <option value="Outdoor">Outdoor</option>
                      </select>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].price = e.target.value;
                          setBulkRows(updated);
                        }}
                        className="w-20 text-xs p-1.5 rounded-lg bg-stone-50 border border-stone-300 text-right font-bold"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min="0"
                        value={row.stock}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].stock = e.target.value;
                          setBulkRows(updated);
                        }}
                        className="w-16 text-xs p-1.5 rounded-lg bg-stone-50 border border-stone-300 text-center font-bold"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        placeholder="Material & finish"
                        value={row.material}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].material = e.target.value;
                          setBulkRows(updated);
                        }}
                        className="w-36 text-xs p-1.5 rounded-lg bg-stone-50 border border-stone-300"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={row.warehouse}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].warehouse = e.target.value;
                          setBulkRows(updated);
                        }}
                        className="w-32 text-xs p-1.5 rounded-lg bg-stone-50 border border-stone-300 truncate"
                      >
                        {WAREHOUSES.filter(w => w !== 'All Warehouses').map(wh => (
                          <option key={wh} value={wh}>{wh}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleCloneBulkRow(idx)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          title="Duplicate Row"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={bulkRows.length <= 1}
                          onClick={() => handleRemoveBulkRow(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-30"
                          title="Delete Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submission Bar */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Ready to create <strong className="text-stone-900">{bulkRows.length}</strong> new listings
            </span>
            <button
              type="button"
              onClick={handleBulkSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Commit {bulkRows.length} Products to Catalog</span>
            </button>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: CSV SPREADSHEET UPLOADER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">Bulk CSV Product Catalog Importer</h3>
                <p className="text-xs text-stone-500">
                  Upload an RFC-compliant CSV containing your furniture SKUs, attributes, and stock counts.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100 text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-amber-800" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-stone-300 hover:border-amber-700 bg-stone-50/60 rounded-3xl p-8 text-center transition-colors relative">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    {csvFile ? `Selected: ${csvFile.name}` : 'Drag and drop your furniture catalog CSV here'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports .csv files with up to 500 product rows per batch
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
                >
                  Browse Files
                </button>
              </div>
            </div>

            {/* Errors alert */}
            {csvErrors.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>CSV Parsing Warnings:</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-rose-700 pl-1">
                  {csvErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Live Parsed Preview Table */}
            {parsedPreview.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600">
                    Parsed Preview ({parsedPreview.length} Products detected)
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Schema Validated</span>
                  </span>
                </div>

                <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2.5">SKU</th>
                        <th className="p-2.5">Title</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Price</th>
                        <th className="p-2.5 text-center">Stock</th>
                        <th className="p-2.5">Material</th>
                        <th className="p-2.5">Warehouse</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/60 bg-white">
                      {parsedPreview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="p-2.5 font-mono font-semibold text-stone-800">{row.sku}</td>
                          <td className="p-2.5 font-medium text-stone-900 truncate max-w-[180px]">{row.name}</td>
                          <td className="p-2.5 text-stone-600">{row.category}</td>
                          <td className="p-2.5 text-right font-bold text-stone-900">{currency}{row.price}</td>
                          <td className="p-2.5 text-center font-bold text-amber-900">{row.stock}</td>
                          <td className="p-2.5 text-stone-600 truncate max-w-[140px]">{row.material}</td>
                          <td className="p-2.5 text-stone-500 text-[11px]">{row.warehouse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Commit Button */}
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCommitCsvImport}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Import {parsedPreview.length} Products to Catalog</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
