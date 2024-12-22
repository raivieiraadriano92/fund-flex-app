import { AntDesign } from '@expo/vector-icons';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

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
        return <AntDesign name="apple1" size={24} color="#fff" />;
      case 'google':
        return <AntDesign name="google" size={24} color="#fff" />;
      case 'anonymous':
        return <AntDesign name="user" size={24} color="#000" />;
    }
  };

  return (
    <Button
      variant={provider === 'anonymous' ? 'outline' : 'default'}
      disabled={isLoading}
      onPress={onPress}>
      <View className="flex-row items-center space-x-2">
        {getProviderIcon()}
        <Text>{getProviderLabel()}</Text>
      </View>
    </Button>
  );
}
