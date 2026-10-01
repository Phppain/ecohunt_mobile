import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { AuthStorage } from "@/services/auth_storage";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EcoButton } from "@/components/ui/eco-button";
import { EcoCard } from "@/components/ui/eco-card";
import { EcoTextInput } from "@/components/ui/eco-text-input";
import { useAppStore } from "@/stores/app_store";

export default function ProfileTab() {
    const user = useAppStore((s) => s.user);
    const refreshUser = useAppStore((s) => s.refreshUser);

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [cameraPermission, setCameraPermission] = useState(false);
    const [geoPermission, setGeoPermission] = useState(false);

    const [loading, setLoading] = useState(true);

    const clearStore = useAppStore((s) => s.clearStore);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    setLoading(true);
                    await refreshUser();
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };

            load();
        }, [refreshUser]),
    );

    useEffect(() => {
        if (!user) return;

        setNickname(user.nickname);
        setEmail(user.email);
        setCameraPermission(user.cameraPermission);
        setGeoPermission(user.geoPermission);

        console.log("USER:", user);
    }, [user]);

    const updateProfile = () => {
        console.log("Профиль обновлен");
    };

    const updatePermissions = () => {
        console.log("Разрешения обновлены");
    };

    const logout = () => {
        Alert.alert("Logout", "Do you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await AuthStorage.clear();
                    clearStore();
                    router.replace("/login");
                },
            },
        ]);
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText style={styles.loading}>Loading...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>
                        Profile
                    </ThemedText>

                    <ThemedText style={styles.subtitle}>
                        Manage your eco settings and permissions.
                    </ThemedText>
                </View>

                <EcoCard>
                    <View style={styles.pointsRow}>
                        <ThemedText style={styles.pointsLabel}>
                            Points
                        </ThemedText>

                        <ThemedText style={styles.pointsValue}>
                            {user?.points ?? 0}
                        </ThemedText>
                    </View>
                </EcoCard>

                <EcoCard>
                    <ThemedText style={styles.sectionTitle}>Account</ThemedText>

                    <EcoTextInput
                        label="Nickname"
                        value={nickname}
                        onChangeText={setNickname}
                    />

                    <EcoTextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </EcoCard>

                <EcoCard>
                    <ThemedText style={styles.sectionTitle}>
                        Permissions
                    </ThemedText>

                    <View style={styles.toggleRow}>
                        <ThemedText style={styles.toggleLabel}>
                            Camera Permission
                        </ThemedText>

                        <Switch
                            value={cameraPermission}
                            onValueChange={setCameraPermission}
                        />
                    </View>

                    <View style={styles.toggleRow}>
                        <ThemedText style={styles.toggleLabel}>
                            Geo Permission
                        </ThemedText>

                        <Switch
                            value={geoPermission}
                            onValueChange={setGeoPermission}
                        />
                    </View>

                    <EcoButton
                        title="Update Profile"
                        onPress={updateProfile}
                        style={{ marginTop: 12 }}
                    />

                    <EcoButton
                        title="Update Permissions"
                        onPress={updatePermissions}
                        variant="secondary"
                        style={{ marginTop: 10 }}
                    />
                </EcoCard>
                <EcoButton
                    title="Logout"
                    onPress={logout}
                    variant="secondary"
                    style={{ marginTop: 20 }}
                />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        padding: 16,
        paddingBottom: 28,
        gap: 14,
    },

    header: {
        gap: 6,
    },

    title: {
        fontWeight: "800",
    },

    subtitle: {
        opacity: 0.85,
        fontSize: 14,
        lineHeight: 20,
    },

    loading: {
        padding: 16,
        opacity: 0.7,
    },

    sectionTitle: {
        fontWeight: "800",
        fontSize: 16,
        marginBottom: 12,
    },

    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 8,
    },

    toggleLabel: {
        fontWeight: "800",
    },

    pointsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pointsLabel: {
        opacity: 0.7,
        fontWeight: "800",
    },

    pointsValue: {
        fontSize: 22,
        fontWeight: "900",
    },
});
