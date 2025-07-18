export interface UserSession {
    flag: boolean;
    token: string;
    refreshToken: string; 
    username: string;
    role: string;
    userId: number;
    message: string;
}