import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="w-full bg-[#F8D7DA] rounded-full py-4 flex items-center justify-center gap-2 hover:bg-[#f5c6cb] transition-colors duration-200"
    >
      <LogOut className="w-4 h-4 text-[#C0392B]" />
      <span className="text-[15px] font-semibold text-[#C0392B]">Logout Account</span>
    </button>
  );
};
