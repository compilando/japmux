import React from 'react';
import { PromptTranslation } from '@/services/api';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon } from "@/icons";

interface PromptTranslationsTableProps {
    promptTranslations: PromptTranslation[];
    onEdit: (item: PromptTranslation) => void;
    onDelete: (item: PromptTranslation) => void;
}

const PromptTranslationsTable: React.FC<PromptTranslationsTableProps> = ({ promptTranslations, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language Code</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content (Excerpt)</th>
                        {/* TODO: Add columns for PromptTranslation fields */}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {promptTranslations.map((item) => (
                        <tr key={item.id}> {/* Key might need adjustment if ID is composite */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={item.id}>{item.id}</span>
                                    <CopyButton textToCopy={item.id} />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <div className="flex items-center space-x-2">
                                    <span title={item.languageCode}>{item.languageCode}</span>
                                    <CopyButton textToCopy={item.languageCode} />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">{item.promptText}</td>
                            {/* TODO: Add cells for PromptTranslation fields */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Edit Translation"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)}
                                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Delete Translation"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {promptTranslations.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No items found.</p>
            )}
        </div>
    );
};

export default PromptTranslationsTable; 