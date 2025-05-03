import React from 'react';
import { Environment } from '@/services/api'; // Asegúrate de que la ruta sea correcta
import CopyButton from '../common/CopyButton';

interface EnvironmentsTableProps {
    environments: Environment[];
    onEdit: (environment: Environment) => void;
    onDelete: (id: string) => void;
}

const EnvironmentsTable: React.FC<EnvironmentsTableProps> = ({ environments, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                        </th>
                        {/* TODO: Añadir más cabeceras de columna según los campos de Environment */}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {environments.map((environment) => (
                        <tr key={environment.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={environment.id}>{environment.id}</span>
                                    <CopyButton textToCopy={environment.id} />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {environment.name}
                            </td>
                            {/* TODO: Añadir más celdas de datos según los campos de Environment */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(environment)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3">
                                    Edit
                                </button>
                                <button onClick={() => onDelete(environment.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {environments.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No environments found.</p>
            )}
        </div>
    );
};

export default EnvironmentsTable; 