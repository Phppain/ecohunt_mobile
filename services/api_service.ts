import { getApiBaseUrl } from "@/constants/ecohunt";
import { AuthStorage } from "./auth_storage";
import type { Friend } from "@/models/friend";
import { friendFromJson } from "@/models/friend";
import type { LeaderboardEntry } from "@/models/leaderboard_entry";
import { leaderboardEntryFromJson } from "@/models/leaderboard_entry";
import type { Report } from "@/models/report";
import { reportFromJson } from "@/models/report";
import type { User } from "@/models/user";
import { userFromJson } from "@/models/user";
import type { FriendLocation } from "@/models/friend_location";
import { friendLocationFromJson } from "@/models/friend_location";

export class ApiService {
    private baseUrl() {
        return getApiBaseUrl();
    }

    private async authHeaders(): Promise<Record<string, string>> {
        const token = await AuthStorage.get();

        console.log("TOKEN RAW:", token, typeof token);

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

    async createReport(
        lat: number,
        lng: number,
        imageUri: string,
    ): Promise<Report> {
        const headers = await this.authHeaders();
        const form = new FormData();
        form.append("lat", String(lat));
        form.append("lng", String(lng));
        form.append("image_before", {
            uri: imageUri,
            name: "before.jpg",
            type: "image/jpeg",
        } as any);

        console.log(await AuthStorage.get());

        const res = await fetch(`${this.baseUrl()}/reports`, {
            method: "POST",
            headers,
            body: form,
        });
        return reportFromJson(await res.json());
    }

    async cleanReport(reportId: number, imageUri: string): Promise<Report> {
        const headers = await this.authHeaders();
        const form = new FormData();
        form.append("image_after", {
            uri: imageUri,
            name: "after.jpg",
            type: "image/jpeg",
        } as any);

        const res = await fetch(`${this.baseUrl()}/reports/${reportId}/clean`, {
            method: "POST",
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

    async getFriendLocations(): Promise<FriendLocation[]> {
        const res = await fetch(`${this.baseUrl()}/friends/locations`, {
            headers: await this.authHeaders(),
        });

        const data = (await res.json()) as any[];

        return data.map(friendLocationFromJson);
    }

    async removeFriend(friendId: number): Promise<void> {
        const res = await fetch(`${this.baseUrl()}/friends/${friendId}`, {
            method: "DELETE",
            headers: await this.authHeaders(),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
        }
    }

    async sendFriendRequest(nickname: string) {
        const res = await fetch(`${this.baseUrl()}/friends/request`, {
            method: "POST",
            headers: {
                ...(await this.authHeaders()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nickname,
            }),
        });

        return await res.json();
    }

    async getFriendRequests(): Promise<any[]> {
        const res = await fetch(`${this.baseUrl()}/friends/requests`, {
            headers: await this.authHeaders(),
        });

        const data = await res.json();

        console.log("FRIEND REQUESTS:", data);

        return Array.isArray(data) ? data : [];
    }

    async acceptFriendRequest(requestId: number) {
        console.log("ACCEPT REQUEST ID:", requestId);

        const res = await fetch(
            `${this.baseUrl()}/friends/requests/${requestId}/accept`,
            {
                method: "POST",
                headers: await this.authHeaders(),
            },
        );

        console.log("ACCEPT STATUS:", res.status);

        const data = await res.json();

        console.log("ACCEPT RESPONSE:", data);

        return data;
    }

    async rejectFriendRequest(requestId: number) {
        const res = await fetch(
            `${this.baseUrl()}/friends/requests/${requestId}/reject`,
            {
                method: "POST",
                headers: await this.authHeaders(),
            },
        );

        return await res.json();
    }

    async updateLocation(lat: number, lng: number): Promise<void> {
        await fetch(`${this.baseUrl()}/users/location`, {
            method: "PATCH",
            headers: {
                ...(await this.authHeaders()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lat,
                lng,
            }),
        });
    }
}
