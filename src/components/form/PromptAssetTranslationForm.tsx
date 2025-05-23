import React, { useState, useEffect } from 'react';
import {
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
    regionService,
    rawExecutionService,
    aiModelService,
    CreateRegionDto
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { LanguageIcon, DocumentDuplicateIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

// Definir el tipo localmente ya que no está exportado desde api
// No es necesario si CreateAssetTranslationDto y UpdateAssetTranslationDto son suficientes
// interface PromptAssetTranslation {
//     languageCode: string;
//     value: string;
// }

interface PromptAssetTranslationFormProps {
    initialData: (CreateAssetTranslationDto & { id?: string }) | (UpdateAssetTranslationDto & { languageCode: string; id?: string }) | null;
    onSave: (payload: CreateAssetTranslationDto | UpdateAssetTranslationDto) => void;
    onCancel: () => void;
    versionText: string;
    availableLanguages?: { code: string; name: string }[];
    isEditing?: boolean;
}

const PromptAssetTranslationForm: React.FC<PromptAssetTranslationFormProps> = ({
    initialData,
    onSave,
    onCancel,
    versionText,
    availableLanguages,
    isEditing
}) => {
    const [languageCode, setLanguageCode] = useState<string>(initialData?.languageCode || '');
    const [value, setValue] = useState<string>(initialData?.value || '');

    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState<boolean>(true);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [defaultAiModelId, setDefaultAiModelId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    useEffect(() => {
        setLanguageCode(initialData?.languageCode || (isEditing ? '' : (availableLanguages?.[0]?.code || '')));
        setValue(initialData?.value || '');
    }, [initialData, isEditing, availableLanguages]);

    useEffect(() => {
        const fetchRegionsAndModel = async () => {
            if (!selectedProjectId) {
                setLoadingRegions(false);
                return;
            }
            setLoadingRegions(true);
            try {
                const regions = await regionService.findAll(selectedProjectId);
                setRegionList(regions);
                const models = await aiModelService.findAll(selectedProjectId);
                const gpt4Model = models.find(model => model.name.toLowerCase().includes('gpt-4'));
                if (gpt4Model) setDefaultAiModelId(gpt4Model.id);
                else console.warn('Default GPT-4 model not found in project for asset translation.');
            } catch (err) {
                console.error('Error fetching regions or AI model for asset translation:', err);
            } finally {
                setLoadingRegions(false);
            }
        };
        fetchRegionsAndModel();
    }, [selectedProjectId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!languageCode || !value) {
            setError('Language and translated value are required.');
            return;
        }
        setIsLoading(true);
        setError(null);
        let payload: CreateAssetTranslationDto | UpdateAssetTranslationDto;
        if (isEditing && initialData) {
            payload = { value } as UpdateAssetTranslationDto;
        } else {
            payload = { languageCode, value } as CreateAssetTranslationDto;
        }
        try {
            await onSave(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving the asset translation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = async () => {
        if (!languageCode || !versionText || !selectedProjectId || !defaultAiModelId) {
            alert('Cannot translate. Missing language, original text, project selection, or AI model configuration.');
            return;
        }
        const selectedRegion = regionList.find(region => region.languageCode === languageCode);
        if (!selectedRegion) {
            alert('Selected language region details not found.');
            return;
        }
        setIsTranslating(true);
        try {
            const executionDto = {
                userText: versionText,
                systemPromptName: 'prompt-translator',
                aiModelId: defaultAiModelId,
                variables: { text: versionText, targetLanguage: languageCode, regionName: selectedRegion.name }
            };
            const result = await rawExecutionService.execute(executionDto);
            if (result && typeof result === 'object' && 'response' in result) {
                const resultWithResponse = result as { response: any };
                if (typeof resultWithResponse.response === 'string') {
                    const cleanResponse = resultWithResponse.response.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                    const parsedResponse = JSON.parse(cleanResponse);
                    if (parsedResponse && typeof parsedResponse === 'object' && 'translatedText' in parsedResponse) {
                        const translatedText = String(parsedResponse.translatedText).replace(/\\n/g, '\n');
                        setValue(translatedText);
                    } else throw new Error('Response does not contain translatedText or is in incorrect format.');
                } else throw new Error('Translation response format is not a JSON string as expected.');
            } else throw new Error('No valid response or expected format from translation service.');
        } catch (err) {
            console.error('Error during asset translation:', err);
            alert(`Error performing automatic translation: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <LanguageIcon className="w-6 h-6 text-brand-500" />
                    {isEditing ? 'Edit Asset Translation' : 'Add New Asset Translation'}
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {error && (
                    <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Original Asset Value (to be translated)
                        </label>
                        <div className="bg-[#343541] text-gray-100 p-4 rounded-lg border border-gray-600 dark:border-gray-500 h-full min-h-[200px] max-h-[400px] overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                                {versionText}
                            </pre>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="languageCodeAsset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Language for Translation
                            </label>
                            <div className="flex items-center gap-2">
                                <select
                                    id="languageCodeAsset"
                                    value={languageCode}
                                    onChange={(e) => setLanguageCode(e.target.value)}
                                    disabled={isEditing || loadingRegions}
                                    className="flex-grow w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value="">{isEditing && languageCode ? languageCode : (availableLanguages && availableLanguages.length === 0 && !loadingRegions ? "No languages available" : "Select a language")}</option>
                                    {!isEditing && availableLanguages && availableLanguages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name} ({lang.code})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleTranslate}
                                    disabled={isTranslating || loadingRegions || !languageCode || !defaultAiModelId}
                                    title={!defaultAiModelId ? "AI Model for translation not configured" : "Auto-translate using AI"}
                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center"
                                >
                                    <ChevronDoubleRightIcon className="w-5 h-5 mr-1" />
                                    {isTranslating ? 'Translating...' : 'Auto-translate'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="valueAsset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Translated Asset Value
                            </label>
                            <textarea
                                id="valueAsset"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                rows={8}
                                className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"
                                placeholder="Enter translated asset value here or use auto-translate..."
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || isTranslating}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Asset Translation')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromptAssetTranslationForm; 