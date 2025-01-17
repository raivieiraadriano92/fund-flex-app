import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "expo-sqlite/kv-store";

import { useAuthStore } from "~/store/auth";
import { useCategoriesStore } from "~/store/categories";
import { useCurrencyStore } from "~/store/currency";
import { useGoalsStore } from "~/store/goals";
import { useTransactionsStore } from "~/store/transactions";

export async function signOut() {
  await useAuthStore.getState().signOut();

  useCategoriesStore.getState().reset();

  useGoalsStore.getState().reset();

  useTransactionsStore.getState().reset();

  useCurrencyStore.getState().reset();

  AsyncStorage.clear();

  Storage.clear();
}
