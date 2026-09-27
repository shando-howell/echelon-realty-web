'use client';

import { 
    createContext, useContext, useState, useEffect, ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';

// The shape of the context
interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// The context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Check the storage exactly once the app mounts
    useEffect(() => {
        setTimeout(() => {
            const token = localStorage.getItem('agent_id');
            setIsLoggedIn(!!token);
        }, 0);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('agent_id', token);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        localStorage.removeItem('agent_id');

        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Implement custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}
