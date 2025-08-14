import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
        <div className="h-10 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg w-32 animate-pulse"></div>
      </div>
      
      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            {/* Image skeleton */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse"></div>
            
            {/* Title skeleton */}
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-3 animate-pulse"></div>
            
            {/* Price skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="h-10 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;