import React from 'react';
import { ChevronLeft, FileUp } from 'lucide-react';
import { CreateDFCViewModel } from '../model/CreateDFC';

interface Props {
  viewModel: CreateDFCViewModel;
}

export const CreateDFCView: React.FC<Props> = ({ viewModel }) => {
  const { state, actions } = viewModel;

  return (
    <div className="max-w-md mx-auto px-4 py-6 font-sans">
      
      {/* 1. Header Section */}
      <div>
        <div className="flex items-center gap-2">
          <button 
            onClick={actions.cancel}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-[#0F5F5C]">Create DFC Event</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Organize a new contribution event for your batch. Set goals, invite contributors, and track academic legacy building.
        </p>
      </div>

      {/* 2. & 3. Form Container */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mt-4 space-y-4">
        
        {/* Alumni Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Alumni Name</label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
            value={state.alumniName}
            onChange={(e) => actions.updateField('alumniName', e.target.value)}
          />
        </div>

        {/* Batch Year */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Batch Year</label>
          <select 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
            value={state.batchYear}
            onChange={(e) => actions.updateField('batchYear', e.target.value)}
          >
            <option value="" disabled>Select Batch</option>
            <option value="1985">1985</option>
            <option value="1988">1988</option>
            <option value="1992">1992</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
          <input 
            type="date" 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
            value={state.dueDate}
            onChange={(e) => actions.updateField('dueDate', e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea 
            placeholder="Detail the purpose and impact of this contribution event..." 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5F5C]"
            rows={3}
            value={state.description}
            onChange={(e) => actions.updateField('description', e.target.value)}
          />
        </div>

        {/* Upload Photo */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Upload Photo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <div className="w-10 h-10 bg-[#eef5f5] rounded-full flex items-center justify-center mb-2">
              <FileUp className="w-5 h-5 text-[#0F5F5C]" />
            </div>
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, or PDF (max. 5MB)</p>
          </div>
        </div>

      </div>

      {/* 4. Buttons Section */}
      <div className="mt-6 flex flex-col">
        <button 
          onClick={actions.submitForm}
          className="w-full bg-[#0F5F5C] text-white py-3 rounded-lg hover:bg-[#0c4c49] transition"
        >
          Create Event
        </button>
        <button 
          onClick={actions.cancel}
          className="w-full text-center text-[#0F5F5C] mt-3 text-sm font-medium hover:underline"
        >
          Cancel
        </button>
      </div>

    </div>
  );
};
