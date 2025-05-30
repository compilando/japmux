"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { userService, CreateUserDto, UpdateUserDto, UserResponseDto, ExtendedUserProfileResponse } from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import UserForm from '@/components/form/UserForm';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const UsersPage: React.FC = () => {
    const router = useRouter();
    const { selectedTenant, selectedTenantId } = useTenant();
    const { user } = useAuth() as { user: ExtendedUserProfileResponse | null };
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let data: UserResponseDto[];
            if (user?.role === 'tenant_admin') {
                if (!selectedTenantId) {
                    setError('No tenant selected');
                    setUsers([]);
                    setLoading(false);
                    return;
                }
                try {
                    data = await userService.findByTenant(selectedTenantId);
                } catch (err: any) {
                    if (err.message.includes('Invalid tenant ID format')) {
                        setError('Invalid tenant ID. Please select a valid tenant.');
                        setUsers([]);
                        setLoading(false);
                        return;
                    }
                    throw err;
                }
            } else {
                data = await userService.findAll();
            }
            setUsers(data);
        } catch (err: any) {
            console.error("Failed to fetch users:", err);
            setError(err.message || 'Failed to fetch data.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [selectedTenantId, user?.role]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddUser = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    const handleEditUser = (user: UserResponseDto) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userService.remove(id);
                showSuccessToast('User deleted successfully');
                fetchData();
            } catch (error: any) {
                console.error("Error deleting user:", error);
                showErrorToast(error.message || 'Error deleting user. Check console for details.');
            }
        }
    };

    const handleSaveUser = async (userData: CreateUserDto | UpdateUserDto) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, userData as UpdateUserDto);
                showSuccessToast('User updated successfully');
            } else {
                // Asegurarse de que el nuevo usuario pertenezca al tenant actual si es tenant_admin
                const createData = {
                    ...userData as CreateUserDto,
                    tenantId: user?.role === 'tenant_admin' ? selectedTenantId : undefined,
                };
                await userService.create(createData);
                showSuccessToast('User created successfully');
            }
            setShowForm(false);
            setEditingUser(null);
            fetchData();
        } catch (error: any) {
            console.error("Error saving user:", error);
            showErrorToast(error.message || 'Error saving user. Check console for details.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    const handleBackToTenants = () => {
        router.push('/tenants');
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Tenants", href: "/tenants" },
        { label: selectedTenant?.name || "Users", href: "/users" }
    ];

    if (user?.role === 'tenant_admin' && !selectedTenantId) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <h3 className="text-lg font-semibold mb-1">No Tenant Selected</h3>
                    <p className="text-sm">Please select a tenant to manage its users.</p>
                    <button
                        onClick={handleBackToTenants}
                        className="mt-4 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Go to Tenants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    {user?.role === 'tenant_admin' ? `Users for ${selectedTenant?.name}` : 'Users'}
                </h2>
                <p className="text-base font-medium dark:text-white">
                    {user?.role === 'tenant_admin'
                        ? 'Manage users for this tenant or create a new one.'
                        : 'Manage all users in the system.'}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-between mb-4">
                    {user?.role === 'tenant_admin' && (
                        <button
                            onClick={handleBackToTenants}
                            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Back to Tenants
                        </button>
                    )}
                    <button
                        onClick={handleAddUser}
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || showForm}
                    >
                        <PlusIcon className="h-4 w-4 inline-block mr-2" />
                        Add New User
                    </button>
                </div>

                {loading && <p className="text-center py-4">Loading users...</p>}
                {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

                {showForm && (
                    <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h3>
                        <UserForm
                            initialData={editingUser}
                            onSave={handleSaveUser}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            aria-label="Edit User"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            aria-label="Delete User"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Role: {user.role}
                                </div>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="col-span-full text-center py-10">
                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <h3 className="text-lg font-semibold mb-1">No Users Found</h3>
                                    <p className="text-sm">
                                        {user?.role === 'tenant_admin'
                                            ? 'There are currently no users configured for this tenant.'
                                            : 'There are currently no users configured in the system.'}
                                    </p>
                                    <p className="text-sm mt-1">Click "Add New User" to create one.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default UsersPage; 