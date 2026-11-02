"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/income": "Income",
  "/expenses": "Expenses",
  "/budgets": "Budgets",
  "/savings": "Savings Goals",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "MoneyWise";

  return (
    <header className="h-16 border-b border-border bg-background-card/80 backdrop-blur-lg flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Page title */}
        <h1 className="text-xl font-semibold text-foreground ml-12 lg:ml-0">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-input-bg transition-all cursor-pointer hidden sm:flex">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-input-bg transition-all cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-navy-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}

