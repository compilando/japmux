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
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptsTable from '@/components/tables/PromptsTable';
import PromptForm from '@/components/form/PromptForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import logger from '@/utils/logger';

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
    const [loadingPrompts, setLoadingPrompts] = useState<boolean>(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [deletingPrompts, setDeletingPrompts] = useState<Set<string>>(new Set());
    const [lastDeleteTime, setLastDeleteTime] = useState<number>(0);

    const params = useParams();
    const router = useRouter();
    const urlProjectId = params.projectId as string;

    const {
        selectedProjectId: contextProjectId,
        isLoading: projectContextIsLoading,
        selectedProjectFull,
        refreshProjects
    } = useProjects();

    logger.debug(`PromptsPage Rendering. urlProjectId: ${urlProjectId}, contextProjectId: ${contextProjectId}, projectContextIsLoading: ${projectContextIsLoading}, selectedProjectFull: ${selectedProjectFull?.name}`);

    const fetchPrompts = useCallback(async () => {
        if (!contextProjectId) {
            logger.debug("fetchPrompts: No contextProjectId, skipping fetch.");
            setPrompts([]);
            setLoadingPrompts(false);
            return;
        }
        logger.debug(`fetchPrompts: Fetching for contextProjectId: ${contextProjectId}`);
        setLoadingPrompts(true);
        setPageError(null);
        try {
            const data = await promptService.findAll(contextProjectId);
            logger.debug("fetchPrompts: Received data", data);
            logger.debug("fetchPrompts: First few prompt IDs", data.slice(0, 5).map(p => ({ id: p.id, name: p.name })));
            setPrompts(data);
        } catch (err: unknown) {
            logger.error("Error fetching prompts", err);
            setPageError(getApiErrorMessage(err, "Failed to fetch prompts."));
            setPrompts([]);
        } finally {
            setLoadingPrompts(false);
        }
    }, [contextProjectId]);

    useEffect(() => {
        if (!projectContextIsLoading && contextProjectId) {
            console.log("[PromptsPage] useEffect[fetchPrompts]: Context ready and contextProjectId available. Calling fetchPrompts.");
            fetchPrompts();
        } else {
            console.log("[PromptsPage] useEffect[fetchPrompts]: Context loading or no contextProjectId. Prompts will not be fetched yet.");
            setPrompts([]);
            if (projectContextIsLoading) setLoadingPrompts(true);
            else setLoadingPrompts(false);
        }
    }, [projectContextIsLoading, contextProjectId, fetchPrompts]);

    const handleAddPrompt = () => {
        if (contextProjectId) {
            router.push(`/projects/${contextProjectId}/prompts/new`);
        } else {
            showErrorToast("No project selected in context to add a new prompt.");
        }
    };

    const handleEditPrompt = (promptToEdit: PromptDto) => {
        if (contextProjectId && promptToEdit && promptToEdit.id) {
            router.push(`/projects/${contextProjectId}/prompts/${promptToEdit.id}/edit`);
        } else {
            showErrorToast("Project ID from context or Prompt ID is missing.");
        }
    };

    // Debouncing para operaciones de eliminación
    const handleDeletePrompt = useCallback(async (promptIdToDelete: string, promptName?: string) => {
        logger.debug("handleDeletePrompt called", {
            promptIdToDelete,
            promptName,
            contextProjectId,
            urlProjectId
        });

        // Verificar si ya está siendo eliminado (debouncing)
        if (deletingPrompts.has(promptIdToDelete)) {
            logger.debug(`Prompt ${promptIdToDelete} is already being deleted, ignoring duplicate request`);
            showErrorToast("Esta operación ya está en progreso. Por favor espera.");
            return;
        }

        // Prevenir clicks muy rápidos (debounce adicional de 1 segundo)
        const currentTime = Date.now();
        if (currentTime - lastDeleteTime < 1000) {
            logger.debug("Delete operation too soon after last delete, ignoring");
            showErrorToast("Por favor espera un momento antes de eliminar otro prompt.");
            return;
        }
        setLastDeleteTime(currentTime);

        if (!contextProjectId) {
            showErrorToast("No hay proyecto seleccionado en el contexto.");
            return;
        }

        const confirmMessage = promptName
            ? `¿Estás seguro de que quieres eliminar el prompt "${promptName}"?`
            : "¿Estás seguro de que quieres eliminar este prompt?";

        if (window.confirm(confirmMessage)) {
            // Marcar como eliminándose
            setDeletingPrompts(prev => new Set(prev).add(promptIdToDelete));

            try {
                logger.debug("Calling promptService.remove", {
                    projectId: contextProjectId,
                    promptId: promptIdToDelete
                });

                // Actualización optimística del estado local
                setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptIdToDelete));

                await promptService.remove(contextProjectId, promptIdToDelete);
                showSuccessToast(`Prompt ${promptName || promptIdToDelete} eliminado correctamente.`);

                // Sincronizar con el servidor
                await fetchPrompts();
            } catch (err: unknown) {
                logger.error("Error deleting prompt", err);

                // Manejo mejorado de errores
                let errorMessage = "Error al eliminar el prompt.";
                if (err && typeof err === 'object' && 'response' in err) {
                    const axiosError = err as any;
                    const status = axiosError.response?.status;
                    const responseData = axiosError.response?.data;

                    switch (status) {
                        case 404:
                            errorMessage = `Prompt con ID "${promptIdToDelete}" no encontrado en el proyecto "${contextProjectId}". Puede que ya haya sido eliminado.`;
                            break;
                        case 500:
                            errorMessage = `Error interno del servidor al eliminar "${promptName || promptIdToDelete}". Por favor revisa los logs del servidor o intenta más tarde.`;
                            break;
                        case 429:
                            errorMessage = `Demasiadas solicitudes. Por favor espera un momento e intenta de nuevo.`;
                            break;
                        case 403:
                            errorMessage = `Permisos denegados. No tienes derechos para eliminar este prompt.`;
                            break;
                        default:
                            if (responseData?.message) {
                                errorMessage = responseData.message;
                            } else {
                                errorMessage = `Error ${status}: No se pudo eliminar el prompt "${promptName || promptIdToDelete}".`;
                            }
                    }
                } else if (err instanceof Error) {
                    errorMessage = `Error de red: ${err.message}`;
                }

                setPageError(errorMessage);
                showErrorToast(errorMessage);

                // En caso de error, restaurar el estado correcto
                await fetchPrompts();
            } finally {
                // Remover de la lista de eliminándose
                setDeletingPrompts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(promptIdToDelete);
                    return newSet;
                });
            }
        }
    }, [contextProjectId, urlProjectId, deletingPrompts, fetchPrompts, lastDeleteTime]);

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        {
            label: projectContextIsLoading ? urlProjectId : (selectedProjectFull?.name || contextProjectId || urlProjectId),
            href: contextProjectId ? `/projects/${contextProjectId}/prompts` : `/projects/${urlProjectId}/prompts`
        },
        { label: "Prompts" }
    ];

    if (projectContextIsLoading) return <p>Loading project information...</p>;
    if (!contextProjectId && !projectContextIsLoading) {
        return <p>No project is currently selected. Please select a project from the header.</p>;
    }
    if ((contextProjectId && !selectedProjectFull && !pageError) || loadingPrompts) {
        return <p>Loading prompts for {selectedProjectFull?.name || contextProjectId}...</p>;
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Prompts for <span className="text-indigo-600 dark:text-indigo-400">{selectedProjectFull?.name || contextProjectId}</span>
                </h2>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Create, view, and manage all prompts associated with this project. Each prompt can have multiple versions and translations.
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddPrompt}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loadingPrompts || projectContextIsLoading || !contextProjectId}
                >
                    Add New Prompt
                </button>
            </div>

            {pageError && <p className="text-red-500 py-2">Error: {pageError}</p>}

            {!loadingPrompts && prompts.length === 0 && !pageError ? (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompts found for this project.</p>
            ) : (
                <PromptsTable
                    prompts={prompts}
                    onEdit={handleEditPrompt}
                    onDelete={handleDeletePrompt}
                    loading={loadingPrompts}
                    projectId={contextProjectId || ''}
                    deletingPrompts={deletingPrompts}
                />
            )}
        </>
    );
};

export default PromptsPage; 