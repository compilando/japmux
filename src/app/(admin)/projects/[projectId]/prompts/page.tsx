"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    // Prompt, // Does not exist or is not used directly
    CreateProjectDto,
    CreatePromptDto,
    UpdatePromptDto,
} from '@/services/generated/api';
import {
    promptService,
    projectService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptsTable from '@/components/tables/PromptsTable';
import PromptForm from '@/components/form/PromptForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<CreatePromptDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<CreatePromptDto | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const { selectedProjectId, isLoading: isLoadingProject, projects: projectList } = useProjects();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (selectedProjectId && Array.isArray(projectList) && projectList.length > 0) {
            setBreadcrumbLoading(true);
            const currentProject = projectList.find(p => p.id === selectedProjectId);
            if (currentProject) {
                setProject(currentProject as CreateProjectDto);
                setBreadcrumbLoading(false);
            } else {
                projectService.findOne(selectedProjectId)
                    .then(data => setProject(data as CreateProjectDto))
                    .catch(err => {
                        console.error("Error fetching project for breadcrumbs:", err);
                        showErrorToast("Failed to load project details for breadcrumbs.");
                        setProject(null);
                    })
                    .finally(() => setBreadcrumbLoading(false));
            }
        } else if (!selectedProjectId) {
            setProject(null);
            setBreadcrumbLoading(false);
        }
    }, [selectedProjectId, projectList]);

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
                setItemsList(data as CreatePromptDto[]);
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
        } else if (!isLoadingProject && !selectedProjectId) {
            setItemsList([]);
            setLoading(false);
            setError("Please select a project to view prompts.");
        }
    }, [selectedProjectId, fetchData, isAuthenticated, isLoadingProject]);

    const handleAdd = () => {
        if (!selectedProjectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: CreatePromptDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot edit, no project selected.");
            return;
        }
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (promptName: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete prompt "${promptName}"?`)) {
            setLoading(true);
            try {
                await promptService.remove(selectedProjectId, promptName);
                showSuccessToast(`Prompt ${promptName} deleted successfully!`);
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

    const handleSave = async (payload: CreatePromptDto | UpdatePromptDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot save, no project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingItem) {
                await promptService.update(selectedProjectId, editingItem.name, payload as UpdatePromptDto);
                message = `Prompt ${editingItem.name} updated successfully!`;
            } else {
                await promptService.create(selectedProjectId, payload as CreatePromptDto);
                message = "Prompt created successfully!";
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
            label: breadcrumbLoading ? selectedProjectId : (project?.name || selectedProjectId),
        });
        breadcrumbs.push({ label: "Prompts" });
    } else {
        breadcrumbs.push({ label: "Prompts (Select Project)" });
    }

    if (isLoadingProject) {
        return <p>Loading project context...</p>;
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${!selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={!selectedProjectId || loading || breadcrumbLoading}
                    title={!selectedProjectId ? "Select a project to add a prompt" : "Add New Prompt"}
                >
                    Add Prompt
                </button>
            </div>

            {!selectedProjectId && !isLoadingProject && (
                <p className="text-yellow-600 dark:text-yellow-400">Please select a project from the dropdown above to see its prompts.</p>
            )}
            {selectedProjectId && loading && <p>Loading prompts...</p>}
            {selectedProjectId && error && <p className="text-red-500">{error}</p>}

            {selectedProjectId && !loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {itemsList.length === 0 ? (
                        <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompts found for project {project?.name || selectedProjectId}.</p>
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
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt' : 'Add New Prompt'}
                        </h3>
                        <PromptForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            projectId={selectedProjectId}
                        />
                        {loading && <p className="text-sm text-center mt-2">Saving...</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptsPage; 