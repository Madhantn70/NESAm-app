import React from "react";
import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="public-layout-root min-h-screen">
      <Outlet />
    </div>
  );
}
