"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CreateProjectDto,
    CreatePromptDto,
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

// --- Interfaces Locales Extendidas ---
// Asume that the API returns isActive even though the generated DTO does not include it
interface PromptVersionData extends CreatePromptVersionDto {
    isActive: boolean;
}

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

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [prompt, setPrompt] = useState<CreatePromptDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const router = useRouter();
    const { selectedProjectId } = useProjects();
    const { selectedPromptId } = usePrompts();

    const projectId = params.projectId as string;
    const promptId = params.promptId as string;

    useEffect(() => {
        if (!projectId || !promptId) return;

        const fetchBreadcrumbData = async () => {
            setBreadcrumbLoading(true);
            try {
                console.log('[fetchBreadcrumbData] Attempting to fetch with projectId:', projectId, 'and promptId (actually promptName):', promptId);
                const [projectData, promptData] = await Promise.all([
                    projectService.findOne(projectId),
                    promptService.findOne(projectId, promptId)
                ]);
                setProject(projectData);
                setPrompt(promptData);
            } catch (error) {
                console.error("Error fetching breadcrumb data:", error);
                showErrorToast("Failed to load project or prompt details for breadcrumbs.");
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
                setItemsList(data as PromptVersionData[]);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch items.');
            showErrorToast('Failed to fetch prompt versions.');
            setItemsList([]);
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
        if (!projectId || !promptId) return;
        if (window.confirm(`Are you sure you want to delete version tag "${itemToDelete.versionTag}"?`)) {
            setLoading(true);
            try {
                await promptVersionService.remove(projectId, promptId, itemToDelete.versionTag);
                showSuccessToast(`Version ${itemToDelete.versionTag} deleted successfully!`);
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete version.';
                showErrorToast(apiErrorMessage);
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
            if (editingItem) {
                await promptVersionService.update(projectId, promptId, editingItem.versionTag, payload as UpdatePromptVersionDto);
                message = `Version ${editingItem.versionTag} updated successfully!`;
            } else {
                await promptVersionService.create(projectId, promptId, payload as CreatePromptVersionDto);
                message = "New version created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save version.';
            showErrorToast(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (itemToToggle: PromptVersionData) => {
        console.log("[handleToggleActive] Called with item:", JSON.stringify(itemToToggle, null, 2));
        if (!projectId || !promptId || typeof itemToToggle.isActive === 'undefined') {
            console.error("[handleToggleActive] Missing IDs or isActive property on item");
            showErrorToast('Cannot toggle status: item data is incomplete.')
            return;
        }

        const payload = { isActive: !itemToToggle.isActive };
        console.log("[handleToggleActive] Payload prepared for UPDATE:", payload);

        setLoading(true);
        try {
            console.log("[handleToggleActive] Entering try block, about to call UPDATE service...");
            await promptVersionService.update(projectId, promptId, itemToToggle.versionTag, payload as UpdatePromptVersionDto);
            console.log("[handleToggleActive] UPDATE Service call successful (apparently).");
            showSuccessToast(`Version ${itemToToggle.versionTag} active status toggled.`);
            fetchData();
        } catch (err) {
            console.error("[handleToggleActive] Caught error during UPDATE:", err);
            setError('Failed to toggle active state');
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to toggle active status.';
            showErrorToast(apiErrorMessage);
        } finally {
            console.log("[handleToggleActive] Entering finally block.");
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
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptVersionsPage; 