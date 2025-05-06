'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import {
    authService,
    userService, // Assuming we need userService to get profile
    LoginDto,
    RegisterDto,
    UserProfileResponse
} from '@/services/api'; // Adjust path if necessary

interface AuthContextType {
    user: UserProfileResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean; // To know if the initial token is being verified
    error: string | null; // For login/registration errors
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
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading to verify token
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
            setIsLoading(false); // Ensure isLoading is set to false here
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
            // Assuming register doesn't log in automatically.
            // If it does, we would need to handle the token here too.
            await authService.register(data);
            // You could try logging in automatically after or redirecting to login
            setIsLoading(false);
            // Consider if you want to log the user in immediately or redirect to login
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
        authService.logout(); // Clear localStorage
        setUser(null);
        setError(null);
        // Redirect to the login page
        router.push('/signin'); // Or the corresponding route
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
    // console.log("AuthProvider: Providing value:", contextValue); // Log provided value (can be very verbose)

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 