import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth";

import type { Category, CategoryFormData } from "~/core/types/category";

import { supabase } from "~/core/api/supabase";
import { generateId } from "~/core/utils/id";

interface CategoriesState {
  categories: Category[];

  // Sync queues
  upsertSyncQueue: string[]; // Array of category IDs to be upserted
  deleteSyncQueue: string[]; // Array of category IDs to be deleted

  // indicates if the remote pull has been completed
  // (used to prevent multiple remote pulls)
  // data will be pulled from the remote only once at the sign in
  remotePullCompleted: boolean;
}

interface CategoriesActions {
  fetchCategories: () => Promise<void>;
  createCategory: (categories: CategoryFormData[]) => Promise<void>;
  updateCategory: (id: string, data: CategoryFormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reset: () => void;
}

type CategoriesStore = CategoriesState & CategoriesActions;

const initialCategoriesState: CategoriesState = {
  categories: [],

  upsertSyncQueue: [],
  deleteSyncQueue: [],

  remotePullCompleted: false
};

const pullRemoteCategories = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const response = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);

    if (response.error) {
      throw response.error;
    }

    const categories = response.data as Category[];

    const prefix = `category:${userId}:`;

    await Promise.all(
      categories.map(async (category) => {
        await Storage.setItem(
          `${prefix}${category.id}`,
          JSON.stringify(category)
        );
      })
    );

    // useCategoriesStore.setState({
    //   categories
    // });

    console.info("- 📋 Successfully pulled categories");
  } catch (e) {
    console.error(e);
  }
};

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      ...initialCategoriesState,

      fetchCategories: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        if (!get().remotePullCompleted) {
          await pullRemoteCategories();
        }

        const prefix = `category:${userId}:`;

        const keys = await Storage.getAllKeys();

        const categoryKeys = keys.filter((key) => key.startsWith(prefix));

        const categories: Category[] = [];

        for (const key of categoryKeys) {
          try {
            const item = await Storage.getItem(key);

            if (!item) {
              continue;
            }

            const category = JSON.parse(item);

            categories.push(category);
          } catch (_e) {}
        }

        set({ categories, remotePullCompleted: true });
      },

      createCategory: async (categories) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const prefix = `category:${userId}:`;

        const newCategories = categories.map<Category>((category) => ({
          ...category,
          id: generateId(),
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        for (const newCategory of newCategories) {
          const key = `${prefix}${newCategory.id}`;

          await Storage.setItem(key, JSON.stringify(newCategory));
        }

        set((state) => ({
          categories: [...state.categories, ...newCategories].sort((a, b) =>
            a.title.localeCompare(b.title)
          ),
          upsertSyncQueue: [
            ...state.upsertSyncQueue,
            ...newCategories.map((c) => c.id)
          ]
        }));
      },

      updateCategory: async (id, data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const key = `category:${userId}:${id}`;

        const item = await Storage.getItem(key);

        if (!item) throw new Error("Category not found");

        const category = JSON.parse(item);

        const updatedCategory: Category = {
          ...category,
          ...data,
          updated_at: new Date().toISOString()
        };

        await Storage.setItem(key, JSON.stringify(updatedCategory));

        set((state) => {
          // update the category in the list
          const categories = state.categories
            .map((category) =>
              category.id === id ? updatedCategory : category
            )
            .sort((a, b) => a.title.localeCompare(b.title));

          const upsertSyncQueue = [...state.upsertSyncQueue];

          // add to the upsert sync queue and remove any duplicates
          if (!upsertSyncQueue.includes(id)) {
            upsertSyncQueue.push(id);
          }

          return {
            categories,
            upsertSyncQueue
          };
        });
      },

      deleteCategory: async (id) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const key = `category:${userId}:${id}`;

        await Storage.removeItem(key);

        set((state) => {
          const categories = state.categories.filter(
            (category) => category.id !== id
          );

          // add to the delete sync queue and remove any duplicates
          const deleteSyncQueue = [...state.deleteSyncQueue];

          // add to the delete sync queue and remove any duplicates
          if (!deleteSyncQueue.includes(id)) {
            deleteSyncQueue.push(id);
          }

          // remove from the upsert sync queue
          // (in case the category was upserted offline and then deleted)
          const upsertSyncQueue = state.upsertSyncQueue.filter(
            (categoryId) => categoryId !== id
          );

          return {
            categories,
            deleteSyncQueue,
            upsertSyncQueue
          };
        });
      },

      reset: () => {
        set({
          ...initialCategoriesState
        });
      }
    }),
    {
      name: "categories-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({
        upsertSyncQueue,
        deleteSyncQueue,
        remotePullCompleted
      }) => ({
        upsertSyncQueue,
        deleteSyncQueue,
        remotePullCompleted
      })
    }
  )
);
