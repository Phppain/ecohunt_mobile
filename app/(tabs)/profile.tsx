import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ApiService } from '@/services/api_service';
import type { User } from '@/models/user';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoCard } from '@/components/ui/eco-card';
import { EcoTextInput } from '@/components/ui/eco-text-input';

export default function ProfileTab() {
  const apiService = useMemo(() => new ApiService(), []);

  const [user, setUser] = useState<User | null>(null);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [cameraPermission, setCameraPermission] = useState(false);
  const [geoPermission, setGeoPermission] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getMe('fake-token')
      .then((u) => {
        setUser(u);
        setNickname(u.nickname);
        setEmail(u.email);
        setCameraPermission(u.cameraPermission);
        setGeoPermission(u.geoPermission);
      })
      .catch((e) => console.log('Failed to load profile', e))
      .finally(() => setLoading(false));
  }, [apiService]);

  const updateProfile = () => {
    // Flutter version is a stub.
    console.log('Профиль обновлен');
  };

  const updatePermissions = () => {
    // Flutter version is a stub.
    console.log('Разрешения обновлены');
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loading}>Loading…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Profile
          </ThemedText>
          <ThemedText style={styles.subtitle}>Manage your eco settings and permissions.</ThemedText>
        </View>

        <EcoCard>
          <View style={styles.pointsRow}>
            <ThemedText style={styles.pointsLabel}>Points</ThemedText>
            <ThemedText style={styles.pointsValue}>{user?.points ?? 0}</ThemedText>
          </View>
        </EcoCard>

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <EcoTextInput label="Nickname" value={nickname} onChangeText={setNickname} />
          <EcoTextInput label="Email" value={email} onChangeText={setEmail} />
        </EcoCard>

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>Permissions</ThemedText>

          <View style={styles.toggleRow}>
            <ThemedText style={styles.toggleLabel}>Camera Permission</ThemedText>
            <Switch value={cameraPermission} onValueChange={setCameraPermission} />
          </View>

          <View style={styles.toggleRow}>
            <ThemedText style={styles.toggleLabel}>Geo Permission</ThemedText>
            <Switch value={geoPermission} onValueChange={setGeoPermission} />
          </View>

          <EcoButton title="Update Profile" onPress={updateProfile} style={{ marginTop: 12 }} />
          <EcoButton title="Update Permissions" onPress={updatePermissions} variant="secondary" style={{ marginTop: 10 }} />
        </EcoCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 28, gap: 14 },
  header: { gap: 6 },
  title: { fontWeight: '800' },
  subtitle: { opacity: 0.85, fontSize: 14, lineHeight: 20 },
  loading: { padding: 16, opacity: 0.7 },

  sectionTitle: { fontWeight: '800', fontSize: 16, marginBottom: 12 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  toggleLabel: { fontWeight: '800' },

  pointsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pointsLabel: { opacity: 0.7, fontWeight: '800' },
  pointsValue: { fontSize: 22, fontWeight: '900' },
});

