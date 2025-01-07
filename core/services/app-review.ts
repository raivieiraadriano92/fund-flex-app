import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import { Linking, Platform } from "react-native";

import { useTransactionsStore } from "~/store/transactions";

const REVIEW_KEY = "last_review_prompt";

const TRANSACTIONS_THRESHOLD = 5;

const DAYS_BETWEEN_PROMPTS = 30;

export async function shouldPromptForReview(): Promise<boolean> {
  try {
    // Check if review is available
    if (!(await StoreReview.hasAction())) {
      return false;
    }

    // Check last prompt date
    const lastPrompt = await AsyncStorage.getItem(REVIEW_KEY);

    if (lastPrompt) {
      const daysSinceLastPrompt =
        (Date.now() - Number(lastPrompt)) / (1000 * 60 * 60 * 24);

      if (daysSinceLastPrompt < DAYS_BETWEEN_PROMPTS) {
        return false;
      }
    }

    // Check transactions threshold
    const transactions = useTransactionsStore.getState().transactions;

    if (transactions.length < TRANSACTIONS_THRESHOLD) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function promptForReview() {
  try {
    await StoreReview.requestReview();

    await AsyncStorage.setItem(REVIEW_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error requesting review:", error);
  }
}

export async function redirectToWriteReview() {
  const os = Platform.OS;

  switch (os) {
    case "ios":
      Linking.openURL(
        "itms-apps://itunes.apple.com/app/viewContentsUserReviews/id6740143675?action=write-review"
      );

      break;

    case "android":
      Linking.openURL(
        `market://details?id=${Constants.expoConfig?.android?.package}&showAllReviews=true`
      );

      break;

    default:
      break;
  }
}
