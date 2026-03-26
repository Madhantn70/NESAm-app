import React, { useEffect } from 'react';
import { useAdminDashboardViewModel } from '../viewmodels/useAdminDashboardViewModel';
import { AdminMetrics } from '../components/AdminMetrics';
import { AdminEventList } from '../components/AdminEventList';
import { AdminActions } from '../components/AdminActions';
import { Header } from '@/shared/components/shared/Header';

export const AdminDashboardPage: React.FC = () => {
  const { data, loading, error, fetchDashboard } = useAdminDashboardViewModel();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#096B6B]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center shadow-sm w-full max-w-md">
          <p>{error || "Failed to load dashboard."}</p>
          <button 
            onClick={() => fetchDashboard()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] w-full flex flex-col font-sans">
      <Header />
      
      {/* Mobile-centric wrapper enforcing max width */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pb-12">
        <AdminMetrics metrics={data.metrics} />
        <AdminEventList events={data.events} />
        <AdminActions />
      </main>
    </div>
  );
};
