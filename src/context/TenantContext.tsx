import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TenantResponseDto } from '@/services/api';

interface TenantContextType {
    currentTenant: TenantResponseDto | null;
    setCurrentTenant: (tenant: TenantResponseDto | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTenant, setCurrentTenant] = useState<TenantResponseDto | null>(null);

    return (
        <TenantContext.Provider value={{ currentTenant, setCurrentTenant }}>
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