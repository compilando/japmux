import React, { useState, useEffect } from 'react';
import { PromptAssetLink, PromptAssetLinkCreatePayload, PromptAssetLinkUpdatePayload } from '@/services/api';

interface PromptAssetLinkFormProps {
    initialData: PromptAssetLink | null;
    onSave: (payload: PromptAssetLinkCreatePayload | PromptAssetLinkUpdatePayload) => void;
    onCancel: () => void;
}

const PromptAssetLinkForm: React.FC<PromptAssetLinkFormProps> = ({ initialData, onSave, onCancel }) => {
    const [promptVersionId, setPromptVersionId] = useState('');
    const [assetVersionId, setAssetVersionId] = useState('');
    const [usageContext, setUsageContext] = useState('');
    const [position, setPosition] = useState<number>(0);
    const [insertionLogic, setInsertionLogic] = useState('');
    const [isRequired, setIsRequired] = useState(true);

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setPromptVersionId(initialData.promptVersionId || '');
            setAssetVersionId(initialData.assetVersionId || '');
            setUsageContext(initialData.usageContext || '');
            setPosition(initialData.position === undefined ? 0 : initialData.position);
            setInsertionLogic(initialData.insertionLogic || '');
            setIsRequired(initialData.isRequired === undefined ? true : initialData.isRequired);
        } else {
            // Reset state
            setPromptVersionId('');
            setAssetVersionId('');
            setUsageContext('');
            setPosition(0);
            setInsertionLogic('');
            setIsRequired(true);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: PromptAssetLinkCreatePayload | PromptAssetLinkUpdatePayload;

        if (isEditing) {
            payload = {
                usageContext: usageContext || undefined,
                position: position === 0 ? undefined : position, // Omitir si es 0?
                insertionLogic: insertionLogic || undefined,
                isRequired: isRequired,
            } as PromptAssetLinkUpdatePayload;
        } else {
            payload = {
                promptVersionId,
                assetVersionId,
                usageContext: usageContext || undefined,
                position: position === 0 ? undefined : position,
                insertionLogic: insertionLogic || undefined,
                isRequired: isRequired,
            } as PromptAssetLinkCreatePayload;
            // Basic validation example
            if (!promptVersionId || !assetVersionId) {
                alert("Prompt Version ID and Asset Version ID are required!");
                return;
            }
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="promptVersionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt Version ID</label>
                <input
                    type="text"
                    id="promptVersionId"
                    value={promptVersionId}
                    onChange={(e) => setPromptVersionId(e.target.value)}
                    required
                    disabled={isEditing} // No se puede cambiar la relación al editar
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="assetVersionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Version ID</label>
                <input
                    type="text"
                    id="assetVersionId"
                    value={assetVersionId}
                    onChange={(e) => setAssetVersionId(e.target.value)}
                    required
                    disabled={isEditing} // No se puede cambiar la relación al editar
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="usageContext" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usage Context (Optional)</label>
                <input
                    type="text"
                    id="usageContext"
                    value={usageContext}
                    onChange={(e) => setUsageContext(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position (Optional)</label>
                <input
                    type="number"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="insertionLogic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Insertion Logic (Optional)</label>
                <input
                    type="text"
                    id="insertionLogic"
                    value={insertionLogic}
                    onChange={(e) => setInsertionLogic(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div className="flex items-center">
                <input
                    id="isRequired"
                    name="isRequired"
                    type="checkbox"
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Is Required?
                </label>
            </div>

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Link'}</button>
            </div>
        </form>
    );
};

export default PromptAssetLinkForm; 