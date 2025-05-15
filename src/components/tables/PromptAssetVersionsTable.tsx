import React from 'react';
import Link from 'next/link';
import { AssetVersionUIData } from '@/app/(admin)/projects/[projectId]/prompt-assets/[assetKey]/versions/page';
import CopyButton from '../common/CopyButton';
import { format } from 'date-fns';
import { PencilIcon, TrashBinIcon } from "@/icons";
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface PromptAssetVersionsTableProps {
    promptAssetVersions: AssetVersionUIData[];
    projectId: string;
    assetKey: string;
    onEdit: (item: AssetVersionUIData) => void;
    onDelete: (versionTag: string) => void;
    loading?: boolean;
}

const PromptAssetVersionsTable: React.FC<PromptAssetVersionsTableProps> = ({
    promptAssetVersions,
    projectId,
    assetKey,
    onEdit,
    onDelete,
    loading,
}) => {
    if (loading) {
        return <p>Loading versions...</p>;
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'PPpp');
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Version Tag</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value (Preview)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change Message</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(promptAssetVersions) && promptAssetVersions.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center space-x-2">
                                        <span className="truncate" title={item.versionTag}>{item.versionTag}</span>
                                        <CopyButton textToCopy={item.versionTag} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                    <span className="block truncate max-w-xs" title={item.value}>{item.value?.substring(0, 100)}{item.value?.length > 100 ? '...' : ''}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.changeMessage || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(item.createdAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 p-1 inline-block"
                                        title="Edit Version"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <Link
                                        href={`/projects/${projectId}/prompt-assets/${assetKey}/versions/${item.versionTag}/translations`}
                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600 p-1 inline-block"
                                        title="Manage Translations"
                                    >
                                        <DocumentDuplicateIcon className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(item.versionTag)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600 p-1 inline-block"
                                        title="Delete Version"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {(!Array.isArray(promptAssetVersions) || promptAssetVersions.length === 0) && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No versions found for this asset.</p>
            )}
        </div>
    );
};

export default PromptAssetVersionsTable; 