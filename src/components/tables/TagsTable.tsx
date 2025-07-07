import React, { useState } from 'react';
import { TagDto } from '@/services/generated/api';
import CopyButton from '../common/CopyButton';
import TrashIcon from "@/icons/trash.svg";
import PencilIcon from "@/icons/pencil.svg";
import InfoIcon from "@/icons/info.svg";
import CheckLineIcon from "@/icons/check-line.svg";
import CloseLineIcon from "@/icons/close-line.svg";

interface TagsTableProps {
    tags: TagDto[];
    onEdit: (tag: TagDto) => void;
    onDelete: (id: string) => void;
    onAdd?: (tag: { name: string; description: string }) => void;
    isAdding?: boolean;
}

const TagsTable: React.FC<TagsTableProps> = ({ tags, onEdit, onDelete, onAdd, isAdding }) => {
    const [editingTag, setEditingTag] = useState<TagDto | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');

    const handleStartEdit = (tag: TagDto) => {
        setEditingTag(tag);
        setEditName(tag.name);
        setEditDescription(tag.description || '');
    };

    const handleCancelEdit = () => {
        setEditingTag(null);
        setEditName('');
        setEditDescription('');
    };

    const handleSaveEdit = () => {
        if (editingTag) {
            onEdit({
                ...editingTag,
                name: editName,
                description: editDescription
            });
            handleCancelEdit();
        }
    };

    const handleSaveNewTag = () => {
        if (onAdd && newTagName.trim()) {
            onAdd({
                name: newTagName.trim(),
                description: newTagDescription.trim()
            });
            setNewTagName('');
            setNewTagDescription('');
        }
    };

    const handleCancelNewTag = () => {
        if (onAdd) {
            onAdd({ name: '', description: '' });
            setNewTagName('');
            setNewTagDescription('');
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-lg">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th scope="col" className="w-1/4 px-5 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
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
                        {isAdding && (
                            <tr className="bg-blue-50 dark:bg-blue-900/20">
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">New Tag</span>
                                </td>
                                <td className="w-1/4 px-5 py-4 whitespace-nowrap text-sm">
                                    <input
                                        type="text"
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        placeholder="Enter tag name"
                                    />
                                </td>
                                <td className="w-1/2 px-5 py-4 text-sm">
                                    <input
                                        type="text"
                                        value={newTagDescription}
                                        onChange={(e) => setNewTagDescription(e.target.value)}
                                        className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        placeholder="Enter tag description"
                                    />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={handleSaveNewTag}
                                            disabled={!newTagName.trim()}
                                            className="text-green-500 hover:text-green-700 p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Save New Tag" title="Save"
                                        >
                                            <CheckLineIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleCancelNewTag}
                                            className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                            aria-label="Cancel New Tag" title="Cancel"
                                        >
                                            <CloseLineIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {tags.length === 0 && !isAdding && (
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
                            <tr key={tag.id} className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 transition-all duration-200">
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                    <div className="flex items-center space-x-2" title={tag.id}>
                                        <span className="truncate max-w-[150px] font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md text-xs">{tag.id}</span>
                                        <CopyButton textToCopy={tag.id} />
                                    </div>
                                </td>
                                <td className="w-1/4 px-5 py-4 whitespace-nowrap text-sm">
                                    {editingTag?.id === tag.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 dark:from-sky-500/20 dark:to-blue-500/20 dark:text-sky-200 ring-1 ring-inset ring-sky-500/10 dark:ring-sky-500/30 shadow-sm group-hover:shadow-md transition-all duration-200">
                                            {tag.name}
                                        </span>
                                    )}
                                </td>
                                <td className="w-1/2 px-5 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-md group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                                    {editingTag?.id === tag.id ? (
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <span title={tag.description}>{tag.description || 'N/A'}</span>
                                    )}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {editingTag?.id === tag.id ? (
                                            <>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="text-green-500 hover:text-green-700 p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                                    aria-label="Save Changes" title="Save"
                                                >
                                                    <CheckLineIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                                    aria-label="Cancel Edit" title="Cancel"
                                                >
                                                    <CloseLineIcon className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleStartEdit(tag)}
                                                    className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                                    aria-label="Edit Tag" title="Edit"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(tag.id)}
                                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                                    aria-label="Delete Tag" title="Delete"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
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