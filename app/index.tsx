import { View } from 'react-native';

import { SignInButton, Logo } from '~/components/features/auth';
import { H1, P, Small } from '~/components/ui/typography';
import { useAuth } from '~/core/hooks/use-auth';

export default function SignInScreen() {
  const { isLoading, error, signInWithApple, signInWithGoogle, signInAnonymously } = useAuth();

  const handleSignIn = async (provider: 'apple' | 'google' | 'anonymous') => {
    switch (provider) {
      case 'apple':
        await signInWithApple();
        break;
      case 'google':
        await signInWithGoogle();
        break;
      case 'anonymous':
        await signInAnonymously();
        break;
    }
  };

  return (
    <View className="flex-1 justify-center gap-y-8 px-4 py-6">
      {/* Logo and Title Section */}
      <View className="items-center gap-y-4">
        <Logo />
        <H1 className="text-center">Manage & Track Your Money in One App</H1>
        <P className="text-center">
          Take control of your financial future with our all-in-one finance management app. Designed
          to simplify and streamline your money matters
        </P>
      </View>

      {/* Error Message */}
      {error && (
        <View className="rounded-lg bg-red-50 px-4 py-3">
          <Small className="text-center text-red-600">{error}</Small>
        </View>
      )}

      {/* Auth Buttons Section */}
      <View className="gap-y-4">
        <SignInButton
          provider="apple"
          onPress={() => handleSignIn('apple')}
          isLoading={isLoading.apple}
        />
        <SignInButton
          provider="google"
          onPress={() => handleSignIn('google')}
          isLoading={isLoading.google}
        />
        <SignInButton
          provider="anonymous"
          onPress={() => handleSignIn('anonymous')}
          isLoading={isLoading.anonymous}
        />
      </View>
    </View>
  );
}
