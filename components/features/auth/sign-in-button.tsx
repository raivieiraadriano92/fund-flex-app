import { ActivityIndicator, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { AppleIcon, GoogleIcon, UserIcon } from '~/lib/icons';

export type Provider = 'apple' | 'google' | 'anonymous';

interface SignInButtonProps {
  provider: Provider;
  isLoading?: boolean;
  onPress: () => void;
}

export function SignInButton({ provider, isLoading = false, onPress }: SignInButtonProps) {
  const getProviderLabel = () => {
    switch (provider) {
      case 'apple':
        return 'Sign in with Apple';
      case 'google':
        return 'Sign in with Google';
      case 'anonymous':
        return 'Sign in Anonymously';
    }
  };

  const getProviderIcon = () => {
    switch (provider) {
      case 'apple':
        return <AppleIcon className="text-white" size={24} />;
      case 'google':
        // Note: We might want to use a different icon or create a custom one for Google
        return <GoogleIcon className="text-white" size={24} />;
      case 'anonymous':
        return <UserIcon className="text-foreground" size={24} />;
    }
  };

  return (
    <Button
      variant={provider === 'anonymous' ? 'outline' : 'solid'}
      disabled={isLoading}
      onPress={onPress}>
      <View className="flex-row items-center gap-2">
        {getProviderIcon()}
        <Text>{getProviderLabel()}</Text>
        <ActivityIndicator animating={isLoading} />
      </View>
    </Button>
  );
}
