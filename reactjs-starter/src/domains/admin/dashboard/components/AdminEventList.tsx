import React from 'react';
import { AdminActiveDfcEvent } from '../models/api/admin';
import { ExternalLink } from 'lucide-react';

interface AdminEventListProps {
  events: AdminActiveDfcEvent[];
}

export const AdminEventList: React.FC<AdminEventListProps> = ({ events }) => {
  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Active DFC Events</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 leading-snug pr-4">{event.deceasedName} (Batch {event.batchYear})</h3>
              <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0 cursor-pointer hover:text-teal-600" />
            </div>
            
            <div className="mt-2 mb-3">
              <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded inline-block border border-gray-100">
                Due: {event.dueDate}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                <div className="text-xs text-gray-500 mb-1">Collected</div>
                <div className="font-semibold text-gray-900">₹{(event.collectedAmount / 1000).toFixed(0)}k</div>
              </div>
              <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                <div className="text-xs text-gray-500 mb-1">Pending</div>
                <div className="font-semibold text-gray-900">{event.pendingMembers}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
