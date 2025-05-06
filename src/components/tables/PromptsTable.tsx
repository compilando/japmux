import React from 'react';
import { Prompt, Tag } from '@/services/api';
import Link from 'next/link';
import { usePrompts } from '@/context/PromptContext';
import CopyButton from '../common/CopyButton';

interface PromptsTableProps {
    prompts: Prompt[];
    onEdit: (item: Prompt) => void;
    onDelete: (id: string) => void;
    projectId?: string;
}

const PromptsTable: React.FC<PromptsTableProps> = ({ prompts, onEdit, onDelete, projectId }) => {
    const { selectPrompt } = usePrompts();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {prompts.map((item) => (
                        <tr key={item.id || item.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs" title={item.description}>{item.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {item.tags && item.tags.length > 0 ? (
                                    item.tags.map((tagRelation: any, index: number) => {
                                        // Try to get id and name from common structures
                                        const tagId = tagRelation?.id ?? tagRelation?.tag?.id ?? tagRelation?.tagId;
                                        const tagName = tagRelation?.name ?? tagRelation?.tag?.name;

                                        // Use index as fallback key if no ID, although not ideal
                                        const key = tagId ?? `tag-${index}`;

                                        // Only render if we have a name
                                        return tagName ? (
                                            <span key={key} className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-1">
                                                {tagName}
                                            </span>
                                        ) : null;
                                    })
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                {projectId && (
                                    <Link
                                        href={`/projects/${projectId}/prompts/${item.id}/versions`}
                                        onClick={() => selectPrompt(item.id)}
                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600"
                                    >
                                        Versions
                                    </Link>
                                )}
                                <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">Edit</button>
                                <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {prompts.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompts found.</p>
            )}
        </div>
    );
};

export default PromptsTable; 