import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export const useTenantAdmin = () => {
    const [isTenantAdmin, setIsTenantAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const checkTenantAdmin = async () => {

            if (!isAuthenticated) {
                console.log('[useTenantAdmin] User is not authenticated');
                setIsTenantAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await apiClient.get('/api/tenant-admin-check');
                if (response.status === 200) {
                    console.log('[useTenantAdmin] User is tenant admin');
                    setIsTenantAdmin(true);
                } else {
                    console.log('[useTenantAdmin] User is not tenant admin');
                    setIsTenantAdmin(false);
                }
            } catch (error: any) {
                console.error('[useTenantAdmin] Error checking tenant admin status:', error);
                console.error('[useTenantAdmin] Error response:', error.response?.data);
                console.error('[useTenantAdmin] Error status:', error.response?.status);
                setIsTenantAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkTenantAdmin();
    }, [isAuthenticated, user]);

    return { isTenantAdmin, isLoading };
}; 