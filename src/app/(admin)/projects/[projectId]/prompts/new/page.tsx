"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CreatePromptDto,
    projectService,
    promptService,
    CreateProjectDto, // Unificado aquí
    UpdatePromptDto // Necesario para la firma de onSave en PromptForm
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
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

const NewPromptPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Definir initialData para un nuevo prompt
    // tenantId ya no se necesita aquí, se infiere en el backend
    const initialDataForNewPrompt: CreatePromptDto = {
        name: '',
        description: '',
        promptText: '',
        // tenantId: projectId, // Eliminado
    };

    useEffect(() => {
        if (projectId) {
            setLoadingProject(true);
            projectService.findOne(projectId)
                .then(data => setProject(data))
                .catch(err => {
                    console.error("Error fetching project details:", err);
                    showErrorToast(getApiErrorMessage(err, "Failed to load project details."));
                    setProject(null); // Asegurarse de que project es null si hay error
                })
                .finally(() => setLoadingProject(false));
        }
    }, [projectId]);

    // La firma de onSave en PromptForm espera (payload: CreatePromptDto | UpdatePromptDto)
    // Aquí sabemos que siempre será CreatePromptDto porque es la página de "nuevo".
    const handleSavePrompt = async (promptPayload: CreatePromptDto | UpdatePromptDto) => {
        if (!projectId) {
            showErrorToast("Project ID is missing.");
            return;
        }

        const createPayload = promptPayload as CreatePromptDto;

        // Validar que los campos necesarios para CreatePromptDto están presentes
        // Se elimina la comprobación de tenantId
        if (!createPayload.name || typeof createPayload.promptText === 'undefined') {
            showErrorToast("Missing required fields for creating a prompt: name or promptText.");
            console.error("Payload incompleto para crear:", createPayload);
            return;
        }

        setIsSaving(true);
        try {
            await promptService.create(projectId, createPayload);
            showSuccessToast(`Prompt "${createPayload.name}" created successfully.`);
            router.push(`/projects/${projectId}/prompts`);
        } catch (err: unknown) {
            console.error("Error creating prompt:", err);
            showErrorToast(getApiErrorMessage(err, "Failed to create prompt."));
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/projects/${projectId}/prompts`);
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        {
            label: loadingProject ? projectId : (project?.name || projectId),
            href: `/projects/${projectId}/prompts`
        },
        { label: "Prompts", href: `/projects/${projectId}/prompts` },
        { label: "New Prompt" }
    ];

    if (loadingProject && !project) {
        return <p>Loading project details...</p>;
    }

    if (!project && !loadingProject) {
        return <p>Error loading project details. Cannot create prompt.</p>;
    }


    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Create New Prompt for <span className="text-indigo-600 dark:text-indigo-400">{project?.name || projectId}</span>
                </h2>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6">
                <PromptForm
                    initialData={initialDataForNewPrompt}
                    projectId={projectId}
                    onSave={handleSavePrompt}
                    onCancel={handleCancel}
                />
            </div>
        </>
    );
};

export default NewPromptPage; 