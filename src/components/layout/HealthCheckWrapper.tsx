'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@nextui-org/react'; // Removed
import { healthService } from '@/services/api';
import ApiHealthErrorModal from '../ui/ApiHealthErrorModal'; // Adjust path if necessary
import { useAuth } from '@/context/AuthContext';

const CHECK_INTERVAL_MS = 30000; // Check every 30 seconds

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
        console.log('[HealthCheck] Checking API status...');
        setIsLoading(true);
        try {
            // TODO: Consider adding retries with exponential backoff
            await healthService.check();
            console.log('[HealthCheck] API is healthy.');
            setIsApiHealthy(true);
            setShowErrorModal(false);
        } catch (error) {
            console.error('[HealthCheck] API health check failed:', error);
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
        console.log('[HealthCheck] Initial mount effect, calling checkApiStatus.');
        checkApiStatus();
    }, [checkApiStatus]);

    // Periodic check
    useEffect(() => {
        console.log(`[HealthCheck] Periodic effect running. isApiHealthy: ${isApiHealthy}`);
        if (intervalRef.current) {
            console.log('[HealthCheck] Clearing previous interval.');
            clearInterval(intervalRef.current);
            intervalRef.current = null; // Important to reset the ref
        }

        if (isApiHealthy) {
            console.log(`[HealthCheck] Setting up new interval (${CHECK_INTERVAL_MS}ms).`);
            intervalRef.current = setInterval(() => {
                console.log('[HealthCheck] Interval triggered, calling checkApiStatus.');
                checkApiStatus();
            }, CHECK_INTERVAL_MS);
        } else {
            console.log('[HealthCheck] API not healthy, interval not set.');
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (intervalRef.current) {
                console.log('[HealthCheck] Cleanup: Clearing interval.');
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [checkApiStatus, isApiHealthy]);

    const handleRetry = () => {
        console.log('[HealthCheck] Retry button clicked, calling checkApiStatus.');
        checkApiStatus();
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