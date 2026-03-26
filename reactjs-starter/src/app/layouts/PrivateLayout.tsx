import React from "react";
import { Outlet, Navigate } from "react-router-dom";

// Stubbing future auth state intercept check. For now, passthrough.
export function PrivateLayout() {
  const isAuthenticated = true; // Hardcoded until we lift auth providers
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="private-layout-root min-h-screen">
      <Outlet />
    </div>
  );
}
