import React from 'react';
import { PromptDto } from '@/services/generated/api';
import Link from 'next/link';
import { usePrompts } from '@/context/PromptContext';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon, BoxCubeIcon } from "@/icons";
import { BoltIcon, ClockIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface PromptsTableProps {
    prompts: PromptDto[];
    onEdit: (item: PromptDto) => void;
    onDelete: (id: string) => void;
    projectId?: string;
    loading?: boolean;
}

const PromptsTable: React.FC<PromptsTableProps> = ({ prompts, onEdit, onDelete, projectId, loading }) => {
    const { selectPrompt } = usePrompts();

    if (loading && prompts.length === 0) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">Loading prompts...</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {(item as any).tags && Array.isArray((item as any).tags) && (item as any).tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {((item as any).tags as any[]).map((tag: any, index: number) => (
                                            <span key={index} className="px-2 py-0.5 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                                {tag.name || 'N/A'}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                <Link
                                    href={`/serveprompt?promptId=${item.id}`}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 p-1 inline-block"
                                    title="Test/Serve Prompt"
                                >
                                    <BoltIcon className="w-5 h-5" />
                                </Link>
                                {projectId && (
                                    <>
                                        <Link
                                            href={`/projects/${projectId}/prompts/${item.id}/versions`}
                                            onClick={() => selectPrompt(item.id)}
                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600 p-1 inline-block"
                                            title="Manage Versions"
                                        >
                                            <ClockIcon className="w-5 h-5" />
                                        </Link>
                                        <Link
                                            href={`/projects/${projectId}/prompts/${item.id}/assets`}
                                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-600 p-1 inline-block"
                                            title="Manage Assets"
                                        >
                                            <BoxCubeIcon style={{ paddingTop: '2px' }} />
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed inline-block"
                                    aria-label="Edit Prompt"
                                >
                                    <PencilIcon />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed inline-block"
                                    aria-label="Delete Prompt"
                                >
                                    <TrashBinIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {prompts.length === 0 && !loading && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompts found.</p>
            )}
        </div>
    );
};

export default PromptsTable; 