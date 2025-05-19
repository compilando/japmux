import React, { useState, useEffect } from 'react';
import { CreatePromptVersionDto, UpdatePromptVersionDto, promptAssetService, promptVersionService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import {
    DocumentDuplicateIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';
import CopyButton from '../common/CopyButton';
import PromptEditor from '../common/PromptEditor';

// Interface local para los datos del formulario, incluyendo versionTag
export interface PromptVersionFormData extends CreatePromptVersionDto {
    versionTag?: string;
}

interface PromptVersionFormProps {
    initialData: PromptVersionFormData | null;
    onSave: (payload: CreatePromptVersionDto | UpdatePromptVersionDto, versionTag: string) => void;
    onCancel: () => void;
    latestVersionTag?: string;
    projectId: string;
    promptId: string;
}

// Helper para calcular la siguiente versión (simplificado)
const calculateNextVersionTag = (latestTag: string | null | undefined): string => {
    // Primero, intenta manejar prefijos y sufijos comunes como -beta, etc.
    // Esta es una lógica muy básica y podría necesitar ajustes para casos más complejos.
    let baseTag = latestTag;
    let suffix = '';
    if (latestTag) {
        const suffixMatch = latestTag.match(/(-[a-zA-Z0-9-.]+)?(\+[a-zA-Z0-9-.]+)?$/);
        if (suffixMatch && suffixMatch[0]) {
            suffix = suffixMatch[0];
            baseTag = latestTag.substring(0, latestTag.length - suffix.length);
        }
    }

    if (!baseTag || !baseTag.startsWith('v')) {
        return 'v1.0.0'; // Default si no hay tag anterior o formato inesperado
    }

    const parts = baseTag.substring(1).split('.');
    if (parts.length === 3) {
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10);
        const patch = parseInt(parts[2], 10);
        if (!isNaN(major) && !isNaN(minor) && !isNaN(patch)) {
            // Solo incrementa patch, no maneja sufijos complejos
            return `v${major}.${minor}.${patch + 1}`;
        }
    }
    // Fallback si el parseo falla
    return 'v1.0.0';
};

const PromptVersionForm: React.FC<PromptVersionFormProps> = ({ initialData, onSave, onCancel, latestVersionTag, projectId, promptId }) => {
    const [promptText, setPromptText] = useState('');
    const [versionTag, setVersionTag] = useState('v1.0.0');
    const [changeMessage, setChangeMessage] = useState('');
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [previousVersion, setPreviousVersion] = useState<{ versionTag: string; promptText: string } | null>(null);

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setPromptText(initialData.promptText || '');
            setVersionTag(initialData.versionTag || 'v1.0.0');
            setChangeMessage(initialData.changeMessage || '');
        } else {
            setPromptText('');
            const suggestedTag = calculateNextVersionTag(latestVersionTag);
            setVersionTag(suggestedTag);
            setChangeMessage('');
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
                    setPreviousVersion({
                        versionTag: version.versionTag,
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
        }

        onSave(payload, versionTag);
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
                                <CopyButton textToCopy={previousVersion.promptText} />
                            </div>
                            <div className="bg-[#343541] border border-gray-700 rounded-lg p-4 h-full min-h-[200px]">
                                <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono h-full overflow-y-auto">
                                    {previousVersion.promptText}
                                </pre>
                            </div>
                        </>
                    )}
                    {!isEditing && !previousVersion && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-full min-h-[200px] flex items-center justify-center">
                            <p className="text-sm text-gray-400 font-mono">No previous version data to display.</p>
                        </div>
                    )}
                    {isEditing && initialData && (
                        <>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Prompt (Editing Version {initialData.versionTag})
                            </h4>
                            <div className="bg-[#343541] border border-gray-700 rounded-lg p-4 h-full min-h-[200px]">
                                <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono h-full overflow-y-auto">
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
                            disabled={isEditing}
                            pattern="^v\d+\.\d+\.\d+(-[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)?(\+[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)?$"
                            title="Semantic Versioning format (e.g., v1.0.0, v1.2.3-beta)"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500 font-mono"
                        />
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