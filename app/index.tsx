import { useTheme } from "@react-navigation/native";
import Constants from "expo-constants";
import { Platform, View } from "react-native";
import { toast } from "sonner-native";

import { SignInButton, Logo } from "~/components/features/auth";
import { H1, P } from "~/components/ui/typography";
import { useAuth } from "~/core/hooks/use-auth";
import { useColorScheme } from "~/lib/useColorScheme";

export default function SignInScreen() {
  const { isDarkColorScheme } = useColorScheme();

  const theme = useTheme();

  const { isLoading, signInWithApple, signInWithGoogle, signInAnonymously } =
    useAuth({
      onError: () => toast.error("An error occurred. Please try again later.")
    });

  const handleSignIn = async (provider: "apple" | "google" | "anonymous") => {
    switch (provider) {
      case "apple":
        await signInWithApple();

        break;

      case "google":
        await signInWithGoogle();

        break;

      case "anonymous":
        await signInAnonymously();

        break;
    }
  };

  return (
    <View
      className="p-safe flex-1"
      style={{
        backgroundColor: isDarkColorScheme
          ? theme.colors.background
          : Constants.expoConfig?.splash?.backgroundColor
      }}
    >
      <View className="flex-1 justify-center p-6">
        {/* Logo Section */}
        <View className="flex-1 items-center justify-center">
          <Logo />
        </View>

        {/* Title Section */}
        <View className="items-center gap-y-3 pb-16">
          <H1 className="text-center">Manage & Track Your Money in One App</H1>
          <P className="text-center">
            Take control of your financial future with our all-in-one finance
            management app. Designed to simplify and streamline your money
            matters
          </P>
        </View>

        {/* Auth Buttons Section */}
        <View className="gap-y-3">
          {Platform.OS === "ios" && (
            <SignInButton
              provider="apple"
              onPress={() => handleSignIn("apple")}
              isLoading={isLoading.apple}
            />
          )}
          {Platform.OS === "android" && (
            <SignInButton
              provider="google"
              onPress={() => handleSignIn("google")}
              isLoading={isLoading.google}
            />
          )}
          {__DEV__ && (
            <SignInButton
              provider="anonymous"
              onPress={() => handleSignIn("anonymous")}
              isLoading={isLoading.anonymous}
            />
          )}
        </View>
      </View>
    </View>
  );
}
