import React, { useState, useEffect } from 'react';
import { promptService, promptVersionService, promptTranslationService, promptAssetService, PromptDto } from '@/services/api';
import { CreatePromptVersionDto, CreatePromptTranslationDto } from '@/services/generated/api';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import { PromptVersionData } from '@/app/(admin)/projects/[projectId]/prompts/[promptId]/versions/page';
import Select from 'react-select';

interface InsertReferenceButtonProps {
    projectId: string;
    onInsert: (text: string) => void;
    type: 'prompt' | 'asset';
    currentPromptId?: string;
}

interface Option {
    value: string;
    label: string;
}

interface PromptVersionWithTag extends CreatePromptVersionDto {
    versionTag: string;
}

// Interface to represent version data as expected for select options
interface PromptVersionForSelect extends CreatePromptVersionDto {
    id?: string; // Often present in fetched data
    versionTag: string; // Should be present and non-optional for selection logic based on current code
}

const InsertReferenceButton: React.FC<InsertReferenceButtonProps> = ({ projectId, onInsert, type, currentPromptId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompts, setPrompts] = useState<PromptDto[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<Option | null>(null);
    const [versions, setVersions] = useState<PromptVersionForSelect[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<Option | null>(null);
    const [translations, setTranslations] = useState<CreatePromptTranslationDto[]>([]);
    const [selectedTranslation, setSelectedTranslation] = useState<Option | null>(null);
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Option | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPrompts = async () => {
            try {
                setLoading(true);
                const response = await promptService.findAll(projectId);
                setPrompts(response);
            } catch (error) {
                console.error('Error loading prompts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPrompts();
    }, [projectId]);

    useEffect(() => {
        const loadVersions = async () => {
            if (!selectedPrompt) {
                setVersions([]);
                setSelectedVersion(null);
                return;
            }

            try {
                setLoading(true);
                const response = await promptVersionService.findAll(projectId, selectedPrompt.value);
                const versionsData = response.map(version => {
                    const versionTag = (version as any).versionTag || 'N/A';
                    return {
                        ...version,
                        id: versionTag,
                        versionTag
                    };
                }) as PromptVersionForSelect[];
                setVersions(versionsData);

                // Si no hay versiones, seleccionar automáticamente 'latest'
                if (versionsData.length === 0) {
                    setSelectedVersion({ value: 'latest', label: 'Latest' });
                }
            } catch (error) {
                console.error('Error loading versions:', error);
                // En caso de error, también seleccionar 'latest'
                setSelectedVersion({ value: 'latest', label: 'Latest' });
            } finally {
                setLoading(false);
            }
        };

        loadVersions();
    }, [selectedPrompt]);

    useEffect(() => {
        const loadTranslations = async () => {
            if (!selectedPrompt || !selectedVersion) {
                setTranslations([]);
                return;
            }
            try {
                const translationsData = await promptTranslationService.findAll(
                    projectId,
                    selectedPrompt.value,
                    selectedVersion.value
                );
                setTranslations(translationsData);
            } catch (error) {
                console.error('Error loading translations:', error);
            }
        };
        loadTranslations();
    }, [projectId, selectedPrompt, selectedVersion]);

    useEffect(() => {
        const loadAssets = async (promptId: string) => {
            if (!projectId) {
                console.log("--> [Debug] Aborting asset load: No projectId.");
                setAssets([]);
                return;
            }
            try {
                console.log(`--> [Debug] Loading assets for projectId: ${projectId}, promptId: ${promptId}`);
                const assetsData = await promptAssetService.findAll(projectId, promptId);
                console.log('--> [Debug] API Response for Assets:', assetsData);
                if (Array.isArray(assetsData)) {
                    setAssets(assetsData);
                } else {
                    console.error("--> [Debug] Asset data is not an array:", assetsData);
                    setAssets([]);
                }
            } catch (error) {
                console.error('--> [Debug] Error loading assets:', error);
                setAssets([]);
            }
        };

        console.log(`--> [Debug] Asset useEffect triggered. Type: ${type}, CurrentPromptId: ${currentPromptId}, ProjectId: ${projectId}`);

        // Only act if the button is for assets.
        if (type === 'asset') {
            // Only load if we have all the necessary IDs.
            if (projectId && currentPromptId) {
                loadAssets(currentPromptId);
            } else {
                // If the IDs are not present, do nothing. Don't clear the assets
                // because the IDs might just be loading. They will be cleared
                // if the project ID changes, which is handled by other components.
                console.log("--> [Debug] 'asset' type but missing projectId or currentPromptId. Waiting...");
            }
        } else {
            // If the button is not of type 'asset', ensure the list is clear.
            // This is important if the component instance is reused and the 'type' prop changes.
            setAssets([]);
        }
    }, [projectId, type, currentPromptId]);

    const handleInsert = () => {
        if (type === 'prompt' && selectedPrompt && selectedVersion) {
            const reference = selectedTranslation
                ? `{{prompt:${selectedPrompt.value}:${selectedVersion.value}:${selectedTranslation.value}}}`
                : `{{prompt:${selectedPrompt.value}:${selectedVersion.value}}}`;
            onInsert(reference);
        } else if (type === 'asset' && selectedAsset) {
            // El formato correcto no necesita el ID del prompt.
            // Si en el futuro se necesitara una versión específica, se añadiría aquí.
            const reference = `{{asset:${selectedAsset.value}}}`;
            onInsert(reference);
        }
        setIsOpen(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedPrompt(null);
        setSelectedVersion(null);
        setSelectedTranslation(null);
        setSelectedAsset(null);
        setAssets([]);
    };

    const promptOptions: Option[] = prompts
        .filter(prompt => !currentPromptId || prompt.id !== currentPromptId)
        .map(prompt => ({
            value: prompt.id,
            label: prompt.name
        }));

    const versionOptions: Option[] = [
        { value: 'latest', label: 'Latest' },
        ...versions.map(version => ({
            value: version.versionTag,
            label: version.versionTag
        }))
    ];

    const translationOptions: Option[] = translations.map(translation => ({
        value: translation.languageCode || '',
        label: translation.languageCode || ''
    }));

    const assetOptions: Option[] = assets.map(asset => ({
        value: asset.key,
        label: asset.name || asset.key
    }));

    console.log('--> [Debug] Final assetOptions passed to Select:', assetOptions);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {type === 'prompt' ? 'Insert Prompt' : 'Insert Asset'}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-4">
                        <div className="space-y-4">
                            {type === 'prompt' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Prompt</label>
                                        <Select
                                            options={promptOptions}
                                            value={selectedPrompt}
                                            onChange={setSelectedPrompt}
                                            isLoading={loading}
                                            placeholder="Select prompt..."
                                            className="react-select-container dark:react-select-container-dark"
                                            classNamePrefix="react-select"
                                            menuPlacement="bottom"
                                        />
                                    </div>

                                    {selectedPrompt && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Version</label>
                                                <Select
                                                    options={versionOptions}
                                                    value={selectedVersion}
                                                    onChange={setSelectedVersion}
                                                    isLoading={loading}
                                                    placeholder="Select version..."
                                                    className="react-select-container dark:react-select-container-dark"
                                                    classNamePrefix="react-select"
                                                    menuPlacement="bottom"
                                                />
                                            </div>

                                            {selectedVersion && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Translation</label>
                                                    <Select
                                                        options={translationOptions}
                                                        value={selectedTranslation}
                                                        onChange={setSelectedTranslation}
                                                        isLoading={loading}
                                                        placeholder="Select translation..."
                                                        className="react-select-container dark:react-select-container-dark"
                                                        classNamePrefix="react-select"
                                                        menuPlacement="bottom"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Asset</label>
                                        <Select
                                            options={assetOptions}
                                            value={selectedAsset}
                                            onChange={setSelectedAsset}
                                            isLoading={loading}
                                            placeholder={assets.length === 0 ? "No assets available" : "Select asset..."}
                                            className="react-select-container dark:react-select-container-dark"
                                            classNamePrefix="react-select"
                                            menuPlacement="bottom"
                                        />
                                        {assets.length === 0 && !loading && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                No assets available for this prompt.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleInsert}
                                    disabled={!((type === 'prompt' && selectedPrompt && selectedVersion) || (type === 'asset' && selectedAsset))}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsertReferenceButton; 