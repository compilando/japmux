import { useState, useEffect } from 'react';
import { AutenticacinYRolesApi } from '@/services/generated/api';
import { useAuth } from '@/context/AuthContext';

export const useTenantAdmin = () => {
    const [isTenantAdmin, setIsTenantAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const checkTenantAdmin = async () => {
            if (!isAuthenticated) {
                setIsTenantAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                const api = new AutenticacinYRolesApi();
                await api.appControllerTenantAdminCheck();
                setIsTenantAdmin(true);
            } catch (error) {
                setIsTenantAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkTenantAdmin();
    }, [isAuthenticated]);

    return { isTenantAdmin, isLoading };
}; 