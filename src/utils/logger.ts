// Sistema de logging centralizado para producción
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
    debug: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    },

    info: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.info(`[INFO] ${message}`, ...args);
        }
        // En producción podríamos enviar a un servicio de logging externo
    },

    warn: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`, ...args);
        } else {
            // En producción, logs de advertencia pueden ser útiles
            console.warn(`[WARN] ${message}`);
        }
    },

    error: (message: string, error?: any, ...args: any[]) => {
        // Los errores siempre se loguean
        if (isDevelopment) {
            console.error(`[ERROR] ${message}`, error, ...args);
        } else {
            console.error(`[ERROR] ${message}`, error instanceof Error ? error.message : error);
        }

        // En producción podríamos enviar a un servicio de monitoreo como Sentry
        // if (isProduction && window.Sentry) {
        //     window.Sentry.captureException(error instanceof Error ? error : new Error(message));
        // }
    },

    // Método especial para logs de API
    api: (operation: string, url: string, data?: any) => {
        if (isDevelopment) {
            console.log(`[API] ${operation} ${url}`, data);
        }
    }
};

export default logger; 