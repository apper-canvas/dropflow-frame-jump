import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={40} className="text-error" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ApperIcon name="RotateCcw" size={18} className="inline mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;