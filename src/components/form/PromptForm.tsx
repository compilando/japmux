import React, { useState, useEffect, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import {
    CreatePromptDto,
    UpdatePromptDto,
    TagDto,
    PromptDto,
    tagService,
} from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';

interface PromptFormProps {
    initialData: PromptDto | CreatePromptDto | null;
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
    const [availableTags, setAvailableTags] = useState<TagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [promptTextBody, setPromptTextBody] = useState('');

    const isEditing = useMemo(() => !!initialData, [initialData]);

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
        console.log("[PromptForm Effect InitForm] Running. initialData:", initialData, "availableTags:", availableTags);
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPromptTextBody((initialData as CreatePromptDto).promptText || '');

            let initialTagIdsSet = new Set<string>();
            const initialCreateDto = initialData as CreatePromptDto;
            if (initialCreateDto.tags && initialCreateDto.tags.size > 0 && availableTags.length > 0) {
                const initialTagNames = Array.from(initialCreateDto.tags);
                initialTagIdsSet = new Set(initialTagNames.map(tagName => availableTags.find(t => t.name === tagName)?.id)
                    .filter(id => id !== undefined) as string[]);
            }
            setSelectedTagIds(Array.from(initialTagIdsSet));

        } else {
            console.log("[PromptForm Effect InitForm] Creation mode (no initialData). Resetting form fields.");
            setName('');
            setDescription('');
            setSelectedTagIds([]);
            setPromptTextBody('');
        }
    }, [initialData, availableTags]);

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEditing && initialData) {
            const updatePayload: UpdatePromptDto = {};
            let hasChanges = false;

            if (description !== (initialData.description || '')) {
                updatePayload.description = description;
                hasChanges = true;
            }

            let initialTagIdsFromInitialData = new Set<string>();
            const initialCreateDtoForTags = initialData as CreatePromptDto;
            if (initialCreateDtoForTags.tags && initialCreateDtoForTags.tags.size > 0 && availableTags.length > 0) {
                const initialTagNames = Array.from(initialCreateDtoForTags.tags);
                initialTagIdsFromInitialData = new Set(initialTagNames.map(tagName => availableTags.find(t => t.name === tagName)?.id)
                    .filter(id => id !== undefined) as string[]);
            }
            
            const selectedTagIdsSet = new Set(selectedTagIds);

            if (initialTagIdsFromInitialData.size !== selectedTagIdsSet.size ||
                !Array.from(initialTagIdsFromInitialData).every(id => selectedTagIdsSet.has(id))) {
                updatePayload.tagIds = selectedTagIds;
                hasChanges = true;
            }

            if (hasChanges) {
                console.log("[PromptForm handleSubmit Edit] Sending update payload:", updatePayload);
                onSave(updatePayload);
            } else {
                showSuccessToast("No changes detected.");
                onCancel();
            }

        } else {
            if (!name.trim()) {
                showErrorToast("Prompt name cannot be empty.");
                return;
            }
            if (!promptTextBody.trim()) {
                showErrorToast("Prompt text cannot be empty.");
                return;
            }

            const tagNamesForCreation = new Set<string>();
            selectedTagIds.forEach(id => {
                const foundTag = availableTags.find(t => t.id === id);
                if (foundTag) {
                    tagNamesForCreation.add(foundTag.name);
                }
            });

            const createPayload: CreatePromptDto = {
                name: name.trim(),
                description: description.trim() || undefined,
                tags: tagNamesForCreation.size > 0 ? tagNamesForCreation : undefined,
                promptText: promptTextBody.trim(),
            } as CreatePromptDto;
            
            console.log("[PromptForm handleSubmit Create] Sending create payload:", createPayload);
            onSave(createPayload);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="promptName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prompt Name / ID
                    </label>
                    <input
                        type="text"
                        name="promptName"
                        id="promptName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        disabled={isEditing}
                        required={!isEditing}
                    />
                    {isEditing && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Prompt Name (ID) cannot be changed after creation.</p>}
                </div>

                <div>
                    <label htmlFor="promptDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                    </label>
                    <textarea
                        name="promptDescription"
                        id="promptDescription"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {!isEditing && (
                    <div>
                        <label htmlFor="promptTextBody" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Prompt Text
                        </label>
                        <textarea
                            name="promptTextBody"
                            id="promptTextBody"
                            rows={4}
                            value={promptTextBody}
                            onChange={(e) => setPromptTextBody(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                    </label>
                    <Select
                        isMulti
                        name="tags"
                        options={tagOptions}
                        isLoading={isLoadingTags}
                        value={currentSelectedTagOptions}
                        onChange={handleTagSelectChange}
                        className="mt-1 react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isEditing ? 'Save Changes' : 'Create Prompt'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default PromptForm; 