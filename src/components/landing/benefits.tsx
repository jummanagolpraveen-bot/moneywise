"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const benefits = [
  {
    title: "For College Students",
    description: "Track pocket money, manage food expenses, and build saving habits early.",
    points: [
      "Simple expense tracking",
      "Category-wise spending breakdown",
      "Set savings goals for big purchases",
      "Understand your spending patterns",
    ],
  },
  {
    title: "For Working Professionals",
    description: "Monitor salary, investments, and monthly budgets like a pro.",
    points: [
      "Multi-source income tracking",
      "Monthly budget management",
      "Detailed financial analytics",
      "Track bills and subscriptions",
    ],
  },
  {
    title: "For Everyone",
    description: "Whether you earn or spend — MoneyWise helps you stay in control.",
    points: [
      "Works with any currency",
      "Beautiful, easy-to-use interface",
      "No financial expertise needed",
      "Completely free to use",
    ],
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Built for{" "}
            <span className="text-emerald-500">real people</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            No matter where you are in your financial journey, MoneyWise adapts to you.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="p-6 rounded-2xl border border-border bg-background-card hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-foreground-muted text-sm mb-6">
                {benefit.description}
              </p>
              <ul className="space-y-3">
                {benefit.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="max-w-xl mx-auto bg-gradient-to-r from-navy-600 to-navy-800 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to take control?
            </h3>
            <p className="text-navy-200 mb-8">
              Join thousands of users who have already improved their financial habits with MoneyWise.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-emerald-500 text-white hover:bg-emerald-600 text-base"
              >
                Start Managing Your Money
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

