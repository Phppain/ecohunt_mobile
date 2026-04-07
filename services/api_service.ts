import { getApiBaseUrl } from '@/constants/ecohunt';
import type { Friend } from '@/models/friend';
import { friendFromJson } from '@/models/friend';
import type { LeaderboardEntry } from '@/models/leaderboard_entry';
import { leaderboardEntryFromJson } from '@/models/leaderboard_entry';
import type { Report } from '@/models/report';
import { reportFromJson } from '@/models/report';
import type { User } from '@/models/user';
import { userFromJson } from '@/models/user';

export class ApiService {
  private baseUrl() {
    return getApiBaseUrl();
  }

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${this.baseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userFromJson(await res.json());
  }

  async getFriends(token: string): Promise<Friend[]> {
    const res = await fetch(`${this.baseUrl()}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as any[];
    return data.map(friendFromJson);
  }

  async getReports(token: string): Promise<Report[]> {
    const res = await fetch(`${this.baseUrl()}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as any[];
    return data.map(reportFromJson);
  }

  async getGlobalLeaderboard(token: string): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${this.baseUrl()}/leaderboard/global`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as any[];
    return data.map(leaderboardEntryFromJson);
  }

  async getFriendsLeaderboard(token: string): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${this.baseUrl()}/leaderboard/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as any[];
    return data.map(leaderboardEntryFromJson);
  }
}

