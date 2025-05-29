"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTenantAdmin } from '@/hooks/useTenantAdmin';
import { TenantResponseDto, CreateTenantDto, UpdateTenantDto, ExtendedUserProfileResponse } from '@/services/api';
import { tenantService } from '@/services/api';
import TenantForm from '@/components/form/TenantForm';
import TenantsDisplay from '@/components/tenants/TenantsDisplay';
import Breadcrumb from '@/components/common/Breadcrumb';
import { TenantProvider } from '@/context/TenantContext';

const TenantsPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { isTenantAdmin, isLoading: isLoadingTenantAdmin } = useTenantAdmin();
    const [tenants, setTenants] = useState<TenantResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTenant, setEditingTenant] = useState<TenantResponseDto | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }

        if (!isLoadingTenantAdmin && !isTenantAdmin) {
            router.push('/');
            return;
        }

        console.log('Usuario actual:', user);
        console.log('Rol del usuario:', (user as ExtendedUserProfileResponse)?.role);

        fetchData();
    }, [isAuthenticated, isLoadingTenantAdmin, isTenantAdmin, router, user]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Si el usuario es tenant_admin, solo obtener su propio tenant
            if ((user as ExtendedUserProfileResponse)?.role === 'tenant_admin' && (user as ExtendedUserProfileResponse)?.tenantId) {
                const tenant = await tenantService.findOne((user as ExtendedUserProfileResponse).tenantId);
                setTenants([tenant]);
            } else {
                // Obtener todos los tenants
                const data = await tenantService.findAll();
                setTenants(data);
            }
        } catch (err: any) {
            console.error('Error fetching tenants:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los tenants';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTenant(null);
        setShowForm(true);
    };

    const handleEdit = (tenant: TenantResponseDto) => {
        // Solo permitir editar si es el tenant del usuario
        if (tenant.id !== (user as ExtendedUserProfileResponse)?.tenantId) {
            setError('No tienes permisos para editar este tenant');
            return;
        }
        setEditingTenant(tenant);
        setShowForm(true);
    };

    const handleDelete = async (tenant: TenantResponseDto) => {
        // Solo permitir eliminar si es el tenant del usuario
        if (tenant.id !== (user as ExtendedUserProfileResponse)?.tenantId) {
            setError('No tienes permisos para eliminar este tenant');
            return;
        }

        if (window.confirm('¿Estás seguro de que deseas eliminar este tenant?')) {
            try {
                setError(null);
                await tenantService.remove(tenant.id);
                await fetchData();
            } catch (err: any) {
                console.error('Error deleting tenant:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el tenant';
                setError(errorMessage);
            }
        }
    };

    const handleSave = async (tenantData: CreateTenantDto | UpdateTenantDto) => {
        try {
            setError(null);
            if (editingTenant) {
                await tenantService.update(editingTenant.id, tenantData as UpdateTenantDto);
            } else {
                await tenantService.create(tenantData as CreateTenantDto);
            }
            setShowForm(false);
            await fetchData();
        } catch (err: any) {
            console.error('Error saving tenant:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error al guardar el tenant';
            setError(errorMessage);
        }
    };

    if (isLoading || isLoadingTenantAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!isTenantAdmin) {
        return null;
    }

    return (
        <TenantProvider>
            <div className="container mx-auto px-4 py-8">
                <Breadcrumb
                    items={[
                        { label: 'Inicio', href: '/' },
                        { label: 'Tenants', href: '/tenants' },
                    ]}
                />

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Tenants</h1>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        Añadir Nuevo Tenant
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {showForm ? (
                    <div className="mb-6">
                        <TenantForm
                            initialData={editingTenant || undefined}
                            onSave={handleSave}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                ) : (
                    <TenantsDisplay
                        tenantsList={tenants}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </TenantProvider>
    );
};

export default TenantsPage; 