import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth";

import type { GoalFormData, GoalWithProgress } from "~/core/types/goal";

import { supabase } from "~/core/api/supabase";
import { mapGoal } from "~/core/utils/map-goal";

interface GoalsState {
  goals: GoalWithProgress[];
}

interface GoalsActions {
  fetchGoals: () => Promise<void>;
  createGoal: (data: GoalFormData) => Promise<void>;
  updateGoal: (id: string, data: GoalFormData) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  reset: () => void;
}

type GoalsStore = GoalsState & GoalsActions;

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set) => ({
      goals: [],

      fetchGoals: async () => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data } = await supabase
          .from("goals")
          .select("*, transactions(amount,type)")
          .eq("user_id", userId)
          .order("title");

        // Transform the data to calculate amount
        const goalsWithProgress = data?.map(mapGoal) ?? [];

        set({ goals: goalsWithProgress });
      },

      createGoal: async (data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data: newGoal, error } = await supabase
          .from("goals")
          .insert([{ ...data, user_id: userId }])
          .select()
          .single();

        if (error) throw error;

        if (newGoal) {
          set((state) => ({
            goals: [
              ...state.goals,
              { ...newGoal, currentAmount: 0, progress: 0 }
            ].sort((a, b) => a.title.localeCompare(b.title))
          }));
        }
      },

      updateGoal: async (id, data) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { data: updatedGoal, error } = await supabase
          .from("goals")
          .update(data)
          .eq("id", id)
          .eq("user_id", userId)
          .select(
            `
            *,
            income_amount: transactions(amount).eq(type, 'income'),
            expense_amount: transactions(amount).eq(type, 'expense')
          `
          )
          .single();

        if (error) throw error;

        if (updatedGoal) {
          const goalWithProgress = {
            // @todo Fix this typing issue -> ParserError<"Unexpected input ...
            // @ts-ignore
            ...updatedGoal,
            current_amount:
              // @todo Fix this typing issue -> ParserError<"Unexpected input ...
              // @ts-ignore
              (updatedGoal.income_amount?.sum?.amount ?? 0) -
              // @todo Fix this typing issue -> ParserError<"Unexpected input ...
              // @ts-ignore
              (updatedGoal.expense_amount?.sum?.amount ?? 0)
          };

          set((state) => ({
            goals: state.goals
              .map((goal) => (goal.id === id ? goalWithProgress : goal))
              .sort((a, b) => a.title.localeCompare(b.title))
          }));
        }
      },

      deleteGoal: async (id) => {
        const userId = useAuthStore.getState().session?.user.id;

        if (!userId) throw new Error("User not found");

        const { error } = await supabase
          .from("goals")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);

        if (error) throw error;

        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id)
        }));
      },

      reset: () => {
        set({
          goals: []
        });
      }
    }),
    {
      name: "goals-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ goals }) => ({ goals })
    }
  )
);
