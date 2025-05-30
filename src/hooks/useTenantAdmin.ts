import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ExtendedUserProfileResponse } from '@/services/api';

export const useTenantAdmin = () => {
    const [isTenantAdmin, setIsTenantAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setIsTenantAdmin(false);
            setIsLoading(false);
            return;
        }

        setIsTenantAdmin((user as ExtendedUserProfileResponse).role === 'tenant_admin');
        setIsLoading(false);
    }, [isAuthenticated, user]);

    return { isTenantAdmin, isLoading };
}; 