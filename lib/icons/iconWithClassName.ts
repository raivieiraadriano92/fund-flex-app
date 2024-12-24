import { cssInterop } from 'nativewind';
import { ComponentType } from 'react';
import { SvgProps } from 'react-native-svg';

export function iconWithClassName(icon: ComponentType<SvgProps>) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}
