import { create } from "zustand";

import { ApiService } from "@/services/api_service";

import type { User } from "@/models/user";
import type { Report } from "@/models/report";
import type { Friend } from "@/models/friend";
import type { LeaderboardEntry } from "@/models/leaderboard_entry";
import { FriendLocation } from "@/models/friend_location";
import { FriendRequest } from "@/models/friend_request";

const api = new ApiService();

interface AppStore {
    user: User | null;

    reports: Report[];

    friends: Friend[];

    leaderboard: LeaderboardEntry[];

    friendsLeaderboard: LeaderboardEntry[];

    friendLocations: FriendLocation[];

    friendRequests: FriendRequest[];

    refreshFriendRequests: () => Promise<void>;

    sendFriendRequest: (nickname: string) => Promise<void>;

    removeFriend: (friendId: number) => Promise<void>;

    refreshFriendLocations: () => Promise<void>;

    refreshUser: () => Promise<void>;

    refreshReports: () => Promise<void>;

    refreshFriends: () => Promise<void>;

    refreshLeaderboard: () => Promise<void>;

    refreshFriendsLeaderboard: () => Promise<void>;

    refreshAll: () => Promise<void>;

    clearStore: () => void;

    acceptFriendRequest: (id: number) => Promise<void>;

    rejectFriendRequest: (id: number) => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
    user: null,

    reports: [],

    friends: [],

    leaderboard: [],

    friendsLeaderboard: [],

    friendLocations: [],

    friendRequests: [],

    sendFriendRequest: async (nickname: string) => {
        await api.sendFriendRequest(nickname);
    },
    removeFriend: async (friendId: number) => {
        await api.removeFriend(friendId);

        const friends = await api.getFriends();

        set({
            friends,
        });
    },

    refreshFriendLocations: async () => {
        set({
            friendLocations: await api.getFriendLocations(),
        });
    },

    refreshUser: async () => {
        const user = await api.getMe();

        set({ user });
    },

    refreshReports: async () => {
        const reports = await api.getReports();

        set({ reports });
    },

    refreshFriends: async () => {
        const friends = await api.getFriends();

        set({ friends });
    },

    refreshLeaderboard: async () => {
        const leaderboard = await api.getGlobalLeaderboard();

        set({ leaderboard });
    },

    refreshFriendsLeaderboard: async () => {
        const friendsLeaderboard = await api.getFriendsLeaderboard();

        set({ friendsLeaderboard });
    },

    refreshAll: async () => {
        const [
            user,
            reports,
            friends,
            leaderboard,
            friendsLeaderboard,
            friendLocations,
            friendRequests,
        ] = await Promise.all([
            api.getMe(),
            api.getReports(),
            api.getFriends(),
            api.getGlobalLeaderboard(),
            api.getFriendsLeaderboard(),
            api.getFriendLocations(),
            api.getFriendRequests(),
        ]);

        set({
            user,
            reports,
            friends,
            leaderboard,
            friendsLeaderboard,
            friendLocations,
            friendRequests,
        });
    },
    clearStore: () => {
        set({
            user: null,
            reports: [],
            friends: [],
            leaderboard: [],
            friendsLeaderboard: [],
            friendLocations: [],
            friendRequests: [],
        });
    },

    refreshFriendRequests: async () => {
        const requests = await api.getFriendRequests();

        set({
            friendRequests: requests,
        });
    },

    acceptFriendRequest: async (id: number) => {
        await api.acceptFriendRequest(id);

        const [friends, friendRequests] = await Promise.all([
            api.getFriends(),
            api.getFriendRequests(),
        ]);

        set({
            friends,
            friendRequests,
        });
    },

    rejectFriendRequest: async (id: number) => {
        await api.rejectFriendRequest(id);

        const requests = await api.getFriendRequests();

        set({
            friendRequests: requests,
        });
    },
}));
