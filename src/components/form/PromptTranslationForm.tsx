import React, { useState, useEffect } from 'react';
import { CreatePromptTranslationDto, UpdatePromptTranslationDto, regionService, rawExecutionService, aiModelService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { CreateRegionDto } from '@/services/generated/api';
import {
    LanguageIcon,
    DocumentDuplicateIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import PromptEditor from '../common/PromptEditor';
import InsertReferenceButton from '../common/InsertReferenceButton';

interface PromptTranslationFormProps {
    initialData: CreatePromptTranslationDto | null;
    versionId?: string;
    onSave: (payload: CreatePromptTranslationDto | UpdatePromptTranslationDto) => void;
    onCancel: () => void;
    versionText: string;
    availableLanguages: { code: string; name: string }[];
    isEditing: boolean;
    versionTag?: string;
    originalVersionLanguageCode?: string | null;
}

const PromptTranslationForm: React.FC<PromptTranslationFormProps> = ({
    initialData,
    versionId,
    onSave,
    onCancel,
    versionText,
    availableLanguages,
    isEditing,
    versionTag,
    originalVersionLanguageCode
}) => {
    const [formData, setFormData] = useState<CreatePromptTranslationDto>({
        languageCode: initialData?.languageCode || '',
        promptText: initialData?.promptText || ''
    });
    const [loadingRegions, setLoadingRegions] = useState<boolean>(false);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [defaultAiModelId, setDefaultAiModelId] = useState<string | null>(null);
    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    useEffect(() => {
        // Populate form data when initialData or isEditing changes
        setFormData({
            languageCode: initialData?.languageCode || '',
            promptText: initialData?.promptText || ''
        });
        if (!isEditing && availableLanguages && availableLanguages.length > 0 && !initialData?.languageCode) {
            setFormData(prev => ({ ...prev, languageCode: availableLanguages[0].code }));
        }
    }, [initialData, isEditing, availableLanguages, versionId]);

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
                if (gpt4Model) {
                    setDefaultAiModelId(gpt4Model.id);
                } else {
                    console.warn('Default GPT-4 model not found in project.');
                }
            } catch (error) {
                console.error('Error fetching regions or AI model:', error);
                // Optionally set an error state to inform the user
            } finally {
                setLoadingRegions(false);
            }
        };

        fetchRegionsAndModel();
    }, [selectedProjectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.languageCode || !formData.promptText) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!versionId && !isEditing) {
            setError('Version ID is required for new translations.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (isEditing && initialData) {
                await onSave({ promptText: formData.promptText } as UpdatePromptTranslationDto);
            } else {
                // Para nuevas traducciones, usamos solo formData sin versionId
                const payload = {
                    ...formData
                };
                await onSave(payload);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving the translation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, languageCode: e.target.value, promptText: '' }));
    };

    const handleTextChange = (newText: string) => {
        setFormData(prev => ({ ...prev, promptText: newText }));
    };

    const handleTranslate = async () => {
        if (!formData.languageCode || !versionText || !selectedProjectId || !defaultAiModelId) {
            console.error('Missing required data for translation:', {
                languageCode: formData.languageCode,
                originalText: versionText,
                projectId: selectedProjectId,
                modelId: defaultAiModelId
            });
            alert('Cannot translate. Missing language, original text, project selection, or AI model configuration.');
            return;
        }

        const selectedRegion = regionList.find(region => region.languageCode === formData.languageCode);
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
                variables: {
                    text: versionText,
                    targetLanguage: formData.languageCode,
                    regionName: selectedRegion.name
                }
            };

            const result = await rawExecutionService.execute(executionDto);

            if (result && typeof result === 'object' && 'response' in result) {
                const resultWithResponse = result as { response: any };
                if (typeof resultWithResponse.response === 'string') {
                    const cleanResponse = resultWithResponse.response
                        .replace(/```json\n?/g, '')  // Remove opening ```json
                        .replace(/```\n?/g, '')      // Remove closing ```
                        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')  // Remove control characters
                        .trim();

                    const parsedResponse = JSON.parse(cleanResponse);
                    if (parsedResponse && typeof parsedResponse === 'object' && 'translatedText' in parsedResponse) {
                        const translatedText = String(parsedResponse.translatedText)
                            .replace(/\\n/g, '\n')  // Replace literal \n with actual newlines
                            .replace(/\\r/g, '')    // Remove \r
                            .replace(/\\t/g, '    '); // Replace \t with 4 spaces
                        setFormData(prev => ({ ...prev, promptText: translatedText }));
                    } else {
                        throw new Error('Response does not contain translatedText or is in incorrect format.');
                    }
                } else {
                    throw new Error('Translation response format is not a JSON string as expected.');
                }
            } else {
                throw new Error('No valid response or expected format from translation service.');
            }
        } catch (error) {
            console.error('Error during translation:', error);
            alert(`Error performing automatic translation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <LanguageIcon className="w-6 h-6 text-brand-500" />
                    {isEditing ? 'Edit Translation' : 'Add New Translation'}
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {error && (
                    <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left Column: Original Text */}
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center flex-wrap gap-x-2 gap-y-1">
                                <DocumentDuplicateIcon className="w-5 h-5 mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <span className="flex-shrink-0">Original Prompt Text {versionTag && `(Version: ${versionTag})`}</span>
                                {originalVersionLanguageCode && (
                                    <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-xs" title={`Original Language: ${originalVersionLanguageCode}`}>
                                        <img
                                            src={(() => {
                                                const langParts = originalVersionLanguageCode.split('-');
                                                const countryOrLangCode = langParts.length > 1 ? langParts[1].toLowerCase() : langParts[0].toLowerCase();
                                                return countryOrLangCode.length === 2 ? `https://flagcdn.com/16x12/${countryOrLangCode}.png` : `https://flagcdn.com/16x12/xx.png`;
                                            })()}
                                            alt={`${originalVersionLanguageCode} flag`}
                                            className="w-4 h-3 object-cover rounded-sm border border-gray-300 dark:border-gray-500"
                                            onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://flagcdn.com/16x12/xx.png'; t.onerror = null; }}
                                        />
                                        <span className="font-medium text-gray-600 dark:text-gray-300">{originalVersionLanguageCode.toUpperCase()}</span>
                                    </div>
                                )}
                            </h4>
                            <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono bg-[#343541] p-4 rounded-lg border border-gray-700 max-h-110 overflow-y-auto">
                                {versionText || "Original prompt text will appear here."}
                            </pre>
                        </div>
                    </div>

                    {/* Right Column: Translation Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Language for Translation
                            </label>
                            <div className="flex items-center gap-2">
                                <select
                                    id="language"
                                    value={formData.languageCode}
                                    onChange={handleLanguageChange}
                                    disabled={isEditing || loadingRegions}
                                    className="flex-grow w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value="">{isEditing && initialData?.languageCode ? initialData.languageCode : (availableLanguages.length === 0 && !loadingRegions ? "No languages available" : "Select a language")}</option>
                                    {!isEditing && availableLanguages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name} ({lang.code})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleTranslate}
                                    disabled={isTranslating || loadingRegions || !formData.languageCode || !defaultAiModelId || isEditing}
                                    title={!defaultAiModelId ? "AI Model for translation not configured" : (isEditing ? "Auto-translate available for new translations only" : "Auto-translate using AI")}
                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center shrink-0"
                                >
                                    {isTranslating ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <ChevronDoubleRightIcon className="w-5 h-5" />
                                    )}
                                    <span className="ml-1 hidden sm:inline">{isTranslating ? 'Translating...' : 'Translate'}</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="translation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Translated Text
                            </label>

                            <PromptEditor
                                value={formData.promptText}
                                onChange={handleTextChange}
                                placeholder="Enter translated text here or use auto-translate..."
                                rows={18}
                                assets={[]}
                                showHistory={true}
                                className="font-mono"
                                extraToolbarButtons={
                                    <div className="flex gap-2">
                                        <InsertReferenceButton
                                            projectId={selectedProjectId || ''}
                                            type="prompt"
                                            currentPromptId={versionId || ''}
                                            onInsert={(text) => {
                                                setFormData(prev => ({ ...prev, promptText: prev.promptText + text }));
                                            }}
                                        />
                                        <InsertReferenceButton
                                            projectId={selectedProjectId || ''}
                                            type="asset"
                                            currentPromptId={versionId || ''}
                                            onInsert={(text) => {
                                                setFormData(prev => ({ ...prev, promptText: prev.promptText + text }));
                                            }}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Translation' : 'Save Translation')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromptTranslationForm; 