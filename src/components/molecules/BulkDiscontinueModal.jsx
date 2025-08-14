import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BulkDiscontinueModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary">
              Discontinue Products
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="AlertTriangle" size={20} className="text-red-500 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Warning: This action cannot be undone</p>
                  <p className="mt-1">
                    You are about to mark {selectedCount} product{selectedCount !== 1 ? 's' : ''} as discontinued. 
                    This will set their stock to 0 and they will no longer be available for ordering.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-2">What happens when products are discontinued:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Stock will be set to 0</li>
                  <li>Products will be marked as "Out of Stock"</li>
                  <li>They will remain in your catalog for reference</li>
                  <li>No new orders can be placed for these products</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={onConfirm} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Discontinue Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDiscontinueModal;