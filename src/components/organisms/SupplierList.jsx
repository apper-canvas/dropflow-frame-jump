import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const SupplierList = ({ suppliers, onViewSupplier, onEditSupplier }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "success";
    if (rating >= 3.5) return "warning";
    return "error";
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={16}
        className={`${
          index < Math.floor(rating) ? "text-warning fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier) => (
        <div
          key={supplier.Id}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary mb-2">
                {supplier.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {supplier.contactEmail}
              </p>
            </div>
            <Badge variant={getRatingColor(supplier.rating)}>
              {supplier.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Rating stars */}
          <div className="flex items-center mb-4">
            <div className="flex space-x-1 mr-2">
              {renderStars(supplier.rating)}
            </div>
            <span className="text-sm text-gray-500">({supplier.rating.toFixed(1)})</span>
          </div>

          {/* Shipping time */}
          <div className="flex items-center mb-4">
            <ApperIcon name="Truck" size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              Shipping: {supplier.shippingTime}
            </span>
          </div>

          {/* API status */}
          <div className="flex items-center mb-6">
            <ApperIcon name="Link" size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {supplier.apiEndpoint ? "API Connected" : "Manual Processing"}
            </span>
            <div className={`w-2 h-2 rounded-full ml-2 ${
              supplier.apiEndpoint ? "bg-success" : "bg-gray-400"
            }`} />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewSupplier(supplier)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditSupplier(supplier)}
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplierList;