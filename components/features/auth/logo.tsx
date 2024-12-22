import { Image } from 'react-native';

export function Logo() {
  return <Image source={require('~/assets/icon.png')} className="h-20 w-20" resizeMode="contain" />;
}
