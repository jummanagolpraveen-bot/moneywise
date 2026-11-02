"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccessEmailConfirmation, setIsSuccessEmailConfirmation] =
    useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }

      // If session is null but user is returned, email confirmation is required by Supabase project settings
      if (data.user && !data.session) {
        setIsSuccessEmailConfirmation(true);
        setIsLoading(false);
        return;
      }

      // If session is established right away, navigate to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setAuthError("An unexpected error occurred during signup.");
      setIsLoading(false);
    }
  };

  if (isSuccessEmailConfirmation) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Verify your email</h2>
        <p className="text-foreground-muted mt-3 mb-8 max-w-sm mx-auto leading-relaxed">
          We&apos;ve sent a confirmation link to{" "}
          <span className="font-semibold text-foreground">
            {formData.email}
          </span>
          . Please click the link in your email to activate your account.
        </p>
        <Link href="/login">
          <Button variant="outline" size="md">
            Go to Log In
          </Button>
        </Link>
      </div>
    );
  }

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

      <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
      <p className="text-foreground-muted mt-2 mb-8">
        Start managing your finances in minutes. It&apos;s completely free.
      </p>

      {authError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User className="w-4 h-4" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          autoComplete="name"
        />

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

        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            icon={<Lock className="w-4 h-4" />}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors mt-1.5 cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {showPassword ? "Hide" : "Show"} password
          </button>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={<Lock className="w-4 h-4" />}
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-muted mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-navy-600 dark:text-navy-400 font-medium hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
