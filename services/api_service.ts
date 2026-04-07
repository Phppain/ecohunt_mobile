import { getApiBaseUrl } from '@/constants/ecohunt';
import { AuthStorage } from './auth_storage';
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

  private async authHeaders(): Promise<Record<string, string>> {
    const token = await AuthStorage.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getMe(): Promise<User> {
    const res = await fetch(`${this.baseUrl()}/auth/me`, {
      headers: await this.authHeaders(),
    });
    return userFromJson(await res.json());
  }

  async getFriends(): Promise<Friend[]> {
    const res = await fetch(`${this.baseUrl()}/friends`, {
      headers: await this.authHeaders(),
    });
    const data = (await res.json()) as any[];
    return data.map(friendFromJson);
  }

  async getReports(): Promise<Report[]> {
    const res = await fetch(`${this.baseUrl()}/reports`, {
      headers: await this.authHeaders(),
    });
    const data = (await res.json()) as any[];
    return data.map(reportFromJson);
  }

  async createReport(lat: number, lng: number, imageUri: string): Promise<Report> {
    const headers = await this.authHeaders();
    const form = new FormData();
    form.append('lat', String(lat));
    form.append('lng', String(lng));
    form.append('image_before', {
      uri: imageUri,
      name: 'before.jpg',
      type: 'image/jpeg',
    } as any);

    const res = await fetch(`${this.baseUrl()}/reports`, {
      method: 'POST',
      headers,
      body: form,
    });
    return reportFromJson(await res.json());
  }

  async cleanReport(reportId: number, imageUri: string): Promise<Report> {
    const headers = await this.authHeaders();
    const form = new FormData();
    form.append('image_after', {
      uri: imageUri,
      name: 'after.jpg',
      type: 'image/jpeg',
    } as any);

    const res = await fetch(`${this.baseUrl()}/reports/${reportId}/clean`, {
      method: 'POST',
      headers,
      body: form,
    });
    return reportFromJson(await res.json());
  }

  async getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${this.baseUrl()}/leaderboard/global`, {
      headers: await this.authHeaders(),
    });
    const data = (await res.json()) as any[];
    return data.map(leaderboardEntryFromJson);
  }

  async getFriendsLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${this.baseUrl()}/leaderboard/friends`, {
      headers: await this.authHeaders(),
    });
    const data = (await res.json()) as any[];
    return data.map(leaderboardEntryFromJson);
  }
}
