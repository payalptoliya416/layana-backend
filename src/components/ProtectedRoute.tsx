import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';
import { Footer } from './layout/Footer';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      setAuth(isAuthenticated());
    };

    checkAuth();

    // every 1 minute token expiry check
    const interval = setInterval(checkAuth, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (auth === null) return null; // loader optional

  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
