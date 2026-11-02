"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 bg-navy-600 rounded-xl flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">
          Money<span className="text-emerald-500">Wise</span>
        </span>
      </div>

      <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
      <p className="text-foreground-muted mt-2 mb-8">
        Log in to your account to continue managing your finances.
      </p>

      {authError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          autoComplete="email"
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
            autoComplete="current-password"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              {showPassword ? "Hide" : "Show"} password
            </button>
            <Link
              href="/forgot-password"
              className="text-xs text-navy-600 dark:text-navy-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Log In"}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-muted mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-navy-600 dark:text-navy-400 font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
