export interface FriendLocation {
  id: number;
  nickname: string;
  lat: number;
  lng: number;
  points: number;
}

export function friendLocationFromJson(json: any): FriendLocation {
  return {
    id: json.id,
    nickname: json.nickname,
    lat: json.lat,
    lng: json.lng,
    points: json.points,
  };
}