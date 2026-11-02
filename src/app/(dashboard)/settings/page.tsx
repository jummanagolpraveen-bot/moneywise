"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme-provider";
import { useAuth } from "@/context/auth-provider";
import { CURRENCIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Moon,
  Sun,
  Check,
  Save,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClient();

  const [currency, setCurrency] = useState("USD");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCurrency(profile.currency || "USD");
    } else if (user) {
      setFullName(user.user_metadata?.full_name || "");
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user, profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(null);
    setErrorMessage(null);
    setIsSavingProfile(true);

    try {
      if (user) {
        // Upsert to profiles table
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName.trim(),
          currency: currency,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          // If table doesn't exist yet, update auth user_metadata
          await supabase.auth.updateUser({
            data: { full_name: fullName.trim() },
          });
        }

        await refreshProfile();
        setSavedSuccess("Profile details saved successfully!");
        setTimeout(() => setSavedSuccess(null), 3000);
      }
    } catch {
      setErrorMessage("Could not save profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3500);
      }
    } catch {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Preferences & Settings</h2>
        <p className="text-sm text-foreground-muted">
          Manage your personal profile, preferred currencies, security, and application visual themes
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4" />
          {savedSuccess}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                placeholder="Your Name"
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                className="opacity-70 cursor-not-allowed"
              />
            </div>
            <Button type="submit" disabled={isSavingProfile}>
              <Save className="w-4 h-4 mr-1.5" />
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Currency & Regional Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Currency & Regional</CardTitle>
          <CardDescription>Select default currency for your balance, reports, and budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CURRENCIES.map((cur) => (
              <div
                key={cur.code}
                onClick={() => setCurrency(cur.code)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  currency === cur.code
                    ? "border-navy-600 bg-navy-50/50 dark:bg-navy-950/50"
                    : "border-border hover:border-border-hover bg-background-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center font-bold text-lg text-foreground">
                    {cur.symbol}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{cur.name}</p>
                    <p className="text-xs text-foreground-muted">{cur.code}</p>
                  </div>
                </div>
                {currency === cur.code && (
                  <div className="w-5 h-5 rounded-full bg-navy-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Interface Appearance</CardTitle>
          <CardDescription>Select your desired UI theme mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                theme === "light"
                  ? "border-navy-600 bg-navy-50/50 dark:bg-navy-950/50"
                  : "border-border hover:border-border-hover bg-background-card"
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Light Mode</p>
                <p className="text-xs text-foreground-muted">Clean bright interface</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-navy-600 bg-navy-50/50 dark:bg-navy-950/50"
                  : "border-border hover:border-border-hover bg-background-card"
              }`}
            >
              <Moon className="w-5 h-5 text-navy-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Dark Mode</p>
                <p className="text-xs text-foreground-muted">Dimmed ambient palette</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Password</CardTitle>
          <CardDescription>Manage credentials and account protection</CardDescription>
        </CardHeader>
        <CardContent>
          {passwordSuccess && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-sm font-medium">
              <Check className="w-4 h-4" />
              Password updated successfully!
            </div>
          )}
          {passwordError && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {passwordError}
            </div>
          )}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<KeyRound className="w-4 h-4" />}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<KeyRound className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
