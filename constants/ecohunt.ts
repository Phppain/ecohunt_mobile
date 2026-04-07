import Constants from 'expo-constants';

function inferDevHost(): string | null {
  // Expo Go usually provides something like "192.168.1.10:8081"
  const hostUri =
    (Constants.expoConfig as any)?.hostUri ??
    (Constants as any)?.expoConfig?.hostUri ??
    (Constants as any)?.manifest?.debuggerHost ??
    (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri || typeof hostUri !== 'string') return null;
  return hostUri.split(':')[0] ?? null;
}

export function getApiBaseUrl(): string {
  // Allows explicit override without touching code.
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && typeof envUrl === 'string') return envUrl;

  const host = inferDevHost();
  if (host) return `http://${host}:8000`;

  // Fallback (works only on iOS simulator / same device hosting backend).
  return 'http://127.0.0.1:8000';
}

export const ECOHUNT = {
  mapInitialLat: 43.23,
  mapInitialLng: 76.92,

  // Marker colors (Flutter used green/yellow/red zones).
  severity: {
    green: '#2ECC71',
    yellow: '#F1C40F',
    red: '#E74C3C',
  },
};

