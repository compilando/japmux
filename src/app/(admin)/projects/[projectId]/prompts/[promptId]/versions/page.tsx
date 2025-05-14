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
    isActive: boolean;
    promptId: string;
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
    // Use local extended type
    const [itemsList, setItemsList] = useState<PromptVersionData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // Use local extended type if editing
    const [editingItem, setEditingItem] = useState<PromptVersionData | null>(null);
    const [latestVersionTagForForm, setLatestVersionTagForForm] = useState<string | null>(null);

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
                // Cast to local interface that includes isActive
                const versionsData = data as PromptVersionData[];
                setItemsList(versionsData);
                // Calcular el último tag después de obtener los datos
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
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptVersionData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemToDelete: PromptVersionData) => {
        if (!projectId || !promptId || !itemToDelete.versionTag) {
            showErrorToast("Cannot delete: version data is incomplete.");
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

    const handleSave = async (payload: CreatePromptVersionDto | UpdatePromptVersionDto) => {
        if (!projectId || !promptId) return;
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.versionTag) {
                await promptVersionService.update(projectId, promptId, editingItem.versionTag!, payload as UpdatePromptVersionDto);
                message = `Version ${editingItem.versionTag} updated successfully!`;
            } else {
                await promptVersionService.create(projectId, promptId, payload as CreatePromptVersionDto);
                message = "New version created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) {
            console.error("Error saving version:", err);
            const defaultMsg = 'Failed to save version.';
            setError(getApiErrorMessage(err, defaultMsg));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (itemToToggle: PromptVersionData) => {
        if (!projectId || !promptId || typeof itemToToggle.isActive === 'undefined' || !itemToToggle.versionTag) {
            showErrorToast('Cannot toggle status: item data is incomplete.');
            return;
        }
        const updatePayload = { isActive: !itemToToggle.isActive };
        setLoading(true);
        try {
            await promptVersionService.update(projectId, promptId, itemToToggle.versionTag!, updatePayload as UpdatePromptVersionDto);
            showSuccessToast(`Version ${itemToToggle.versionTag} active status toggled.`);
            fetchData();
        } catch (err: unknown) {
            console.error("Error toggling active state:", err);
            const defaultMsg = 'Failed to toggle active status.';
            setError(getApiErrorMessage(err, defaultMsg));
        } finally {
            setLoading(false);
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
        { label: breadcrumbLoading ? promptId : (prompt?.name || promptId), href: `/projects/${projectId}/prompts/${promptId}/versions` },
        { label: "Versions" }
    ];

    if (breadcrumbLoading || loading) return <p>Loading version details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={breadcrumbLoading || loading}>
                    Add Prompt Version
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 && !loading ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No versions found for this prompt.</p>
                ) : (
                    <PromptVersionsTable
                        promptVersions={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        projectId={projectId}
                    />
                )
                }
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? `Edit Version (${editingItem.versionTag})` : 'Add New Prompt Version'}
                        </h3>
                        <PromptVersionForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            latestVersionTag={latestVersionTagForForm ?? undefined}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptVersionsPage; 