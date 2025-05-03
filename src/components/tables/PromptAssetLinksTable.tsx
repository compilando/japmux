import React from 'react';
import { PromptAssetLink } from '@/services/api';
import CopyButton from '../common/CopyButton';

interface PromptAssetLinksTableProps {
    promptAssetLinks: PromptAssetLink[];
    // Optional context props
    projectId?: string;
    promptVersionId?: string;
    onEdit: (item: PromptAssetLink) => void;
    onDelete: (id: string) => void; // Expects linkId
    loading?: boolean;
}

const PromptAssetLinksTable: React.FC<PromptAssetLinksTableProps> = ({ promptAssetLinks, projectId, promptVersionId, onEdit, onDelete, loading }) => {
    if (loading) {
        return <p>Loading links...</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="w-3/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Link ID</th>
                        {/* Prompt Version ID might be redundant if all links are for the same version */}
                        {/* <th scope="col" className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prompt Version ID</th> */}
                        <th scope="col" className="w-3/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Asset Version ID</th>
                        <th scope="col" className="w-3/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usage Context</th>
                        <th scope="col" className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                        <th scope="col" className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Required</th>
                        <th scope="col" className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(promptAssetLinks) && promptAssetLinks.map((item) => (
                        <tr key={item.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={item.id}>{item.id}</span>
                                    <CopyButton textToCopy={item.id} />
                                </div>
                            </td>
                            {/* Prompt Version ID Cell - Removed as redundant in this context */}
                            {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={item.promptVersionId}>{item.promptVersionId}</span>
                                    <CopyButton textToCopy={item.promptVersionId} />
                                </div>
                            </td> */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <div className="flex items-center space-x-2">
                                    {/* TODO: Maybe fetch Asset Version details to show key/tag? */}
                                    <span className="truncate" title={item.assetVersionId}>{item.assetVersionId}</span>
                                    <CopyButton textToCopy={item.assetVersionId} />
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.usageContext || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.position ?? '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isRequired ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {item.isRequired ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">Edit</button>
                                {/* onDelete expects linkId (item.id) */}
                                <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!Array.isArray(promptAssetLinks) || promptAssetLinks.length === 0) && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No asset versions linked.</p>
            )}
        </div>
    );
};

export default PromptAssetLinksTable; 