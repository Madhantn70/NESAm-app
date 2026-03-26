import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { PublicLayout } from "@/app/layouts/PublicLayout";
import { PrivateLayout } from "@/app/layouts/PrivateLayout";

// Will update these imports in Step C when we move screens
import { HomePage } from "@/domains/public/landing/pages/HomePage";
import { LoginPage } from "@/domains/public/login/pages/LoginPage";
import { RegistrationPage } from "@/domains/public/registration/pages/RegistrationPage";

import { MemberDashboardPage } from '../../domains/member/home/pages/MemberDashboardPage';
import { MemberActiveDfcPage } from '../../domains/member/contributions/pages/MemberActiveDfcPage';
import { MemberImpactPage } from '../../domains/member/impact/pages/MemberImpactPage';

import { AdminDashboardPage } from '../../domains/admin/dashboard/pages/AdminDashboardPage';

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes via Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/*" element={<RegistrationPage />} />
        </Route>

        {/* Private Routes via Layout */}
        <Route element={<PrivateLayout />}>
          <Route path="/member" element={<MemberDashboardPage />} />
          <Route path="/member/active-dfc" element={<MemberActiveDfcPage />} />
          <Route path="/member/impact" element={<MemberImpactPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
