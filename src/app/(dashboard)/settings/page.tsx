"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme-provider";
import { CURRENCIES } from "@/lib/constants";
import {
  User,
  Moon,
  Sun,
  Shield,
  CreditCard,
  Bell,
  Check,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState("USD");
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
          Settings saved successfully!
        </div>
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                className="opacity-70 cursor-not-allowed"
              />
            </div>
            <Button type="submit">
              <Save className="w-4 h-4 mr-1.5" />
              Save Profile
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
        <CardContent className="space-y-4">
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="New Password" type="password" placeholder="Min 6 characters" />
            <Input label="Confirm New Password" type="password" placeholder="Repeat new password" />
          </div>
          <Button type="button">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
