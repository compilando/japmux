import React from 'react';
// import { TagResponse } from '@/services/api'; // Comentado temporalmente
import { PencilIcon, TrashBinIcon, CheckLineIcon, CloseLineIcon, ListIcon } from '@/icons'; // Cambiado TagIcon a ListIcon

// Definición local de TagResponse para evitar error de importación
// Asumimos que esta es la estructura básica que necesitamos
export interface TagResponse {
    id: string;
    name: string;
    description?: string | null; // description puede ser opcional o null
    // projectId: string; // Si los tags están ligados a proyectos, esto podría ser necesario
}

interface TagCardItemProps {
    tag: TagResponse;
    isEditing: boolean;
    editName: string;
    editDescription: string;
    onStartEdit: (tag: TagResponse) => void;
    onCancelEdit: () => void;
    onSaveEdit: (tagId: string) => Promise<void>;
    onDelete: (id: string) => void;
    onEditNameChange: (value: string) => void;
    onEditDescriptionChange: (value: string) => void;
}

const TagCardItem: React.FC<TagCardItemProps> = ({
    tag,
    isEditing,
    editName,
    editDescription,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
    onEditNameChange,
    onEditDescriptionChange,
}) => {
    const cardClasses = `
        group bg-white dark:bg-gray-800 rounded-xl shadow-lg 
        border border-gray-200 dark:border-gray-700 
        transition-all duration-300 
        hover:shadow-xl hover:border-brand-500 dark:hover:border-brand-500
    `;

    const handleSave = async () => {
        await onSaveEdit(tag.id);
    };

    return (
        <div className={cardClasses}>
            <div className="p-5">
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor={`tagName-${tag.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tag Name
                            </label>
                            <input
                                type="text"
                                id={`tagName-${tag.id}`}
                                value={editName}
                                onChange={(e) => onEditNameChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Enter tag name"
                            />
                        </div>
                        <div>
                            <label htmlFor={`tagDesc-${tag.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                id={`tagDesc-${tag.id}`}
                                value={editDescription ?? ''} // Asegurar que no sea null
                                onChange={(e) => onEditDescriptionChange(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Enter tag description (optional)"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={onCancelEdit}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500"
                            >
                                <CloseLineIcon className="w-4 h-4 inline mr-1" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md border border-transparent"
                            >
                                <CheckLineIcon className="w-4 h-4 inline mr-1" /> Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 min-w-0 pr-10 relative">
                                <ListIcon className="w-6 h-6 text-brand-500 dark:text-brand-400 flex-shrink-0" />
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate" title={tag.name}>
                                    <span className="inline-block px-2 py-0.5 text-sm font-medium text-brand-700 bg-brand-100 dark:text-brand-200 dark:bg-brand-700/50 rounded-full">
                                        {tag.name}
                                    </span>
                                </h3>
                                {/* Botones de acción (Editar/Eliminar) - movidos a un div con posicionamiento absoluto */}
                                <div className="absolute top-[-4px] right-[-30px] flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => onStartEdit(tag)}
                                        className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                        title="Edit Tag"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(tag.id)}
                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                        title="Delete Tag"
                                    >
                                        <TrashBinIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {tag.description && (
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3" title={tag.description}>
                                {tag.description}
                            </p>
                        )}
                        {!tag.description && (
                            <p className="mt-3 text-sm text-gray-400 dark:text-gray-500 italic">
                                No description provided.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TagCardItem; 