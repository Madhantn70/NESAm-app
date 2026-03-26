import React from 'react';
import { Plus, Bell, FileText } from 'lucide-react';

export const AdminActions: React.FC = () => {
  return (
    <div className="w-full mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Admin Actions</h2>
      <div className="flex flex-col space-y-3">
        <button className="flex items-center justify-center space-x-2 bg-[#096B6B] hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-lg w-full transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Create DFC Event</span>
        </button>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          <button className="flex items-center justify-center space-x-2 bg-white border border-[#096B6B] text-[#096B6B] hover:bg-teal-50 font-medium py-2.5 px-3 rounded-lg w-full transition-colors">
            <Bell className="w-4 h-4" />
            <span className="text-sm">Send Reminders</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-white border border-[#096B6B] text-[#096B6B] hover:bg-teal-50 font-medium py-2.5 px-3 rounded-lg w-full transition-colors">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Export Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};
