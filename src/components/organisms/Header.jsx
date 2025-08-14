import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title, actions }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="mr-3 lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>

          {/* Page title */}
          <h1 className="text-xl font-semibold text-secondary">{title}</h1>
        </div>

        {/* Header actions */}
        <div className="flex items-center space-x-4">
          {actions}
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-error rounded-full"></span>
          </Button>

          {/* User menu placeholder */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;