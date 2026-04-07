export type Report = {
  id: number;
  lat: number;
  lng: number;
  severity: 'green' | 'yellow' | 'red' | string;
  reportsCount: number;
  aiScore?: number | null;
  aiPointsAwarded?: number | null;
  aiCleaned?: boolean | null;
};

export function reportFromJson(json: any): Report {
  return {
    id: json.id,
    lat: json.lat,
    lng: json.lng,
    severity: json.severity,
    reportsCount: json.reports_count,
    aiScore: json.ai_score ?? null,
    aiPointsAwarded: json.ai_points_awarded ?? null,
    aiCleaned: json.ai_cleaned ?? null,
  };
}
