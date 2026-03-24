import React from "react";

export const InputField = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`w-full h-12 rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 transition-colors outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
InputField.displayName = "InputField";
