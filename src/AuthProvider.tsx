import { useState, type ReactNode } from 'react';
import type { UserSession } from './Interface/UserSessionData';
import { UseAuthContext } from './hooks/UseLogin';

type AuthProps = {
    children: ReactNode;
};

export const AuthProvider = (props: AuthProps) => {
    const AuthContext = UseAuthContext();
    const [user, setUser] = useState<UserSession | null>(null);

    const login = (userData: UserSession) => setUser(userData);

    const updateToken = (userData: UserSession) => {
        const token = userData.token !== "" && userData.token !== undefined && userData.token !== null 
            ? userData.token 
            : user!.token;

        const refreshToken = userData.refreshToken !== "" && userData.refreshToken !== undefined  && userData.token !== null
            ? userData.refreshToken 
            : user!.refreshToken;

        const newUser: UserSession = {
            ...user!,
            token,
            refreshToken
        };

        setUser(newUser);
        window.sessionStorage.setItem("userSession", JSON.stringify(newUser));
    }

    const logout = () => {
        setUser(null);
        window.sessionStorage.removeItem("userSession");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateToken: updateToken }}>
            {props.children}
        </AuthContext.Provider>
    );
};