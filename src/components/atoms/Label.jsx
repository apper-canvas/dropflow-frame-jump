import React from "react";
import { cn } from "@/utils/cn";

const Label = ({ className, ...props }) => {
  return (
    <label
      className={cn(
        "text-sm font-medium text-secondary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2",
        className
      )}
      {...props}
    />
  );
};

export default Label;