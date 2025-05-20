import React from 'react';
import { UserProfileResponse } from '@/services/api'; // Usar UserProfileResponse directamente
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon, UserCircleIcon, InfoIcon } from "@/icons"; // Añadir UserCircleIcon e InfoIcon
import { format } from 'date-fns'; // Para formatear la fecha

interface UsersTableProps {
    users: UserProfileResponse[];
    onEdit: (user: UserProfileResponse) => void;
    onDelete: (id: string) => void;
}

// Función para obtener iniciales del nombre
const getInitials = (name: string | undefined | null): string => {
    if (!name) return '-';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
};

// Función para formatear la fecha si está disponible
const formatDateIfAvailable = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'PP'); // Formato como 'Sep 20, 2023'
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
};

// Mapeo de colores para roles (ejemplo)
const roleColorMap: { [key: string]: string } = {
    USER: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200',
    ADMIN: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
    TENANT_ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200',
    DEFAULT: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => {
    if (users.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <InfoIcon className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
                    <p className="text-sm">There are currently no users in the system.</p>
                    {/* Podrías añadir un botón para "Add User" aquí si la lógica está en la página padre */}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <tr>
                        <th scope="col" className="pl-4 pr-2 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[5%]">
                            {/* Espacio para Avatar/ID */}
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            User
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Role
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Created At
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap text-sm">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-700 text-brand-600 dark:text-brand-200 font-semibold text-xs">
                                    {getInitials(user.name)}
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={user.name || user.email}>{user.name || 'N/A'}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <span className="truncate" title={user.email}>{user.email}</span>
                                    <CopyButton textToCopy={user.email} size="xs" />
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${(user.role && roleColorMap[user.role.toUpperCase()]) || roleColorMap.DEFAULT}`}>
                                    {user.role || '-'}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDateIfAvailable(user.createdAt)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                        aria-label="Edit User" title="Edit User"
                                    >
                                        <PencilIcon />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                        aria-label="Delete User" title="Delete User"
                                    >
                                        <TrashBinIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
