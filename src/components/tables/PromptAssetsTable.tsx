import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreatePromptAssetDto, promptAssetService } from '@/services/api';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon } from "@/icons";
import { ClockIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

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
    const [versionsCount, setVersionsCount] = useState<Record<string, number>>({});
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersionsCount = async () => {
            const counts: Record<string, number> = {};
            for (const asset of promptAssets) {
                try {
                    const versions = await promptAssetService.findVersions(projectId, promptId, asset.key);
                    counts[asset.key] = versions.length;
                } catch (error) {
                    console.error(`Error fetching versions for asset ${asset.key}:`, error);
                    counts[asset.key] = 0;
                }
            }
            setVersionsCount(counts);
        };

        fetchVersionsCount();
    }, [promptAssets, projectId, promptId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Key</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Array.isArray(promptAssets) && promptAssets.map((item) => (
                            <tr
                                key={item.key}
                                className={`transition-colors duration-200 ${hoveredRow === item.key
                                        ? 'bg-gray-50 dark:bg-gray-700/50'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                                onMouseEnter={() => setHoveredRow(item.key)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={item.key}>
                                            {item.key ?? 'N/A'}
                                        </span>
                                        {item.key && <CopyButton textToCopy={item.key} />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {item.category || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.enabled
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {item.enabled ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link
                                            href={`/projects/${projectId}/prompts/${promptId}/assets/${item.key}/versions`}
                                            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                                            title="Manage Versions"
                                        >
                                            <ClockIcon className="w-4 h-4 mr-1.5" />
                                            <span>Versions</span>
                                            {versionsCount[item.key] !== undefined && (
                                                <span className="ml-1.5 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                                                    {versionsCount[item.key]}
                                                </span>
                                            )}
                                        </Link>
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                            title="Edit Asset"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.key)}
                                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                            title="Delete Asset"
                                        >
                                            <TrashBinIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {(!Array.isArray(promptAssets) || promptAssets.length === 0) && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
                    <DocumentDuplicateIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No prompt assets found</p>
                </div>
            )}
        </div>
    );
};

export default PromptAssetsTable; 