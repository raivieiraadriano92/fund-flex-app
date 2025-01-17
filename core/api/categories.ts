import Storage from "expo-sqlite/kv-store";

import { Category } from "../types/category";

import { supabase } from "./supabase";

import { useAuthStore } from "~/store/auth";
import { useCategoriesStore } from "~/store/categories";

const getAndParseCategory = async (key: string) => {
  const category = await Storage.getItem(key);

  if (!category) {
    return null;
  }

  return JSON.parse(category) as Category;
};

export const pushLocalCategories = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const prefix = `category:${userId}:`;

    const { deleteSyncQueue, upsertSyncQueue } = useCategoriesStore.getState();

    const categoriesToUpsert = await Promise.all(
      upsertSyncQueue.map(
        async (id) => await getAndParseCategory(`${prefix}${id}`)
      )
    );

    const upsertData = categoriesToUpsert.filter(
      (category) => category !== null
    );

    if (upsertData.length) {
      const upsertResponse = await supabase
        .from("categories")
        .upsert(upsertData);

      if (upsertResponse.error) {
        throw upsertResponse.error;
      }

      useCategoriesStore.setState((state) => ({
        upsertSyncQueue: state.upsertSyncQueue.filter(
          (id) => !upsertData.some((category) => category.id === id)
        )
      }));

      console.info("- 📋 Successfully upserted categories");
    }

    if (deleteSyncQueue.length) {
      const deleteResponse = await supabase
        .from("categories")
        .delete()
        .in("id", deleteSyncQueue);

      if (deleteResponse.error) {
        throw deleteResponse.error;
      }

      useCategoriesStore.setState((state) => ({
        deleteSyncQueue: state.deleteSyncQueue.filter(
          (id) => !deleteSyncQueue.includes(id)
        )
      }));

      console.info("- 📋 Successfully deleted categories");
    }
  } catch (e) {
    console.error(e);
  }
};
