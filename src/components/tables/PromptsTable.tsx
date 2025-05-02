import React from 'react';
import { Prompt, Tag } from '@/services/api';

interface PromptsTableProps {
    prompts: Prompt[];
    onEdit: (item: Prompt) => void;
    onDelete: (id: string) => void;
}

const PromptsTable: React.FC<PromptsTableProps> = ({ prompts, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name (ID)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tactic ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {prompts.map((item) => (
                        <tr key={item.id || item.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs" title={item.description}>{item.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.tacticId || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {item.tags && item.tags.length > 0 ? (
                                    item.tags.map((tagRelation: any, index: number) => {
                                        // Intentar obtener id y name desde estructuras comunes
                                        const tagId = tagRelation?.id ?? tagRelation?.tag?.id ?? tagRelation?.tagId;
                                        const tagName = tagRelation?.name ?? tagRelation?.tag?.name;

                                        // Usar un índice como fallback para la key si no hay ID, aunque no es ideal
                                        const key = tagId ?? `tag-${index}`;

                                        // Solo renderizar si tenemos un nombre
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
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3">Edit</button>
                                <button onClick={() => onDelete(item.name)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
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