'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { toast, ToastOptions } from 'react-hot-toast';
import { setToastImplementation } from '@/utils/toastUtils'; // Importar la utilidad

interface NotificationContextType {
    // Podríamos añadir funciones específicas si quisiéramos usarlas desde componentes React
    // notifySuccess: (message: string) => void;
    // notifyError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    // Al montar el proveedor, establecemos la implementación de toast en la utilidad
    useEffect(() => {
        // Pasamos la función `toast` de react-hot-toast a nuestro módulo de utilidad
        // para que las funciones showErrorToast/showSuccessToast puedan usarla.
        setToastImplementation(toast);

        // Opcional: Limpieza si fuera necesario (aquí no parece serlo)
        // return () => { /* código de limpieza */ };
    }, []);

    // Las funciones para usar desde React podrían definirse aquí si fueran necesarias
    // const notifySuccess = (message: string) => toast.success(message);
    // const notifyError = (message: string) => toast.error(message);

    // El valor del contexto puede estar vacío si solo lo usamos para inicializar la utilidad
    const contextValue = {};

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

// Hook personalizado (si se necesitan funciones expuestas en el futuro)
export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}; 