import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Boxes, 
  Star,
  Tag
} from 'lucide-react';
import { Product } from '../../types';
import { useSeller } from '../../context/SellerContext';
import { Badge, getProductStatusVariant } from '../common/Badge';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit?: (product: Product) => void;
  onRestock?: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  onClose,
  onRestock 
}) => {
  const { currency, deleteProduct } = useSeller();
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.images[0] || '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Badge variant={getProductStatusVariant(product.status)} dot size="sm">
              {product.status}
            </Badge>
            <span className="font-mono text-[11px] font-semibold text-slate-500">{product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Product Images Gallery */}
            <div className="space-y-2.5">
              <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img 
                  src={activeImage || product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === img ? 'border-indigo-600 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium flex items-center gap-1 border border-slate-200">
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Specs */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{product.category} • {product.subCategory}</span>
                <h3 className="text-base font-bold text-slate-800 mt-0.5">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-[11px] text-slate-400">{product.salesCount} lifetime orders</span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Selling Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-800">{currency}{product.price.toLocaleString()}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-slate-400 line-through">{currency}{product.compareAtPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Cost / Margin</span>
                  <p className="text-xs font-bold text-emerald-700">
                    {currency}{product.costPrice.toLocaleString()} ({Math.round(((product.price - product.costPrice) / product.price) * 100)}% Margin)
                  </p>
                </div>
              </div>

              {/* Stock Bar */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                    <Boxes className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Available Inventory:</span>
                  </span>
                  <strong className="text-slate-800 text-xs font-bold">{product.stock} units</strong>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      product.stock === 0 ? 'bg-rose-500' :
                      product.stock <= product.minStockThreshold ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (product.stock / 25) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Threshold: {product.minStockThreshold} units</span>
                  <span>Warehouse: {product.warehouse}</span>
                </div>
              </div>

              {/* Material & Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Material</span>
                  <p className="font-medium text-slate-700 truncate text-[11px]">{product.material}</p>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Finish / Color</span>
                  <p className="font-medium text-slate-700 truncate text-[11px]">{product.finish}</p>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Dimensions</span>
                  <p className="font-medium text-slate-700 text-[11px]">
                    {product.dimensions.widthCm} × {product.dimensions.depthCm} × {product.dimensions.heightCm} cm
                  </p>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Weight & Assembly</span>
                  <p className="font-medium text-slate-700 text-[11px]">
                    {product.weightKg} kg • {product.assemblyRequired ? 'Assembly Req.' : 'Pre-Assembled'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Description</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {product.description}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                deleteProduct(product.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {onRestock && (
              <button
                onClick={() => {
                  onClose();
                  onRestock(product);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                <Boxes className="w-3.5 h-3.5 text-indigo-600" />
                <span>Adjust Stock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

