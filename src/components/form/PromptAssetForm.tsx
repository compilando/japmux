import React, { useState, useEffect } from 'react';
import { PromptAsset, PromptAssetCreatePayload, PromptAssetUpdatePayload } from '@/services/api';

interface PromptAssetFormProps {
    initialData: PromptAsset | null;
    onSave: (payload: PromptAssetCreatePayload | PromptAssetUpdatePayload) => void;
    onCancel: () => void;
}

const PromptAssetForm: React.FC<PromptAssetFormProps> = ({ initialData, onSave, onCancel }) => {
    const [key, setKey] = useState('');
    const [name, setName] = useState('');
    const [initialValue, setInitialValue] = useState(''); // Solo para creación
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [initialChangeMessage, setInitialChangeMessage] = useState(''); // Solo para creación
    const [projectId, setProjectId] = useState('');
    const [enabled, setEnabled] = useState(true); // Solo para edición

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setKey(initialData.key || '');
            setName(initialData.name || '');
            setType(initialData.type || '');
            setDescription(initialData.description || '');
            setCategory(initialData.category || '');
            setProjectId(initialData.projectId || '');
            setEnabled(initialData.enabled === undefined ? true : initialData.enabled);
            // Resetear campos de creación
            setInitialValue('');
            setInitialChangeMessage('');
        } else {
            // Resetear para creación
            setKey('');
            setName('');
            setType('');
            setDescription('');
            setCategory('');
            setProjectId('');
            setEnabled(true); // Resetear al default
            setInitialValue('');
            setInitialChangeMessage('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: PromptAssetCreatePayload | PromptAssetUpdatePayload;

        if (isEditing) {
            payload = {
                name: name || undefined,
                type: type || undefined,
                description: description || undefined,
                category: category || undefined,
                enabled,
                projectId: projectId || null, // Permitir desasociar con null
            } as PromptAssetUpdatePayload;
        } else {
            payload = {
                key,
                name,
                initialValue,
                type: type || undefined,
                description: description || undefined,
                category: category || undefined,
                initialChangeMessage: initialChangeMessage || undefined,
                projectId: projectId || undefined,
            } as PromptAssetCreatePayload;
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key (ID)</label>
                <input
                    type="text"
                    id="key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                    disabled={isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            {!isEditing && (
                <>
                    <div>
                        <label htmlFor="initialValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Value (v1.0.0)</label>
                        <textarea
                            id="initialValue"
                            rows={3}
                            value={initialValue}
                            onChange={(e) => setInitialValue(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="initialChangeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Change Message (Optional)</label>
                        <input
                            type="text"
                            id="initialChangeMessage"
                            value={initialChangeMessage}
                            onChange={(e) => setInitialChangeMessage(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>
                </>
            )}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type (Optional)</label>
                <input
                    type="text"
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category (Optional)</label>
                <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project ID (Optional)</label>
                <input
                    type="text"
                    id="projectId"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400">Dejar vacío para desasociar.</p>}
            </div>
            {isEditing && (
                <div className="flex items-center">
                    <input
                        id="enabled"
                        name="enabled"
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Enabled
                    </label>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Asset'}</button>
            </div>
        </form>
    );
};

export default PromptAssetForm; 