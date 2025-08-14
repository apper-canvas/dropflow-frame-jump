import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-purple-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ApperIcon name="Plus" size={18} className="inline mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;