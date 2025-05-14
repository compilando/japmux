"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    CreatePromptAssetDto,
    UpdatePromptAssetDto,
    CreateProjectDto,
} from '@/services/generated/api';
import {
    promptAssetService,
    projectService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetsTable, { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import PromptAssetForm from '@/components/form/PromptAssetForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptAssetsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAssetData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetData | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const { selectedProjectId } = useProjects();

    const projectId = selectedProjectId || params.projectId as string;

    useEffect(() => {
        if (projectId) {
            setBreadcrumbLoading(true);
            projectService.findOne(projectId)
                .then(data => setProject(data as CreateProjectDto))
                .catch(err => {
                    console.error("Error fetching project for breadcrumbs:", err);
                    showErrorToast("Failed to load project details for breadcrumbs.");
                    setProject(null);
                })
                .finally(() => setBreadcrumbLoading(false));
        } else {
            setProject(null);
            setBreadcrumbLoading(false);
        }
    }, [projectId]);

    const fetchData = useCallback(async () => {
        if (!projectId) {
            setError("Project ID is missing.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const data = await promptAssetService.findAll(projectId);
            if (Array.isArray(data)) {
                setItemsList(data as PromptAssetData[]);
            } else {
                console.error("API response for assets is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching assets:", err);
            setError('Failed to fetch assets.');
            showErrorToast('Failed to fetch prompt assets.');
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        if (!projectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetData) => {
        if (!projectId) {
            showErrorToast("Cannot edit, no project selected.");
            return;
        }
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (assetKey: string) => {
        if (!projectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete asset "${assetKey}"?`)) {
            setLoading(true);
            try {
                await promptAssetService.remove(projectId, assetKey);
                showSuccessToast(`Asset ${assetKey} deleted successfully!`);
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete asset.';
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptAssetDto | UpdatePromptAssetDto) => {
        if (!projectId) {
            showErrorToast("Cannot save, no project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.key) {
                await promptAssetService.update(projectId, editingItem.key, payload as UpdatePromptAssetDto);
                message = `Asset ${editingItem.key} updated successfully!`;
            } else {
                const createPayload = payload as CreatePromptAssetDto;
                if (!createPayload.key) {
                    showErrorToast("Asset key is required for creation.");
                    setLoading(false);
                    return;
                }
                await promptAssetService.create(projectId, createPayload);
                message = `Asset ${createPayload.key} created successfully!`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save asset.';
            showErrorToast(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (projectId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? projectId : (project?.name || projectId),
            href: `/projects/${projectId}/prompts`
        });
        breadcrumbs.push({ label: "Assets" });
    } else {
        breadcrumbs.push({ label: "Assets (Select Project)" });
    }

    if (!projectId) {
        return <p className="text-yellow-600 dark:text-yellow-400">Please select a project to view assets.</p>;
    }
    if (loading || breadcrumbLoading) return <p>Loading assets...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Prompt Assets for {project?.name || projectId}
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all prompts and prompt assets associated with this project.
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    disabled={loading}
                    title="Add New Prompt Asset"
                >
                    Add Asset
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt assets found for this project.</p>
                ) : (
                    <PromptAssetsTable
                        promptAssets={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        projectId={projectId}
                        loading={loading}
                    />
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt Asset' : 'Add New Prompt Asset'}
                        </h3>
                        <PromptAssetForm
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

export default PromptAssetsPage; 