"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-provider";
import { Category, TransactionType } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

export function useCategories() {
  const { user } = useAuth();
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackDefaults = useCallback(() => {
    const defaults: Category[] = [
      ...EXPENSE_CATEGORIES.map((c, i) => ({
        id: `def-exp-${i}`,
        user_id: user?.id || "",
        name: c.name,
        type: "expense" as TransactionType,
        icon: c.icon,
        color: c.color,
        is_default: true,
        created_at: new Date().toISOString(),
      })),
      ...INCOME_CATEGORIES.map((c, i) => ({
        id: `def-inc-${i}`,
        user_id: user?.id || "",
        name: c.name,
        type: "income" as TransactionType,
        icon: c.icon,
        color: c.color,
        is_default: true,
        created_at: new Date().toISOString(),
      })),
    ];
    setCategories(defaults);
  }, [user]);

  const seedDefaultCategories = useCallback(async () => {
    if (!user) return;
    try {
      const defaultRows = [
        ...EXPENSE_CATEGORIES.map((c) => ({
          user_id: user.id,
          name: c.name,
          type: "expense",
          icon: c.icon,
          color: c.color,
          is_default: true,
        })),
        ...INCOME_CATEGORIES.map((c) => ({
          user_id: user.id,
          name: c.name,
          type: "income",
          icon: c.icon,
          color: c.color,
          is_default: true,
        })),
      ];

      const { data, error } = await supabase
        .from("categories")
        .insert(defaultRows)
        .select();

      if (!error && data) {
        setCategories(data as Category[]);
      } else {
        fallbackDefaults();
      }
    } catch {
      fallbackDefaults();
    }
  }, [user, supabase, fallbackDefaults]);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error) {
        console.warn("Could not load categories from database:", error.message);
        // Fallback to local default categories
        fallbackDefaults();
      } else if (!data || data.length === 0) {
        // If user table is empty, auto-seed defaults into DB
        await seedDefaultCategories();
      } else {
        setCategories(data as Category[]);
      }
    } catch {
      fallbackDefaults();
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, fallbackDefaults, seedDefaultCategories]);

  const addCategory = async (name: string, type: TransactionType, color: string = "#3c5fa0") => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: name.trim(),
          type,
          icon: "Tag",
          color,
          is_default: false,
        })
        .select()
        .single();

      if (!error && data) {
        setCategories((prev) => [...prev, data as Category]);
        return data as Category;
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
    return null;
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    refreshCategories: fetchCategories,
    addCategory,
  };
}

