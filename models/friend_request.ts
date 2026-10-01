export interface FriendRequest {
    request_id:number;

    id:number;
    nickname:string;
    email:string;

    points:number;
}


export function friendRequestFromJson(json:any):FriendRequest {

    return {
        request_id: json.request_id,
        id: json.id,
        nickname: json.nickname,
        email: json.email,
        points: json.points,
    };
}