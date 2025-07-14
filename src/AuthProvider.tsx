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

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};