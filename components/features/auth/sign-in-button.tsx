import { useMemo } from "react";

import { ActivityIndicator } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AppleIcon, GoogleIcon, UserIcon } from "~/lib/icons";

export type Provider = "apple" | "google" | "anonymous";

interface SignInButtonProps {
  provider: Provider;
  isLoading?: boolean;
  onPress: () => void;
}

export function SignInButton({
  provider,
  isLoading = false,
  onPress
}: SignInButtonProps) {
  const providerConfig = useMemo(() => {
    switch (provider) {
      case "apple":
        return {
          className: "bg-black dark:bg-white",
          icon: (
            <AppleIcon
              className="text-white dark:text-black"
              height={24}
              width={24}
            />
          ),
          label: "Sign in with Apple",
          variant: "solid"
        };

      case "google":
        return {
          className: "bg-black dark:bg-white",
          icon: <GoogleIcon className="text-white" height={24} width={24} />,
          label: "Sign in with Google",
          variant: "solid"
        };

      case "anonymous":
        return {
          icon: <UserIcon className="text-foreground" size={24} />,
          label: "Sign in Anonymously",
          variant: "ghost"
        };
    }
  }, [provider]);

  return (
    <Button
      className={providerConfig.className}
      variant={providerConfig.variant}
      disabled={isLoading}
      onPress={onPress}
    >
      {providerConfig.icon}
      <Text>{providerConfig.label}</Text>
      {isLoading && <ActivityIndicator />}
    </Button>
  );
}
