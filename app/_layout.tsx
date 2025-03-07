import "../global.css";

import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import * as BackgroundTask from "expo-background-task";
import { Slot, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { vexo } from "vexo-analytics";

import { AuthProvider } from "~/components/providers/auth-provider";
import { DataProvider } from "~/components/providers/data-provider";
import { useProtectedRoute } from "~/core/hooks/use-protected-route";
import { pushLocalDataToRemote } from "~/core/utils/backup";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index"
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo()
});

const vexoApiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;

const sentryDns = process.env.EXPO_PUBLIC_SENTRY_DNS;

if (!vexoApiKey) {
  throw new Error("Missing env var: EXPO_PUBLIC_VEXO_API_KEY");
}

if (!vexoApiKey) {
  throw new Error("Missing env var: EXPO_PUBLIC_SENTRY_DNS");
}

if (!__DEV__) {
  vexo(vexoApiKey);
}

Sentry.init({
  enabled: !__DEV__,
  dsn: sentryDns,
  debug: false, //__DEV__,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,
  integrations: [
    // Pass integration
    navigationIntegration
  ],
  enableNativeFramesTracking: !isRunningInExpoGo() // Tracks slow and frozen frames in the application
});

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: { ...DefaultTheme, ...NAV_THEME.light }
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  dark: true,
  colors: { ...DarkTheme, ...NAV_THEME.dark }
};

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true
});

const SYNC_DATA_BACKGROUND_TASK_IDENTIFIER = "sync-data-task";

// Register and create the task so that it is available also when the background task screen
// (a React component defined later in this example) is not visible.
// Note: This needs to be called in the global scope, not in a React component.
TaskManager.defineTask(SYNC_DATA_BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    await pushLocalDataToRemote();

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Failed to execute the background task:", error);

    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// 2. Register the task at some point in your app by providing the same name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
BackgroundTask.registerTaskAsync(SYNC_DATA_BACKGROUND_TASK_IDENTIFIER);

function AuthProtection() {
  const { isInitialized } = useProtectedRoute();

  if (!isInitialized) {
    return null;
  }

  return <Slot />;
}

function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();

  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  // Capture the NavigationContainer ref and register it with the integration.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    (async () => {
      try {
        const theme = await AsyncStorage.getItem("theme");

        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }

        if (!theme) {
          await AsyncStorage.setItem("theme", colorScheme);

          setIsColorSchemeLoaded(true);

          return;
        }

        const colorTheme = theme === "dark" ? "dark" : "light";

        if (colorTheme !== colorScheme) {
          setColorScheme(colorTheme);

          setIsColorSchemeLoaded(true);

          return;
        }

        setIsColorSchemeLoaded(true);
      } catch (_e) {
        setIsColorSchemeLoaded(true);
      }
    })();
  }, [colorScheme, setColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar animated style={isDarkColorScheme ? "light" : "dark"} />
        <AuthProvider>
          <DataProvider>
            <AuthProtection />
            <Toaster closeButton richColors />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// Wrap the Root Layout route component with `Sentry.wrap` to capture gesture info and profiling data.
export default Sentry.wrap(RootLayout);
