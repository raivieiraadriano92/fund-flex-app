import * as React from 'react';
import { TextInput, View, type TextInputProps as RNTextInputProps } from 'react-native';

import { Small } from './typography';

import { cn } from '~/lib/utils';

interface TextInputProps extends RNTextInputProps {
  error?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, error, placeholderClassName, ...props }, ref) => {
    return (
      <View className="gap-2">
        <TextInput
          ref={ref}
          className={cn(
            'native:h-12 native:text-lg native:leading-[1.25] h-10 rounded-xl border border-input bg-background px-3 text-base text-foreground file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 lg:text-sm',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          {...props}
        />
        {!!error && <Small className="text-destructive">{error}</Small>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
