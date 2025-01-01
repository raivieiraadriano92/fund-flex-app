import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth";

import type { Category, CategoryFormData } from "~/core/types/category";

import { supabase } from "~/core/api/supabase";

interface CategoriesState {
  categories: Category[];
}

interface CategoriesActions {
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryFormData) => Promise<void>;
  createDefaultCategories: (categories: CategoryFormData[]) => Promise<void>;
  updateCategory: (id: string, data: CategoryFormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

type CategoriesStore = CategoriesState & CategoriesActions;

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set) => ({
      categories: [],

      fetchCategories: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", userId)
          .order("title");

        set({ categories: data ?? [] });
      },

      createCategory: async (data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data: newCategory, error } = await supabase
          .from("categories")
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();

        if (error) throw error;

        if (newCategory) {
          set((state) => ({
            categories: [...state.categories, newCategory].sort((a, b) =>
              a.title.localeCompare(b.title)
            )
          }));
        }
      },

      createDefaultCategories: async (categories) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data, error } = await supabase
          .from("categories")
          .insert(
            categories.map((category) => ({ ...category, user_id: userId }))
          )
          .select();

        if (error) throw error;

        if (data) {
          set((state) => ({
            categories: [...state.categories, ...data]
          }));
        }
      },

      updateCategory: async (id, data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data: updatedCategory, error } = await supabase
          .from("categories")
          .update(data)
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;

        if (updatedCategory) {
          set((state) => ({
            categories: state.categories
              .map((category) =>
                category.id === id ? updatedCategory : category
              )
              .sort((a, b) => a.title.localeCompare(b.title))
          }));
        }
      },

      deleteCategory: async (id) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);

        if (error) throw error;

        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id)
        }));
      }
    }),
    {
      name: "categories-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ categories: state.categories })
    }
  )
);
