# 💰 MoneyWise — Premium Personal Finance Tracker

> **Take Control of Your Money.**  
> A modern, elegant, and secure full-stack personal finance web application built for college students, working professionals, and anyone aiming to master their money habits.

[![Next.js 16](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ecf8e?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **📊 Live Financial Dashboard**: Real-time overview of Total Balance (lifetime history), Net Savings, Total Income, and Total Expenses with comparative trend indicators.
- **📈 Interactive Visualizations**: Income vs. Expense monthly bar charts and category distribution donut charts powered by Recharts.
- **💸 Transaction Management**: Full CRUD operations for income and expenses with real-time filtering, search, multi-column sorting, and instant CSV export.
- **🎯 Category-Wise Monthly Budgets**: Set spending limits per category with dynamic progress bars and visual threshold warnings (Amber warning at 80%, Red alert when exceeded).
- **🐷 Savings Goals & Contribution Tracking**: Target-oriented savings goals with deposit tracking, progress meters, and complete contribution deposit history.
- **🛡️ Enterprise-Grade Security**: Row Level Security (RLS) enabled on 100% of PostgreSQL tables ensuring complete multi-tenant user isolation.
- **🌐 Multi-Currency Support**: Instant switching between Indian Rupee (**₹ INR**) and US Dollar (**$ USD**).
- **🌗 Theme Flexibility**: Built-in Light and Dark mode with persistent user preference storage.
- **📱 Fully Responsive**: Optimized layouts across mobile devices, tablets, and wide desktop displays.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server & Client Components), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) icons |
| **Charts & Analytics** | [Recharts](https://recharts.org/) |
| **Backend & DB** | [Supabase](https://supabase.com/) (PostgreSQL 15+, Supabase SSR Auth Client, Database Triggers) |
| **Security** | PostgreSQL Row Level Security (RLS) on all tables |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
moneywise/
├── public/                 # Static assets & icons
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── (auth)/         # /login, /signup, /forgot-password
│   │   ├── (dashboard)/    # Protected application pages
│   │   │   ├── dashboard/  # Live financial overview
│   │   │   ├── transactions/ # Transaction history & CSV export
│   │   │   ├── income/     # Dedicated income tracking
│   │   │   ├── expenses/   # Dedicated expense tracking
│   │   │   ├── budgets/    # Monthly budget management & alerts
│   │   │   ├── savings/    # Savings goals & contribution history
│   │   │   ├── analytics/  # Detailed visual reports & charts
│   │   │   └── settings/   # User profile & currency settings
│   │   └── auth/callback/  # Supabase OAuth and magic link callback
│   ├── components/         # Reusable UI components & modals
│   ├── context/            # AuthProvider & ThemeProvider
│   ├── hooks/              # Custom hooks (useTransactions, useBudgets, etc.)
│   ├── lib/                # Supabase clients, constants & formatting helpers
│   ├── middleware.ts       # Route protection middleware
│   └── types/              # TypeScript interfaces & domain types
├── supabase/
│   └── migrations/         # PostgreSQL schema & RLS migrations
├── .env.example            # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- A free [Supabase](https://supabase.com/) account

### 2. Clone the Repository
```bash
git clone https://github.com/jummanagolpraveen-bot/moneywise.git
cd moneywise
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

### 5. Setup Database Schema
In your Supabase project dashboard, navigate to the **SQL Editor**, open [`supabase/migrations/20261102_initial_schema.sql`](supabase/migrations/20261102_initial_schema.sql), and run the script to initialize tables, triggers, and Row Level Security policies.

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Precision

- **Integer Minor Units**: Monetary balances are stored in integer cents/paise (`BIGINT`) to prevent floating-point calculation inaccuracies.
- **Row Level Security**: Every SQL operation (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) checks `auth.uid() = user_id`, guaranteeing zero data leakage between users.
- **Authentication Guard**: Unauthenticated requests to private routes are automatically intercepted and redirected to `/login` by Next.js SSR middleware.

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in **Project Settings > Environment Variables**.
4. In Supabase under **Authentication > URL Configuration**, add your Vercel URL to **Redirect URLs**.
5. Deploy!

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
