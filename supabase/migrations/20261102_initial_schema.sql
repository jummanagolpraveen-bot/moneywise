-- ==============================================================================
-- MONEYWISE — POSTGRESQL INITIAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Enable pgcrypto / uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- TABLE: PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- TABLE: CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT DEFAULT 'Tag' NOT NULL,
  color TEXT DEFAULT '#3c5fa0' NOT NULL,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- TABLE: TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount BIGINT NOT NULL CHECK (amount > 0), -- Stored in minor units (e.g. cents, paise)
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  transaction_date DATE DEFAULT CURRENT_DATE NOT NULL,
  payment_method TEXT DEFAULT 'Cash' NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_date 
  ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category 
  ON public.transactions(category_id);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- TABLE: BUDGETS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  amount BIGINT NOT NULL CHECK (amount > 0), -- Stored in minor units (cents)
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL CHECK (year >= 2020),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_category_month_year UNIQUE (user_id, category_id, month, year)
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Policies for budgets
CREATE POLICY "Users can view their own budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- TABLE: SAVINGS_GOALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount BIGINT NOT NULL CHECK (target_amount > 0), -- Stored in minor units (cents)
  current_amount BIGINT DEFAULT 0 NOT NULL CHECK (current_amount >= 0),
  target_date DATE NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- Policies for savings goals
CREATE POLICY "Users can view their own savings goals"
  ON public.savings_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings goals"
  ON public.savings_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals"
  ON public.savings_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals"
  ON public.savings_goals FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- TABLE: SAVINGS_CONTRIBUTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.savings_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.savings_goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount BIGINT NOT NULL CHECK (amount > 0),
  contribution_date DATE DEFAULT CURRENT_DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.savings_contributions ENABLE ROW LEVEL SECURITY;

-- Policies for savings contributions
CREATE POLICY "Users can view their own contributions"
  ON public.savings_contributions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contributions"
  ON public.savings_contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contributions"
  ON public.savings_contributions FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- AUTOMATION: TRIGGER TO AUTO-CREATE USER PROFILE AND SEED DEFAULT CATEGORIES
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, full_name, currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'USD'
  );

  -- 2. Seed Default Expense Categories
  INSERT INTO public.categories (user_id, name, type, icon, color, is_default) VALUES
    (NEW.id, 'Food & Dining', 'expense', 'UtensilsCrossed', '#f97316', true),
    (NEW.id, 'Transportation', 'expense', 'Car', '#3b82f6', true),
    (NEW.id, 'Shopping', 'expense', 'ShoppingBag', '#ec4899', true),
    (NEW.id, 'Entertainment', 'expense', 'Gamepad2', '#06b6d4', true),
    (NEW.id, 'Bills & Utilities', 'expense', 'Receipt', '#f59e0b', true),
    (NEW.id, 'Rent & Housing', 'expense', 'Home', '#14b8a6', true),
    (NEW.id, 'Education', 'expense', 'GraduationCap', '#8b5cf6', true),
    (NEW.id, 'Healthcare', 'expense', 'Heart', '#ef4444', true),
    (NEW.id, 'Travel', 'expense', 'Plane', '#6366f1', true),
    (NEW.id, 'Other Expense', 'expense', 'MoreHorizontal', '#64748b', true);

  -- 3. Seed Default Income Categories
  INSERT INTO public.categories (user_id, name, type, icon, color, is_default) VALUES
    (NEW.id, 'Salary', 'income', 'Briefcase', '#10b981', true),
    (NEW.id, 'Freelancing', 'income', 'Laptop', '#3b82f6', true),
    (NEW.id, 'Business', 'income', 'Building2', '#8b5cf6', true),
    (NEW.id, 'Pocket Money', 'income', 'Wallet', '#f97316', true),
    (NEW.id, 'Scholarships', 'income', 'Award', '#06b6d4', true),
    (NEW.id, 'Other Income', 'income', 'MoreHorizontal', '#64748b', true);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger hook on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- AUTOMATION: TRIGGER TO AUTO-UPDATE SAVINGS GOAL CURRENT AMOUNT
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_savings_contribution()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.savings_goals
    SET current_amount = current_amount + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.goal_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.savings_goals
    SET current_amount = GREATEST(0, current_amount - OLD.amount),
        updated_at = NOW()
    WHERE id = OLD.goal_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_savings_contribution_change ON public.savings_contributions;
CREATE TRIGGER on_savings_contribution_change
  AFTER INSERT OR DELETE ON public.savings_contributions
  FOR EACH ROW EXECUTE FUNCTION public.handle_savings_contribution();
