export interface UserSession {
    flag: boolean;
    token: string;
    refreshToken: string; 
    username: string;
    message: string;
}