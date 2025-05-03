import React from 'react';
import { PromptAssetTranslation } from '@/services/api';
import CopyButton from '../common/CopyButton';

interface PromptAssetTranslationsTableProps {
    translations: PromptAssetTranslation[];
    onEdit: (item: PromptAssetTranslation) => void;
    // onDelete receives the languageCode to identify the translation
    onDelete: (languageCode: string) => void;
    loading?: boolean; // Add loading prop
}

const PromptAssetTranslationsTable: React.FC<PromptAssetTranslationsTableProps> = ({ translations, onEdit, onDelete, loading }) => {
    if (loading) {
        return <p>Loading translations...</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {/* <th scope="col" className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th> */}
                        <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language Code</th>
                        <th scope="col" className="w-8/12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Translated Value (Preview)</th>
                        <th scope="col" className="w-2/12 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(translations) && translations.map((item) => (
                        // Use languageCode as key if it's unique for this context
                        <tr key={item.languageCode}>
                            {/* ID cell removed - less relevant */}
                            {/* <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="truncate" title={item.id}>{item.id}</span>
                                    <CopyButton textToCopy={item.id} />
                                </div>
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-2">
                                    <span title={item.languageCode}>{item.languageCode}</span>
                                    <CopyButton textToCopy={item.languageCode} />
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {/* Show preview of the value */}
                                <span className="block truncate max-w-xl" title={item.value}>{item.value?.substring(0, 150)}{item.value?.length > 150 ? '...' : ''}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">Edit</button>
                                {/* Pass languageCode to onDelete */}
                                <button onClick={() => onDelete(item.languageCode)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!Array.isArray(translations) || translations.length === 0) && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No translations found for this version.</p>
            )}
        </div>
    );
};

export default PromptAssetTranslationsTable; 