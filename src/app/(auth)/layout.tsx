import { Wallet } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-700 to-navy-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold">
              Money<span className="text-emerald-400">Wise</span>
            </span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Take Control of
            <br />
            Your Money
          </h1>
          <p className="text-navy-200 text-lg max-w-md leading-relaxed">
            Track your income, manage expenses, set budgets, and achieve your
            savings goals — all in one beautiful dashboard.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {["bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-cyan-400"].map(
                (bg, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full ${bg} border-2 border-navy-800 flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                )
              )}
            </div>
            <p className="text-navy-300 text-sm">
              Trusted by thousands of users
            </p>
          </div>
        </div>

        <p className="text-navy-400 text-sm relative">
          © 2026 MoneyWise. All rights reserved.
        </p>
      </div>

      {/* Right side — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

