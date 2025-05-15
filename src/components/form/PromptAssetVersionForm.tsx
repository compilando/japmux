import React, { useState, useEffect } from 'react';
import { CreatePromptAssetVersionDto, UpdatePromptAssetVersionDto } from '@/services/api';

interface PromptAssetVersionFormProps {
    initialData: CreatePromptAssetVersionDto | null;
    onSave: (payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto) => void;
    onCancel: () => void;
    latestVersionTag?: string;
}

// Helper para calcular la siguiente versión (simplificado)
const calculateNextAssetVersionTag = (latestTag: string | null | undefined): string => {
    // Lógica muy básica, similar a la de PromptVersionForm
    let baseTag = latestTag;
    let suffix = '';
    if (latestTag) {
        const suffixMatch = latestTag.match(/(-[a-zA-Z0-9-.]+)?(\+[a-zA-Z0-9-.]+)?$/);
        if (suffixMatch && suffixMatch[0]) {
            suffix = suffixMatch[0];
            baseTag = latestTag.substring(0, latestTag.length - suffix.length);
        }
    }

    if (!baseTag || !baseTag.startsWith('v')) return 'v1.0.0'; // Default si no hay base o formato incorrecto

    const parts = baseTag.substring(1).split('.').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 'v1.0.0'; // Default si el formato no es vX.Y.Z

    parts[2]++; // Incrementar patch
    // Podría añadirse lógica para incrementar minor/major si es necesario

    return `v${parts.join('.')}${suffix}`;
};

const PromptAssetVersionForm: React.FC<PromptAssetVersionFormProps> = ({ initialData, onSave, onCancel, latestVersionTag }) => {
    const [value, setValue] = useState('');
    // Usar latestVersionTag para inicializar el estado de versionTag en modo creación
    const [versionTag, setVersionTag] = useState(() => {
        if (initialData) return initialData.versionTag || 'v1.0.0';
        return calculateNextAssetVersionTag(latestVersionTag);
    });
    const [changeMessage, setChangeMessage] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setValue(initialData.value || '');
            setVersionTag(initialData.versionTag || 'v1.0.0'); // Si es edición, usar el tag existente
            setChangeMessage(initialData.changeMessage || '');
        } else {
            // En modo creación, ya se establece arriba con calculateNextAssetVersionTag
            // así que solo reseteamos los otros campos
            setValue('');
            setVersionTag(calculateNextAssetVersionTag(latestVersionTag)); // Asegurar que se recalcula si latestVersionTag cambia
            setChangeMessage('');
        }
    }, [initialData, latestVersionTag]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto;

        if (isEditing) {
            payload = {
                value: value || undefined,
                changeMessage: changeMessage || undefined,
            } as UpdatePromptAssetVersionDto;
        } else {
            payload = {
                value,
                versionTag: versionTag,
                changeMessage: changeMessage || undefined,
            } as CreatePromptAssetVersionDto;
            if (!value) {
                alert("Value is required for a new version!");
                return;
            }
            if (!versionTag) {
                alert("Version Tag is required for a new version!");
                return;
            }
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="versionTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Version Tag</label>
                <input
                    type="text"
                    id="versionTag"
                    value={versionTag}
                    onChange={(e) => setVersionTag(e.target.value)}
                    required
                    disabled={isEditing}
                    pattern="^v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)?(\+[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)?$"
                    title="Semantic Versioning format (e.g., v1.0.0, v1.2.3-beta)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500 disabled:text-gray-400"
                    placeholder="e.g., v1.0.1"
                />
                {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400">Version tag cannot be changed after creation.</p>}
            </div>
            <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Value / Content</label>
                <textarea
                    id="value"
                    rows={5}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter the asset content for this version..."
                />
            </div>
            <div>
                <label htmlFor="changeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Change Message (Optional)</label>
                <input
                    type="text"
                    id="changeMessage"
                    value={changeMessage}
                    onChange={(e) => setChangeMessage(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Describe the changes in this version..."
                />
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isEditing ? 'Save Changes' : 'Create Version'}
                </button>
            </div>
        </form>
    );
};

export default PromptAssetVersionForm; 