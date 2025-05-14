import React from 'react';
import { PromptDto } from '@/services/generated/api';
import Link from 'next/link';
import { usePrompts } from '@/context/PromptContext';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon } from "@/icons";

interface PromptsTableProps {
    prompts: PromptDto[];
    onEdit: (item: PromptDto) => void;
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {prompts.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                    <span className="mr-2" title={item.id}>{item.id}</span>
                                    {item.id && <CopyButton textToCopy={item.id} />}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs" title={item.description}>{item.description || '-'}</td>
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
                                <div className="inline-flex items-center gap-3">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Edit Prompt"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Delete Prompt"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                </div>
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