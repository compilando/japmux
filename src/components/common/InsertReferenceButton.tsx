import React, { useState, useEffect } from 'react';
import { promptService, promptVersionService, promptTranslationService, promptAssetService } from '@/services/api';
import { PromptDto, CreatePromptVersionDto, CreatePromptTranslationDto } from '@/services/generated/api';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import { PromptVersionData } from '@/app/(admin)/projects/[projectId]/prompts/[promptId]/versions/page';
import Select from 'react-select';

interface InsertReferenceButtonProps {
    projectId: string;
    onInsert: (text: string) => void;
    type: 'prompt' | 'asset';
    currentPromptId?: string;
}

interface PromptOption {
    value: string;
    label: string;
}

interface VersionOption {
    value: string;
    label: string;
}

interface TranslationOption {
    value: string;
    label: string;
}

interface AssetOption {
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
    const [selectedPrompt, setSelectedPrompt] = useState<PromptOption | null>(null);
    const [versions, setVersions] = useState<PromptVersionForSelect[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<VersionOption | null>(null);
    const [translations, setTranslations] = useState<CreatePromptTranslationDto[]>([]);
    const [selectedTranslation, setSelectedTranslation] = useState<TranslationOption | null>(null);
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<AssetOption | null>(null);
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
            try {
                const assetsData = await promptAssetService.findAll(projectId, promptId);
                setAssets(assetsData);
            } catch (error) {
                console.error('Error loading assets:', error);
            }
        };
        if (type === 'asset' && currentPromptId) {
            loadAssets(currentPromptId);
        } else if (selectedPrompt) {
            loadAssets(selectedPrompt.value);
        } else {
            setAssets([]);
            setSelectedAsset(null);
        }
    }, [selectedPrompt, currentPromptId, type]);

    const handleInsert = () => {
        if (type === 'prompt' && selectedPrompt && selectedVersion) {
            const reference = selectedTranslation
                ? `{{prompt:${selectedPrompt.value}:${selectedVersion.value}:${selectedTranslation.value}}}`
                : `{{prompt:${selectedPrompt.value}:${selectedVersion.value}}}`;
            onInsert(reference);
        } else if (type === 'asset' && selectedPrompt && selectedAsset) {
            const reference = `{{asset:${selectedPrompt.value}:${selectedAsset.value}}}`;
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

    const promptOptions: PromptOption[] = prompts
        .filter(prompt => !currentPromptId || prompt.id !== currentPromptId)
        .map(prompt => ({
            value: prompt.id, c
            label: prompt.name
        }));

    const versionOptions: VersionOption[] = [
        { value: 'latest', label: 'Latest' },
        ...versions.map(version => ({
            value: version.versionTag,
            label: version.versionTag
        }))
    ];

    const translationOptions: TranslationOption[] = translations.map(translation => ({
        value: translation.languageCode || '',
        label: translation.languageCode || ''
    }));

    const assetOptions = assets.map(asset => ({
        value: asset.key,
        label: asset.name
    }));

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
                <div className="absolute z-50 mt-2 w-96 bg-white rounded-md shadow-lg">
                    <div className="p-4">
                        <div className="space-y-4">
                            {type === 'prompt' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Prompt</label>
                                        <Select
                                            options={promptOptions}
                                            value={selectedPrompt}
                                            onChange={setSelectedPrompt}
                                            isLoading={loading}
                                            placeholder="Select prompt..."
                                            menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999, minWidth: '240px', maxWidth: '380px' }) }}
                                        />
                                    </div>

                                    {selectedPrompt && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Version</label>
                                                <Select
                                                    options={versionOptions}
                                                    value={selectedVersion}
                                                    onChange={setSelectedVersion}
                                                    isLoading={loading}
                                                    placeholder="Select version..."
                                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999, minWidth: '240px', maxWidth: '380px' }) }}
                                                />
                                            </div>

                                            {selectedVersion && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Translation</label>
                                                    <Select
                                                        options={translationOptions}
                                                        value={selectedTranslation}
                                                        onChange={setSelectedTranslation}
                                                        isLoading={loading}
                                                        placeholder="Select translation..."
                                                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999, minWidth: '240px', maxWidth: '380px' }) }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Asset</label>
                                    <Select
                                        options={assetOptions}
                                        value={selectedAsset}
                                        onChange={setSelectedAsset}
                                        isLoading={loading}
                                        placeholder={assets.length === 0 ? "No assets available" : "Select asset..."}
                                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999, minWidth: '240px', maxWidth: '380px' }) }}
                                    />
                                    {assets.length === 0 && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            No assets available for this prompt.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleInsert}
                                    disabled={
                                        type === 'prompt'
                                            ? (!selectedPrompt || !selectedVersion)
                                            : (!selectedAsset || assets.length === 0)
                                    }
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
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