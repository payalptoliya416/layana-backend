import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, saveToken, removeToken, isAuthenticated } from '@/services/authService';

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiLogin(email, password);
      
      // Check for success status and token
      if (response.status === "success" && response.token) {
        saveToken(response.token);
        setSuccess(true);
        
        // Redirect after showing success message
        setTimeout(() => {
          navigate('/treatments-list');
        }, 800);
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    removeToken();
    navigate('/login');
  }, [navigate]);

  return {
    login,
    logout,
    loading,
    error,
    success,
    isAuthenticated: isAuthenticated()
  };
};
