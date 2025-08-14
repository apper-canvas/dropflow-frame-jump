import React from "react";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const InventoryList = ({ products, onUpdateStock, onViewProduct }) => {
  const getStockStatus = (stock) => {
    if (stock === 0) return "out-of-stock";
    if (stock < 10) return "low-stock";
    return "in-stock";
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-error";
    if (stock < 10) return "text-warning";
    return "text-success";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.Id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images[0]}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <ApperIcon name="Package" size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                      {product.stock} units
                    </span>
                    {product.stock < 10 && product.stock > 0 && (
                      <ApperIcon name="AlertTriangle" size={16} className="ml-2 text-warning" />
                    )}
                    {product.stock === 0 && (
                      <ApperIcon name="XCircle" size={16} className="ml-2 text-error" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={getStockStatus(product.stock)} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                  ${product.sellingPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Supplier #{product.supplierId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateStock(product)}
                    >
                      <ApperIcon name="Package" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProduct(product)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;