import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EcoButton } from "@/components/ui/eco-button";
import { EcoCard } from "@/components/ui/eco-card";
import { EcoTextInput } from "@/components/ui/eco-text-input";
import { useAppStore } from "@/stores/app_store";

export default function FriendsTab() {
    const friends = useAppStore((s) => s.friends);
    const requests = useAppStore((s) => s.friendRequests);
    const refreshFriends = useAppStore((s) => s.refreshFriends);
    const refreshRequests = useAppStore((s) => s.refreshFriendRequests);
    const sendFriendRequest = useAppStore((s) => s.sendFriendRequest);
    const accept = useAppStore((s) => s.acceptFriendRequest);
    const reject = useAppStore((s) => s.rejectFriendRequest);
    const remove = useAppStore((s) => s.removeFriend);
    const [nickname, setNickname] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            await Promise.all([refreshFriends(), refreshRequests()]);
        }

        load();
    }, []);

    async function handleAdd() {
    try {
        setLoading(true);

        await sendFriendRequest(nickname);

        setNickname("");

        await refreshRequests();

    } catch (e) {
        console.log(e);
    } finally {
        setLoading(false);
    }
}

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <ThemedText type="title">Friends</ThemedText>

                <EcoCard>
                    <ThemedText style={styles.title}>Add friend</ThemedText>

                    <EcoTextInput
                        label="Nickname"
                        value={nickname}
                        onChangeText={setNickname}
                    />

                    <EcoButton
                        title="Send request"
                        onPress={handleAdd}
                        disabled={!nickname.trim() || loading}
                    />
                </EcoCard>

                <EcoCard>
                    <ThemedText style={styles.title}>Requests</ThemedText>

                    {!requests || requests.length === 0 ? (
                        <ThemedText>No requests</ThemedText>
                    ) : (
                        (requests ?? []).map((r) => (
                            <View key={r.request_id} style={styles.row}>
                                <ThemedText>{r.nickname}</ThemedText>

                                <View style={styles.buttons}>
                                    <EcoButton
                                        title="Accept"
                                        
                                        onPress={() => {console.log("CLICK ACCEPT", r.request_id);
                                          accept(r.request_id);}}
                                    />

                                    <EcoButton
                                        title="Reject"
                                        variant="secondary"
                                        onPress={() => reject(r.request_id)}
                                    />
                                </View>
                            </View>
                        ))
                    )}
                </EcoCard>

                <EcoCard>
                    <ThemedText style={styles.title}>Friends list</ThemedText>

                    <FlatList
                        data={friends}
                        scrollEnabled={false}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <ThemedText>{item.nickname}</ThemedText>

                                <EcoButton
                                    title="Remove"
                                    variant="secondary"
                                    onPress={() => remove(item.id)}
                                />
                            </View>
                        )}
                    />
                </EcoCard>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 16,
        gap: 14,
    },

    title: {
        fontWeight: "800",
        fontSize: 18,
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },

    buttons: {
        flexDirection: "row",
        gap: 8,
    },
});
