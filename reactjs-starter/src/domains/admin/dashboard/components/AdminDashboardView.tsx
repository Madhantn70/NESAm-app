import React from 'react';
import { AdminDashboardData } from '../model/AdminDashboard';
import { Plus, Bell, FileText, UserPlus, CreditCard, Calendar, AlertTriangle } from 'lucide-react';

interface Props {
  data: AdminDashboardData;
}

const iconMap: Record<string, React.ReactNode> = {
  UserPlus: <UserPlus className="w-4 h-4 text-teal-600" />,
  CreditCard: <CreditCard className="w-4 h-4 text-amber-700" />,
  Calendar: <Calendar className="w-4 h-4 text-slate-500" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4 text-orange-400" />,
};

export const AdminDashboardView: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 bg-gray-50 min-h-screen font-sans">
      
      {/* 1. Top Section - Stats Cards */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {data.stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3 text-gray-500">
                {stat.icon && iconMap[stat.icon]}
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. & 3. Event Cards (List) */}
      <section>
        <h2 className="mt-6 font-semibold text-lg text-gray-800">Active DFC Events</h2>
        <div className="mt-3">
          {data.events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border p-4 mt-3">
              <div className="mb-2">
                <h3 className="font-bold text-gray-800 leading-snug">
                  {event.title} <span className="font-normal text-gray-600">({event.batch})</span>
                </h3>
              </div>
              
              <div className="text-gray-500 text-sm">
                Due: {event.dueDate}
              </div>

              <div className="flex justify-between gap-3 mt-3">
                <div className="flex-1 bg-gray-100 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500 mb-1">Collected</p>
                  <p className="font-bold text-gray-800">{event.collectedAmount}</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500 mb-1">Pending</p>
                  <p className="font-bold text-gray-800">{event.pendingCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Admin Actions Section */}
      <section>
        <h2 className="mt-6 font-semibold text-lg text-gray-800">Admin Actions</h2>
        
        <div className="mt-3">
          <button className="w-full bg-[#0F5F5C] text-white py-3 rounded-lg hover:bg-[#0c4c49] transition flex items-center justify-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            Create DFC Event
          </button>
          
          <div className="flex gap-3 mt-3">
            <button className="flex-1 border border-gray-300 py-2 rounded-lg text-sm flex items-center justify-center gap-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
              Send Reminders
            </button>
            <button className="flex-1 border border-gray-300 py-2 rounded-lg text-sm flex items-center justify-center gap-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              Export Reports
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
};
