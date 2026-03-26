import React from 'react';
import { UserPlus, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { AdminMetricsResponse } from '../models/api/admin';

interface AdminMetricsProps {
  metrics: AdminMetricsResponse;
}

export const AdminMetrics: React.FC<AdminMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* New Members */}
      <div className="bg-white border rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center text-teal-700 space-x-2 text-sm">
          <div className="p-1.5 bg-teal-50 rounded-full">
            <UserPlus className="w-4 h-4" />
          </div>
          <span className="font-medium text-gray-600">New Members</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold text-teal-800">{metrics.newMembersPending}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">Pending Approval</div>
      </div>

      {/* Offline Payments */}
      <div className="bg-white border rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center text-orange-700 space-x-2 text-sm">
          <div className="p-1.5 bg-orange-50 rounded-full">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="font-medium text-gray-600">Offline Payments</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-800">{metrics.offlinePaymentsPending}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">Pending Verification</div>
      </div>

      {/* Active DFC */}
      <div className="bg-white border rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center text-gray-700 space-x-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span className="font-medium text-gray-600">Active DFC</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900">{metrics.activeDfcCount}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">Events Running</div>
      </div>

      {/* Overdue */}
      <div className="bg-white border rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center text-orange-600 space-x-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium text-gray-600">Overdue</span>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold text-orange-500">{metrics.overdueContributions}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">Contributions</div>
      </div>
    </div>
  );
};
