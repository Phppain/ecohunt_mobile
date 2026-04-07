export type Friend = {
  id: number;
  nickname: string;
};

export function friendFromJson(json: any): Friend {
  return {
    id: json.id,
    nickname: json.nickname,
  };
}

