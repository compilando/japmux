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
        logger.debug('HealthCheck: Checking API status...');
        setIsLoading(true);
        try {
            // TODO: Consider adding retries with exponential backoff
            await healthService.check();
            logger.debug('HealthCheck: API is healthy.');
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
        logger.debug('HealthCheck: Initial mount effect, calling checkApiStatus.');
        checkApiStatus();
    }, [checkApiStatus]);

    // Periodic check
    useEffect(() => {
        logger.debug(`HealthCheck: Periodic effect running. isApiHealthy: ${isApiHealthy}`);
        if (intervalRef.current) {
            logger.debug('HealthCheck: Clearing previous interval.');
            clearInterval(intervalRef.current);
            intervalRef.current = null; // Important to reset the ref
        }

        if (isApiHealthy) {
            logger.debug(`HealthCheck: Setting up new interval (${CHECK_INTERVAL_MS}ms).`);
            intervalRef.current = setInterval(() => {
                logger.debug('HealthCheck: Interval triggered, calling checkApiStatus.');
                checkApiStatus();
            }, CHECK_INTERVAL_MS);
        } else {
            logger.debug('HealthCheck: API not healthy, interval not set.');
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (intervalRef.current) {
                logger.debug('HealthCheck: Cleanup: Clearing interval.');
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [checkApiStatus, isApiHealthy]);

    const handleRetry = () => {
        logger.debug('HealthCheck: Retry button clicked, calling checkApiStatus.');
        checkApiStatus();
    };

    logger.debug(`HealthCheck: Rendering wrapper. isLoading: ${isLoading}, showErrorModal: ${showErrorModal}`);

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