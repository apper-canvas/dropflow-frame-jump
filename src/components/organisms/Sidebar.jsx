import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
{ name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "Products", href: "/products", icon: "Package" },
    { name: "Orders", href: "/orders", icon: "ShoppingCart" },
    { name: "Inventory", href: "/inventory", icon: "Warehouse" },
    { name: "Suppliers", href: "/suppliers", icon: "Users" }
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-100 group ${
          isActive
            ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
            : "text-gray-700 hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon
            name={item.icon}
            size={20}
            className={`mr-3 ${isActive ? "text-white" : "text-gray-500 group-hover:text-primary"}`}
          />
          {item.name}
        </>
      )}
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-lg">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-primary to-purple-600">
          <ApperIcon name="Zap" size={24} className="text-white mr-3" />
          <h1 className="text-xl font-bold text-white">DropFlow</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-6 pb-4">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-gradient-to-r from-primary to-purple-600">
            <div className="flex items-center">
              <ApperIcon name="Zap" size={24} className="text-white mr-3" />
              <h1 className="text-xl font-bold text-white">DropFlow</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-6 pb-4">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;