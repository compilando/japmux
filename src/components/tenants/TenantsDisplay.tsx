import React from 'react';
import { TenantResponseDto } from '@/types/tenant';
import { PencilIcon, TrashIcon } from '@/icons';

interface TenantsDisplayProps {
    tenantsList: TenantResponseDto[];
    onEdit: (tenant: TenantResponseDto) => void;
    onDelete: (tenant: TenantResponseDto) => void;
}

const TenantsDisplay: React.FC<TenantsDisplayProps> = ({ tenantsList, onEdit, onDelete }) => {
    if (tenantsList.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No hay tenants disponibles</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha de creación
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tenantsList.map((tenant) => (
                        <tr key={tenant.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tenant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(tenant.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(tenant)}
                                    className="text-brand-600 hover:text-brand-900 mr-4"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(tenant)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TenantsDisplay; 