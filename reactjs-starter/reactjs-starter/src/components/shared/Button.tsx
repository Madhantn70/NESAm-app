import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseClass = "w-full h-12 rounded-lg font-medium transition-colors disabled:opacity-50 outline-none";
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
    };

    return (
      <button ref={ref} className={`${baseClass} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";
