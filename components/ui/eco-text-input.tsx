import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EcoTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
}: Props) {
  const scheme = useColorScheme() ?? 'light';

  const textColor = Colors[scheme].text;

  const backgroundColor =
  scheme === 'light'
    ? '#FFFFFF'
    : '#0D1B12';

  const borderColor =
    scheme === 'light'
      ? '#C9DDD2'
      : 'rgba(255,255,255,0.15)';

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.label, { color: textColor }]}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors[scheme].icon}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            color: textColor,
            backgroundColor,
            borderColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
  },

  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
});