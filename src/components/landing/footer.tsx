import Link from "next/link";
import { Wallet } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-navy-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Money<span className="text-emerald-500">Wise</span>
              </span>
            </Link>
            <p className="text-sm text-foreground-muted max-w-sm leading-relaxed">
              A premium personal finance tracker that helps you understand where
              your money goes and make smarter financial decisions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#preview" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Preview
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Benefits
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Account</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/login" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-muted">
            © 2026 MoneyWise. All rights reserved.
          </p>
          <p className="text-sm text-foreground-muted">
            Built with ❤️ for better financial management.
          </p>
        </div>
      </div>
    </footer>
  );
}

