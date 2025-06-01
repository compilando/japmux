import React, { useState, useEffect, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import {
    CreatePromptDto,
    UpdatePromptDto,
    TagDto,
    PromptDto,
    tagService,
    rawExecutionService,
    ExecuteRawDto,
    aiModelService,
    promptAssetService,
    regionService,
} from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import {
    DocumentDuplicateIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';
import PromptEditor from '../common/PromptEditor';
import * as generated from '@/services/generated/api';
import InsertReferenceButton from '../common/InsertReferenceButton';
import { promptTypes, getPromptTypeByValue } from '@/config/promptTypes';
import { CreateRegionDto } from '@/services/generated/api';

interface PromptFormProps {
    initialData?: CreatePromptDto | UpdatePromptDto;
    projectId: string;
    isEditing?: boolean;
    onCreate: (promptPayload: Omit<CreatePromptDto, 'tenantId'>) => Promise<void>;
    onUpdate: (promptPayload: UpdatePromptDto) => Promise<void>;
    onCancel: () => void;
}

interface FormData {
    name: string;
    description: string;
    promptText: string;
    projectId: string;
    type: string;
    languageCode: string;
}

interface TagOption {
    value: string;
    label: string;
}

const PromptForm: React.FC<PromptFormProps> = ({ initialData, onCreate, onUpdate, onCancel, projectId, isEditing = false }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        promptText: '',
        projectId: projectId,
        type: 'GENERAL',
        languageCode: ''
    });
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();
    const [availableTags, setAvailableTags] = useState<TagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [isImproving, setIsImproving] = useState(false);
    const [defaultAiModelId, setDefaultAiModelId] = useState<string>('');
    const [regions, setRegions] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);

    useEffect(() => {
        console.log("[PromptForm Effect FetchTags] Fetching tags for projectId:", projectId);
        if (projectId) {
            setIsLoadingTags(true);
            tagService.findAll(projectId)
                .then(fetchedTags => {
                    console.log('[PromptForm Effect FetchTags] Fetched tags:', fetchedTags);
                    setAvailableTags(fetchedTags);
                })
                .catch(error => {
                    console.error("[PromptForm Effect FetchTags] Error fetching tags:", error);
                    showErrorToast("Failed to load tags.");
                })
                .finally(() => setIsLoadingTags(false));
        }
    }, [projectId]);

    useEffect(() => {
        const fetchDefaultAiModel = async () => {
            if (!projectId) return;
            try {
                const models = await aiModelService.findAll(projectId);
                const gpt4Model = models.find(model => model.name.toLowerCase().includes('gpt-4'));
                if (gpt4Model) {
                    setDefaultAiModelId(gpt4Model.id);
                } else {
                    console.error('No GPT-4 model found in project configuration');
                }
            } catch (error) {
                console.error('Error loading AI model:', error);
            }
        };

        fetchDefaultAiModel();
    }, [projectId]);

    useEffect(() => {
        console.log("[PromptForm Effect InitForm] Running. initialData:", initialData, "isEditing:", isEditing);
        if (initialData) {
            const data = initialData as any;
            setFormData(prev => ({
                ...prev,
                name: data.name || '',
                description: data.description || '',
                promptText: data.promptText || '',
                projectId: projectId,
                type: data.type?.value || data.type || 'GENERAL',
                languageCode: data.languageCode || ''
            }));

            let initialTagIds: string[] = [];
            if (isEditing) {
                console.log("[PromptForm Effect InitForm - EDITING] currentPromptData.tags:", data.tags);
                if (data.tags && Array.isArray(data.tags)) {
                    initialTagIds = data.tags.map((tag: any) => tag.id);
                }
            }
            setSelectedTagIds(initialTagIds);
        } else {
            setFormData({
                name: '',
                description: '',
                promptText: '',
                projectId: projectId,
                type: 'GENERAL',
                languageCode: ''
            });
            setSelectedTagIds([]);
        }
    }, [initialData, availableTags, isEditing, projectId]);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!projectId || !isEditing || !(initialData as any)?.id) return;
            try {
                const assetsData = await promptAssetService.findAll(projectId, (initialData as any).id);
                setAssets(assetsData);
            } catch (error) {
                console.error('Error loading assets:', error);
            }
        };

        fetchAssets();
    }, [projectId, initialData, isEditing]);

    useEffect(() => {
        const fetchRegions = async () => {
            if (!projectId) return;
            setLoadingRegions(true);
            try {
                const regionsData = await regionService.findAll(projectId);
                console.log('[PromptForm fetchRegions] Loaded regions:', regionsData);
                setRegions(regionsData);

                // Solo establecer el languageCode por defecto cuando no estemos editando
                if (!isEditing && regionsData.length > 0) {
                    const defaultLanguageCode = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE_CODE || 'en-US';
                    console.log('[PromptForm fetchRegions] Default language from env:', defaultLanguageCode);

                    const hasDefaultRegion = regionsData.some(region => region.languageCode === defaultLanguageCode);
                    console.log('[PromptForm fetchRegions] Has default region:', hasDefaultRegion);

                    const newLanguageCode = hasDefaultRegion
                        ? defaultLanguageCode
                        : regionsData[0].languageCode;

                    console.log('[PromptForm fetchRegions] Setting languageCode to:', newLanguageCode);

                    setFormData(prev => {
                        console.log('[PromptForm fetchRegions] Current languageCode:', prev.languageCode);
                        return { ...prev, languageCode: newLanguageCode };
                    });
                }
            } catch (error) {
                console.error('Error loading regions:', error);
                // Solo establecer fallback si no estamos editando
                if (!isEditing) {
                    setFormData(prev => ({
                        ...prev,
                        languageCode: 'en-US'
                    }));
                }
            } finally {
                setLoadingRegions(false);
            }
        };

        // Ejecutar inmediatamente
        fetchRegions();
    }, [projectId, isEditing]);

    // Efecto adicional para establecer languageCode cuando las regiones cambien
    useEffect(() => {
        if (!isEditing && regions.length > 0 && !formData.languageCode) {
            const defaultLanguageCode = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE_CODE || 'en-US';
            const hasDefaultRegion = regions.some(region => region.languageCode === defaultLanguageCode);
            const newLanguageCode = hasDefaultRegion ? defaultLanguageCode : regions[0].languageCode;

            console.log('[PromptForm useEffect regions] Setting languageCode to:', newLanguageCode);
            setFormData(prev => ({ ...prev, languageCode: newLanguageCode }));
        }
    }, [regions, isEditing, formData.languageCode]);

    const handleTagSelectChange = (selectedOptions: MultiValue<TagOption>) => {
        const newIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        console.log("[PromptForm handleTagSelectChange] New selected IDs:", newIds);
        setSelectedTagIds(newIds);
    };

    const tagOptions: TagOption[] = useMemo(() => {
        console.log("[PromptForm Memo tagOptions] Recalculating. availableTags:", availableTags);
        const options = availableTags.map(tag => ({
            value: tag.id,
            label: tag.name,
        }));
        console.log("[PromptForm Memo tagOptions] Calculated options:", options);
        return options;
    }, [availableTags]);

    const currentSelectedTagOptions = useMemo(() => {
        console.log("[PromptForm Memo currentSelectedTagOptions] Recalculating. tagOptions:", tagOptions, "selectedTagIds:", selectedTagIds);
        const selected = tagOptions.filter(option => selectedTagIds.includes(option.value));
        console.log("[PromptForm Memo currentSelectedTagOptions] Calculated selected options for Select component:", selected);
        return selected;
    }, [tagOptions, selectedTagIds]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        console.log('[PromptForm handleSubmit] Current formData:', formData);
        console.log('[PromptForm handleSubmit] languageCode:', formData.languageCode, 'length:', formData.languageCode.length);

        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        if (!isEditing && !formData.promptText.trim()) {
            setError('Prompt text is required');
            return;
        }

        if (!isEditing && (!formData.languageCode || formData.languageCode.length < 2)) {
            // Intentar establecer un languageCode por defecto si no hay uno
            if (regions.length > 0) {
                const defaultLanguageCode = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE_CODE || 'en-US';
                const hasDefaultRegion = regions.some(region => region.languageCode === defaultLanguageCode);
                const fallbackLanguageCode = hasDefaultRegion ? defaultLanguageCode : regions[0].languageCode;

                console.log('[PromptForm handleSubmit] Setting fallback languageCode:', fallbackLanguageCode);
                setFormData(prev => ({ ...prev, languageCode: fallbackLanguageCode }));
                setError('Language code has been set automatically. Please submit again.');
                return;
            } else {
                setError('Language code is required and must be at least 2 characters long');
                return;
            }
        }

        try {
            if (isEditing) {
                const updateData: UpdatePromptDto = {
                    description: formData.description
                };
                await onUpdate(updateData);
            } else {
                const createData: any = {
                    name: formData.name,
                    type: { value: formData.type },
                    description: formData.description,
                    promptText: formData.promptText,
                    languageCode: formData.languageCode,
                    tags: selectedTagIds.length > 0 ? new Set(selectedTagIds) : undefined,
                };
                await onCreate(createData);
            }
        } catch (err) {
            console.error('Error saving prompt:', err);
            setError('Error saving prompt');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePromptTextChange = (newText: string) => {
        setFormData(prev => ({ ...prev, promptText: newText }));
    };

    const handleImprovePrompt = async () => {
        if (!formData.promptText.trim()) {
            showErrorToast("Please write a prompt to improve.");
            return;
        }

        if (!defaultAiModelId) {
            showErrorToast("No GPT-4 model found in the project configuration.");
            return;
        }

        setIsImproving(true);
        try {
            const payload: ExecuteRawDto & { variables?: Record<string, string> } = {
                userText: formData.promptText,
                systemPromptName: "prompt-improver",
                aiModelId: defaultAiModelId,
                variables: {
                    text: formData.promptText
                }
            };

            const response = await rawExecutionService.execute(payload);

            if (response && typeof response === 'object' && 'response' in response && response.response) {
                setFormData(prev => ({ ...prev, promptText: response.response as string }));
                showSuccessToast("Prompt improved successfully.");
            } else {
                console.error("Invalid response format:", response);
                showErrorToast("Failed to improve prompt. Please try again.");
            }
        } catch (error) {
            console.error("Error improving prompt:", error);
            showErrorToast("Error improving prompt. Please try again.");
        } finally {
            setIsImproving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Basic Information */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Enter prompt name"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Type *
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {promptTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label} - {type.description}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Selecciona el tipo que mejor describe el propósito de este prompt
                        </p>
                    </div>

                    {!isEditing && (
                        <div>
                            <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Language Code *
                            </label>
                            <select
                                id="languageCode"
                                name="languageCode"
                                value={formData.languageCode}
                                onChange={handleInputChange}
                                required
                                disabled={loadingRegions}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-500"
                            >
                                {loadingRegions ? (
                                    <option value={formData.languageCode || 'en-US'}>Cargando regiones...</option>
                                ) : regions.length === 0 ? (
                                    <option value="en-US">en-US (default)</option>
                                ) : (
                                    <>
                                        {!regions.some(region => region.languageCode === formData.languageCode) && formData.languageCode && (
                                            <option value={formData.languageCode}>{formData.languageCode} (actual)</option>
                                        )}
                                        {regions.map((region) => (
                                            <option key={region.languageCode} value={region.languageCode}>
                                                {region.languageCode} - {region.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Selecciona el idioma base para la primera versión del prompt
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Enter prompt description"
                        />
                    </div>
                </div>

                {/* Right Column: Prompt Text */}
                <div className="space-y-4">
                    {!isEditing && (
                        <div>
                            <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Prompt Text
                            </label>
                            <div className="mt-1">
                                <PromptEditor
                                    value={formData.promptText}
                                    onChange={handlePromptTextChange}
                                    placeholder="Enter your prompt text here..."
                                    assets={assets}
                                    extraToolbarButtons={
                                        <div className="flex gap-2">
                                            <InsertReferenceButton
                                                projectId={projectId}
                                                type="prompt"
                                                currentPromptId={isEditing ? (initialData as any)?.id : undefined}
                                                onInsert={(text) => {
                                                    const newText = formData.promptText + text;
                                                    setFormData(prev => ({ ...prev, promptText: newText }));
                                                }}
                                            />
                                            <InsertReferenceButton
                                                projectId={projectId}
                                                type="asset"
                                                currentPromptId={isEditing ? (initialData as any)?.id : undefined}
                                                onInsert={(text) => {
                                                    const newText = formData.promptText + text;
                                                    setFormData(prev => ({ ...prev, promptText: newText }));
                                                }}
                                            />
                                        </div>
                                    }
                                />
                            </div>
                            <div className="mt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleImprovePrompt}
                                    disabled={isImproving || !formData.promptText.trim()}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isImproving ? 'Improving...' : 'Improve Prompt'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : (isEditing ? 'Update Prompt' : 'Create Prompt')}
                </button>
            </div>
        </form>
    );
};

export default PromptForm; 