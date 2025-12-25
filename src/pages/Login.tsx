import React, { useEffect, useState } from 'react';
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
import { cn } from '@/lib/utils';
import LayanLogoDark from "@/assets/LayanLogo-dark.png";

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

  useEffect(() => {
  if (success) {
    navigate("/treatments-list", { replace: true });
  }
}, [success, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
  <div className="bg-background flex flex-col justify-center items-center p-4 h-screen">
  {/* Logo */}
  <div className="mb-8">
    <img
    src={LayanLogo}
      alt="Layana"
      className="h-24 w-auto object-contain"
    />
  </div>

  {/* Login Card */}
  <div className="w-full max-w-md bg-card rounded-3xl shadow-card p-8 md:p-10 border border-border">
    {/* Error */}
    {error && (
      <Alert variant="destructive" className="mb-6 rounded-xl">
        <AlertDescription className="text-sm">
          {error}
        </AlertDescription>
      </Alert>
    )}

    {/* Success */}
    {success && (
      <Alert className="mb-6 rounded-xl border border-primary/30 bg-primary/10">
        <AlertDescription className="text-sm text-foreground">
          Login successful! Redirecting…
        </AlertDescription>
      </Alert>
    )}

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Email
        </label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className={cn(
            "h-12 rounded-xl bg-background placeholder:text-muted-foreground transition-all",
            errors.email
              ? "border-destructive focus:ring-destructive/30"
              : "border-input focus:ring-primary/30"
          )}
          {...register("email")}
          disabled={loading}
        />

        {errors.email && (
          <p className="mt-1.5 text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Password
        </label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className={cn(
            "h-12 rounded-xl bg-background placeholder:text-muted-foreground transition-all",
            errors.password
              ? "border-destructive focus:ring-destructive/30"
              : "border-input focus:ring-primary/30"
          )}
          {...register("password")}
          disabled={loading}
        />

        {errors.password && (
          <p className="mt-1.5 text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="save"
        className="w-full h-12 text-base font-medium"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          "Login"
        )}
      </Button>
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
