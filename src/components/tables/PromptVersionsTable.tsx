import React from 'react';
import { PromptVersion } from '@/services/api';
import CopyButton from '../common/CopyButton';

interface PromptVersionsTableProps {
    promptVersions: PromptVersion[];
    onEdit: (item: PromptVersion) => void;
    onDelete: (id: string) => void;
    onToggleActive?: (versionId: string, currentIsActive: boolean) => void;
}

const PromptVersionsTable: React.FC<PromptVersionsTableProps> = ({ promptVersions, onEdit, onDelete, onToggleActive }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tag</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content (Excerpt)</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {promptVersions.map((item) => (
                        <tr key={item.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={item.id}>{item.id}</span>
                                    <CopyButton textToCopy={item.id} />
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.versionTag}</td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">{item.promptText}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {item.isActive ?
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</span> :
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Inactive</span>
                                }
                                {onToggleActive && (
                                    <button
                                        onClick={() => onToggleActive(item.id, item.isActive)}
                                        className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Toggle
                                    </button>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3">Edit</button>
                                <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {promptVersions.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt versions found for this prompt.</p>
            )}
        </div>
    );
};

export default PromptVersionsTable; 