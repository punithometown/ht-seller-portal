import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Boxes, 
  FileSpreadsheet, 
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import { Product } from '../types';
import { Badge, getProductStatusVariant } from '../components/common/Badge';
import { ProductDetailsModal } from '../components/products/ProductDetailsModal';
import { QuickRestockModal } from '../components/inventory/QuickRestockModal';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, currency, activeWarehouse } = useSeller();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'stock-low' | 'newest'>('popular');

  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

  const categories: string[] = [
    'All',
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Study & Office',
    'Kitchen & Dining',
    'Decor & Accents',
    'Lighting',
    'Outdoor'
  ];

  const materialsList: string[] = [
    'All',
    'Solid Sheesham',
    'Teak',
    'Oak',
    'Velvet',
    'Bouclé',
    'Travertine Marble',
    'Spun Brass'
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    if (activeWarehouse !== 'All Warehouses' && p.warehouse !== activeWarehouse) {
      return false;
    }
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'All' && p.status !== selectedStatus) {
      return false;
    }
    if (selectedMaterial !== 'All' && !p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchSub = p.subCategory.toLowerCase().includes(q);
      const matchMat = p.material.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      return matchName || matchSku || matchSub || matchMat || matchTags;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') return b.salesCount - a.salesCount;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'stock-low') return a.stock - b.stock;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStockThreshold).length;

  return (
    <div className="space-y-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Product Catalog</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage product listings, SKU specifications, pricing margins, and multi-warehouse allocations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/products/add?tab=csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Upload</span>
          </button>
          <button
            onClick={() => navigate('/products/add')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Bar & Controls */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, SKU, material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            >
              <option value="All">All Stock Statuses</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Material Filter */}
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            >
              <option value="All">All Materials</option>
              {materialsList.filter(m => m !== 'All').map(mat => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            >
              <option value="popular">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-low">Inventory: Low to High</option>
              <option value="newest">Newest</option>
            </select>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded transition-colors ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Applied Filters & Summary Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{sortedProducts.length}</strong> of {products.length} catalog items
            {activeWarehouse !== 'All Warehouses' && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 text-[10px]">
                {activeWarehouse}
              </span>
            )}
          </div>
          {lowStockCount > 0 && (
            <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lowStockCount} products need restock</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid Mode View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-2">
              <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No furniture products match your filter</h3>
              <p className="text-xs text-slate-400">Try clearing your search terms or category selection.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSelectedMaterial('All');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant={getProductStatusVariant(product.status)} size="sm">
                        {product.status}
                      </Badge>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {product.salesCount} sold
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{product.sku}</span>
                        <span>{product.category}</span>
                      </div>
                      <h3 
                        onClick={() => setInspectProduct(product)}
                        className="font-bold text-slate-800 text-xs leading-snug line-clamp-1 hover:text-indigo-600 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{product.material}</p>
                    </div>

                    {/* Dimensions & Specs chip */}
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-600 flex justify-between">
                      <span>{product.dimensions.widthCm}×{product.dimensions.depthCm}×{product.dimensions.heightCm} cm</span>
                      <span className="font-semibold text-slate-700">{product.finish}</span>
                    </div>

                    {/* Pricing and Stock Level */}
                    <div className="flex items-end justify-between pt-0.5">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold">Price</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-slate-800">{currency}{product.price.toLocaleString()}</span>
                          {product.compareAtPrice && (
                            <span className="text-[11px] text-slate-400 line-through">{currency}{product.compareAtPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 uppercase font-bold">Stock</span>
                        <p className={`text-xs font-bold ${
                          product.stock === 0 ? 'text-rose-600' :
                          product.stock <= product.minStockThreshold ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {product.stock} units
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setRestockProduct(product)}
                    className="flex-1 py-1 px-2 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <RefreshCw className="w-3 h-3 text-indigo-600" />
                    <span>Stock</span>
                  </button>
                  <button
                    onClick={() => setInspectProduct(product)}
                    className="py-1 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Dense Table Mode View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3.5">Product & SKU</th>
                  <th className="py-2.5 px-3.5">Category & Specs</th>
                  <th className="py-2.5 px-3.5">Material & Finish</th>
                  <th className="py-2.5 px-3.5 text-right">Price / Cost</th>
                  <th className="py-2.5 px-3.5 text-center">Stock Level</th>
                  <th className="py-2.5 px-3.5">Warehouse</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={prod.images[0]} 
                          alt="" 
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <p 
                            onClick={() => setInspectProduct(prod)}
                            className="font-bold text-slate-800 hover:text-indigo-600 cursor-pointer text-xs"
                          >
                            {prod.name}
                          </p>
                          <span className="font-mono text-[10px] text-slate-400">{prod.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="font-semibold text-slate-800 text-xs">{prod.category}</p>
                      <p className="text-[10px] text-slate-400">{prod.dimensions.widthCm}×{prod.dimensions.depthCm}×{prod.dimensions.heightCm} cm</p>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <p className="text-slate-700 font-medium text-xs">{prod.material}</p>
                      <span className="text-[10px] text-slate-400">{prod.finish}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <p className="font-bold text-slate-800 text-xs">{currency}{prod.price.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400">Cost: {currency}{prod.costPrice}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold text-xs ${
                          prod.stock === 0 ? 'text-rose-600' :
                          prod.stock <= prod.minStockThreshold ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {prod.stock}
                        </span>
                        <Badge variant={getProductStatusVariant(prod.status)} size="sm">
                          {prod.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 text-[11px]">
                      {prod.warehouse}
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setRestockProduct(prod)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px]"
                          title="Restock / Adjust Stock"
                        >
                          Stock
                        </button>
                        <button
                          onClick={() => setInspectProduct(prod)}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px]"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductDetailsModal
        product={inspectProduct}
        onClose={() => setInspectProduct(null)}
        onRestock={(p) => setRestockProduct(p)}
      />

      <QuickRestockModal
        product={restockProduct}
        onClose={() => setRestockProduct(null)}
      />

    </div>
  );
};
