export type LeaderboardEntry = {
  nickname: string;
  points: number;
};

export function leaderboardEntryFromJson(json: any): LeaderboardEntry {
  return {
    nickname: json.nickname,
    points: json.points,
  };
}

