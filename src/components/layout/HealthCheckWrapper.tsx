'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getApiHealth, HealthCheckResponse } from '@/services/api';
import ApiHealthErrorModal from '../ui/ApiHealthErrorModal'; // Ajusta la ruta si es necesario

const CHECK_INTERVAL_MS = 10000; // Chequear cada 5 segundos

interface HealthCheckWrapperProps {
    children: React.ReactNode;
}

const HealthCheckWrapper: React.FC<HealthCheckWrapperProps> = ({ children }) => {
    const [isApiHealthy, setIsApiHealthy] = useState<boolean>(true);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const checkApiHealth = useCallback(async () => {
        console.log('[HealthCheck] Attempting check...');
        if (isLoading) {
            console.log('[HealthCheck] Check skipped, already loading.');
            return;
        }
        setIsLoading(true);
        console.log('[HealthCheck] Set loading to true.');

        try {
            console.log('[HealthCheck] Calling getApiHealth()...');
            const health = await getApiHealth();
            console.log('[HealthCheck] getApiHealth() returned:', health);

            const isOk =
                health.status === 'ok' &&
                health.info?.prisma?.status === 'up' &&
                health.details?.prisma?.status === 'up';

            if (isOk) {
                console.log('[HealthCheck] API is healthy.');
                setIsApiHealthy(true);
                setShowErrorModal(false);
            } else {
                console.warn('[HealthCheck] API is unhealthy or criteria failed:', health);
                setIsApiHealthy(false);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('[HealthCheck] Unexpected error during health check:', error);
            setIsApiHealthy(false);
            setShowErrorModal(true);
        } finally {
            // Asegurarse de que isLoading se ponga a false siempre
            setIsLoading(false);
            console.log('[HealthCheck] Set loading to false (finally).');
        }
    }, []);

    // Chequeo inicial al montar
    useEffect(() => {
        console.log('[HealthCheck] Initial mount effect, calling checkApiHealth.');
        checkApiHealth();
    }, [checkApiHealth]);

    // Chequeo periódico
    useEffect(() => {
        console.log(`[HealthCheck] Periodic effect running. isApiHealthy: ${isApiHealthy}`);
        if (intervalRef.current) {
            console.log('[HealthCheck] Clearing previous interval.');
            clearInterval(intervalRef.current);
            intervalRef.current = null; // Importante resetear la ref
        }

        if (isApiHealthy) {
            console.log(`[HealthCheck] Setting up new interval (${CHECK_INTERVAL_MS}ms).`);
            intervalRef.current = setInterval(() => {
                console.log('[HealthCheck] Interval triggered, calling checkApiHealth.');
                checkApiHealth();
            }, CHECK_INTERVAL_MS);
        } else {
            console.log('[HealthCheck] API not healthy, interval not set.');
        }

        // Limpieza al desmontar o cuando cambien las dependencias
        return () => {
            if (intervalRef.current) {
                console.log('[HealthCheck] Cleanup: Clearing interval.');
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [checkApiHealth, isApiHealthy]);

    const handleRetry = () => {
        console.log('[HealthCheck] Retry button clicked, calling checkApiHealth.');
        checkApiHealth();
    };

    console.log(`[HealthCheck] Rendering wrapper. isLoading: ${isLoading}, showErrorModal: ${showErrorModal}`);

    return (
        <>
            {children}
            <ApiHealthErrorModal
                isOpen={showErrorModal}
                onRetry={handleRetry}
                isLoading={isLoading}
            />
        </>
    );
};

export default HealthCheckWrapper; 