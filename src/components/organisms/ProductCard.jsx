import React from "react";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ product, onView, onEdit, onAddToStore, isSelected = false, onSelect }) => {
  const profit = product.sellingPrice - product.supplierPrice;
  const profitMargin = ((profit / product.sellingPrice) * 100).toFixed(1);
  
  const getStockStatus = (stock) => {
    if (stock === 0) return "out-of-stock";
    if (stock < 10) return "low-stock";
    return "in-stock";
  };

  return (
<div className={`bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] group ${
      isSelected ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-100'
    }`}>
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Selection checkbox */}
        {onSelect && (
          <div className="absolute top-3 left-3 z-10">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected 
                  ? 'bg-primary border-primary' 
                  : 'bg-white border-gray-300 hover:border-primary'
              }`}>
                {isSelected && (
                  <ApperIcon name="Check" size={14} className="text-white" />
                )}
              </div>
            </label>
          </div>
        )}
        
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="Package" size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={getStockStatus(product.stock)} />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Supplier Price:</span>
            <span className="font-medium text-secondary">${product.supplierPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Selling Price:</span>
            <span className="font-semibold text-lg text-secondary">${product.sellingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Profit:</span>
            <div className="text-right">
              <span className="font-bold text-success">${profit.toFixed(2)}</span>
              <span className="text-sm text-success ml-1">({profitMargin}%)</span>
            </div>
          </div>
        </div>

        {/* Stock info */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Stock:</span>
          <span className="font-medium text-secondary">{product.stock} units</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToStore(product)}
            className="flex-1"
            icon="Plus"
          >
            Add to Store
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(product)}
            >
              <ApperIcon name="Eye" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;