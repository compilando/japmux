import React, { useState, useEffect } from 'react';
import {
    PromptAssetTranslation,
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto
} from '@/services/api';

interface PromptAssetTranslationFormProps {
    initialData: PromptAssetTranslation | null;
    onSave: (payload: CreateAssetTranslationDto | UpdateAssetTranslationDto) => void;
    onCancel: () => void;
    // We might need versionId if the creation DTO requires it,
    // but the current API seems to handle it in the route
}

const PromptAssetTranslationForm: React.FC<PromptAssetTranslationFormProps> = ({ initialData, onSave, onCancel }) => {
    const [languageCode, setLanguageCode] = useState('');
    const [value, setValue] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setLanguageCode(initialData.languageCode || '');
            setValue(initialData.value || '');
        } else {
            // Reset form for creation
            setLanguageCode('');
            setValue('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        let payload: CreateAssetTranslationDto | UpdateAssetTranslationDto;

        if (isEditing) {
            payload = {
                value: value,
            } as UpdateAssetTranslationDto;
        } else {
            if (!languageCode) {
                // Ideally use a toast or better validation
                alert("Language Code is required for new translations.");
                return;
            }
            payload = {
                languageCode: languageCode,
                value: value,
            } as CreateAssetTranslationDto;
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language Code</label>
                <input
                    type="text"
                    id="languageCode"
                    value={languageCode}
                    onChange={(e) => setLanguageCode(e.target.value)}
                    required={!isEditing} // Required only when creating
                    disabled={isEditing} // Not editable after creation
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500 disabled:text-gray-400"
                    placeholder="e.g., es-ES, fr-FR, ja-JP"
                />
                {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400">Cannot be changed after creation.</p>}
            </div>
            <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Translated Value</label>
                <textarea
                    id="value"
                    rows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter the translated text for the asset..."
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Translation'}</button>
            </div>
        </form>
    );
};

export default PromptAssetTranslationForm; 