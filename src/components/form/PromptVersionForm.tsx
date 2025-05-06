import React, { useState, useEffect } from 'react';
import { PromptVersion, CreatePromptVersionDto, UpdatePromptVersionDto } from '@/services/api';

interface PromptVersionFormProps {
    initialData: PromptVersion | null;
    onSave: (payload: CreatePromptVersionDto | UpdatePromptVersionDto) => void;
    onCancel: () => void;
}

const PromptVersionForm: React.FC<PromptVersionFormProps> = ({ initialData, onSave, onCancel }) => {
    const [promptText, setPromptText] = useState('');
    const [versionTag, setVersionTag] = useState('v1.0.0');
    const [changeMessage, setChangeMessage] = useState('');
    // isActive is not in UpdateDto, might need a dedicated endpoint

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setPromptText(initialData.promptText || '');
            setVersionTag(initialData.versionTag || 'v1.0.0');
            setChangeMessage(initialData.changeMessage || '');
        } else {
            // Reset state
            setPromptText('');
            setVersionTag('v1.0.0');
            setChangeMessage('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreatePromptVersionDto | UpdatePromptVersionDto;

        if (isEditing) {
            payload = {
                promptText: promptText ? promptText : undefined,
                changeMessage: changeMessage ? changeMessage : undefined,
            } as UpdatePromptVersionDto;
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));

        } else {
            payload = {
                promptText,
                versionTag: versionTag || undefined,
                changeMessage: changeMessage || undefined,
                assetLinks: [],
            };

            if (!payload.versionTag) delete payload.versionTag;
            if (!payload.changeMessage) delete payload.changeMessage;

            payload = payload as CreatePromptVersionDto;

            if (!promptText) {
                alert("Prompt Text is required!");
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
                    disabled={isEditing} // Not editable
                    pattern="^v\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*)?(\\+[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*)?$"
                    title="Semantic Versioning format (e.g., v1.0.0, v1.2.3-beta)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt Text</label>
                <textarea
                    id="promptText"
                    rows={8} // More space for prompt text
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
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

            {/* isActive might need a separate control or a dedicated button/endpoint */}

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Version'}</button>
            </div>
        </form>
    );
};

export default PromptVersionForm; 