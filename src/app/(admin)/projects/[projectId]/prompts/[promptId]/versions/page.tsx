"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    CreateProjectDto,
    PromptDto,
    CreatePromptVersionDto,
    UpdatePromptVersionDto,
} from '@/services/generated/api';
import {
    promptVersionService,
    projectService,
    promptService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { usePrompts } from '@/context/PromptContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptVersionsTable from '@/components/tables/PromptVersionsTable';
import PromptVersionForm from '@/components/form/PromptVersionForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { PlusCircleIcon, PencilIcon as EditIconHero } from '@heroicons/react/24/outline';
import { diffLines, type Change } from 'diff'; // Importar solo diffLines y Change
import DiffViewerModal from '@/components/common/DiffViewerModal'; // Importar el nuevo modal

// Helper para extraer mensajes de error de forma segura
const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

// --- Interfaces Locales Extendidas ---
// Exportar esta interfaz para poder usarla en el componente hijo (Table)
export interface PromptVersionData extends CreatePromptVersionDto {
    id: string;
    versionTag: string; // Asumimos que versionTag SIEMPRE debe existir para una versión existente
    isActive: boolean;
    promptId: string;
    languageCode?: string;
}

// Nueva interfaz para detalles del marketplace, extendiendo PromptVersionData
export interface PromptVersionMarketplaceDetails extends PromptVersionData {
    marketplaceStatus?: 'NOT_PUBLISHED' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | string;
    createdAt?: string;
}

// --- Helper para versionado (simplificado) ---
const getLatestVersionTag = (versions: PromptVersionData[]): string | null => {
    if (!versions || versions.length === 0) return null;

    const sortedVersions = [...versions].sort((a, b) => {
        // Extraer y normalizar tags, manejando undefined
        const tagAValue = a.versionTag;
        const tagBValue = b.versionTag;

        const normalizedTagA = typeof tagAValue === 'string' && tagAValue.startsWith('v')
            ? tagAValue.substring(1)
            : tagAValue;
        const normalizedTagB = typeof tagBValue === 'string' && tagBValue.startsWith('v')
            ? tagBValue.substring(1)
            : tagBValue;

        // Comparar, tratando undefined/null como string vacío para consistencia
        const valA = normalizedTagA || '';
        const valB = normalizedTagB || '';

        return valB.localeCompare(valA); // Orden descendente
    });

    // El primer elemento después de ordenar, si existe y tiene versionTag
    if (sortedVersions.length > 0 && typeof sortedVersions[0].versionTag === 'string') {
        return sortedVersions[0].versionTag;
    }
    return null;
};

// Type for the update payload, allowing isActive
// (Although UpdatePromptVersionDto should ideally allow it)
// Simplify: we'll use a simple object for the payload.

const PromptVersionsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptVersionMarketplaceDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
    const [editingItem, setEditingItem] = useState<PromptVersionData | null>(null);
    const [latestVersionTagForForm, setLatestVersionTagForForm] = useState<string | null>(null);
    const [marketplaceActionLoading, setMarketplaceActionLoading] = useState<Record<string, boolean>>({});

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [prompt, setPrompt] = useState<PromptDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    // Estados para la funcionalidad de Diff
    const [selectedVersionsForDiff, setSelectedVersionsForDiff] = useState<string[]>([]);
    const [diffResult, setDiffResult] = useState<Change[] | null>(null);
    const [showDiffModal, setShowDiffModal] = useState<boolean>(false);

    const params = useParams();
    const { selectedProjectId } = useProjects();
    const { selectedPromptId } = usePrompts();

    const projectId = params.projectId as string;
    const promptId = params.promptId as string;

    useEffect(() => {
        if (!projectId || !promptId) return;

        const fetchBreadcrumbData = async () => {
            setBreadcrumbLoading(true);
            try {
                const [projectData, promptDataFromService] = await Promise.all([
                    projectService.findOne(projectId),
                    promptService.findOne(projectId, promptId)
                ]);
                setProject(projectData);
                setPrompt(promptDataFromService);
            } catch (err: unknown) {
                console.error("Error fetching breadcrumb data:", err);
                const defaultMsg = "Failed to load project or prompt details for breadcrumbs.";
                showErrorToast(getApiErrorMessage(err, defaultMsg));
                setProject(null);
                setPrompt(null);
            } finally {
                setBreadcrumbLoading(false);
            }
        };

        fetchBreadcrumbData();
    }, [projectId, promptId]);

    const fetchData = useCallback(async () => {
        // --- START: Clear error ALWAYS when trying to load data ---
        setError(null);
        // --- END: Clear error ---

        if (!projectId || !promptId) {
            setError("Missing Project or Prompt ID in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (projectId !== selectedProjectId) {
            setError("Project ID in URL does not match selected project.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (selectedPromptId && promptId !== selectedPromptId) {
            setError(`Error: URL prompt ID (${promptId.substring(0, 6)}...) does not match context prompt ID (${selectedPromptId.substring(0, 6)}...). Clear selection or navigate from Prompts table.`);
            setLoading(false);
            setItemsList([]);
            return;
        }

        setLoading(true);
        try {
            const data = await promptVersionService.findAll(projectId, promptId);
            if (Array.isArray(data)) {
                const versionsData = data.map(v_any => {
                    const v = v_any as CreatePromptVersionDto & Partial<{ id: string, versionTag: string, isActive: boolean, marketplaceStatus: string, promptId: string, createdAt: string, languageCode: string }>;
                    return {
                        ...v,
                        id: v.id || v.versionTag || String(Date.now() + Math.random()),
                        versionTag: v.versionTag || 'N/A',
                        isActive: v.isActive || false,
                        promptId: v.promptId || promptId,
                        marketplaceStatus: v.marketplaceStatus,
                        createdAt: v.createdAt,
                        languageCode: v.languageCode
                    };
                }) as PromptVersionMarketplaceDetails[];
                setItemsList(versionsData);
                const latestTag = getLatestVersionTag(versionsData);
                setLatestVersionTagForForm(latestTag);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
                setLatestVersionTagForForm(null);
            }
        } catch (err: unknown) {
            console.error("Error fetching items:", err);
            const defaultMsg = 'Failed to fetch prompt versions.';
            setError(getApiErrorMessage(err, defaultMsg));
            setItemsList([]);
            setLatestVersionTagForForm(null);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, selectedProjectId, selectedPromptId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelectVersionForDiff = (versionTag: string) => {
        setSelectedVersionsForDiff(prevSelected => {
            if (prevSelected.includes(versionTag)) {
                return prevSelected.filter(tag => tag !== versionTag);
            } else {
                if (prevSelected.length < 2) {
                    return [...prevSelected, versionTag];
                }
                // showErrorToast("Puedes seleccionar hasta 2 versiones para comparar.");
                return prevSelected;
            }
        });
    };

    const handleCompareVersions = () => {
        if (selectedVersionsForDiff.length !== 2) {
            showErrorToast("Por favor, selecciona exactamente dos versiones para comparar.");
            return;
        }

        const version1Data = itemsList.find(item => item.versionTag === selectedVersionsForDiff[0]);
        const version2Data = itemsList.find(item => item.versionTag === selectedVersionsForDiff[1]);

        if (!version1Data || !version2Data) {
            showErrorToast("No se pudieron encontrar los datos de las versiones seleccionadas.");
            return;
        }

        const text1 = version1Data.promptText ?? '';
        const text2 = version2Data.promptText ?? '';

        const differences = diffLines(text1, text2, { newlineIsToken: true });
        setDiffResult(differences);
        setShowDiffModal(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setFormMode('add');
    };

    const handleEdit = (item: PromptVersionData) => {
        setEditingItem(item);
        setFormMode('edit');
    };

    const handleCancelForm = () => {
        setFormMode(null);
        setEditingItem(null);
    };

    const handleDelete = async (itemToDelete: PromptVersionData) => {
        if (!projectId || !promptId || !itemToDelete.versionTag) {
            showErrorToast("Cannot delete: version data is incomplete (missing versionTag).");
            return;
        }
        if (window.confirm(`Are you sure you want to delete version tag "${itemToDelete.versionTag}"?`)) {
            setLoading(true);
            try {
                await promptVersionService.remove(projectId, promptId, itemToDelete.versionTag!);
                showSuccessToast(`Version ${itemToDelete.versionTag} deleted successfully!`);
                fetchData();
            } catch (err: unknown) {
                console.error("Error deleting version:", err);
                const defaultMsg = 'Failed to delete version.';
                setError(getApiErrorMessage(err, defaultMsg));
            } finally {
                setLoading(false);
            }
        }
    };

    // Funciones para marketplace (asumiendo que podrían estar aquí o necesitan ser definidas
    // según las props de PromptVersionsTable)
    const handleRequestPublish = async (versionTag: string) => {
        if (!projectId || !promptId || !versionTag) return;
        setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: true }));
        try {
            // Asumimos que el servicio devuelve la versión actualizada con el nuevo estado
            const updatedVersion = await promptVersionService.requestPublish(projectId, promptId, versionTag);
            // Actualizar el estado en itemsList es crucial aquí
            setItemsList(prevList =>
                prevList.map(item =>
                    item.versionTag === versionTag
                        ? { ...item, ...updatedVersion, marketplaceStatus: (updatedVersion as PromptVersionMarketplaceDetails).marketplaceStatus || 'PENDING_APPROVAL' }
                        : item
                )
            );
            showSuccessToast(`Solicitud de publicación para la versión ${versionTag} enviada.`);
            fetchData(); // Opcional: re-fetch para asegurar consistencia, o confiar en la actualización local.
        } catch (err) {
            console.error(`Error requesting publish for version ${versionTag}:`, err);
            showErrorToast(getApiErrorMessage(err, `Error al solicitar publicación para ${versionTag}.`));
        } finally {
            setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: false }));
        }
    };

    const handleUnpublish = async (versionTag: string) => {
        if (!projectId || !promptId || !versionTag) return;
        setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: true }));
        try {
            // Asumimos que el servicio devuelve la versión actualizada
            const updatedVersion = await promptVersionService.unpublish(projectId, promptId, versionTag);
            // Actualizar el estado en itemsList
            setItemsList(prevList =>
                prevList.map(item =>
                    item.versionTag === versionTag
                        ? { ...item, ...updatedVersion, marketplaceStatus: (updatedVersion as PromptVersionMarketplaceDetails).marketplaceStatus || 'NOT_PUBLISHED' }
                        : item
                )
            );
            showSuccessToast(`Version ${versionTag} removed from marketplace.`);
            fetchData(); // Opcional: re-fetch
        } catch (err) {
            console.error(`Error unpublishing version ${versionTag}:`, err);
            showErrorToast(getApiErrorMessage(err, `Error unpublishing ${versionTag} from marketplace.`));
        } finally {
            setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: false }));
        }
    };

    const handleSave = async (payload: CreatePromptVersionDto | UpdatePromptVersionDto, versionTagFromForm?: string, languageCode?: string) => {
        try {
            if (!versionTagFromForm && !editingItem) {
                showErrorToast('Version tag is required for new versions.');
                return;
            }

            if (editingItem) {
                await promptVersionService.update(projectId, promptId, editingItem.versionTag, payload as UpdatePromptVersionDto);
                showSuccessToast('Version updated successfully');
            } else {
                const rawPayload = {
                    promptText: (payload as CreatePromptVersionDto).promptText,
                    changeMessage: payload.changeMessage,
                    initialTranslations: (payload as CreatePromptVersionDto).initialTranslations,
                    versionTag: versionTagFromForm,
                    languageCode: languageCode
                };

                if (!rawPayload.promptText) {
                    showErrorToast('Prompt text is required for new versions.');
                    return;
                }
                if (!rawPayload.versionTag) {
                    showErrorToast('Version tag is somehow missing before API call.');
                    return;
                }
                if (!rawPayload.languageCode) {
                    showErrorToast('Language code is required for new versions.');
                    return;
                }
                // Castear a 'any' temporalmente para diagnóstico, 
                // para permitir que versionTag y languageCode se envíen en el payload a pesar de la definición de CreatePromptVersionDto.
                await promptVersionService.create(projectId, promptId, rawPayload as any);
                showSuccessToast('New version created successfully');
            }
            setFormMode(null);
            fetchData();
        } catch (error: any) {
            console.error('Error saving version:', error);
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error saving version';
            showErrorToast(apiErrorMessage);
        }
    };

    if (!projectId || !promptId) {
        return <p className="text-red-500">Error: Missing Project or Prompt ID in URL.</p>;
    }

    if (projectId !== selectedProjectId) {
        return <p className="text-red-500">Error: Project ID in URL ({projectId}) does not match selected project ({selectedProjectId}).</p>;
    }

    if (selectedPromptId && promptId !== selectedPromptId) {
        return <p className="text-yellow-600 dark:text-yellow-400">Warning: Navigated directly? URL prompt ID ({promptId.substring(0, 6)}...) differs from last selected prompt ({selectedPromptId.substring(0, 6)}...).</p>;
    }

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: breadcrumbLoading ? projectId : (project?.name || projectId), href: `/projects/${projectId}/prompts` },
        { label: breadcrumbLoading ? promptId : (prompt?.name || promptId) },
        { label: "Versions" }
    ];

    if (breadcrumbLoading || loading && !formMode) return <p>Loading page details...</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="my-4">
                <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Manage Prompt Versions</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage the different versions of your prompt. Each version can have its own prompt text, marketplace status (if applicable), and a dedicated set of translations. Create new versions to iterate on your prompt, test changes, or maintain stable releases for consumption.
                </p>
            </div>

            {!formMode && (
                <div className="flex justify-end items-center mb-6 mt-4">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                        disabled={loading}
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add Prompt Version
                    </button>
                </div>
            )}

            {formMode && (
                <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 shadow-md">
                    <h3 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white mb-6">
                        {formMode === 'edit' ? `Editing Version: ${editingItem?.versionTag}` : 'Create New Version of Prompt'}
                    </h3>
                    <PromptVersionForm
                        initialData={editingItem ? {
                            promptText: editingItem.promptText || '',
                            changeMessage: editingItem.changeMessage || '',
                            versionTag: editingItem.versionTag
                        } : null}
                        onSave={handleSave}
                        onCancel={handleCancelForm}
                        latestVersionTag={latestVersionTagForForm ?? undefined}
                        projectId={projectId}
                        promptId={promptId}
                    />
                </div>
            )}

            {/* Botón para comparar versiones seleccionadas */}
            {itemsList.length > 1 && !loading && ( // Mostrar solo si hay más de una versión y no está cargando
                <div className="my-4 flex justify-start gap-x-4 items-center">
                    <button
                        onClick={handleCompareVersions}
                        disabled={selectedVersionsForDiff.length !== 2}
                        title={selectedVersionsForDiff.length !== 2 ? "Select 2 versions from the table to compare" : "Compare selected versions"}
                        className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h4.5M12 3v1.5M12 9v1.5m0 3v1.5m0 3v1.5M12 21v-1.5m6-10.5h-1.5m0 0V5.25m0 3V9m0 3v1.5m0 3V18M3 10.5h1.5m0 0V9m0 3v1.5m0 3V18" />
                        </svg>
                        <span>Compare ({selectedVersionsForDiff.length}/2)</span>
                    </button>
                    {selectedVersionsForDiff.length > 0 && (
                        <button
                            onClick={() => setSelectedVersionsForDiff([])}
                            title="Clear selection"
                            className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>
            )}

            {/* Tabla de versiones */}
            {loading && <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading versions...</p>}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg my-4 shadow" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}
            {!loading && !error && itemsList.length === 0 && (
                <div className="text-center py-10 mt-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No versions</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start creating a new version for this prompt.</p>
                </div>
            )}
            {!loading && !error && itemsList.length > 0 && (
                <PromptVersionsTable
                    promptVersions={itemsList}
                    projectId={projectId}
                    promptIdForTable={promptId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRequestPublish={handleRequestPublish}
                    onUnpublish={handleUnpublish}
                    marketplaceActionLoading={marketplaceActionLoading}
                    selectedVersionsForDiff={selectedVersionsForDiff}
                    onSelectVersionForDiff={handleSelectVersionForDiff}
                />
            )}

            {showDiffModal && diffResult && selectedVersionsForDiff.length === 2 && (() => {
                const v1Details = itemsList.find(item => item.versionTag === selectedVersionsForDiff[0]);
                const v2Details = itemsList.find(item => item.versionTag === selectedVersionsForDiff[1]);

                if (!v1Details || !v2Details) return null; // No debería pasar si selectedVersionsForDiff tiene 2 elementos válidos

                return (
                    <DiffViewerModal
                        isOpen={showDiffModal}
                        onClose={() => {
                            setShowDiffModal(false);
                            setDiffResult(null);
                            // setSelectedVersionsForDiff([]); // Optional: clear selection
                        }}
                        diffResult={diffResult}
                        versionInfo1={{
                            tag: v1Details.versionTag,
                            text: v1Details.promptText
                        }}
                        versionInfo2={{
                            tag: v2Details.versionTag,
                            text: v2Details.promptText
                        }}
                    />
                );
            })()}
        </>
    );
};

export default PromptVersionsPage; 