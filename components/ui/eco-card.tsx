import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function EcoCard({ children, style }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const backgroundColor = Colors[scheme].background === '#fff' ? '#fff' : 'rgba(255,255,255,0.06)';

  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
});

