import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';

export default function Modal() {
  return (
    <View>
      <StatusBar animated style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
