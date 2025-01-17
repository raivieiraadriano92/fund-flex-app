import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth";

import type { Goal, GoalFormData } from "~/core/types/goal";

import { supabase } from "~/core/api/supabase";
import { generateId } from "~/core/utils/id";

interface GoalsState {
  goals: Goal[];

  // Sync queues
  upsertSyncQueue: string[]; // Array of goal IDs to be upserted
  deleteSyncQueue: string[]; // Array of goal IDs to be deleted

  // indicates if the remote pull has been completed
  // (used to prevent multiple remote pulls)
  // data will be pulled from the remote only once at the sign in
  remotePullCompleted: boolean;
}

interface GoalsActions {
  fetchGoals: () => Promise<void>;
  createGoal: (goals: GoalFormData[]) => Promise<void>;
  updateGoal: (id: string, data: GoalFormData) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  reset: () => void;
}

type GoalsStore = GoalsState & GoalsActions;

const initialGoalsState: GoalsState = {
  goals: [],

  upsertSyncQueue: [],
  deleteSyncQueue: [],

  remotePullCompleted: false
};

const pullRemoteGoals = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const response = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (response.error) {
      throw response.error;
    }

    const goals = response.data as Goal[];

    await Promise.all(
      goals.map(async (goal) => {
        const key = `goal:${userId}:${goal.id}`;

        await Storage.setItem(key, JSON.stringify(goal));
      })
    );

    // useGoalsStore.setState({
    //   goals
    // });

    console.info("- 🎯 Successfully pulled goals");
  } catch (e) {
    console.error(e);
  }
};

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      ...initialGoalsState,

      fetchGoals: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        if (!get().remotePullCompleted) {
          await pullRemoteGoals();
        }

        const prefix = `goal:${userId}:`;

        const keys = await Storage.getAllKeys();

        const goalKeys = keys.filter((key) => key.startsWith(prefix));

        const goals: Goal[] = [];

        for (const key of goalKeys) {
          try {
            const item = await Storage.getItem(key);

            if (!item) {
              continue;
            }

            const goal = JSON.parse(item);

            goals.push(goal);
          } catch (_e) {}
        }

        set({ goals, remotePullCompleted: true });
      },

      createGoal: async (goals) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const prefix = `goal:${userId}:`;

        const newGoals = goals.map<Goal>((goal) => ({
          ...goal,
          id: generateId(),
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        for (const newGoal of newGoals) {
          const key = `${prefix}${newGoal.id}`;

          await Storage.setItem(key, JSON.stringify(newGoal));
        }

        set((state) => ({
          goals: [...state.goals, ...newGoals].sort((a, b) =>
            a.title.localeCompare(b.title)
          ),
          upsertSyncQueue: [
            ...state.upsertSyncQueue,
            ...newGoals.map((c) => c.id)
          ]
        }));
      },

      updateGoal: async (id, data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const key = `goal:${userId}:${id}`;

        const item = await Storage.getItem(key);

        if (!item) throw new Error("Goal not found");

        const goal = JSON.parse(item);

        const updatedGoal: Goal = {
          ...goal,
          ...data,
          updated_at: new Date().toISOString()
        };

        await Storage.setItem(key, JSON.stringify(updatedGoal));

        set((state) => {
          // update the goal in the list
          const goals = state.goals
            .map((goal) => (goal.id === id ? updatedGoal : goal))
            .sort((a, b) => a.title.localeCompare(b.title));

          const upsertSyncQueue = [...state.upsertSyncQueue];

          // add to the upsert sync queue and remove any duplicates
          if (!upsertSyncQueue.includes(id)) {
            upsertSyncQueue.push(id);
          }

          return {
            goals,
            upsertSyncQueue
          };
        });
      },

      deleteGoal: async (id) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const key = `goal:${userId}:${id}`;

        await Storage.removeItem(key);

        set((state) => {
          const goals = state.goals.filter((goal) => goal.id !== id);

          // add to the delete sync queue and remove any duplicates
          const deleteSyncQueue = [...state.deleteSyncQueue];

          // add to the delete sync queue and remove any duplicates
          if (!deleteSyncQueue.includes(id)) {
            deleteSyncQueue.push(id);
          }

          // remove from the upsert sync queue
          // (in case the goal was upserted offline and then deleted)
          const upsertSyncQueue = state.upsertSyncQueue.filter(
            (goalId) => goalId !== id
          );

          return {
            goals,
            deleteSyncQueue,
            upsertSyncQueue
          };
        });
      },

      reset: () => {
        set({
          ...initialGoalsState
        });
      }
    }),
    {
      name: "goals-storage",
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
