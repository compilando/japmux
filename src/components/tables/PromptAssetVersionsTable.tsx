import React from 'react';
import Link from 'next/link';
import { AssetVersionUIData, PromptAssetVersionMarketplaceDetails } from '@/app/(admin)/projects/[projectId]/prompt-assets/[assetKey]/versions/page';
import CopyButton from '../common/CopyButton';
import { format } from 'date-fns';

interface PromptAssetVersionsTableProps {
    promptAssetVersions: PromptAssetVersionMarketplaceDetails[];
    projectId: string;
    assetKey: string;
    onEdit: (item: AssetVersionUIData) => void;
    onDelete: (versionTag: string) => void;
    loading?: boolean;
    onRequestPublish: (versionTag: string) => void;
    onUnpublish: (versionTag: string) => void;
    marketplaceActionLoading: Record<string, boolean>;
}

const PromptAssetVersionsTable: React.FC<PromptAssetVersionsTableProps> = ({
    promptAssetVersions,
    projectId,
    assetKey,
    onEdit,
    onDelete,
    loading,
    onRequestPublish,
    onUnpublish,
    marketplaceActionLoading
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marketplace Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(promptAssetVersions) && promptAssetVersions.map((item) => {
                        const status = item.marketplaceStatus;
                        const isLoadingAction = marketplaceActionLoading[item.versionTag] || false;
                        const canRequestPublish = !status || status === 'NOT_PUBLISHED' || status === 'REJECTED';
                        const canUnpublish = status === 'PENDING_APPROVAL' || status === 'PUBLISHED';

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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                        {status || 'NOT_PUBLISHED'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                    <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 p-1" title="Edit Version">Edit</button>
                                    <Link href={`/projects/${projectId}/prompt-assets/${assetKey}/versions/${item.versionTag}/translations`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600 p-1" title="Manage Translations">
                                        Translations
                                    </Link>
                                    {canRequestPublish && (
                                        <button
                                            onClick={() => onRequestPublish(item.versionTag)}
                                            disabled={isLoadingAction}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 disabled:opacity-50 p-1"
                                            title="Request Publish to Marketplace">
                                            {isLoadingAction ? '...' : 'Publish'}
                                        </button>
                                    )}
                                    {canUnpublish && (
                                        <button
                                            onClick={() => onUnpublish(item.versionTag)}
                                            disabled={isLoadingAction}
                                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-600 disabled:opacity-50 p-1"
                                            title="Unpublish from Marketplace">
                                            {isLoadingAction ? '...' : 'Unpublish'}
                                        </button>
                                    )}
                                    <button onClick={() => onDelete(item.versionTag)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600 p-1" title="Delete Version">Delete</button>
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