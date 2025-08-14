import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success/10 to-green-200 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-200 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-200 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-blue-200 text-info border border-info/20",
    primary: "bg-gradient-to-r from-primary/10 to-purple-200 text-primary border border-primary/20"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;