import React, { useCallback, useEffect, useMemo, useRef } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";

import { ECOHUNT } from "@/constants/ecohunt";
import { ApiService } from "@/services/api_service";
import { useAppStore } from "@/stores/app_store";

const api = new ApiService();
export function MapWidget() {
    const reports = useAppStore((s) => s.reports);
    const refreshReports = useAppStore((s) => s.refreshReports);

    const friendLocations = useAppStore((s) => s.friendLocations);
    const refreshFriendLocations = useAppStore((s) => s.refreshFriendLocations);

    const interval = useRef<ReturnType<typeof setInterval> | null>(null);

    useFocusEffect(
        useCallback(() => {
            refreshReports();
            refreshFriendLocations();
        }, [refreshReports, refreshFriendLocations]),
    );

    useEffect(() => {
        async function startTracking() {
            const permission =
                await Location.requestForegroundPermissionsAsync();

            if (!permission.granted) return;

            const updateLocation = async () => {
                const location = await Location.getCurrentPositionAsync({});

                await api.updateLocation(
                    location.coords.latitude,
                    location.coords.longitude,
                );
            };

            await updateLocation();

            interval.current = setInterval(updateLocation, 60000);
        }

        startTracking();

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }, []);

    const initialRegion: Region = useMemo(
        () => ({
            latitude: ECOHUNT.mapInitialLat,
            longitude: ECOHUNT.mapInitialLng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }),
        [],
    );

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={initialRegion}
            showsCompass={false}
        >
            {reports.map((report) => (
                <Marker
                    key={`report-${report.id}`}
                    coordinate={{
                        latitude: report.lat,
                        longitude: report.lng,
                    }}
                    title={`Report #${report.id}`}
                />
            ))}

            {friendLocations
                .filter((friend) => friend.lat != null && friend.lng != null)
                .map((friend) => (
                    <Marker
                        key={`friend-${friend.id}`}
                        coordinate={{
                            latitude: Number(friend.lat),
                            longitude: Number(friend.lng),
                        }}
                        pinColor="blue"
                        title={friend.nickname}
                        description={`${friend.points} points`}
                    />
                ))}
        </MapView>
    );
}
