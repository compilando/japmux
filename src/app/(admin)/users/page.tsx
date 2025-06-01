"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { userService, CreateUserDto, UpdateUserDto, UserResponseDto, ExtendedUserProfileResponse } from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { PlusIcon } from '@heroicons/react/24/outline';
import UserForm from '@/components/form/UserForm';
import UsersDisplay from '@/components/users/UsersDisplay';
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    {/* Glassmorphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                    <div className="relative p-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-lg text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Tenant Selected</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Please select a tenant to manage its users.</p>
                        <button
                            onClick={handleBackToTenants}
                            className="relative px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            Go to Tenants
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-200/10 dark:bg-brand-800/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative">
                <Breadcrumb crumbs={breadcrumbs} />

                {/* Header section with glassmorphism */}
                <div className="my-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl rounded-2xl"></div>
                        <div className="relative p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                {user?.role === 'tenant_admin'
                                    ? 'Manage users for this tenant or create a new one.'
                                    : 'Manage all users in the system.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content with glassmorphism */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl">
                        {/* Back button (if needed) */}
                        {user?.role === 'tenant_admin' && (
                            <div className="mb-4">
                                <button
                                    onClick={handleBackToTenants}
                                    className="relative px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/30 dark:border-gray-700/40 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-300 hover:shadow-lg"
                                >
                                    Back to Tenants
                                    <div className="absolute inset-0 bg-gray-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        )}

                        {/* Action button */}
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={handleAddUser}
                                className="relative px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={loading || showForm}
                            >
                                <PlusIcon className="h-5 w-5 inline-block mr-2" />
                                Add New User
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                                        <div className="w-8 h-8 mx-auto mb-4 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-red-50/40 to-red-50/60 dark:from-red-900/60 dark:via-red-900/40 dark:to-red-900/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-red-50/30 dark:bg-red-900/30 backdrop-blur-sm rounded-2xl border border-red-200/30 dark:border-red-700/40 shadow-lg">
                                        <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form section */}
                        {showForm && (
                            <div className="mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-brand-50/40 to-brand-50/60 dark:from-brand-950/60 dark:via-brand-950/40 dark:to-brand-950/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-brand-50/30 dark:bg-brand-950/30 backdrop-blur-sm rounded-2xl border border-brand-200/30 dark:border-brand-700/40 shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                            {editingUser ? 'Edit User' : 'Add New User'}
                                        </h3>
                                        <UserForm
                                            initialData={editingUser}
                                            onSave={handleSaveUser}
                                            onCancel={handleCancelForm}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users display */}
                        {!loading && !error && (
                            <UsersDisplay
                                usersList={users}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                userRole={user?.role}
                                currentUserId={user?.id}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage; 