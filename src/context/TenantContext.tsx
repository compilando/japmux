"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { TenantResponseDto, tenantService } from '@/services/api';

interface TenantContextType {
    selectedTenantId: string | null;
    selectedTenant: TenantResponseDto | null;
    setSelectedTenantId: (id: string | null) => void;
    setSelectedTenant: (tenant: TenantResponseDto | null) => void;
    refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<TenantResponseDto | null>(null);

    const refreshTenant = useCallback(async () => {
        if (selectedTenantId) {
            try {
                const tenant = await tenantService.findOne(selectedTenantId);
                setSelectedTenant(tenant);
            } catch (error) {
                console.error('Error refreshing tenant:', error);
                setSelectedTenant(null);
            }
        }
    }, [selectedTenantId]);

    return (
        <TenantContext.Provider
            value={{
                selectedTenantId,
                selectedTenant,
                setSelectedTenantId,
                setSelectedTenant,
                refreshTenant,
            }}
        >
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}; 