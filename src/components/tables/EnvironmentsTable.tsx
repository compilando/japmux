import React from 'react';
import { Environment } from '@/services/api'; // Make sure the path is correct
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon } from "@/icons"; // Added PencilIcon and TrashBinIcon

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
                        {/* TODO: Add more column headers based on Environment fields */}
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
                            {/* TODO: Add more data cells based on Environment fields */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => onEdit(environment)}
                                        className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Edit Environment"
                                    >
                                        <PencilIcon />
                                    </button>
                                    <button
                                        onClick={() => onDelete(environment.id)}
                                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Delete Environment"
                                    >
                                        <TrashBinIcon />
                                    </button>
                                </div>
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