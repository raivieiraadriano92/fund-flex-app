import { Link } from 'expo-router';
import { View } from 'react-native';

import { SignInButton } from '~/components/features/auth';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { supabase } from '~/core/api/supabase';

export default function Home() {
  return (
    <View>
      <Button
        onPress={async () => {
          const { error } = await supabase.auth.signOut();
          console.log('signOut -> ', error);
        }}
        variant="destructive">
        <Text>Logout</Text>
      </Button>
      <Button>
        <Text>Default</Text>
      </Button>
      <Link href="/modal" asChild>
        <Text>Modal</Text>
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Text>Sign In</Text>
      </Link>
    </View>
  );
}
