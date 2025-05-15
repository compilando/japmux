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
        console.log("[PromptForm Effect InitForm] Running. initialData:", initialData, "isEditing:", isEditing);
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');

            if (!isEditing && 'promptText' in initialData && initialData.promptText) {
                setPromptTextBody((initialData as CreatePromptDto).promptText || '');
            } else {
                setPromptTextBody('');
            }

            let initialTagIds: string[] = [];
            if (isEditing) {
                const currentPromptData = initialData as any;
                console.log("[PromptForm Effect InitForm - EDITING] currentPromptData.tags:", currentPromptData.tags);
                if (currentPromptData.tags && Array.isArray(currentPromptData.tags)) {
                    initialTagIds = (currentPromptData.tags as TagDto[]).map(tag => tag.id).filter(id => id !== undefined) as string[];
                    console.log("[PromptForm Effect InitForm - EDITING] Extracted initialTagIds from PromptDto:", initialTagIds);
                } else {
                    console.log("[PromptForm Effect InitForm - EDITING] 'tags' not found or not an array in initialData (PromptDto).", currentPromptData);
                }
            } else {
                if ('tags' in initialData && initialData.tags instanceof Set && initialData.tags.size > 0 && availableTags.length > 0) {
                    const initialTagNames = Array.from(initialData.tags as Set<string>);
                    initialTagIds = initialTagNames.map(tagName => availableTags.find(t => t.name === tagName)?.id)
                        .filter(id => id !== undefined) as string[];
                    console.log("[PromptForm Effect InitForm - CREATION] Mapped tag names to IDs:", initialTagIds);
                }
            }
            setSelectedTagIds(initialTagIds);

        } else {
            console.log("[PromptForm Effect InitForm] No initialData. Resetting form fields for creation.");
            setName('');
            setDescription('');
            setSelectedTagIds([]);
            setPromptTextBody('');
        }
    }, [initialData, availableTags, isEditing]);

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

        if (isEditing && initialData && 'id' in initialData) {
            const updatePayload: UpdatePromptDto = {};
            let hasChanges = false;

            if (description !== (initialData.description || '')) {
                updatePayload.description = description;
                hasChanges = true;
            }

            const originalPromptData = initialData as any;
            console.log("[PromptForm handleSubmit Edit] initialData for originalTagIds:", originalPromptData);
            const originalTagIds = (originalPromptData.tags && Array.isArray(originalPromptData.tags))
                ? new Set((originalPromptData.tags as TagDto[]).map(t => t.id))
                : new Set<string>();

            const currentSelectedTagIdsSet = new Set(selectedTagIds);

            console.log("[PromptForm handleSubmit Edit] originalTagIds Set:", originalTagIds);
            console.log("[PromptForm handleSubmit Edit] currentSelectedTagIdsSet:", currentSelectedTagIdsSet);

            if (originalTagIds.size !== currentSelectedTagIdsSet.size ||
                !Array.from(originalTagIds).every(id => currentSelectedTagIdsSet.has(id))) {
                updatePayload.tagIds = selectedTagIds;
                hasChanges = true;
                console.log("[PromptForm handleSubmit Edit] Tag changes DETECTED.");
            } else {
                console.log("[PromptForm handleSubmit Edit] Tag changes NOT detected.");
            }

            console.log("[PromptForm handleSubmit Edit] hasChanges before onSave:", hasChanges);
            if (hasChanges) {
                console.log("[PromptForm handleSubmit Edit] Sending update payload:", updatePayload);
                onSave(updatePayload);
            } else {
                showSuccessToast("No changes detected.");
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

            const tagNamesForCreationSet = new Set<string>();
            selectedTagIds.forEach(id => {
                const foundTag = availableTags.find(t => t.id === id);
                if (foundTag) {
                    tagNamesForCreationSet.add(foundTag.name);
                }
            });

            const tagsArrayForPayload = tagNamesForCreationSet.size > 0 ? Array.from(tagNamesForCreationSet) : undefined;

            const createPayload: CreatePromptDto = {
                name: name.trim(),
                description: description.trim() || undefined,
                tags: tagsArrayForPayload,
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