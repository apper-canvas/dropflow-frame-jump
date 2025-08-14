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

// Safe rendering function to prevent object rendering errors
  const safeRender = (content) => {
    if (content === null || content === undefined) return '';
    if (typeof content === 'object') {
      // Handle objects by extracting meaningful display value
      if (content.value !== undefined) return String(content.value);
      if (content.label !== undefined) return String(content.label);
      if (content.name !== undefined) return String(content.name);
      return String(content);
    }
    return String(content);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{safeRender(title)}</p>
          <p className="text-2xl font-bold text-secondary mb-2">{safeRender(value)}</p>
{change && (
            <div className="flex items-center text-sm">
              {(() => {
                try {
                  const iconElement = (
                    <ApperIcon 
                      name={changeType === "positive" ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className={`mr-1 ${changeColors[changeType]}`}
                    />
                  );
                  // Ensure we're not rendering an invalid object
                  if (typeof iconElement === 'object' && iconElement !== null && !React.isValidElement(iconElement)) {
                    return <span className={`mr-1 ${changeColors[changeType]}`}>📈</span>;
                  }
                  return iconElement;
                } catch (error) {
                  console.warn('ApperIcon rendering error:', error);
                  return <span className={`mr-1 ${changeColors[changeType]}`}>📈</span>;
                }
              })()}
              <span className={changeColors[changeType]}>{String(change)}</span>
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