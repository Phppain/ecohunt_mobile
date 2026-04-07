import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle> | null;
  disabled?: boolean;
};

export function EcoButton({ title, onPress, variant = 'primary', style, disabled }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const tint = Colors[scheme].tint;
  const backgroundColor = variant === 'primary' ? tint : 'transparent';
  const borderColor = variant === 'secondary' ? tint : 'transparent';
  const textColor = variant === 'primary' ? '#07110B' : tint;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => {
        // Some RN builds crash if the style resolves to `null` internally.
        // Always return a concrete style object.
        return StyleSheet.flatten([
          styles.buttonBase,
          pressed ? styles.pressed : undefined,
          {
            backgroundColor,
            borderColor,
            opacity: disabled ? 0.6 : 1,
          } satisfies ViewStyle,
          (style ?? undefined) as StyleProp<ViewStyle>,
        ]);
      }}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
});

