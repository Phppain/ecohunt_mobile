import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EcoCard } from '@/components/ui/eco-card';
import { MapWidget } from '@/components/map/MapWidget';
import { ECOHUNT } from '@/constants/ecohunt';


export default function HomeScreen() {
  const router = useRouter();

  console.log("INDEX.TSX TABS");
  

  return (
    <ThemedView style={styles.container}>
      <View style={styles.map}>
        <MapWidget />

        <View style={styles.topOverlay}>
          <ThemedText type="title" style={styles.title}>
            EcoMap
          </ThemedText>
          <ThemedText style={styles.subtitle}>Friend reports and eco-zone signals.</ThemedText>
        </View>

        <View style={styles.fabRow}>
          <EcoCard style={styles.legendCard}>
            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: ECOHUNT.severity.green }]} />
              <ThemedText style={styles.legendText}>Clean</ThemedText>
              <View style={[styles.dot, { backgroundColor: ECOHUNT.severity.yellow }]} />
              <ThemedText style={styles.legendText}>Watch</ThemedText>
              <View style={[styles.dot, { backgroundColor: ECOHUNT.severity.red }]} />
              <ThemedText style={styles.legendText}>Hazard</ThemedText>
            </View>
          </EcoCard>

          <Pressable style={styles.reportButton} onPress={() => router.push('/explore')}>
            <IconSymbol name="exclamationmark.triangle.fill" size={22} color="#07110B" />
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 18,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  title: {
    color: '#fff',
  },
  subtitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  fabRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    gap: 12,
  },
  legendCard: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12,
    fontWeight: '700',
  },
  reportButton: {
    alignSelf: 'flex-end',
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: ECOHUNT.severity.red,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});
