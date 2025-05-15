"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    // Prompt, // Does not exist or is not used directly
    CreatePromptDto,
    UpdatePromptDto,
    PromptDto,
} from '@/services/generated/api';
import {
    promptService,
    projectService,
    CreateProjectDto,
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptsTable from '@/components/tables/PromptsTable';
import PromptForm from '@/components/form/PromptForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

// Helper para extraer mensajes de error de forma segura
const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

const PromptsPage: React.FC = () => {
    const [prompts, setPrompts] = useState<PromptDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;

    useEffect(() => {
        if (!projectId) return;
        setBreadcrumbLoading(true);
        projectService.findOne(projectId)
            .then(data => setProject(data))
            .catch(err => {
                console.error("Error fetching project details:", err);
                showErrorToast(getApiErrorMessage(err, "Failed to load project details."));
                setProject(null);
            })
            .finally(() => setBreadcrumbLoading(false));
    }, [projectId]);

    const fetchPrompts = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await promptService.findAll(projectId);
            setPrompts(data);
        } catch (err: unknown) {
            console.error("Error fetching prompts:", err);
            setError(getApiErrorMessage(err, "Failed to fetch prompts."));
            setPrompts([]);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const handleAddPrompt = () => {
        router.push(`/projects/${projectId}/prompts/new`);
    };

    const handleEditPrompt = (promptToEdit: PromptDto) => {
        if (promptToEdit && promptToEdit.id) {
            router.push(`/projects/${projectId}/prompts/${promptToEdit.id}/edit`);
        } else {
            showErrorToast("Prompt ID is missing, cannot navigate to edit page.");
            console.error("Attempted to edit prompt without an ID:", promptToEdit);
        }
    };

    const handleDeletePrompt = async (promptIdToDelete: string, promptName?: string) => {
        const confirmMessage = promptName ? `Are you sure you want to delete prompt "${promptName}"?` : "Are you sure you want to delete this prompt?";
        if (window.confirm(confirmMessage)) {
            setLoading(true);
            try {
                await promptService.remove(projectId, promptIdToDelete);
                showSuccessToast(`Prompt ${promptName || promptIdToDelete} deleted.`);
                fetchPrompts();
            } catch (err: unknown) {
                console.error("Error deleting prompt:", err);
                setError(getApiErrorMessage(err, "Failed to delete prompt."));
            } finally {
                setLoading(false);
            }
        }
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: breadcrumbLoading ? projectId : (project?.name || projectId), href: `/projects/${projectId}/prompts` },
        { label: "Prompts" }
    ];

    if (breadcrumbLoading) return <p>Loading project details...</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Prompts for <span className="text-indigo-600 dark:text-indigo-400">{project?.name || projectId}</span>
                </h2>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Create, view, and manage all prompts associated with this project. Each prompt can have multiple versions and translations.
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddPrompt}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading || breadcrumbLoading}
                >
                    Add New Prompt
                </button>
            </div>

            {error && <p className="text-red-500 py-2">Error: {error}</p>}
            {loading && !prompts.length ? (
                <p>Loading prompts...</p>
            ) : !loading && prompts.length === 0 && !error ? (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompts found for this project.</p>
            ) : (
                <PromptsTable
                    prompts={prompts}
                    onEdit={handleEditPrompt}
                    onDelete={handleDeletePrompt}
                    loading={loading}
                    projectId={projectId}
                />
            )}
        </>
    );
};

export default PromptsPage; 