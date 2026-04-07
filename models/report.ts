export type Report = {
  id: number;
  lat: number;
  lng: number;
  severity: 'green' | 'yellow' | 'red' | string;
  reportsCount: number;
};

export function reportFromJson(json: any): Report {
  return {
    id: json.id,
    lat: json.lat,
    lng: json.lng,
    severity: json.severity,
    reportsCount: json.reports_count,
  };
}

