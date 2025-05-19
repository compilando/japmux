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
} from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import {
    DocumentDuplicateIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';
import PromptEditor from '../common/PromptEditor';

interface PromptFormProps {
    initialData?: CreatePromptDto | UpdatePromptDto;
    onSave: (data: CreatePromptDto | UpdatePromptDto) => Promise<void>;
    onCancel: () => void;
    projectId?: string;
}

interface FormData {
    name: string;
    description: string;
    promptText: string;
    projectId?: string;
    tenantId: string;
}

interface TagOption {
    value: string;
    label: string;
}

const PromptForm: React.FC<PromptFormProps> = ({ initialData, onSave, onCancel, projectId }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        promptText: '',
        projectId: projectId || '',
        tenantId: ''
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

    const isEditing = useMemo(() => !!(initialData && 'id' in initialData && initialData.id), [initialData]);

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
                    console.error('No se encontró un modelo GPT-4 en el proyecto');
                }
            } catch (error) {
                console.error('Error al cargar el modelo de IA:', error);
            }
        };

        fetchDefaultAiModel();
    }, [projectId]);

    useEffect(() => {
        console.log("[PromptForm Effect InitForm] Running. initialData:", initialData, "isEditing:", isEditing);
        if (initialData) {
            const data = initialData as any;
            setFormData({
                name: data.name || '',
                description: data.description || '',
                promptText: data.promptText || '',
                projectId: projectId || '',
                tenantId: data.tenantId || ''
            });

            let initialTagIds: string[] = [];
            if (isEditing) {
                console.log("[PromptForm Effect InitForm - EDITING] currentPromptData.tags:", data.tags);
                if (data.tags && Array.isArray(data.tags)) {
                    initialTagIds = (data.tags as TagDto[]).map(tag => tag.id).filter(id => id !== undefined) as string[];
                    console.log("[PromptForm Effect InitForm - EDITING] Extracted initialTagIds from PromptDto:", initialTagIds);
                } else {
                    console.log("[PromptForm Effect InitForm - EDITING] 'tags' not found or not an array in initialData (PromptDto).", data);
                }
            } else {
                if ('tags' in data && data.tags instanceof Set && data.tags.size > 0 && availableTags.length > 0) {
                    const initialTagNames = Array.from(data.tags as Set<string>);
                    initialTagIds = initialTagNames.map(tagName => availableTags.find(t => t.name === tagName)?.id)
                        .filter(id => id !== undefined) as string[];
                    console.log("[PromptForm Effect InitForm - CREATION] Mapped tag names to IDs:", initialTagIds);
                }
            }
            setSelectedTagIds(initialTagIds);

        } else {
            console.log("[PromptForm Effect InitForm] No initialData. Resetting form fields for creation.");
            setFormData({
                name: '',
                description: '',
                promptText: '',
                projectId: projectId || '',
                tenantId: ''
            });
            setSelectedTagIds([]);
        }
    }, [initialData, availableTags, isEditing]);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!projectId) return;
            try {
                const assetsData = await promptAssetService.findAll(projectId, (initialData as any)?.id || '');
                setAssets(assetsData);
            } catch (error) {
                console.error('Error loading assets:', error);
            }
        };

        fetchAssets();
    }, [projectId, initialData]);

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
        if (!formData.name || !formData.promptText) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (initialData) {
                const updateData = {
                    description: formData.description,
                    promptText: formData.promptText
                } as UpdatePromptDto;
                await onSave(updateData);
            } else {
                const createData: CreatePromptDto = {
                    name: formData.name,
                    description: formData.description,
                    promptText: formData.promptText,
                    tenantId: formData.tenantId || ''
                };
                await onSave(createData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving the prompt.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

            const response = await rawExecutionService.executeRaw(payload);

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
                    <div>
                        <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Prompt Text *
                        </label>

                        <PromptEditor
                            value={formData.promptText}
                            onChange={handlePromptTextChange}
                            placeholder="Enter the prompt text here..."
                            rows={26}
                            assets={assets}
                            showHistory={true}
                        />
                    </div>
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
                    {isLoading ? 'Saving...' : (initialData ? 'Update Prompt' : 'Create Prompt')}
                </button>
            </div>
        </form>
    );
};

export default PromptForm; 