import React, { useEffect, useMemo, useState } from 'react';
import MapView, { Marker, type Region } from 'react-native-maps';
import { ECOHUNT } from '@/constants/ecohunt';
import { ApiService } from '@/services/api_service';
import type { Report } from '@/models/report';

const apiService = new ApiService();

export function MapWidget() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    apiService.getReports().then(setReports).catch(console.error);
  }, []);

  const initialRegion: Region = useMemo(() => ({
    latitude: ECOHUNT.mapInitialLat,
    longitude: ECOHUNT.mapInitialLng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }), []);

  return (
    <MapView style={{ flex: 1 }} initialRegion={initialRegion} showsCompass={false}>
      {reports.map((r) => (
        <Marker
          key={r.id}
          coordinate={{ latitude: r.lat, longitude: r.lng }}
          pinColor={ECOHUNT.severity[r.severity as keyof typeof ECOHUNT.severity] ?? ECOHUNT.severity.yellow}
          title={`Report #${r.id}`}
          description={`Severity: ${r.severity}`}
        />
      ))}
    </MapView>
  );
}
