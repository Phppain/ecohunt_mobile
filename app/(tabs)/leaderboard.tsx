import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EcoCard } from '@/components/ui/eco-card';
import type { LeaderboardEntry } from '@/models/leaderboard_entry';
import { ApiService } from '@/services/api_service';

type TabKey = 'global' | 'friends';

export default function LeaderboardTab() {
  const apiService = useMemo(() => new ApiService(), []);

  const [tab, setTab] = useState<TabKey>('global');
  const [global, setGlobal] = useState<LeaderboardEntry[]>([]);
  const [friends, setFriends] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getGlobalLeaderboard('fake-token'),
      apiService.getFriendsLeaderboard('fake-token'),
    ])
      .then(([g, f]) => {
        setGlobal(g);
        setFriends(f);
      })
      .catch((e) => console.log('Failed to load leaderboard', e))
      .finally(() => setLoading(false));
  }, [apiService]);

  const listData = tab === 'global' ? global : friends;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Leaderboard
          </ThemedText>
          <ThemedText style={styles.subtitle}>Top eco guardians by points.</ThemedText>
        </View>

        <EcoCard style={styles.segmentCard}>
          <View style={styles.segment}>
            <Pressable style={[styles.segmentItem, tab === 'global' && styles.segmentItemActive]} onPress={() => setTab('global')}>
              <ThemedText style={[styles.segmentText, tab === 'global' && styles.segmentTextActive]}>Global</ThemedText>
            </Pressable>
            <Pressable style={[styles.segmentItem, tab === 'friends' && styles.segmentItemActive]} onPress={() => setTab('friends')}>
              <ThemedText style={[styles.segmentText, tab === 'friends' && styles.segmentTextActive]}>Friends</ThemedText>
            </Pressable>
          </View>
        </EcoCard>

        {loading ? (
          <ThemedText style={styles.empty}>Loading…</ThemedText>
        ) : listData.length === 0 ? (
          <ThemedText style={styles.empty}>Nothing here yet.</ThemedText>
        ) : (
          <EcoCard style={{ padding: 0 }}>
            <FlatList
              data={listData}
              keyExtractor={(_, i) => String(i)}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={styles.row}>
                  <ThemedText style={styles.rank}>{index + 1}</ThemedText>
                  <View style={styles.rowMid}>
                    <ThemedText style={styles.name}>{item.nickname}</ThemedText>
                  </View>
                  <ThemedText style={styles.points}>{item.points}</ThemedText>
                </View>
              )}
            />
          </EcoCard>
        )}
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

  segmentCard: { padding: 10 },
  segment: { flexDirection: 'row', gap: 10 },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: 'rgba(25,195,125,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(25,195,125,0.35)',
  },
  segmentText: { fontWeight: '800', opacity: 0.8 },
  segmentTextActive: { opacity: 1 },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  rank: { width: 24, fontWeight: '800', opacity: 0.8 },
  rowMid: { flex: 1 },
  name: { fontWeight: '800' },
  points: { fontWeight: '900' },
  empty: { opacity: 0.7, marginTop: 10 },
});

