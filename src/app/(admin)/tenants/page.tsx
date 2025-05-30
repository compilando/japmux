"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { tenantService, CreateTenantDto, UpdateTenantDto, TenantResponseDto } from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import TenantForm from '@/components/form/TenantForm';
import { useTenant } from '@/context/TenantContext';
import { useRouter } from 'next/navigation';

const TenantsPage: React.FC = () => {
    const router = useRouter();
    const { setSelectedTenantId, setSelectedTenant } = useTenant();
    const [tenants, setTenants] = useState<TenantResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingTenant, setEditingTenant] = useState<TenantResponseDto | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tenantService.findAll();
            setTenants(data);
        } catch (err: any) {
            console.error("Failed to fetch tenants:", err);
            setError(err.message || 'Failed to fetch data.');
            setTenants([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddTenant = () => {
        setEditingTenant(null);
        setShowForm(true);
    };

    const handleEditTenant = (tenant: TenantResponseDto) => {
        setEditingTenant(tenant);
        setShowForm(true);
    };

    const handleDeleteTenant = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
            try {
                await tenantService.remove(id);
                showSuccessToast('Tenant deleted successfully');
                fetchData();
            } catch (error: any) {
                console.error("Error deleting tenant:", error);
                showErrorToast(error.message || 'Error deleting tenant. Check console for details.');
            }
        }
    };

    const handleManageUsers = (tenant: TenantResponseDto) => {
        setSelectedTenantId(tenant.id);
        setSelectedTenant(tenant);
        router.push('/users');
    };

    const handleSaveTenant = async (tenantData: CreateTenantDto | UpdateTenantDto) => {
        try {
            if (editingTenant) {
                await tenantService.update(editingTenant.id, tenantData as UpdateTenantDto);
                showSuccessToast('Tenant updated successfully');
            } else {
                await tenantService.create(tenantData as CreateTenantDto);
                showSuccessToast('Tenant created successfully');
            }
            setShowForm(false);
            setEditingTenant(null);
            fetchData();
        } catch (error: any) {
            console.error("Error saving tenant:", error);
            showErrorToast(error.message || 'Error saving tenant. Check console for details.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTenant(null);
    };

    const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Tenants" }];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Tenants
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Manage all your tenants or create a new one.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddTenant}
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || showForm}
                    >
                        <PlusIcon className="h-4 w-4 inline-block mr-2" />
                        Add New Tenant
                    </button>
                </div>

                {loading && <p className="text-center py-4">Loading tenants...</p>}
                {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

                {showForm && (
                    <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
                        </h3>
                        <TenantForm
                            initialData={editingTenant}
                            onSave={handleSaveTenant}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tenants.map((tenant) => (
                            <div
                                key={tenant.id}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {tenant.name}
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditTenant(tenant)}
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            aria-label="Edit Tenant"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTenant(tenant.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            aria-label="Delete Tenant"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Created: {new Date(tenant.createdAt).toLocaleDateString()}
                                </div>
                                <button
                                    onClick={() => handleManageUsers(tenant)}
                                    className="w-full px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    <UserGroupIcon className="h-4 w-4 inline-block mr-2" />
                                    Manage Users
                                </button>
                            </div>
                        ))}
                        {tenants.length === 0 && (
                            <div className="col-span-full text-center py-10">
                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <h3 className="text-lg font-semibold mb-1">No Tenants Found</h3>
                                    <p className="text-sm">There are currently no tenants configured.</p>
                                    <p className="text-sm mt-1">Click "Add New Tenant" to create one.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default TenantsPage; 