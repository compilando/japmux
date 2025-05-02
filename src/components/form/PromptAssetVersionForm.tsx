import React, { useState, useEffect } from 'react';
import { PromptAssetVersion, PromptAssetVersionCreatePayload, PromptAssetVersionUpdatePayload } from '@/services/api';

interface PromptAssetVersionFormProps {
    initialData: PromptAssetVersion | null;
    onSave: (payload: PromptAssetVersionCreatePayload | PromptAssetVersionUpdatePayload) => void;
    onCancel: () => void;
}

const PromptAssetVersionForm: React.FC<PromptAssetVersionFormProps> = ({ initialData, onSave, onCancel }) => {
    const [assetId, setAssetId] = useState(''); // asset key
    const [value, setValue] = useState('');
    const [versionTag, setVersionTag] = useState('v1.0.0');
    const [changeMessage, setChangeMessage] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setAssetId(initialData.assetId || '');
            setValue(initialData.value || '');
            setVersionTag(initialData.versionTag || 'v1.0.0'); // Mantener versión en edición
            setChangeMessage(initialData.changeMessage || '');
        } else {
            // Reset state
            setAssetId('');
            setValue('');
            setVersionTag('v1.0.0'); // Default para nueva versión
            setChangeMessage('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: PromptAssetVersionCreatePayload | PromptAssetVersionUpdatePayload;

        if (isEditing) {
            // Solo 'value' y 'changeMessage' son editables según UpdateDto
            payload = {
                value: value || undefined,
                changeMessage: changeMessage || undefined,
            } as PromptAssetVersionUpdatePayload;
        } else {
            payload = {
                assetId,
                value,
                versionTag: versionTag || undefined, // Permitir vacío si API lo maneja
                changeMessage: changeMessage || undefined,
            } as PromptAssetVersionCreatePayload;
            if (!assetId || !value) {
                alert("Asset ID (Key) and Value are required!");
                return;
            }
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset ID (Key)</label>
                <input
                    type="text"
                    id="assetId"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    required
                    disabled={isEditing} // No editable después de crear?
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="versionTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Version Tag</label>
                <input
                    type="text"
                    id="versionTag"
                    value={versionTag}
                    onChange={(e) => setVersionTag(e.target.value)}
                    required
                    disabled={isEditing} // No editable después de crear?
                    pattern="^v\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*)?(\\+[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*)?$"
                    title="Semantic Versioning format (e.g., v1.0.0, v1.2.3-beta)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
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
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Version'}</button>
            </div>
        </form>
    );
};

export default PromptAssetVersionForm; 