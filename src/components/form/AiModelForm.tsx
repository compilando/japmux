import React, { useState, useEffect } from 'react';
import { AiModel, AiModelCreatePayload, AiModelUpdatePayload } from '@/services/api';

interface AiModelFormProps {
    initialData: AiModel | null;
    onSave: (data: AiModelCreatePayload | AiModelUpdatePayload) => void;
    onCancel: () => void;
}

const AiModelForm: React.FC<AiModelFormProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [provider, setProvider] = useState('');
    const [description, setDescription] = useState('');
    const [apiIdentifier, setApiIdentifier] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name ?? '');
            setProvider(initialData.provider ?? '');
            setDescription(initialData.description ?? '');
            setApiIdentifier(initialData.apiIdentifier ?? '');
        } else {
            setName('');
            setProvider('');
            setDescription('');
            setApiIdentifier('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            alert('Model Name is required.');
            return;
        }

        const payload: AiModelCreatePayload | AiModelUpdatePayload = {
            name: name.trim(),
            provider: provider.trim() || undefined,
            description: description.trim() || undefined,
            apiIdentifier: apiIdentifier.trim() || undefined,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                <input
                    type="text"
                    id="modelName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            {/* Provider */}
            <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider (Optional)</label>
                <input
                    type="text"
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* API Identifier */}
            <div>
                <label htmlFor="apiIdentifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Identifier (Optional)</label>
                <input
                    type="text"
                    id="apiIdentifier"
                    value={apiIdentifier}
                    onChange={(e) => setApiIdentifier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {isEditing ? 'Update AI Model' : 'Create AI Model'}
                </button>
            </div>
        </form>
    );
};

export default AiModelForm; 