"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTenantAdmin } from '@/hooks/useTenantAdmin';
import { TenantResponseDto, CreateTenantDto, UpdateTenantDto } from '@/services/api';
import { tenantService } from '@/services/api';
import TenantForm from '@/components/form/TenantForm';
import TenantsDisplay from '@/components/tenants/TenantsDisplay';
import Breadcrumb from '@/components/common/Breadcrumb';

const TenantsPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
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

        fetchData();
    }, [isAuthenticated, isLoadingTenantAdmin, isTenantAdmin, router]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await tenantService.findAll();
            setTenants(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los tenants');
            console.error('Error fetching tenants:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTenant(null);
        setShowForm(true);
    };

    const handleEdit = (tenant: TenantResponseDto) => {
        setEditingTenant(tenant);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este tenant?')) {
            try {
                await tenantService.remove(id);
                await fetchData();
            } catch (err) {
                setError('Error al eliminar el tenant');
                console.error('Error deleting tenant:', err);
            }
        }
    };

    const handleSave = async (tenantData: CreateTenantDto | UpdateTenantDto) => {
        try {
            if (editingTenant) {
                await tenantService.update(editingTenant.id, tenantData as UpdateTenantDto);
            } else {
                await tenantService.create(tenantData as CreateTenantDto);
            }
            setShowForm(false);
            await fetchData();
        } catch (err) {
            setError('Error al guardar el tenant');
            console.error('Error saving tenant:', err);
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
                        initialData={editingTenant}
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
    );
};

export default TenantsPage; 