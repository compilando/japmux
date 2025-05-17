import React from 'react';
import { TagResponse } from './TagCardItem'; // Importar TagResponse definida localmente
import TagCardItem from './TagCardItem';
import { InfoIcon, PlusIcon } from '@/icons';

interface NewTagData {
    name: string;
    description: string;
}

interface TagsDisplayProps {
    tagsList: TagResponse[];
    editingTagId: string | null;
    editTagName: string;
    editTagDescription: string;
    isAdding: boolean;
    newTagName: string;
    newTagDescription: string;
    onStartEdit: (tag: TagResponse) => void;
    onCancelEdit: () => void;
    onSaveEdit: (tagId: string) => Promise<void>;
    onDeleteTag: (id: string) => void;
    onEditTagNameChange: (value: string) => void;
    onEditTagDescriptionChange: (value: string) => void;
    onAddNewTag: () => void; // Para mostrar el formulario de nuevo tag
    onCancelNewTag: () => void;
    onSaveNewTag: () => Promise<void>;
    onNewTagNameChange: (value: string) => void;
    onNewTagDescriptionChange: (value: string) => void;
}

const TagsDisplay: React.FC<TagsDisplayProps> = ({
    tagsList,
    editingTagId,
    editTagName,
    editTagDescription,
    isAdding,
    newTagName,
    newTagDescription,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDeleteTag,
    onEditTagNameChange,
    onEditTagDescriptionChange,
    onAddNewTag,
    onCancelNewTag,
    onSaveNewTag,
    onNewTagNameChange,
    onNewTagDescriptionChange,
}) => {
    if (!tagsList || tagsList.length === 0 && !isAdding) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-semibold mb-1">No Tags Found</h3>
                    <p className="text-sm">There are currently no tags configured for this project.</p>
                    <button
                        onClick={onAddNewTag}
                        className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New Tag
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Botón para añadir nuevo tag (si no se está añadiendo ya) */}
            {!isAdding && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={onAddNewTag}
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New Tag
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Tarjeta para añadir nuevo tag (si se está añadiendo) */}
                {isAdding && (
                    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-brand-500 ring-2 ring-brand-500 p-5">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Add New Tag</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newTagName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tag Name
                                </label>
                                <input
                                    type="text"
                                    id="newTagName"
                                    value={newTagName}
                                    onChange={(e) => onNewTagNameChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter new tag name"
                                />
                            </div>
                            <div>
                                <label htmlFor="newTagDesc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="newTagDesc"
                                    value={newTagDescription}
                                    onChange={(e) => onNewTagDescriptionChange(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter tag description"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={onCancelNewTag}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onSaveNewTag}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md border border-transparent"
                                >
                                    Save Tag
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de tags existentes */}
                {tagsList.map((tag) => (
                    <TagCardItem
                        key={tag.id}
                        tag={tag}
                        isEditing={editingTagId === tag.id}
                        editName={editingTagId === tag.id ? editTagName : ''}
                        editDescription={editingTagId === tag.id ? editTagDescription ?? '' : ''}
                        onStartEdit={onStartEdit}
                        onCancelEdit={onCancelEdit}
                        onSaveEdit={onSaveEdit}
                        onDelete={onDeleteTag}
                        onEditNameChange={onEditTagNameChange}
                        onEditDescriptionChange={onEditTagDescriptionChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default TagsDisplay; 