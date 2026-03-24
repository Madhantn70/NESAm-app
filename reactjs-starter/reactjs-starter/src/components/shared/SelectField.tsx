import React from "react";

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className = "", options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`w-full h-12 rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 disabled:opacity-50 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);
SelectField.displayName = "SelectField";
