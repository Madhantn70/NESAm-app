import React from 'react';
import { useAdminDashboard } from '../viewModel/useAdminDashboard';
import { AdminDashboardView } from '../components/AdminDashboardView';

export default function AdminDashboardPage() {
  const viewModel = useAdminDashboard();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AdminDashboard</h1>
      <AdminDashboardView {...viewModel} />
    </div>
  );
}
