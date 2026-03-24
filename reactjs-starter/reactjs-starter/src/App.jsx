import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './screens/LoginPage';
import { HomePage } from './screens/HomePage';
import { RegistrationPage } from './screens/RegistrationPage';

import { MemberDashboardPage } from './screens/member/MemberDashboardPage';
import { MemberActiveDfcPage } from './screens/member/MemberActiveDfcPage';
import { MemberImpactPage } from './screens/member/MemberImpactPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/*" element={<RegistrationPage />} />
        <Route path="/member" element={<MemberDashboardPage />} />
        <Route path="/member/active-dfc" element={<MemberActiveDfcPage />} />
        <Route path="/member/impact" element={<MemberImpactPage />} />
        {/* Wildcard redirects to exact home match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;