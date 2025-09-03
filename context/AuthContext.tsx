import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
    name: string;
    username: string;
    role: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (data: { token: string; name: string; username: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Carregar dados do AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            const savedToken = await AsyncStorage.getItem("token");
            const savedUser = await AsyncStorage.getItem("user");

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                setIsLoggedIn(true);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    // useEffect(() => {
    //     const clear = async () => {
    //         await AsyncStorage.clear();
    //     };
    //     clear();
    // }, []);

    const login = async (data: { token: string; name: string; username: string; role: string }) => {
        const { token, name, username, role } = data;
        
        setToken(token);
        setUser({ name, username, role });
        setIsLoggedIn(true);
        
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify({ name, username, role }));
    };
    
    const logout = async () => {
        setToken(null);
        setUser(null) ;
        setIsLoggedIn(false);

        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    };
    
    return (
        <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
