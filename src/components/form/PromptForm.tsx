import React, { useState, useEffect, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { CreatePromptDto, UpdatePromptDto, tagService, CreateTagDto } from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import GeneratePromptModal from '@/components/modal/GeneratePromptModal';

interface PromptFormProps {
    initialData: CreatePromptDto | null;
    onSave: (payload: CreatePromptDto | UpdatePromptDto) => void;
    onCancel: () => void;
    projectId: string;
}

interface TagOption {
    value: string;
    label: string;
}

const PromptForm: React.FC<PromptFormProps> = ({ initialData, onSave, onCancel, projectId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
    const [promptText, setPromptText] = useState('');
    const [availableTags, setAvailableTags] = useState<CreateTagDto[]>([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    const isEditing = !!initialData;

    useEffect(() => {
        if (!projectId) {
            console.warn("[PromptForm Effect FetchTags] No projectId provided.");
            setAvailableTags([]);
            setLoadingTags(false);
            return;
        }

        const fetchTags = async () => {
            setLoadingTags(true);
            try {
                const fetchedTags = await tagService.findAll(projectId);
                setAvailableTags(fetchedTags as CreateTagDto[]);
                console.log('[PromptForm Effect FetchTags] availableTags set:', fetchedTags);
            } catch (error) {
                console.error("[PromptForm Effect FetchTags] Failed to fetch tags:", error);
                setAvailableTags([]);
            } finally {
                setLoadingTags(false);
            }
        };
        fetchTags();
    }, [projectId]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPromptText(initialData.promptText || '');
            setSelectedTagNames(Array.from(initialData.tags || []));
        } else {
            setName('');
            setDescription('');
            setSelectedTagNames([]);
            setPromptText('');
        }
    }, [initialData]);

    const handleGenerateComplete = (generatedText: string) => {
        setPromptText(generatedText);
        setIsGenerateModalOpen(false);
        showSuccessToast("Prompt text updated from generator.");
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreatePromptDto | UpdatePromptDto;

        if (isEditing) {
            payload = {
                description: description || undefined,
                tags: new Set(selectedTagNames),
                tacticId: initialData?.tacticId,
            };
            if (Object.keys(payload).length === 0) {
                showErrorToast("No changes detected to save.");
                return;
            }
        } else {
            if (!promptText) {
                showErrorToast("Please enter or generate the prompt text before creating.");
                return;
            }
            payload = {
                name,
                promptText: promptText,
                description: description || undefined,
                tags: new Set(selectedTagNames),
                tacticId: undefined,
            };
        }
        console.log('[PromptForm] Saving payload:', payload);
        onSave(payload);
    };

    const handleTagSelectChange = (selectedOptions: MultiValue<TagOption>) => {
        const newSelectedNames = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedTagNames(newSelectedNames);
    };

    const tagOptions: TagOption[] = useMemo(() => {
        console.log('[PromptForm Memo tagOptions] Recalculating based on availableTags:', availableTags);
        return availableTags.map(tag => ({
            value: tag.name,
            label: tag.name
        }));
    }, [availableTags]);

    const currentSelectedTagOptions: TagOption[] = useMemo(() => {
        console.log('[PromptForm Memo currentSelectedTags] Recalculating. Deps - selectedTagNames:', selectedTagNames, 'tagOptions:', tagOptions);
        const selected = tagOptions.filter(option =>
            selectedTagNames.includes(option.value)
        );
        console.log('[PromptForm Memo currentSelectedTags] Calculated value:', selected);
        return selected;
    }, [tagOptions, selectedTagNames]);

    const selectStyles = {
        control: (baseStyles: any, state: any) => ({
            ...baseStyles,
            backgroundColor: 'rgb(55 65 81 / var(--tw-bg-opacity, 1))',
            borderColor: state.isFocused ? 'rgb(99 102 241 / var(--tw-border-opacity, 1))' : 'rgb(75 85 99 / var(--tw-border-opacity, 1))',
            boxShadow: state.isFocused ? '0 0 0 1px rgb(99 102 241 / var(--tw-ring-opacity, 1))' : baseStyles.boxShadow,
            '&:hover': {
                borderColor: 'rgb(99 102 241 / var(--tw-border-opacity, 1))'
            }
        }),
        menu: (baseStyles: any) => ({
            ...baseStyles,
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))'
        }),
        option: (baseStyles: any, state: any) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? 'rgb(55 65 81 / var(--tw-bg-opacity, 1))' : undefined,
            color: 'rgb(209 213 219 / var(--tw-text-opacity, 1))',
            ":active": {
                backgroundColor: 'rgb(75 85 99 / var(--tw-bg-opacity, 1))'
            },
        }),
        input: (baseStyles: any) => ({
            ...baseStyles,
            color: 'rgb(209 213 219 / var(--tw-text-opacity, 1))'
        }),
        multiValue: (baseStyles: any) => ({
            ...baseStyles,
            backgroundColor: 'rgb(75 85 99 / var(--tw-bg-opacity, 1))'
        }),
        multiValueLabel: (baseStyles: any) => ({
            ...baseStyles,
            color: 'rgb(229 231 235 / var(--tw-text-opacity, 1))'
        }),
        multiValueRemove: (baseStyles: any) => ({
            ...baseStyles,
            color: 'rgb(229 231 235 / var(--tw-text-opacity, 1))',
            ':hover': {
                backgroundColor: 'rgb(156 163 175 / var(--tw-bg-opacity, 1))',
                color: 'rgb(17 24 39 / var(--tw-text-opacity, 1))'
            }
        }),
    };

    console.log(`[PromptForm Render] Rendering. Props for Select -> isLoading: ${loadingTags}, value:`, currentSelectedTagOptions, 'options:', tagOptions);

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name (ID)</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isEditing}
                        pattern="^[a-z0-9_\-]+$"
                        title="Only lowercase letters, numbers, underscores, and hyphens"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-600 disabled:text-gray-400"
                    />
                    {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prompt name cannot be changed after creation.</p>}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                {!isEditing && (
                    <div className="space-y-2">
                        <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt Text (v1.0.0)</label>
                        <textarea
                            id="promptText"
                            rows={8}
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            required
                            placeholder="Enter prompt text manually or use the generator..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setIsGenerateModalOpen(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Generate / Refine Prompt...
                        </button>
                    </div>
                )}
                {isEditing && initialData?.promptText && (
                    <div>
                        <label htmlFor="promptTextDisplay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt Text (Read Only - Managed via Versions)</label>
                        <textarea
                            id="promptTextDisplay"
                            rows={8}
                            value={promptText}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                    <Select<TagOption, true>
                        instanceId={`prompt-tags-select-${projectId}-${isEditing}`}
                        id="tags"
                        isMulti
                        options={tagOptions}
                        value={currentSelectedTagOptions}
                        onChange={handleTagSelectChange}
                        isLoading={loadingTags}
                        isDisabled={loadingTags || !projectId}
                        placeholder={loadingTags ? "Loading tags..." : !projectId ? "Select a project first" : "Select tags..."}
                        closeMenuOnSelect={false}
                        className="mt-1"
                        classNamePrefix="react-select"
                        styles={selectStyles}
                    />
                    {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">La selección reemplaza los tags existentes al guardar.</p>}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!isEditing && !promptText}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isEditing ? 'Save Changes' : 'Create Prompt'}
                    </button>
                </div>
            </form>
            <GeneratePromptModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerateComplete={handleGenerateComplete}
                projectId={projectId}
                initialUserText={promptText}
            />
        </>
    );
};

export default PromptForm; 