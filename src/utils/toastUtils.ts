import { toast, ToastOptions } from 'react-hot-toast';

// Referencia global (o usa un sistema de eventos)
let toastFunction: (message: string, options?: ToastOptions) => string = toast;

export const setToastImplementation = (fn: (message: string, options?: ToastOptions) => string) => {
    toastFunction = fn;
};

// Funciones que llamará el código no-React (como api.ts)
export const showErrorToast = (message: string) => {
    // Asegúrate de que la implementación esté lista (puede que no en SSR inicial)
    if (toastFunction && typeof window !== 'undefined') {
        toastFunction(message, {
            id: message, // Evita duplicados rápidos del mismo error
            icon: '❌', // Icono de error
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    }
};

export const showSuccessToast = (message: string) => {
    if (toastFunction && typeof window !== 'undefined') {
        toastFunction(message, {
            id: message,
            icon: '✅', // Icono de éxito
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    }
}; 