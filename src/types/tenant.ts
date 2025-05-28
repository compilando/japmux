export interface CreateTenantDto {
    name: string;
    description?: string;
}

export interface UpdateTenantDto {
    name?: string;
    description?: string;
}

export interface TenantResponseDto extends CreateTenantDto {
    id: string;
    createdAt: string;
    updatedAt: string;
} 