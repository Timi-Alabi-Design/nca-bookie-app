import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

type User = {
        name: string;
        email: string;
        // add more fields if needed
};

interface AuthContextProps {
        user: User | null;
        token: string | null;
        login: (token: string, user: User) => void;
        logout: () => void;
        loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
        user: null,
        token: null,
        login: () => { },
        logout: () => { },
        loading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
        const [user, setUser] = useState<User | null>(null);
        const [token, setToken] = useState<string | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const loadStoredAuth = async () => {
                        const storedToken = await authService.getToken();
                        // optional: fetch user profile with token
                        if (storedToken) {
                                setToken(storedToken);
                                setUser({ name: 'User', email: 'default@email.com' }); // replace with real user
                        }
                        setLoading(false);
                };
                loadStoredAuth();
        }, []);

        const login = async (newToken: string, userData: User) => {
                await authService.storeToken(newToken);
                setToken(newToken);
                setUser(userData);
        };

        const logout = async () => {
                await authService.removeToken();
                setToken(null);
                setUser(null);
        };

        return (
                <AuthContext.Provider value={{ user, token, login, logout, loading }}>
                        {children}
                </AuthContext.Provider>
        );
};
export { AuthContext, AuthProvider };
