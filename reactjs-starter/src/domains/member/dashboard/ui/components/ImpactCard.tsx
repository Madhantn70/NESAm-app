import React from 'react';
import { DashboardModel } from '../../domain/models/dashboard.model';
import { Heart, HandHeart } from 'lucide-react';

interface ImpactCardProps {
  data: DashboardModel;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="font-bold text-gray-900">Your Impact</h3>

      <div className="flex gap-4">
        {/* Families Supported — beige card */}
        <div className="flex-1 bg-[#FFF4E6] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-[#0A5F5F]" />
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[#0A5F5F] text-xl font-extrabold">{data.familiesSupported}</span>
            <span className="text-gray-500 text-[10px] font-medium tracking-wide">Families Supported</span>
          </div>
        </div>

        {/* Total Contributed — teal card */}
        <div className="flex-1 bg-[#FFF4E6] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <HandHeart className="w-5 h-5 text-[#0A5F5F]" />
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[#0A5F5F] text-xl font-extrabold">₹1K</span>
            <span className="text-gray-500 text-[10px] font-medium tracking-wide">Total Contributed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
