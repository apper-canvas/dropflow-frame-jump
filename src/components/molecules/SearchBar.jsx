import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 bg-gradient-to-r from-white to-gray-50 border-gray-200 focus:from-white focus:to-white"
      />
    </div>
  );
};

export default SearchBar;