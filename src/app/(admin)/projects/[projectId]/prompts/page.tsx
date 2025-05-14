"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingPrompt, setEditingPrompt] = useState<CreatePromptDto | null>(null);
    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
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
        setEditingPrompt(null);
        setIsModalOpen(true);
    };

    const handleEditPrompt = (promptToEdit: PromptDto) => {
        // Definir una interfaz extendida para el promptToEdit con campo opcional promptText
        interface PromptWithOptionalPromptText extends PromptDto {
            promptText?: string;
        }

        const typedPromptToEdit = promptToEdit as PromptWithOptionalPromptText;

        const formInitialData: CreatePromptDto = {
            name: typedPromptToEdit.name,
            description: typedPromptToEdit.description,
            promptText: typedPromptToEdit.promptText || '',
            tenantId: projectId,
        };
        setEditingPrompt(formInitialData);
        setIsModalOpen(true);
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

    const handleSavePrompt = async (promptPayload: CreatePromptDto | UpdatePromptDto) => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            if (editingPrompt && editingPrompt.name) {
                await promptService.update(projectId, editingPrompt.name, promptPayload as UpdatePromptDto);
                showSuccessToast(`Prompt ${editingPrompt.name} updated.`);
            } else {
                await promptService.create(projectId, promptPayload as CreatePromptDto);
                showSuccessToast(`Prompt ${(promptPayload as CreatePromptDto).name} created successfully.`);
            }
            setIsModalOpen(false);
            fetchPrompts();
        } catch (err: unknown) {
            console.error("Error saving prompt:", err);
            setError(getApiErrorMessage(err, "Failed to save prompt."));
        } finally {
            setLoading(false);
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
            <div className="flex justify-between items-center my-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Prompts Management</h1>
                <button onClick={handleAddPrompt} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
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
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative p-6 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                            {editingPrompt ? `Edit Prompt: ${editingPrompt.name}` : 'Create New Prompt'}
                        </h3>
                        <PromptForm
                            initialData={editingPrompt}
                            projectId={projectId}
                            onSave={handleSavePrompt}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setEditingPrompt(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptsPage; 