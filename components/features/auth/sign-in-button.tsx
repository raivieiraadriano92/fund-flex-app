import { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';

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
  const providerConfig = useMemo(() => {
    switch (provider) {
      case 'apple':
        return {
          icon: <AppleIcon className="text-white" height={24} width={24} />,
          label: 'Sign in with Apple',
          variant: 'solid',
        };
      case 'google':
        return {
          icon: <GoogleIcon className="text-white" height={24} width={24} />,
          label: 'Sign in with Google',
          variant: 'outline',
        };
      case 'anonymous':
        return {
          icon: <UserIcon className="text-foreground" size={24} />,
          label: 'Sign in Anonymously',
          variant: 'ghost',
        };
    }
  }, [provider]);

  return (
    <Button variant={providerConfig.variant} disabled={isLoading} onPress={onPress}>
      {providerConfig.icon}
      <Text>{providerConfig.label}</Text>
      {isLoading && <ActivityIndicator />}
    </Button>
  );
}
