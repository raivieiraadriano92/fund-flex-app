import '../global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

import { AuthProvider } from '~/components/providers/auth-provider';
import { DataProvider } from '~/components/providers/data-provider';
import { useProtectedRoute } from '~/core/hooks/use-protected-route';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: { ...DefaultTheme, ...NAV_THEME.light },
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  dark: true,
  colors: { ...DarkTheme, ...NAV_THEME.dark },
};

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AuthProtection() {
  const { isInitialized } = useProtectedRoute();

  if (!isInitialized) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        if (Platform.OS === 'web') {
          document.documentElement.classList.add('bg-background');
        }
        if (!theme) {
          await AsyncStorage.setItem('theme', colorScheme);
          setIsColorSchemeLoaded(true);
          return;
        }
        const colorTheme = theme === 'dark' ? 'dark' : 'light';
        if (colorTheme !== colorScheme) {
          setColorScheme(colorTheme);
          setIsColorSchemeLoaded(true);
          return;
        }
        setIsColorSchemeLoaded(true);
      } catch (e) {
        console.error('Error loading theme:', e);
        setIsColorSchemeLoaded(true);
      }
    })();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar animated style={isDarkColorScheme ? 'light' : 'dark'} />
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
