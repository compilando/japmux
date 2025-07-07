import { TenantResponseDto, CreateTenantDto, UpdateTenantDto } from '@/types/tenant';
import { apiClient } from './apiClient';

export const tenantService = {
    findAll: async (): Promise<TenantResponseDto[]> => {
        const response = await apiClient.get('/api/tenants');
        return response.data as TenantResponseDto[];
    },

    findById: async (id: string): Promise<TenantResponseDto> => {
        const response = await apiClient.get(`/api/tenants/${id}`);
        return response.data as TenantResponseDto;
    },

    create: async (tenant: CreateTenantDto): Promise<TenantResponseDto> => {
        const response = await apiClient.post('/api/tenants', tenant);
        return response.data as TenantResponseDto;
    },

    update: async (id: string, tenant: UpdateTenantDto): Promise<TenantResponseDto> => {
        const response = await apiClient.patch(`/api/tenants/${id}`, tenant);
        return response.data as TenantResponseDto;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/tenants/${id}`);
    }
}; 