import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './screens/LoginPage';
import { HomePage } from './screens/HomePage';
import { RegistrationPage } from './screens/RegistrationPage';

import { MemberDashboardPage } from './screens/member/MemberDashboardPage';
import { MemberActiveDfcPage } from './screens/member/MemberActiveDfcPage';
import { MemberImpactPage } from './screens/member/MemberImpactPage';

import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/*" element={<RegistrationPage />} />
        
        {/* Protected Member Routes */}
        <Route path="/member" element={<ProtectedRoute><MemberDashboardPage /></ProtectedRoute>} />
        <Route path="/member/active-dfc" element={<ProtectedRoute><MemberActiveDfcPage /></ProtectedRoute>} />
        <Route path="/member/impact" element={<ProtectedRoute><MemberImpactPage /></ProtectedRoute>} />
        
        {/* Other Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><MemberDashboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        {/* Wildcard redirects to home match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;