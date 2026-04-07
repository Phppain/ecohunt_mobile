import React, { useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoCard } from '@/components/ui/eco-card';

export default function ReportScreen() {
  const [imageBeforeUri, setImageBeforeUri] = useState<string | null>(null);
  const [imageAfterUri, setImageAfterUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickBeforeImage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!res.canceled) {
        setImageBeforeUri(res.assets[0]?.uri ?? null);
      }
    } finally {
      setLoading(false);
    }
  };

  const pickAfterImage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!res.canceled) {
        setImageAfterUri(res.assets[0]?.uri ?? null);
      }
    } finally {
      setLoading(false);
    }
  };

  const createReport = async () => {
    if (!imageBeforeUri) return;
    console.log(`Report created с фото: ${imageBeforeUri}`);
  };

  const cleanReport = async () => {
    if (!imageAfterUri) return;
    console.log(`Report cleaned с фото: ${imageAfterUri}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Report
          </ThemedText>
          <ThemedText style={styles.subtitle}>Send before/after photos to mark eco issues.</ThemedText>
        </View>

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>Before</ThemedText>
          <EcoButton title="Pick Before Image" onPress={pickBeforeImage} disabled={loading} />
          {imageBeforeUri ? (
            <ExpoImage source={{ uri: imageBeforeUri }} style={styles.preview} />
          ) : (
            <ThemedText style={styles.empty}>No photo selected.</ThemedText>
          )}
          <EcoButton title="Create Report" onPress={createReport} disabled={!imageBeforeUri || loading} style={{ marginTop: 12 }} />
        </EcoCard>

        <View style={styles.spacer} />

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>After</ThemedText>
          <EcoButton title="Pick After Image" onPress={pickAfterImage} disabled={loading} />
          {imageAfterUri ? (
            <ExpoImage source={{ uri: imageAfterUri }} style={styles.preview} />
          ) : (
            <ThemedText style={styles.empty}>No photo selected.</ThemedText>
          )}
          <EcoButton title="Clean Report" onPress={cleanReport} disabled={!imageAfterUri || loading} style={{ marginTop: 12 }} />
        </EcoCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 28, gap: 14 },
  header: { gap: 6, marginBottom: 2 },
  title: { fontWeight: '800' },
  subtitle: { opacity: 0.85, fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontWeight: '800', fontSize: 16, marginBottom: 10 },
  preview: {
    width: '100%',
    height: 180,
    marginTop: 14,
    borderRadius: 14,
  },
  empty: { opacity: 0.7, marginTop: 12 },
  spacer: { height: 2 },
});
