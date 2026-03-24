import React from "react";

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ className = "", label, id, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={`w-5 h-5 cursor-pointer rounded border-gray-300 text-teal-600 focus:ring-teal-600 focus:ring-2 checked:bg-teal-600 transition-all ${className}`}
            {...props}
          />
        </div>
        {label && (
          <label htmlFor={id} className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);
CheckboxField.displayName = "CheckboxField";
