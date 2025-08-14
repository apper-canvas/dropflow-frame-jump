import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon,
  gradient = "from-primary to-purple-600"
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-secondary mb-2">{value}</p>
          {change && (
            <div className="flex items-center text-sm">
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className={`mr-1 ${changeColors[changeType]}`}
              />
              <span className={changeColors[changeType]}>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} bg-opacity-10 rounded-lg flex items-center justify-center`}>
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;