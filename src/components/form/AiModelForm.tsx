import React, { useState, useEffect } from 'react';
import { aiModelService } from '@/services/api';
import { AiModelResponseDto, CreateAiModelDto, UpdateAiModelDto } from '@/services/generated/api';
import { showErrorToast } from '@/utils/toastUtils';

// Tipo provisional para las opciones del proveedor, ajustar según la respuesta real del API
interface ProviderTypeOption {
    value: string;
    label: string;
}

interface AiModelFormProps {
    initialData: AiModelResponseDto | null;
    onSave: (data: CreateAiModelDto | UpdateAiModelDto) => void;
    onCancel: () => void;
    projectId: string;
}

const AiModelForm: React.FC<AiModelFormProps> = ({ initialData, onSave, onCancel, projectId }) => {
    const [name, setName] = useState('');
    const [provider, setProvider] = useState('');
    const [description, setDescription] = useState('');
    const [apiIdentifier, setApiIdentifier] = useState('');

    // Estados para los tipos de proveedor
    const [providerTypes, setProviderTypes] = useState<ProviderTypeOption[]>([]);
    const [isLoadingProviderTypes, setIsLoadingProviderTypes] = useState(false);

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

    // Efecto para cargar los tipos de proveedores
    useEffect(() => {
        console.log('[AiModelForm] useEffect for provider types. ProjectId:', projectId);
        if (projectId) {
            setIsLoadingProviderTypes(true);
            aiModelService.getProviderTypes(projectId)
                .then(data => {
                    // La API devuelve string[], mapeamos a ProviderTypeOption[]
                    const options: ProviderTypeOption[] = data.map(pt => ({ value: pt, label: pt }));
                    setProviderTypes(options);
                })
                .catch(err => {
                    console.error("[AiModelForm] Error fetching provider types:", err);
                    showErrorToast("Failed to load provider types. Please try again.");
                    setProviderTypes([]); // Limpiar en caso de error
                })
                .finally(() => setIsLoadingProviderTypes(false));
        } else {
            setProviderTypes([]); // Limpiar si no hay projectId
        }
    }, [projectId]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            showErrorToast('Model Name is required.');
            return;
        }

        if (!provider.trim()) {
            showErrorToast('Provider is required.');
            return;
        }

        const payload: CreateAiModelDto | UpdateAiModelDto = {
            name: name.trim(),
            provider: provider.trim(),
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

            {/* Provider - CAMBIADO A SELECT */}
            <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
                <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    disabled={isLoadingProviderTypes}
                >
                    <option value="">-- Select Provider --</option>
                    {providerTypes.map(pt => (
                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                </select>
                {isLoadingProviderTypes && <p className="text-sm text-gray-500 dark:text-gray-400">Loading providers...</p>}
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

            {/* Buttons */}
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