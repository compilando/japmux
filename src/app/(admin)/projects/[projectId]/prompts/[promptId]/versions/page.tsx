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
        // --- INICIO: Limpiar error SIEMPRE al intentar cargar datos ---
        setError(null);
        // --- FIN: Limpiar error ---

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
                    const v = v_any as CreatePromptVersionDto & Partial<{ id: string, versionTag: string, isActive: boolean, marketplaceStatus: string, promptId: string, createdAt: string }>;
                    return {
                        ...v,
                        id: v.id || v.versionTag || String(Date.now() + Math.random()),
                        versionTag: v.versionTag || 'N/A',
                        isActive: v.isActive || false,
                        promptId: v.promptId || promptId,
                        marketplaceStatus: v.marketplaceStatus,
                        createdAt: v.createdAt
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

    const handleSave = async (payload: CreatePromptVersionDto | UpdatePromptVersionDto, versionTagFromForm?: string) => {
        try {
            if (!versionTagFromForm && !editingItem) {
                showErrorToast('Version tag is required for new versions.');
                return;
            }

            if (editingItem) {
                await promptVersionService.update(projectId, promptId, editingItem.versionTag, payload as UpdatePromptVersionDto);
                showSuccessToast('Versión actualizada correctamente');
            } else {
                const rawPayload = {
                    promptText: (payload as CreatePromptVersionDto).promptText,
                    changeMessage: payload.changeMessage,
                    initialTranslations: (payload as CreatePromptVersionDto).initialTranslations,
                    versionTag: versionTagFromForm
                };

                if (!rawPayload.promptText) {
                    showErrorToast('Prompt text is required for new versions.');
                    return;
                }
                if (!rawPayload.versionTag) {
                    showErrorToast('Version tag is somehow missing before API call.');
                    return;
                }
                // Castear a 'any' temporalmente para diagnóstico, 
                // para permitir que versionTag se envíe en el payload a pesar de la definición de CreatePromptVersionDto.
                await promptVersionService.create(projectId, promptId, rawPayload as any);
                showSuccessToast('Nueva versión creada correctamente');
            }
            setFormMode(null);
            fetchData();
        } catch (error: any) {
            console.error('Error saving version:', error);
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error al guardar la versión';
            showErrorToast(apiErrorMessage);
        }
    };

    const handleRequestPublish = async (versionTag: string) => {
        if (!projectId || !promptId || !versionTag) return;
        setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: true }));
        try {
            const updatedVersion = await promptVersionService.requestPublish(projectId, promptId, versionTag);
            setItemsList(prevList =>
                prevList.map(item =>
                    item.versionTag === versionTag
                        ? { ...item, ...updatedVersion, marketplaceStatus: (updatedVersion as PromptVersionMarketplaceDetails).marketplaceStatus || 'PENDING_APPROVAL' }
                        : item
                )
            );
            showSuccessToast(`Solicitud de publicación para la versión ${versionTag} enviada.`);
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
            const updatedVersion = await promptVersionService.unpublish(projectId, promptId, versionTag);
            setItemsList(prevList =>
                prevList.map(item =>
                    item.versionTag === versionTag
                        ? { ...item, ...updatedVersion, marketplaceStatus: (updatedVersion as PromptVersionMarketplaceDetails).marketplaceStatus || 'NOT_PUBLISHED' }
                        : item
                )
            );
            showSuccessToast(`Versión ${versionTag} retirada del marketplace.`);
        } catch (err) {
            console.error(`Error unpublishing version ${versionTag}:`, err);
            showErrorToast(getApiErrorMessage(err, `Error al retirar ${versionTag} del marketplace.`));
        } finally {
            setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: false }));
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
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 my-8 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        {formMode === 'edit' && editingItem ? `Edit Version (${editingItem.versionTag})` : 'Add New Prompt Version'}
                    </h3>
                    <PromptVersionForm
                        initialData={formMode === 'edit' ? editingItem : null}
                        onSave={handleSave}
                        onCancel={handleCancelForm}
                        latestVersionTag={latestVersionTagForForm ?? undefined}
                        projectId={projectId}
                        promptId={promptId}
                    />
                </div>
            )}

            {error && !formMode && <p className="text-red-500 py-2 text-center">Error loading versions: {error}</p>}

            {loading && !formMode && <p className="text-center py-4">Loading versions...</p>}

            {!loading && !error && (
                itemsList.length === 0 && !formMode ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No versions found for this prompt.</p>
                ) : !formMode && (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <PromptVersionsTable
                            promptVersions={itemsList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRequestPublish={handleRequestPublish}
                            onUnpublish={handleUnpublish}
                            marketplaceActionLoading={marketplaceActionLoading}
                            projectId={projectId}
                            promptIdForTable={promptId}
                        />
                    </div>
                )
            )}
        </>
    );
};

export default PromptVersionsPage; 