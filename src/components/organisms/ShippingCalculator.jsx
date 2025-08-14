import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { shippingService } from "@/services/api/shippingService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const ShippingCalculator = ({ order, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    destination: order?.customerAddress || "",
    weight: order?.totalWeight || "",
    length: "",
    width: "",
    height: ""
  });
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleCalculateRates = async () => {
    // Validation
    const requiredFields = ['destination', 'weight', 'length', 'width', 'height'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (parseFloat(formData.weight) <= 0) {
      setError("Weight must be greater than 0");
      return;
    }

    if (parseFloat(formData.length) <= 0 || parseFloat(formData.width) <= 0 || parseFloat(formData.height) <= 0) {
      setError("All dimensions must be greater than 0");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const calculatedRates = await shippingService.calculateRates({
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        dimensions: {
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height)
        },
        orderValue: order?.total || 100
      });

      setRates(calculatedRates);
      toast.success("Shipping rates calculated successfully");
    } catch (err) {
      setError(err.message || "Failed to calculate shipping rates");
      toast.error("Failed to calculate shipping rates");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      destination: order?.customerAddress || "",
      weight: order?.totalWeight || "",
      length: "",
      width: "",
      height: ""
    });
    setRates([]);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Shipping Rate Calculator</h2>
            {order && (
              <p className="text-purple-100 mt-1">Order #{order.orderNumber}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
                  <ApperIcon name="Package" size={20} className="mr-2 text-primary" />
                  Package Details
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    label="Destination Address"
                    required
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="Enter destination address"
                  />

                  <FormField
                    label="Weight (lbs)"
                    required
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0.1"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      label="Length (in)"
                      required
                      type="number"
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                      placeholder="0.0"
                      step="0.1"
                      min="0.1"
                    />
                    <FormField
                      label="Width (in)"
                      required
                      type="number"
                      value={formData.width}
                      onChange={(e) => handleInputChange('width', e.target.value)}
                      placeholder="0.0"
                      step="0.1"
                      min="0.1"
                    />
                    <FormField
                      label="Height (in)"
                      required
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="0.0"
                      step="0.1"
                      min="0.1"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700 mt-4">
                    <ApperIcon name="AlertCircle" size={16} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={handleCalculateRates}
                    loading={loading}
                    icon={loading ? undefined : "Calculator"}
                    className="flex-1"
                  >
                    Calculate Rates
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    icon="RotateCcw"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
                <ApperIcon name="Truck" size={20} className="mr-2 text-primary" />
                Shipping Rates
              </h3>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <ApperIcon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-3" />
                    <p className="text-gray-500">Calculating shipping rates...</p>
                  </div>
                </div>
              )}

              {!loading && rates.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <ApperIcon name="Package" size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Enter package details and click "Calculate Rates" to see shipping options</p>
                </div>
              )}

              {!loading && rates.length > 0 && (
                <div className="space-y-3">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className={cn(
                        "border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
                        rate.recommended ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-gray-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold",
                            rate.carrier === 'USPS' && "bg-blue-600",
                            rate.carrier === 'FedEx' && "bg-purple-600",
                            rate.carrier === 'UPS' && "bg-yellow-600"
                          )}>
                            {rate.carrier === 'USPS' ? 'US' : rate.carrier.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-secondary">{rate.carrier}</span>
                              {rate.recommended && (
                                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{rate.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-secondary">${rate.cost.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{rate.deliveryTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Rates are estimates and may vary based on actual package details
            </p>
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;