import React from 'react';
import Link from 'next/link';
import { CreatePromptAssetDto } from '@/services/api';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon } from "@/icons";
import { ClockIcon } from '@heroicons/react/24/outline';

// Nueva interfaz local para incluir campos que podrían no estar en CreatePromptAssetDto
// pero que la API podría devolver y la tabla necesita (ej: enabled)
export interface PromptAssetData extends CreatePromptAssetDto {
    enabled?: boolean; // Asumir que 'enabled' viene de la API aunque no esté en el DTO
    projectId?: string; // Anteriormente projectId
    promptId?: string;
    promptName?: string;
    // key: string; // key ya está en CreatePromptAssetDto
}

interface PromptAssetsTableProps {
    promptAssets: PromptAssetData[];
    projectId: string;        // Cambiado de projectId a projectId
    promptId: string;
    onEdit: (item: PromptAssetData) => void;
    onDelete: (assetKey: string) => void;
    loading?: boolean;
}

const PromptAssetsTable: React.FC<PromptAssetsTableProps> = ({ promptAssets, projectId, promptId, onEdit, onDelete, loading }) => {
    if (loading) {
        return <p>Loading assets...</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="w-4/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key</th>
                        <th scope="col" className="w-3/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                        <th scope="col" className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enabled</th>
                        <th scope="col" className="w-2/12 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(promptAssets) && promptAssets.map((item) => (
                        <tr key={item.key}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={item.key}>{item.key ?? 'N/A'}</span>
                                    {item.key && <CopyButton textToCopy={item.key} />}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.category || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {item.enabled ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                <Link
                                    href={`/projects/${projectId}/prompts/${promptId}/assets/${item.key}/versions`}
                                    className="text-green-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 p-1 inline-block"
                                    title="Manage Versions"
                                >
                                    <ClockIcon className="w-5 h-5" />
                                </Link>

                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 p-1 inline-block"
                                    title="Edit Asset"
                                >
                                    <PencilIcon />
                                </button>
                                <button
                                    onClick={() => onDelete(item.key)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600 p-1 inline-block"
                                    title="Delete Asset"
                                >
                                    <TrashBinIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!Array.isArray(promptAssets) || promptAssets.length === 0) && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt assets found.</p>
            )}
        </div>
    );
};

export default PromptAssetsTable; 