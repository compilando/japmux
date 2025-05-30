"use client";
import React, { useState } from 'react';
import { CreateTenantDto, UpdateTenantDto, TenantResponseDto } from '@/services/api';

interface TenantFormProps {
    initialData: TenantResponseDto | null;
    onSave: (data: CreateTenantDto | UpdateTenantDto) => void;
    onCancel: () => void;
}

const TenantForm: React.FC<TenantFormProps> = ({
    initialData,
    onSave,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateTenantDto | UpdateTenantDto>({
        name: initialData?.name || '',
        marketplaceRequiresApproval: initialData?.marketplaceRequiresApproval ?? true,
        initialAdminUser: {
            email: '',
            password: '',
            name: ''
        }
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((formData as CreateTenantDto).initialAdminUser?.password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        setPasswordError('');
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (name.startsWith('admin.')) {
            const adminField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                initialAdminUser: {
                    ...(prev as CreateTenantDto).initialAdminUser,
                    [adminField]: value
                }
            }));
            // Limpiar error de contraseña cuando se modifica
            if (adminField === 'password') {
                setPasswordError('');
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value !== (formData as CreateTenantDto).initialAdminUser?.password) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tenant Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="marketplaceRequiresApproval"
                    name="marketplaceRequiresApproval"
                    checked={(formData as CreateTenantDto).marketplaceRequiresApproval}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="marketplaceRequiresApproval" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Require approval for marketplace prompt versions
                </label>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Initial Admin User</h4>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="admin.name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Admin Name
                        </label>
                        <input
                            type="text"
                            id="admin.name"
                            name="admin.name"
                            value={(formData as CreateTenantDto).initialAdminUser?.name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            id="admin.email"
                            name="admin.email"
                            value={(formData as CreateTenantDto).initialAdminUser?.email || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin.password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            id="admin.password"
                            name="admin.password"
                            value={(formData as CreateTenantDto).initialAdminUser?.password || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm ${passwordError
                                    ? 'border-red-300 dark:border-red-600'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}
                        />
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {passwordError}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {initialData ? 'Update' : 'Create'} Tenant
                </button>
            </div>
        </form>
    );
};

export default TenantForm; 