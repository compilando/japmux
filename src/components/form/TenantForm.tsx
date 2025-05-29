"use client";
import React, { useState, useEffect } from 'react';
import { CreateTenantDto, UpdateTenantDto } from '@/services/api';

interface TenantFormProps {
    initialData?: UpdateTenantDto;
    onSave: (data: CreateTenantDto | UpdateTenantDto) => void;
    onCancel: () => void;
}

interface FormData {
    name: string;
    marketplaceRequiresApproval: boolean;
    initialAdminUser: {
        email: string;
        password: string;
        confirmPassword: string;
        name?: string;
    };
}

const TenantForm: React.FC<TenantFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        marketplaceRequiresApproval: true,
        initialAdminUser: {
            email: '',
            password: '',
            confirmPassword: '',
            name: ''
        }
    });

    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
    }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                marketplaceRequiresApproval: initialData.marketplaceRequiresApproval || true,
                initialAdminUser: {
                    email: '',
                    password: '',
                    confirmPassword: '',
                    name: ''
                }
            });
        }
    }, [initialData]);

    const validatePassword = (password: string): boolean => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasMinLength && hasUpperCase && hasSymbol;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar contraseña solo si estamos creando un nuevo tenant
        if (!initialData) {
            const newErrors: { password?: string; confirmPassword?: string } = {};

            if (!validatePassword(formData.initialAdminUser.password)) {
                newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un símbolo';
            }

            if (formData.initialAdminUser.password !== formData.initialAdminUser.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }

        if (initialData) {
            const updateData: UpdateTenantDto = {
                name: formData.name,
                marketplaceRequiresApproval: formData.marketplaceRequiresApproval
            };
            onSave(updateData);
        } else {
            const createData: CreateTenantDto = {
                name: formData.name,
                marketplaceRequiresApproval: formData.marketplaceRequiresApproval,
                initialAdminUser: {
                    email: formData.initialAdminUser.email,
                    password: formData.initialAdminUser.password,
                    ...(formData.initialAdminUser.name && { name: formData.initialAdminUser.name })
                }
            };
            onSave(createData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (name.startsWith('initialAdminUser.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                initialAdminUser: {
                    ...prev.initialAdminUser,
                    [field]: value
                }
            }));

            // Limpiar errores cuando se modifica el campo
            if (field === 'password' || field === 'confirmPassword') {
                setErrors(prev => ({
                    ...prev,
                    [field]: undefined
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre del Tenant
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="marketplaceRequiresApproval"
                    name="marketplaceRequiresApproval"
                    checked={formData.marketplaceRequiresApproval}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="marketplaceRequiresApproval" className="ml-2 block text-sm text-gray-900">
                    Requiere aprobación en marketplace
                </label>
            </div>

            {!initialData && (
                <>
                    <div>
                        <label htmlFor="initialAdminUser.email" className="block text-sm font-medium text-gray-700">
                            Email del Admin
                        </label>
                        <input
                            type="email"
                            id="initialAdminUser.email"
                            name="initialAdminUser.email"
                            value={formData.initialAdminUser.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="initialAdminUser.password" className="block text-sm font-medium text-gray-700">
                            Contraseña del Admin
                        </label>
                        <input
                            type="password"
                            id="initialAdminUser.password"
                            name="initialAdminUser.password"
                            value={formData.initialAdminUser.password}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-500 sm:text-sm ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="initialAdminUser.confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="initialAdminUser.confirmPassword"
                            name="initialAdminUser.confirmPassword"
                            value={formData.initialAdminUser.confirmPassword}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-500 sm:text-sm ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
                                }`}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="initialAdminUser.name" className="block text-sm font-medium text-gray-700">
                            Nombre del Admin (opcional)
                        </label>
                        <input
                            type="text"
                            id="initialAdminUser.name"
                            name="initialAdminUser.name"
                            value={formData.initialAdminUser.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                        />
                    </div>
                </>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default TenantForm; 