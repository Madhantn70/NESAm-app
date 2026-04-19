import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export const FilterCard: React.FC = () => {
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-sm">
      {/* Title row */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-[#0A5F5F]" />
        <span className="text-[14px] font-semibold text-[#1A1A1A]">Filter Impact Statistics</span>
      </div>

      {/* Dropdowns row */}
      <div className="flex gap-3">
        {/* Batch Year */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">Batch Year</span>
          <div className="flex items-center justify-between border border-gray-200 rounded-[10px] px-3 py-2 bg-gray-50">
            <span className="text-[13px] text-[#1A1A1A]">All Batches</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Department */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">Department</span>
          <div className="flex items-center justify-between border border-gray-200 rounded-[10px] px-3 py-2 bg-gray-50">
            <span className="text-[13px] text-[#1A1A1A]">All Depts</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
