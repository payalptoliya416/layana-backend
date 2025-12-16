import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { isAuthenticated } from '@/services/authService';
import LayanLogo from '@/assets/LayanLogo.png';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, success } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/treatments-list');
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      {/* Layana Logo */}
      <div className="mb-8">
        <img 
          src={LayanLogo} 
          alt="Layana" 
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-card rounded-3xl shadow-card p-8 md:p-10 border border-border/60">
        {/* <h1 className="text-2xl font-semibold text-foreground text-center mb-8">
          Admin Login
        </h1> */}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 rounded-xl">
            <AlertDescription className="text-red-600 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 rounded-xl">
            <AlertDescription className="text-green-700 text-sm">
              Login successful! Redirecting…
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 h-12 border rounded-xl bg-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-input'
              }`}
              {...register('email')}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 h-12 border rounded-xl bg-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.password ? 'border-red-400 focus:ring-red-400' : 'border-input'
              }`}
              {...register('password')}
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            variant="save"
            className="w-full h-12 text-base font-medium mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </Button>

          {/* Forgot Password Link */}
          {/* <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() =>}
            >
              Forgot password?
            </button>
          </div> */}
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground">
        © 2025 Layana. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
