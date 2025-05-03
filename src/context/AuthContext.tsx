'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Para redirección
import {
    authService,
    userService, // Asumiendo que necesitamos userService para obtener perfil
    LoginDto,
    RegisterDto,
    UserProfileResponse
} from '@/services/api'; // Ajusta la ruta si es necesario

interface AuthContextType {
    user: UserProfileResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean; // Para saber si se está verificando el token inicial
    error: string | null; // Para errores de login/registro
    login: (credentials: LoginDto) => Promise<boolean>;
    logout: () => void;
    register: (data: RegisterDto) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Empieza cargando para verificar token
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchUserProfile = useCallback(async () => {
        console.log('AuthProvider: fetchUserProfile called'); // Log inicio
        if (authService.isAuthenticated()) {
            try {
                console.log("AuthProvider: Token found, fetching user profile...");
                const userProfile = await authService.getCurrentUserProfile();
                console.log("AuthProvider: User profile fetched:", userProfile); // Log perfil
                setUser(userProfile);
            } catch (err) {
                console.error("AuthProvider: Failed to fetch user profile on load:", err);
                authService.logout();
                setUser(null);
            }
        } else {
            console.log("AuthProvider: No token found.");
            setUser(null);
        }
        setIsLoading(false);
        console.log('AuthProvider: fetchUserProfile finished, isLoading:', false); // Log fin carga
    }, []);

    useEffect(() => {
        console.log("AuthProvider: Initializing, calling fetchUserProfile...");
        fetchUserProfile();
    }, [fetchUserProfile]);

    const login = async (credentials: LoginDto): Promise<boolean> => {
        console.log('AuthProvider: login called'); // Log inicio login
        setError(null);
        setIsLoading(true);
        try {
            await authService.login(credentials);
            console.log('AuthProvider: login successful, calling fetchUserProfile...'); // Log post-login
            await fetchUserProfile();
            setIsLoading(false); // Asegurarse que isLoading se setea a false aquí
            console.log('AuthProvider: login finished successfully');
            return true;
        } catch (err: any) {
            console.error("AuthProvider: Login failed:", err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            setUser(null);
            authService.logout();
            setIsLoading(false);
            console.log('AuthProvider: login finished with error');
            return false;
        }
    };

    const register = async (data: RegisterDto): Promise<boolean> => {
        setError(null);
        setIsLoading(true);
        try {
            // Asumiendo que register no loguea automáticamente.
            // Si lo hace, necesitaríamos manejar el token aquí también.
            await authService.register(data);
            // Podrías intentar loguear automáticamente después o redirigir a login
            setIsLoading(false);
            // Considera si quieres loguear al usuario inmediatamente o redirigir a login
            return true;
        } catch (err: any) {
            console.error("AuthProvider: Registration failed:", err);
            setError(err.response?.data?.message || "Registration failed.");
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        // console.log("AuthProvider: Logging out...");
        authService.logout(); // Limpia localStorage
        setUser(null);
        setError(null);
        // Redirigir a la página de login
        router.push('/signin'); // O la ruta que corresponda
    };

    const contextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        register
    };
    // console.log("AuthProvider: Providing value:", contextValue); // Log valor proveído (puede ser muy verboso)

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 