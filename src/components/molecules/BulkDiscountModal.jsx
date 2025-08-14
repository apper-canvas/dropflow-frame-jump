import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const BulkDiscountModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  const [discountPercent, setDiscountPercent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!discountPercent || parseFloat(discountPercent) <= 0 || parseFloat(discountPercent) >= 100) return;
    
    onConfirm(parseFloat(discountPercent));
    setDiscountPercent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary">
              Apply Discount ({selectedCount} products)
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="99.9"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="15"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter discount percentage (0.1% - 99.9%)
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Tag" size={20} className="text-orange-500 mt-0.5" />
                <div className="text-sm text-orange-700">
                  <p className="font-medium">Discount Preview</p>
                  <p className="mt-1">
                    All selected products will receive a {discountPercent || "X"}% discount on their selling price
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                Apply Discount
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkDiscountModal;