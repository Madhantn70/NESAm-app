import React from 'react';
import { DashboardModel } from '../../domain/models/dashboard.model';
import { Users, Users as FamilyIcon, Banknote } from 'lucide-react'; 

interface StatsCardProps {
  data: DashboardModel;
}

export const StatsCard: React.FC<StatsCardProps> = ({ data }) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-5 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <h3 className="font-bold text-gray-900">Live Program Stats</h3>
      </div>
      
      <div className="flex justify-between items-center text-center px-2">
        {/* Members */}
        <div className="flex flex-col items-center gap-1">
          <Users className="w-6 h-6 text-gray-800" />
          <span className="text-xl font-extrabold text-gray-900 mt-1">{data.totalActiveMembers}+</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">Members</span>
        </div>
        
        {/* Families */}
        <div className="flex flex-col items-center gap-1">
          <FamilyIcon className="w-6 h-6 text-gray-800" />
          <span className="text-xl font-extrabold text-gray-900 mt-1">3</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">Families</span>
        </div>

        {/* Funds Disbursed */}
        <div className="flex flex-col items-center gap-1">
          <Banknote className="w-6 h-6 text-gray-800" />
          <span className="text-xl font-extrabold text-gray-900 mt-1">₹338K</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">Disbursed</span>
        </div>
      </div>
    </div>
  );
};
