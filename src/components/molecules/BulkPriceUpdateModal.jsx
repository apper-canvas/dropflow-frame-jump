import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const BulkPriceUpdateModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  const [updateType, setUpdateType] = useState("percentage");
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || parseFloat(value) <= 0) return;
    
    onConfirm({
      type: updateType,
      value: parseFloat(value)
    });
    
    setValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary">
              Update Prices ({selectedCount} products)
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Update Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setUpdateType("percentage")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    updateType === "percentage"
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateType("fixed")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    updateType === "fixed"
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Fixed Amount
                </button>
              </div>
            </div>

            <div>
              <Label>
                {updateType === "percentage" ? "Percentage Increase (%)" : "Amount to Add ($)"}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={updateType === "percentage" ? "10" : "5.00"}
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" size={20} className="text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Price Update Preview</p>
                  <p className="mt-1">
                    {updateType === "percentage"
                      ? `Prices will be increased by ${value || "X"}%`
                      : `$${value || "X"} will be added to each product's selling price`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                Update Prices
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkPriceUpdateModal;