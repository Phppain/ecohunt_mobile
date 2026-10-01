import React, { useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoCard } from '@/components/ui/eco-card';

import { ApiService } from '@/services/api_service';
import { useAppStore } from '@/stores/app_store';

export default function ReportScreen() {
  const apiService = useMemo(() => new ApiService(), []);

  const refreshUser = useAppStore((s) => s.refreshUser);
  const refreshReports = useAppStore((s) => s.refreshReports);
  const refreshLeaderboard = useAppStore((s) => s.refreshLeaderboard);

  const [imageBeforeUri, setImageBeforeUri] = useState<string | null>(null);
  const [imageAfterUri, setImageAfterUri] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const lockRef = useRef(false);

  const pickImage = async (setter: (uri: string) => void) => {
    if (loading) return;

    const perm = await ImagePicker.requestCameraPermissionsAsync();

    if (!perm.granted) {
      Alert.alert('Нет доступа к камере');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (!res.canceled) {
      setter(res.assets[0].uri);
    }
  };

  const createReport = async () => {
    if (!imageBeforeUri || loading || lockRef.current) return;

    lockRef.current = true;
    setLoading(true);

    try {
      const locPerm = await Location.requestForegroundPermissionsAsync();

      if (!locPerm.granted) return;

      const loc = await Location.getCurrentPositionAsync({});

      const report = await apiService.createReport(
        loc.coords.latitude,
        loc.coords.longitude,
        imageBeforeUri,
      );

      setActiveReportId(report.id);

      // Обновляем карту
      await refreshReports();

      Alert.alert('Репорт создан!', `ID: ${report.id}`);
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось создать репорт');
    } finally {
      setLoading(false);
      lockRef.current = false;
    }
  };

  const cleanReport = async () => {
    if (!imageAfterUri || !activeReportId || loading || lockRef.current) return;

    lockRef.current = true;
    setLoading(true);

    try {
      const report = await apiService.cleanReport(
        activeReportId,
        imageAfterUri,
      );

      // Обновляем всё
      await Promise.all([
        refreshUser(),
        refreshReports(),
        refreshLeaderboard(),
      ]);

      const msg = report.aiCleaned
        ? `Засчитано! +${report.aiPointsAwarded} очков`
        : `Изменения незначительные. +${report.aiPointsAwarded ?? 0} очков`;

      Alert.alert('Результат очистки', msg);

      setImageBeforeUri(null);
      setImageAfterUri(null);
      setActiveReportId(null);
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось отправить очистку');
    } finally {
      setLoading(false);
      lockRef.current = false;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Report
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Send before/after photos to mark eco issues.
          </ThemedText>
        </View>

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>Before</ThemedText>

          <EcoButton
            title="Take Before Photo"
            onPress={() => pickImage(setImageBeforeUri)}
            disabled={loading}
          />

          {imageBeforeUri ? (
            <ExpoImage
              source={{ uri: imageBeforeUri }}
              style={styles.preview}
            />
          ) : (
            <ThemedText style={styles.empty}>
              No photo selected.
            </ThemedText>
          )}

          <EcoButton
            title={loading ? 'Sending...' : 'Create Report'}
            onPress={createReport}
            disabled={!imageBeforeUri || loading}
            style={{ marginTop: 12 }}
          />
        </EcoCard>

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>After</ThemedText>

          {activeReportId && (
            <ThemedText style={styles.reportId}>
              Report #{activeReportId} активен
            </ThemedText>
          )}

          <EcoButton
            title="Take After Photo"
            onPress={() => pickImage(setImageAfterUri)}
            disabled={loading}
          />

          {imageAfterUri ? (
            <ExpoImage
              source={{ uri: imageAfterUri }}
              style={styles.preview}
            />
          ) : (
            <ThemedText style={styles.empty}>
              No photo selected.
            </ThemedText>
          )}

          <EcoButton
            title={loading ? 'Sending...' : 'Clean Report'}
            onPress={cleanReport}
            disabled={!imageAfterUri || !activeReportId || loading}
            style={{ marginTop: 12 }}
          />
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
  reportId: { opacity: 0.7, fontSize: 13, marginBottom: 8 },
});