export interface UserSession {
    flag: boolean;
    token: string;
    refreshToken: string; 
    username: string;
    role: string;
    message: string;
}