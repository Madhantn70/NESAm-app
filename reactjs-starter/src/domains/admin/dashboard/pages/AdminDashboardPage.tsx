import React from 'react';
import { useAdminDashboard } from '../viewModel/useAdminDashboard';
import { AdminDashboardView } from '../components/AdminDashboardView';

export const AdminDashboardPage: React.FC = () => {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return <AdminDashboardView data={data} />;
};

export default AdminDashboardPage;
