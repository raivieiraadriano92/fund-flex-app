import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Home() {
  return (
    <View>
      <Button>
        <Text>Default</Text>
      </Button>
      <Link href="/modal" asChild>
        <Text>Modal</Text>
      </Link>
    </View>
  );
}
