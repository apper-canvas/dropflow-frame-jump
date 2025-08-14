import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    pending: {
      variant: "warning",
      icon: "Clock",
      label: "Pending"
    },
    processing: {
      variant: "info",
      icon: "Package",
      label: "Processing"
    },
    shipped: {
      variant: "success",
      icon: "Truck",
      label: "Shipped"
    },
    delivered: {
      variant: "success",
      icon: "CheckCircle",
      label: "Delivered"
    },
    cancelled: {
      variant: "error",
      icon: "XCircle",
      label: "Cancelled"
    },
    "in-stock": {
      variant: "success",
      icon: "Package",
      label: "In Stock"
    },
    "low-stock": {
      variant: "warning",
      icon: "AlertTriangle",
      label: "Low Stock"
    },
    "out-of-stock": {
      variant: "error",
      icon: "XCircle",
      label: "Out of Stock"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={className}>
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;