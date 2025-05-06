import React, { useState, useEffect, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { Prompt, CreatePromptDto, UpdatePromptDto, tagService, Tag } from '@/services/api';

interface PromptFormProps {
    initialData: Prompt | null;
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
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [initialTagNames, setInitialTagNames] = useState<string[]>([]);
    const [promptText, setPromptText] = useState('');
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

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
                setAvailableTags(fetchedTags);
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

            console.log('[PromptForm Effect InitialData] Inspecting initialData.tags:', initialData.tags);
            const names = initialData.tags
                ?.map((tagObject: any) => tagObject?.name)
                .filter((name): name is string => name !== undefined && name !== null) || [];

            setInitialTagNames(names);
            console.log('[PromptForm Effect InitialData] initialTagNames set:', names);
            setDataLoaded(true);
            setSelectedTagIds([]);
            setPromptText('');
        } else {
            setName('');
            setDescription('');
            setInitialTagNames([]);
            setSelectedTagIds([]);
            setPromptText('');
            setDataLoaded(true);
        }
    }, [initialData]);

    useEffect(() => {
        if (dataLoaded && !loadingTags && initialTagNames.length > 0 && availableTags.length > 0) {
            console.log('[PromptForm Effect MatchTags] Attempting to match names to available tags. Names:', initialTagNames, 'Available:', availableTags);
            const foundIds = initialTagNames.map(nameToFind => {
                const foundTag = availableTags.find(tag => tag.name === nameToFind);
                return foundTag?.id;
            }).filter((id): id is string => id !== undefined);

            setSelectedTagIds(foundIds);
            console.log('[PromptForm Effect MatchTags] selectedTagIds set after matching:', foundIds);
        } else if (dataLoaded && !loadingTags) {
            if (initialTagNames.length === 0 && selectedTagIds.length > 0) {
                setSelectedTagIds([]);
                console.log('[PromptForm Effect MatchTags] Resetting selectedTagIds as no initial names found.');
            }
        }
    }, [dataLoaded, loadingTags, initialTagNames, availableTags]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: any;

        if (isEditing) {
            payload = {
                description: description || undefined,
                tagIds: selectedTagIds.length > 0 ? selectedTagIds : [],
            };
        } else {
            payload = {
                name,
                promptText: promptText,
                description: description || undefined,
                tags: selectedTagIds,
            };
        }
        console.log('[PromptForm] Saving payload:', payload);
        onSave(payload);
    };

    const handleTagSelectChange = (selectedOptions: MultiValue<TagOption>) => {
        const newSelectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedTagIds(newSelectedIds);
        console.log('[PromptForm] Tag selection changed:', newSelectedIds);
    };

    const tagOptions: TagOption[] = useMemo(() => {
        console.log('[PromptForm Memo tagOptions] Recalculating based on availableTags:', availableTags);
        return availableTags.map(tag => ({
            value: tag.id,
            label: tag.name
        }));
    }, [availableTags]);

    const currentSelectedTags: TagOption[] = useMemo(() => {
        console.log('[PromptForm Memo currentSelectedTags] Recalculating. Deps - selectedTagIds:', selectedTagIds, 'tagOptions:', tagOptions);
        const selected = tagOptions.filter(option =>
            selectedTagIds.includes(option.value)
        );
        console.log('[PromptForm Memo currentSelectedTags] Calculated value:', selected);
        return selected;
    }, [tagOptions, selectedTagIds]);

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

    console.log(`[PromptForm Render] Rendering. Props for Select -> isLoading: ${loadingTags}, value:`, currentSelectedTags, 'options:', tagOptions);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name (ID)</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isEditing}
                    pattern="^[a-z0-9_]+$"
                    title="Only lowercase letters, numbers, and underscores"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
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
                <div>
                    <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Prompt Text (v1.0.0)</label>
                    <textarea
                        id="promptText"
                        rows={5}
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
            )}
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                <Select<TagOption, true>
                    instanceId={`prompt-tags-select-${projectId}`}
                    id="tags"
                    isMulti
                    options={tagOptions}
                    value={currentSelectedTags}
                    onChange={handleTagSelectChange}
                    isLoading={loadingTags}
                    isDisabled={loadingTags || !projectId}
                    placeholder={loadingTags ? "Loading tags..." : !projectId ? "Select a project first" : "Select tags..."}
                    closeMenuOnSelect={false}
                    className="mt-1"
                    classNamePrefix="react-select"
                />
                {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">La selección reemplaza los tags existentes.</p>}
            </div>

            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isEditing ? 'Save Changes' : 'Create Prompt'}
                </button>
            </div>
        </form>
    );
};

export default PromptForm; 