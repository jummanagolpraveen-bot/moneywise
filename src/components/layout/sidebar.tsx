"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import {
  Wallet,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
} from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { useAuth } from "@/context/auth-provider";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-xl bg-background-card border border-border shadow-sm cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 bg-background-sidebar border-r border-border flex flex-col transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 bg-navy-600 rounded-xl flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-foreground whitespace-nowrap">
                Money<span className="text-emerald-500">Wise</span>
              </span>
            )}
          </Link>

          {/* Close on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-input-bg text-foreground-muted cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse on desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden lg:flex p-1 rounded-lg hover:bg-input-bg text-foreground-muted cursor-pointer transition-transform",
              collapsed && "rotate-180"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-navy-600 text-white shadow-sm"
                    : "text-foreground-muted hover:text-foreground hover:bg-input-bg"
                )}
                title={collapsed ? item.label : undefined}
              >
                {Icon && <Icon className="w-5 h-5 shrink-0" />}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full",
              "text-foreground-muted hover:text-foreground hover:bg-input-bg transition-all cursor-pointer"
            )}
            title={collapsed ? "Toggle theme" : undefined}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            {!collapsed && (
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full",
              "text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all cursor-pointer"
            )}
            title={collapsed ? "Log out" : undefined}
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

