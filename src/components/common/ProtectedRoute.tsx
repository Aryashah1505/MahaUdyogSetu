import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname + location.search + location.hash;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      try {
        sessionStorage.setItem('mahau_redirect_after_login', currentPath);
      } catch (err) {
        console.error('Error saving return URL:', err);
      }
    }
  }, [isLoading, isAuthenticated, currentPath]);

  // Clean GovTech loading screen during session hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f4f9] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center text-teal-700">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">MahaUdyogSetu</h2>
          <p className="text-xs text-slate-500 font-medium">Verifying security credentials & session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> immediately redirect to /login with target preserved
  if (!isAuthenticated) {
    const encodedRedirect = encodeURIComponent(currentPath);
    return <Navigate to={`/login?redirect=${encodedRedirect}`} state={{ from: location }} replace />;
  }

  return children;
};
