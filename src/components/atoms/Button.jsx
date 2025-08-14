import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  loading = false,
  icon,
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-purple-600 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-primary/50",
    secondary: "bg-white text-secondary border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-gray-500/50",
    ghost: "text-secondary hover:bg-gray-100 focus:ring-gray-500/50",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-success shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-success/50",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white hover:from-yellow-600 hover:to-warning shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-warning/50",
    error: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-error shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-error/50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />}
      {!loading && icon && <ApperIcon name={icon} size={16} className="mr-2" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;