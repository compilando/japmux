'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import {
    authService,
    LoginDto,
    RegisterDto,
    UserProfileResponse
} from '@/services/api'; // Adjust path if necessary

interface AuthContextType {
    user: UserProfileResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean; // To know if the initial token is being verified
    error: string | null; // For login/registration errors
    login: (credentials: LoginDto, rememberMe?: boolean) => Promise<boolean>;
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
        // Fetching user profile
        if (authService.isAuthenticated()) {
            try {
                // Token found, fetching user profile
                const userProfile = await authService.getCurrentUserProfile();
                // User profile fetched successfully
                setUser(userProfile);
            } catch (err) {
                console.error("AuthProvider: Failed to fetch user profile on load:", err);
                authService.logout();
                setUser(null);
            }
        } else {
            // No token found
            setUser(null);
        }
        setIsLoading(false);
        // fetchUserProfile finished
    }, []);

    useEffect(() => {
        // Initializing auth provider
        fetchUserProfile();
    }, [fetchUserProfile]);

    const login = async (credentials: LoginDto, rememberMe: boolean = false): Promise<boolean> => {
        console.log('AuthProvider: login called, rememberMe:', rememberMe); // Log inicio login
        setError(null);
        setIsLoading(true);
        try {
            await authService.login(credentials, rememberMe);
            console.log('AuthProvider: login successful, calling fetchUserProfile...'); // Log post-login
            await fetchUserProfile();
            setIsLoading(false); // Ensure isLoading is set to false here
            console.log('AuthProvider: login finished successfully');
            return true;
        } catch (err: unknown) {
            console.error("AuthProvider: Login failed:", err);
            // Verificar si err tiene estructura esperada
            let errorMessage = "Login failed. Please check your credentials.";
            if (err && typeof err === 'object' && 'response' in err &&
                err.response && typeof err.response === 'object' &&
                'data' in err.response && err.response.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data) {
                errorMessage = String(err.response.data.message);
            }
            setError(errorMessage);
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
        } catch (err: unknown) {
            console.error("AuthProvider: Registration failed:", err);
            // Verificar si err tiene estructura esperada
            let errorMessage = "Registration failed.";
            if (err && typeof err === 'object' && 'response' in err &&
                err.response && typeof err.response === 'object' &&
                'data' in err.response && err.response.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data) {
                errorMessage = String(err.response.data.message);
            }
            setError(errorMessage);
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