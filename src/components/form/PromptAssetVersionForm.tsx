import React, { useState, useEffect } from 'react';
import { PromptAssetVersion, CreatePromptAssetVersionDto, UpdatePromptAssetVersionDto } from '@/services/api';

interface PromptAssetVersionFormProps {
    initialData: PromptAssetVersion | null;
    onSave: (payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto) => void;
    onCancel: () => void;
}

const PromptAssetVersionForm: React.FC<PromptAssetVersionFormProps> = ({ initialData, onSave, onCancel }) => {
    const [value, setValue] = useState('');
    const [versionTag, setVersionTag] = useState('v1.0.0');
    const [changeMessage, setChangeMessage] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setValue(initialData.value || '');
            setVersionTag(initialData.versionTag || '');
            setChangeMessage(initialData.changeMessage || '');
        } else {
            setValue('');
            setVersionTag('v1.0.0');
            setChangeMessage('');
        }
    }, [initialData]);

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="versionTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Version Tag</label>
                <input
                    type="text"
                    id="versionTag"
                    value={versionTag}
                    onChange={(e) => setVersionTag(e.target.value)}
                    required
                    disabled={isEditing}
                    pattern="^v\d+\.\d+\.\d+(-[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)?(\+[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)?$"
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
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Version'}</button>
            </div>
        </form>
    );
};

export default PromptAssetVersionForm; 