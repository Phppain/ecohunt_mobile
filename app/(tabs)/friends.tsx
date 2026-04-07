import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoCard } from '@/components/ui/eco-card';
import { EcoTextInput } from '@/components/ui/eco-text-input';
import { ApiService } from '@/services/api_service';
import type { Friend } from '@/models/friend';

export default function FriendsTab() {
  const apiService = useMemo(() => new ApiService(), []);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getFriends('fake-token')
      .then(setFriends)
      .catch((e) => console.log('Failed to load friends', e))
      .finally(() => setLoading(false));
  }, [apiService]);

  const addFriend = () => {
    // Flutter implementation is a stub.
    console.log(`Friend added: ${nickname}`);
    setNickname('');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Friends
          </ThemedText>
          <ThemedText style={styles.subtitle}>Track eco reports from people you trust.</ThemedText>
        </View>

        <EcoCard>
          <ThemedText style={styles.sectionTitle}>Add friend</ThemedText>
          <EcoTextInput
            label="Friend Nickname"
            value={nickname}
            onChangeText={setNickname}
            placeholder="Azizali"
          />
          <EcoButton title="Add Friend" onPress={addFriend} disabled={!nickname.trim() || loading} />
        </EcoCard>

        <View style={styles.spacer} />

        <ThemedText style={styles.sectionTitle}>Your list</ThemedText>

        {loading ? (
          <ThemedText style={styles.empty}>Loading…</ThemedText>
        ) : friends.length === 0 ? (
          <ThemedText style={styles.empty}>No friends yet.</ThemedText>
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(f) => String(f.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.friendRow}>
                <View style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.friendName}>{item.nickname}</ThemedText>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 28, gap: 14 },
  header: { gap: 6 },
  title: { fontWeight: '800' },
  subtitle: { opacity: 0.85, fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontWeight: '800', fontSize: 16, marginBottom: 10 },
  spacer: { height: 2 },
  empty: { opacity: 0.7 },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(25,195,125,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(25,195,125,0.25)',
  },
  friendName: { fontWeight: '800' },
});

