'use client';

import React, { Component, ReactNode } from 'react';
import logger from '@/utils/logger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Actualizar el estado para que el siguiente renderizado muestre la UI de error
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log del error para debugging
        logger.error('ErrorBoundary caught an error', error, errorInfo);

        // En producción, enviar a servicio de monitoreo
        if (process.env.NODE_ENV === 'production') {
            // Aquí podríamos enviar a Sentry u otro servicio
            // window.Sentry?.captureException(error, { extra: errorInfo });
        }
    }

    render() {
        if (this.state.hasError) {
            // UI de fallback personalizada
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                            ¡Ups! Algo salió mal
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                            Ha ocurrido un error inesperado. Por favor, recarga la página o contacta al soporte si el problema persiste.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                                    Detalles del error (solo en desarrollo)
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Recargar página
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Ir atrás
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 