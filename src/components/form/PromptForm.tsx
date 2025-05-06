import React, { useState, useEffect, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import {
    CreatePromptDto,
    UpdatePromptDto,
    tagService,
    TagDto,
} from '@/services/api';
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
    const [promptText, setPromptText] = useState('');
    const [availableTags, setAvailableTags] = useState<TagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    const isEditing = useMemo(() => !!initialData, [initialData]);

    useEffect(() => {
        if (projectId) {
            setIsLoadingTags(true);
            console.log('[PromptForm Effect FetchTags] Fetching tags for projectId:', projectId);
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
        if (initialData) { // Modo Edición
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPromptText(initialData.promptText || '');

            if (initialData.tags && initialData.tags.size > 0) {
                console.log("[PromptForm Effect InitForm] Editing mode. initialData.tags:", Array.from(initialData.tags));
                if (availableTags.length > 0) {
                    console.log("[PromptForm Effect InitForm] availableTags is populated. Proceeding to map names to IDs.");
                    const initialTagNames = Array.from(initialData.tags);
                    const ids = initialTagNames.map(tagName => {
                        const foundTag = availableTags.find(t => t.name === tagName);
                        console.log(`[PromptForm Effect InitForm] Mapping tag name "${tagName}" to ID: ${foundTag?.id}`);
                        return foundTag?.id;
                    }).filter(id => id !== undefined) as string[];
                    console.log("[PromptForm Effect InitForm] Setting selectedTagIds to:", ids);
                    setSelectedTagIds(ids);
                } else {
                    console.warn("[PromptForm Effect InitForm] availableTags is EMPTY. Cannot map tag names to IDs yet. initialData.tags:", Array.from(initialData.tags));
                    setSelectedTagIds([]); // Asegurar que se limpia si availableTags no está listo
                }
            } else {
                console.log("[PromptForm Effect InitForm] Editing mode, but initialData.tags is empty or undefined.");
                setSelectedTagIds([]);
            }
        } else { // Modo Creación
            console.log("[PromptForm Effect InitForm] Creation mode. Resetting form fields.");
            setName('');
            setDescription('');
            setPromptText('');
            setSelectedTagIds([]);
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

    const handleGenerateComplete = (generatedText: string) => {
        setPromptText(generatedText);
        setIsGenerateModalOpen(false);
        showSuccessToast("Prompt text updated with generated content!");
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEditing && initialData) {
            const updatePayload: UpdatePromptDto = {};
            let hasChanges = false;

            if (description !== (initialData.description || '')) {
                updatePayload.description = description;
                hasChanges = true;
            }

            if (promptText !== (initialData.promptText || '')) {
                (updatePayload as any).promptText = promptText;
                hasChanges = true;
            }

            const initialTagIdsSet = new Set(initialData.tags && availableTags.length > 0 ?
                (Array.from(initialData.tags)
                    .map(name => availableTags.find(t => t.name === name)?.id)
                    .filter(id => id !== undefined) as string[])
                : []);
            const selectedTagIdsSet = new Set(selectedTagIds);

            if (initialTagIdsSet.size !== selectedTagIdsSet.size ||
                !Array.from(initialTagIdsSet).every(id => selectedTagIdsSet.has(id))) {
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

            const tagNamesForCreation = new Set<string>();
            selectedTagIds.forEach(id => {
                const foundTag = availableTags.find(t => t.id === id);
                if (foundTag) {
                    tagNamesForCreation.add(foundTag.name);
                }
            });

            const createPayload: CreatePromptDto = {
                name,
                description,
                promptText,
                tags: tagNamesForCreation.size > 0 ? tagNamesForCreation : undefined,
            };
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

                <div>
                    <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prompt Text
                    </label>
                    <div className="mt-1 relative">
                        <textarea
                            id="promptText"
                            name="promptText"
                            rows={10}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setIsGenerateModalOpen(true)}
                            className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded-md text-xs shadow-md transition duration-150 ease-in-out"
                        >
                            Generate / Improve
                        </button>
                    </div>
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

            {isGenerateModalOpen && projectId && (
                <GeneratePromptModal
                    isOpen={isGenerateModalOpen}
                    onClose={() => setIsGenerateModalOpen(false)}
                    onGenerateComplete={handleGenerateComplete}
                    projectId={projectId}
                    initialUserText={promptText}
                />
            )}
        </>
    );
};

export default PromptForm; 