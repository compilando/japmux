'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { toast, ToastOptions } from 'react-hot-toast';
import { setToastImplementation } from '@/utils/toastUtils'; // Import the utility

interface NotificationContextType {
    // We could add specific functions if we wanted to use them from React components
    // notifySuccess: (message: string) => void;
    // notifyError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    // When mounting the provider, we set the toast implementation in the utility
    useEffect(() => {
        // Pass the `toast` function from react-hot-toast to our utility module
        // so that showErrorToast/showSuccessToast functions can use it.
        setToastImplementation(toast);

        // Optional: Cleanup if necessary (doesn't seem to be here)
        // return () => { /* cleanup code */ };
    }, []);

    // Functions to use from React could be defined here if needed
    // const notifySuccess = (message: string) => toast.success(message);
    // const notifyError = (message: string) => toast.error(message);

    // The context value can be empty if we only use it to initialize the utility
    const contextValue = {};

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook (if exposed functions are needed in the future)
export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}; 