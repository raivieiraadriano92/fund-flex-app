import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useAuthStore } from './auth';

import { supabase } from '~/core/api/supabase';
import type { Category, CategoryFormData } from '~/core/types/category';

interface CategoriesState {
  categories: Category[];
}

interface CategoriesActions {
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryFormData) => Promise<void>;
  updateCategory: (id: string, data: CategoryFormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

type CategoriesStore = CategoriesState & CategoriesActions;

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set) => ({
      categories: [],

      fetchCategories: async () => {
        const { data } = await supabase.from('categories').select('*').order('title');

        set({ categories: data ?? [] });
      },

      createCategory: async (data) => {
        const userId = useAuthStore.getState().session?.user.id;
        const { data: newCategory } = await supabase
          .from('categories')
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();

        if (newCategory) {
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));
        }
      },

      updateCategory: async (id, data) => {
        const { data: updatedCategory } = await supabase
          .from('categories')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (updatedCategory) {
          set((state) => ({
            categories: state.categories.map((category) =>
              category.id === id ? updatedCategory : category
            ),
          }));
        }
      },

      deleteCategory: async (id) => {
        await supabase.from('categories').delete().eq('id', id);

        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
    }),
    {
      name: 'categories-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);
