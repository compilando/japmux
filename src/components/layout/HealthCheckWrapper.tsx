'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@nextui-org/react'; // Removed
import { healthService } from '@/services/api';
import ApiHealthErrorModal from '../ui/ApiHealthErrorModal'; // Adjust path if necessary
import { useAuth } from '@/context/AuthContext';
import logger from '@/utils/logger';

const CHECK_INTERVAL_MS = 60000; // 1 minuto

interface HealthCheckWrapperProps {
    children: React.ReactNode;
}

const HealthCheckWrapper: React.FC<HealthCheckWrapperProps> = ({ children }) => {
    const [isApiHealthy, setIsApiHealthy] = useState<boolean>(true);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const checkApiStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            // TODO: Consider adding retries with exponential backoff
            await healthService.check();
            setIsApiHealthy(true);
            setShowErrorModal(false);
        } catch (error) {
            logger.error('HealthCheck: API health check failed', error);
            setIsApiHealthy(false);
            if (!isAuthenticated && !isAuthLoading && !showErrorModal) {
                setShowErrorModal(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, isAuthLoading, showErrorModal]);

    // Initial check on mount
    useEffect(() => {
        checkApiStatus();
    }, [checkApiStatus]);

    // Periodic check
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null; // Important to reset the ref
        }

        if (isApiHealthy) {
            intervalRef.current = setInterval(() => {
                checkApiStatus();
            }, CHECK_INTERVAL_MS);
        } else {
            logger.debug('HealthCheck: API not healthy, interval not set.');
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [checkApiStatus, isApiHealthy]);

    const handleRetry = () => {
        checkApiStatus();
    };

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