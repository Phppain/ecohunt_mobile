export type User = {
  id: number;
  nickname: string;
  email: string;
  cameraPermission: boolean;
  geoPermission: boolean;
  points: number;
};

export function userFromJson(json: any): User {
  return {
    id: json.id,
    nickname: json.nickname,
    email: json.email,
    cameraPermission: json.camera_permission,
    geoPermission: json.geo_permission,
    points: json.points,
  };
}

