import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import RegistrationPage from '../../domains/public/registration/pages/RegistrationPage';
import LoginPage from '../../domains/public/login/pages/LoginPage';

// Member Stubs
import MemberDashboardPage from '../../domains/member/dashboard/ui/pages/MemberDashboardPage';
import MemberContributionsPage from '../../domains/member/contributions/pages/MemberContributionsPage';
import MemberImpactPage from '../../domains/member/impact/pages/MemberImpactPage';
import MemberWalletPage from '../../domains/member/wallet/ui/pages/MemberWalletPage';
import MemberActiveDfcPage from '../../domains/member/active-dfc/ui/pages/MemberActiveDfcPage';
import MemberNotificationsPage from '../../domains/member/notifications/ui/pages/MemberNotificationsPage';
import MemberProfilePage from '../../domains/member/profile/ui/pages/MemberProfilePage';
import MemberEditProfilePage from '../../domains/member/profile-edit/ui/pages/MemberEditProfilePage';

// Admin Stubs
import AdminDashboardPage from '../../domains/admin/dashboard/pages/AdminDashboardPage';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard based on role
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/member/home'} replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Member Routes */}
      <Route element={<ProtectedRoute allowedRoles={['MEMBER']} />}>
        <Route path="/member/home" element={<MemberDashboardPage />} />
        <Route path="/member/contributions" element={<MemberContributionsPage />} />
        <Route path="/member/impact" element={<MemberImpactPage />} />
        <Route path="/member/wallet" element={<MemberWalletPage />} />
        <Route path="/member/active-dfc" element={<MemberActiveDfcPage />} />
        <Route path="/member/notifications" element={<MemberNotificationsPage />} />
        <Route path="/member/profile" element={<MemberProfilePage />} />
        <Route path="/member/profile/edit" element={<MemberEditProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
