import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PublicRoute — wraps public pages (landing, login, signup).
 * If the user is already authenticated, redirects to /dashboard.
 * Shows a loading spinner while auth state is being resolved.
 */
export function PublicRoute() {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <span className="text-sm font-medium text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
