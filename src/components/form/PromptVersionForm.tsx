import React, { useState, useEffect } from 'react';
import { CreatePromptVersionDto, UpdatePromptVersionDto } from '@/services/generated/api';
import { promptAssetService, promptVersionService, regionService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import {
    DocumentDuplicateIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';
import CopyButton from '../common/CopyButton';
import PromptEditor from '../common/PromptEditor';
import InsertReferenceButton from '../common/InsertReferenceButton';
import { CreateRegionDto } from '@/services/generated/api';

// Interface local para los datos del formulario, incluyendo versionTag y languageCode
export interface PromptVersionFormData {
    promptText: string;
    changeMessage?: string;
    versionTag?: string;
    languageCode?: string;
    initialTranslations?: Array<any>; // Mantener por compatibilidad si es necesario
}

interface PromptVersionFormProps {
    initialData: PromptVersionFormData | null;
    onSave: (payload: CreatePromptVersionDto | UpdatePromptVersionDto, versionTag: string, languageCode?: string) => void;
    onCancel: () => void;
    latestVersionTag?: string;
    projectId: string;
    promptId: string;
}

// Helper para calcular la siguiente versión (simplificado)
const calculateNextVersionTag = (latestTag: string | null | undefined): string => {
    if (!latestTag) {
        return '1.0.0';
    }

    // Extraer el número de versión base y cualquier sufijo
    const match = latestTag.match(/^(\d+)\.(\d+)\.(\d+)(-[a-zA-Z0-9-.]+)?(\+[a-zA-Z0-9-.]+)?$/);
    if (!match) {
        return '1.0.0';
    }

    const [, major, minor, patch, prerelease, build] = match;

    // Incrementar el número de patch
    const newPatch = parseInt(patch, 10) + 1;

    // Reconstruir el tag con el nuevo número de patch
    let newTag = `${major}.${minor}.${newPatch}`;

    // Añadir el sufijo de prerelease si existía
    if (prerelease) {
        newTag += prerelease;
    }

    // Añadir el sufijo de build si existía
    if (build) {
        newTag += build;
    }

    return newTag;
};

const PromptVersionForm: React.FC<PromptVersionFormProps> = ({ initialData, onSave, onCancel, latestVersionTag, projectId, promptId }) => {
    const [promptText, setPromptText] = useState('');
    const [versionTag, setVersionTag] = useState('1.0.0');
    const [changeMessage, setChangeMessage] = useState('');
    const [languageCode, setLanguageCode] = useState('');
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [previousVersion, setPreviousVersion] = useState<{ versionTag: string; promptText: string } | null>(null);
    const [regions, setRegions] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);

    const isEditing = !!initialData;

    // Fetch regions para el selector de language code
    useEffect(() => {
        const fetchRegions = async () => {
            if (!projectId) return;
            setLoadingRegions(true);
            try {
                const regionsData = await regionService.findAll(projectId);
                setRegions(regionsData);

                // Establecer valor por defecto
                const defaultLanguageCode = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE_CODE || 'en-US';
                const hasDefaultRegion = regionsData.some(region => region.languageCode === defaultLanguageCode);

                if (hasDefaultRegion) {
                    setLanguageCode(defaultLanguageCode);
                } else if (regionsData.length > 0) {
                    setLanguageCode(regionsData[0].languageCode);
                } else {
                    setLanguageCode('en-US'); // fallback
                }
            } catch (error) {
                console.error('Error loading regions:', error);
                // Fallback en caso de error
                setLanguageCode('en-US');
            } finally {
                setLoadingRegions(false);
            }
        };

        fetchRegions();
    }, [projectId]);

    useEffect(() => {
        if (initialData) {
            setPromptText(initialData.promptText || '');
            setVersionTag(initialData.versionTag || '1.0.0');
            setChangeMessage(initialData.changeMessage || '');
            // Si hay languageCode en initialData y es válido, usarlo; sino esperar al efecto de regions
            if (initialData.languageCode && initialData.languageCode.length >= 2) {
                setLanguageCode(initialData.languageCode);
            }
        } else {
            setPromptText('');
            const suggestedTag = calculateNextVersionTag(latestVersionTag);
            setVersionTag(suggestedTag);
            setChangeMessage('');
            // languageCode se establece en el useEffect de regions
        }
    }, [initialData, latestVersionTag]);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!projectId || !promptId) return;
            try {
                const assetsData = await promptAssetService.findAll(projectId, promptId);
                setAssets(assetsData);
            } catch (error) {
                console.error('Error loading assets:', error);
            }
        };

        fetchAssets();
    }, [projectId, promptId]);

    useEffect(() => {
        const fetchPreviousVersion = async () => {
            if (!projectId || !promptId || !latestVersionTag) return;
            try {
                const version = await promptVersionService.findOne(projectId, promptId, latestVersionTag);
                if (version) {
                    // El backend incluye versionTag aunque los tipos generados no lo reflejen
                    const versionWithTag = version as any;
                    setPreviousVersion({
                        versionTag: versionWithTag.versionTag || latestVersionTag,
                        promptText: version.promptText || ''
                    });
                }
            } catch (error) {
                console.error('Error loading previous version:', error);
            }
        };

        if (!isEditing) {
            fetchPreviousVersion();
        }
    }, [projectId, promptId, latestVersionTag, isEditing]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreatePromptVersionDto | UpdatePromptVersionDto;

        if (isEditing) {
            payload = {
                promptText: promptText ? promptText : undefined,
                changeMessage: changeMessage ? changeMessage : undefined,
            } as UpdatePromptVersionDto;
            payload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined)) as UpdatePromptVersionDto;
        } else {
            payload = {
                promptText,
                changeMessage: changeMessage || undefined,
            } as CreatePromptVersionDto;

            if (!promptText) {
                alert("Prompt Text is required!");
                return;
            }

            if (!languageCode || languageCode.length < 2) {
                alert("Language Code is required and must be at least 2 characters long!");
                return;
            }
        }

        onSave(payload, versionTag, languageCode);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Previous Version */}
                <div className="space-y-4">
                    {!isEditing && previousVersion && (
                        <>
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Previous Version ({previousVersion.versionTag})
                                </h4>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPromptText(previousVersion.promptText)}
                                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                                    >
                                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                                        Copy to New Version
                                    </button>
                                    <CopyButton textToCopy={previousVersion.promptText} />
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 h-full min-h-[200px]">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono h-full overflow-y-auto">
                                    {previousVersion.promptText}
                                </pre>
                            </div>
                        </>
                    )}
                    {!isEditing && !previousVersion && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 h-full min-h-[200px] flex items-center justify-center">
                            <p className="text-sm text-gray-600 font-mono">No previous version data to display.</p>
                        </div>
                    )}
                    {isEditing && initialData && (
                        <>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Prompt (Editing Version {initialData.versionTag})
                            </h4>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 h-full min-h-[200px]">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono h-full overflow-y-auto">
                                    {initialData.promptText}
                                </pre>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Form */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="versionTagInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Version Tag</label>
                        <input
                            type="text"
                            id="versionTagInput"
                            value={versionTag}
                            onChange={(e) => setVersionTag(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-mono"
                            placeholder="e.g., 1.0.0 or 1.0.0-beta.1"
                            pattern="^\d+\.\d+\.\d+.*$"
                            title="Must be a valid SemVer tag (e.g., 1.0.0, 1.0.1-beta, 2.0.0+build.42)"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Use <a href="https://semver.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Semantic Versioning</a> (e.g., 1.0.0, 1.0.1-beta).
                        </p>
                    </div>

                    <div>
                        <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Language Code *
                        </label>
                        <select
                            id="languageCode"
                            value={languageCode}
                            onChange={(e) => setLanguageCode(e.target.value)}
                            required
                            disabled={loadingRegions}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-500"
                        >
                            {loadingRegions ? (
                                <option value={languageCode || 'en-US'}>Cargando regiones...</option>
                            ) : regions.length === 0 ? (
                                <option value="en-US">en-US (default)</option>
                            ) : (
                                <>
                                    {!regions.some(region => region.languageCode === languageCode) && languageCode && (
                                        <option value={languageCode}>{languageCode} (actual)</option>
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
                            Selecciona el idioma base para esta versión del prompt
                        </p>
                    </div>

                    <div>
                        <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isEditing ? 'Prompt Text (Editing)' : 'New Prompt Text'}
                        </label>

                        <PromptEditor
                            value={promptText}
                            onChange={setPromptText}
                            placeholder={isEditing ? "Edit the prompt text..." : "Enter the new prompt text here..."}
                            rows={26}
                            assets={assets}
                            showHistory={true}
                            extraToolbarButtons={
                                <div className="flex gap-2">
                                    <InsertReferenceButton
                                        projectId={projectId}
                                        type="prompt"
                                        currentPromptId={promptId}
                                        onInsert={(text) => {
                                            setPromptText(prev => prev + text);
                                        }}
                                    />
                                    <InsertReferenceButton
                                        projectId={projectId}
                                        type="asset"
                                        currentPromptId={promptId}
                                        onInsert={(text) => {
                                            setPromptText(prev => prev + text);
                                        }}
                                    />
                                </div>
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="changeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Change Message (Optional)</label>
                        <input
                            type="text"
                            id="changeMessage"
                            value={changeMessage}
                            onChange={(e) => setChangeMessage(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-mono"
                            placeholder="Describe the changes in this version..."
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
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isEditing ? 'Save Changes' : 'Create Version'}
                </button>
            </div>
        </form>
    );
};

export default PromptVersionForm; 