import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Book, Bell, Heart } from 'lucide-react';

export const QuickAccess: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="font-bold text-gray-900">Quick Access</h3>
      <div className="flex justify-between items-center px-1">
        
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => navigate('/member/profile/edit')}
        >
          <div className="w-14 h-14 rounded-full border border-gray-500 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-700 stroke-[1.5]" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Edit profile</span>
        </div>

        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => navigate('/member/active-dfc')}
        >
          <div className="w-14 h-14 rounded-full border border-gray-500 flex items-center justify-center">
            <Book className="w-6 h-6 text-gray-700 stroke-[1.5]" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Active DFC's</span>
        </div>

        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => navigate('/member/notifications')}
        >
          <div className="w-14 h-14 rounded-full border border-gray-500 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-700 stroke-[1.5]" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Notification</span>
        </div>

        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <div className="w-14 h-14 rounded-full border border-gray-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-gray-700 stroke-[1.5]" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Support</span>
        </div>

      </div>
    </div>
  );
};
