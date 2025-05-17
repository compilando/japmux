import React, { useState, useEffect } from 'react';
import { CreatePromptTranslationDto, UpdatePromptTranslationDto, regionService, rawExecutionService, aiModelService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { CreateRegionDto } from '@/services/generated/api';
import { LanguageIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface PromptTranslationFormProps {
    initialData: CreatePromptTranslationDto | null;
    versionId?: string;
    onSave: (payload: CreatePromptTranslationDto | UpdatePromptTranslationDto) => void;
    onCancel: () => void;
    versionText: string;
    availableLanguages: { code: string; name: string }[];
    isEditing: boolean;
}

const PromptTranslationForm: React.FC<PromptTranslationFormProps> = ({
    initialData,
    versionId,
    onSave,
    onCancel,
    versionText,
    availableLanguages,
    isEditing
}) => {
    const [formData, setFormData] = useState<CreatePromptTranslationDto>({
        versionId: versionId || '',
        languageCode: initialData?.languageCode || '',
        promptText: initialData?.promptText || ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.languageCode || !formData.promptText) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await onSave(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving the translation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, languageCode: e.target.value }));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, promptText: e.target.value }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <LanguageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    {isEditing ? 'Edit Translation' : 'Add New Translation'}
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Language
                        </label>
                        <select
                            id="language"
                            value={formData.languageCode}
                            onChange={handleLanguageChange}
                            disabled={isEditing}
                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        >
                            <option value="">Select a language</option>
                            {availableLanguages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name} ({lang.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="translation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Translation
                        </label>
                        <textarea
                            id="translation"
                            value={formData.promptText}
                            onChange={handleTextChange}
                            rows={6}
                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            required
                        />
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <DocumentDuplicateIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Text</h4>
                        </div>
                        <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                            {versionText}
                        </pre>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Translation'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromptTranslationForm; 