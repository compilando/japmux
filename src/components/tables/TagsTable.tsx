import React from 'react';
import { TagDto } from '@/services/generated/api';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon, InfoIcon } from "@/icons";

interface TagsTableProps {
    tags: TagDto[];
    onEdit: (tag: TagDto) => void;
    onDelete: (id: string) => void;
}

const TagsTable: React.FC<TagsTableProps> = ({ tags, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-lg">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th scope="col" className="w-1/4 px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="w-1/4 px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="w-1/2 px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Description
                            </th>
                            <th scope="col" className="px-5 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tags.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-10 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                                        <h3 className="text-lg font-semibold mb-1">No Tags Found</h3>
                                        <p className="text-sm">There are currently no tags configured for this project.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {tags.map((tag) => (
                            <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                    <div className="flex items-center space-x-2" title={tag.id}>
                                        <span className="truncate max-w-[150px]">{tag.id}</span>
                                        <CopyButton textToCopy={tag.id} />
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    <span className="font-semibold">{tag.name}</span>
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-md" title={tag.description}>
                                    {tag.description || 'N/A'}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(tag)}
                                            className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                            aria-label="Edit Tag" title="Edit"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(tag.id)}
                                            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                            aria-label="Delete Tag" title="Delete"
                                        >
                                            <TrashBinIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TagsTable; 