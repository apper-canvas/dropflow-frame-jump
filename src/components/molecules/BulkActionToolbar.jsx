import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BulkActionToolbar = ({ 
  selectedCount, 
  onBulkPriceUpdate, 
  onBulkDiscount, 
  onBulkDiscontinue,
  onClearSelection 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckCircle" size={20} className="text-primary" />
            <span className="font-medium text-secondary">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBulkPriceUpdate}
              icon="DollarSign"
            >
              Update Prices
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onBulkDiscount}
              icon="Tag"
            >
              Apply Discount
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkDiscontinue}
              icon="AlertTriangle"
              className="text-warning hover:text-warning"
            >
              Discontinue
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              icon="X"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar;