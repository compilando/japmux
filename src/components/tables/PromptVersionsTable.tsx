import React from 'react';
import { PromptVersionData, PromptVersionMarketplaceDetails } from '@/app/(admin)/projects/[projectId]/prompts/[promptId]/versions/page';
import CopyButton from '../common/CopyButton';
import Link from 'next/link';
import { TrashBinIcon, PencilIcon } from "@/icons";

interface PromptVersionsTableProps {
    promptVersions: PromptVersionMarketplaceDetails[];
    projectId: string;
    promptIdForTable: string;
    onEdit: (item: PromptVersionData) => void;
    onDelete: (item: PromptVersionData) => void;
    onToggleActive?: (item: PromptVersionData) => void;
    onRequestPublish: (versionTag: string) => void;
    onUnpublish: (versionTag: string) => void;
    marketplaceActionLoading: Record<string, boolean>;
}

const PromptVersionsTable: React.FC<PromptVersionsTableProps> = ({
    promptVersions,
    projectId,
    promptIdForTable,
    onEdit,
    onDelete,
    onToggleActive,
    onRequestPublish,
    onUnpublish,
    marketplaceActionLoading
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tag</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content (Excerpt)</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marketplace Status</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {promptVersions.map((item) => {
                        const status = item.marketplaceStatus;
                        const isLoadingAction = marketplaceActionLoading[item.versionTag] || false;
                        const canRequestPublish = !status || status === 'NOT_PUBLISHED' || status === 'REJECTED';
                        const canUnpublish = status === 'PENDING_APPROVAL' || status === 'PUBLISHED';
                        const currentPromptId = item.promptId || promptIdForTable;

                        return (
                            <tr key={item.id}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <span className="truncate" title={item.versionTag}>{item.versionTag}</span>
                                        <CopyButton textToCopy={item.versionTag} />
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs" title={item.promptText}>{item.promptText?.substring(0, 100)}{item.promptText && item.promptText.length > 100 ? '...' : ''}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {item.isActive ?
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</span> :
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Inactive</span>
                                    }
                                    {onToggleActive && (
                                        <button
                                            onClick={() => onToggleActive(item)}
                                            className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Toggle
                                        </button>
                                    )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                        {status || 'NOT_PUBLISHED'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                    <Link
                                        href={`/projects/${projectId}/prompts/${currentPromptId}/versions/${item.versionTag}/translations?versionId=${item.id}`}
                                        className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-600 p-1"
                                        title="Manage Translations"
                                    >
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
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-600 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Edit Version"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Delete Version"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {promptVersions.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt versions found for this prompt.</p>
            )}
        </div>
    );
};

export default PromptVersionsTable; 