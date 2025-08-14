import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

function SupplierPerformanceCard({ supplier, performance }) {
  const getPerformanceColor = (value, thresholds) => {
    if (value >= thresholds.excellent) return 'text-success';
    if (value >= thresholds.good) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceBadgeVariant = (value, thresholds) => {
    if (value >= thresholds.excellent) return 'success';
    if (value >= thresholds.good) return 'warning';
    return 'destructive';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<ApperIcon key={i} name="Star" size={16} className="fill-warning text-warning" />);
    }
    
    if (hasHalfStar) {
      stars.push(<ApperIcon key="half" name="Star" size={16} className="fill-warning/50 text-warning" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<ApperIcon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{supplier.name}</h3>
          <div className="flex items-center gap-1">
            {renderStars(supplier.rating)}
            <span className="text-sm text-gray-500 ml-1">({supplier.rating})</span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {performance.totalOrders} orders
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        {/* On-time Delivery */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">On-time Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold text-sm",
              getPerformanceColor(performance.onTimeDelivery, { excellent: 95, good: 85 })
            )}>
              {performance.onTimeDelivery}%
            </span>
            <Badge
              variant={getPerformanceBadgeVariant(performance.onTimeDelivery, { excellent: 95, good: 85 })}
              className="text-xs px-2 py-1"
            >
              {performance.onTimeDelivery >= 95 ? 'Excellent' : 
               performance.onTimeDelivery >= 85 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </div>

        {/* Order Accuracy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckCircle" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Order Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold text-sm",
              getPerformanceColor(performance.accuracy, { excellent: 98, good: 92 })
            )}>
              {performance.accuracy}%
            </span>
            <Badge
              variant={getPerformanceBadgeVariant(performance.accuracy, { excellent: 98, good: 92 })}
              className="text-xs px-2 py-1"
            >
              {performance.accuracy >= 98 ? 'Excellent' : 
               performance.accuracy >= 92 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </div>

        {/* Processing Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Timer" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Avg. Processing Time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">
              {performance.avgProcessingTime}h
            </span>
            <div className="flex items-center gap-1">
              <ApperIcon 
                name={performance.processingTrend > 0 ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className={performance.processingTrend > 0 ? "text-error" : "text-success"} 
              />
              <span className={cn(
                "text-xs",
                performance.processingTrend > 0 ? "text-error" : "text-success"
              )}>
                {Math.abs(performance.processingTrend)}h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierPerformanceCard;