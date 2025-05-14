"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    // Prompt, // Does not exist or is not used directly
    CreatePromptDto,
    UpdatePromptDto,
    PromptDto,
} from '@/services/generated/api';
import {
    promptService,
    // projectService // Ya no es necesario aquí
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptsTable from '@/components/tables/PromptsTable';
import PromptForm from '@/components/form/PromptForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptDto | null>(null);

    const {
        selectedProjectId,
        isLoading: isLoadingProjectsList, // Renombrado para claridad
        selectedProjectFull,
        isLoadingSelectedProjectFull
    } = useProjects();
    const { isAuthenticated } = useAuth();

    const fetchData = useCallback(async () => {
        setError(null);
        if (!selectedProjectId) {
            setLoading(false);
            setItemsList([]);
            return;
        }
        setLoading(true);
        try {
            const data = await promptService.findAll(selectedProjectId);
            if (Array.isArray(data)) {
                setItemsList(data as PromptDto[]);
            } else {
                console.error("API response for /prompts is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching prompts:", err);
            setError('Failed to fetch prompts.');
            showErrorToast('Failed to fetch prompts.');
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId && isAuthenticated) {
            fetchData();
        } else if (!isLoadingProjectsList && !selectedProjectId) { // Usar isLoadingProjectsList
            setItemsList([]);
            setLoading(false);
            setError("Please select a project to view prompts.");
        }
    }, [selectedProjectId, fetchData, isAuthenticated, isLoadingProjectsList]);

    const handleAdd = () => {
        if (!selectedProjectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (item: PromptDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot edit, no project selected.");
            return;
        }
        setLoading(true);
        try {
            // Asumimos que item.id es el nombre/key del prompt para findOne en este servicio
            const detailedPrompt = await promptService.findOne(selectedProjectId, (item as any).name || item.id);
            setEditingItem(detailedPrompt);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error fetching prompt details for edit:", err);
            showErrorToast("Failed to load prompt details for editing.");
            setEditingItem(null);
            setIsModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (promptId: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        const promptToDelete = itemsList.find(p => p.id === promptId);
        const promptNameToConfirm = promptToDelete ? (promptToDelete as any).name : promptId;

        if (window.confirm(`Are you sure you want to delete prompt \"${promptNameToConfirm}\"?`)) {
            setLoading(true);
            try {
                // Asumimos que promptService.remove usa el id (o nombre si es el identificador)
                await promptService.remove(selectedProjectId, promptId);
                showSuccessToast(`Prompt ${promptNameToConfirm} deleted successfully!`);
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete prompt.';
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: UpdatePromptDto | CreatePromptDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot save, no project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.id) {
                // Asumimos que editingItem.name es el identificador para update si es necesario
                await promptService.update(selectedProjectId, (editingItem as any).name || editingItem.id, payload as UpdatePromptDto);
                message = `Prompt ${(editingItem as any).name || editingItem.id} updated successfully!`;
            } else {
                await promptService.create(selectedProjectId, payload as CreatePromptDto);
                const promptNameFromPayload = (payload as CreatePromptDto).name;
                message = `Prompt ${promptNameFromPayload || 'new prompt'} created successfully!`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save prompt.';
            showErrorToast(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    type BreadcrumbItem = { label: string; href?: string };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (selectedProjectId) {
        breadcrumbs.push({
            // Usar nombre del proyecto del contexto si está disponible y no cargando
            label: isLoadingSelectedProjectFull ? selectedProjectId : (selectedProjectFull?.name || selectedProjectId),
        });
        breadcrumbs.push({ label: "Prompts" });
    } else {
        breadcrumbs.push({ label: "Prompts (Select Project)" });
    }

    // Usar isLoadingProjectsList para el estado general de carga del contexto de proyectos
    if (isLoadingProjectsList) {
        return <p>Loading project context...</p>;
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    {/* Usar nombre del proyecto del contexto */}
                    Prompts for {selectedProjectFull?.name || selectedProjectId}
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all prompts and prompt assets associated with this project.
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${!selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    // Deshabilitar si la lista de prompts está cargando O el proyecto seleccionado aún no está completamente cargado.
                    disabled={!selectedProjectId || loading || isLoadingSelectedProjectFull}
                    title={!selectedProjectId ? "Select a project to add a prompt" : "Add New Prompt"}
                >
                    Add Prompt
                </button>
            </div>

            {!selectedProjectId && !isLoadingProjectsList && (
                <p className="text-yellow-600 dark:text-yellow-400">Please select a project from the dropdown above to see its prompts.</p>
            )}
            {/* Mensaje de carga para la lista de prompts (loading) o para el proyecto seleccionado (isLoadingSelectedProjectFull) */}
            {selectedProjectId && (loading || isLoadingSelectedProjectFull) && <p>Loading prompts...</p>}
            {selectedProjectId && error && <p className="text-red-500">{error}</p>}

            {selectedProjectId && !loading && !error && !isLoadingSelectedProjectFull && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {itemsList.length === 0 ? (
                        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No prompts found for project {selectedProjectFull?.name || selectedProjectId}.
                        </p>
                    ) : (
                        <PromptsTable
                            prompts={itemsList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            projectId={selectedProjectId}
                        />
                    )}
                </div>
            )}

            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt' : 'Add New Prompt'}
                        </h3>
                        <PromptForm
                            initialData={editingItem} // PromptDto
                            onSave={handleSave} // UpdatePromptDto | CreatePromptDto
                            onCancel={() => setIsModalOpen(false)}
                            projectId={selectedProjectId} // Requerido por PromptForm
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptsPage; 