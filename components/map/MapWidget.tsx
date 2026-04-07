import React, { useMemo } from 'react';
import MapView, { Marker, type Region } from 'react-native-maps';
import { ECOHUNT } from '@/constants/ecohunt';

export function MapWidget() {
  const initialRegion: Region = useMemo(
    () => ({
      latitude: ECOHUNT.mapInitialLat,
      longitude: ECOHUNT.mapInitialLng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [],
  );

  const markers = useMemo(
    () => [
      {
        key: 'friend_1',
        coordinate: { latitude: ECOHUNT.mapInitialLat, longitude: ECOHUNT.mapInitialLng },
        pinColor: ECOHUNT.severity.green,
      },
      {
        key: 'report_1',
        coordinate: {
          latitude: ECOHUNT.mapInitialLat + 0.001,
          longitude: ECOHUNT.mapInitialLng + 0.001,
        },
        pinColor: ECOHUNT.severity.red,
      },
    ],
    [],
  );

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={initialRegion}
      showsCompass={false}
      showsScale={false}
      >
      {markers.map((m) => (
        <Marker
          key={m.key}
          coordinate={m.coordinate}
          pinColor={m.pinColor}
          title={m.key === 'friend_1' ? 'Друг: Azizali' : 'Грязная зона'}
        />
      ))}
    </MapView>
  );
}

