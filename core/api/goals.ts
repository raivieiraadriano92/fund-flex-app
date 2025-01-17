import Storage from "expo-sqlite/kv-store";

import { Goal } from "../types/goal";

import { supabase } from "./supabase";

import { useAuthStore } from "~/store/auth";
import { useGoalsStore } from "~/store/goals";

const getAndParseGoal = async (key: string) => {
  const goal = await Storage.getItem(key);

  if (!goal) {
    return null;
  }

  return JSON.parse(goal) as Goal;
};

export const pushLocalGoals = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const prefix = `goal:${userId}:`;

    const { deleteSyncQueue, upsertSyncQueue } = useGoalsStore.getState();

    const goalsToUpsert = await Promise.all(
      upsertSyncQueue.map(async (id) => await getAndParseGoal(`${prefix}${id}`))
    );

    const upsertData = goalsToUpsert.filter((goal) => goal !== null);

    if (upsertData.length) {
      const upsertResponse = await supabase.from("goals").upsert(upsertData);

      if (upsertResponse.error) {
        throw upsertResponse.error;
      }

      useGoalsStore.setState((state) => ({
        upsertSyncQueue: state.upsertSyncQueue.filter(
          (id) => !upsertData.some((goal) => goal.id === id)
        )
      }));

      console.info("- 🎯 Successfully upserted goals");
    }

    if (deleteSyncQueue.length) {
      const deleteResponse = await supabase
        .from("goals")
        .delete()
        .in("id", deleteSyncQueue);

      if (deleteResponse.error) {
        throw deleteResponse.error;
      }

      useGoalsStore.setState((state) => ({
        deleteSyncQueue: state.deleteSyncQueue.filter(
          (id) => !deleteSyncQueue.includes(id)
        )
      }));

      console.info("- 🎯 Successfully deleted goals");
    }
  } catch (e) {
    console.error(e);
  }
};

export const pullRemoteGoals = async () => {};
