"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    Project,
    PromptAsset,
    promptAssetService,
    CreatePromptAssetDto,
    UpdatePromptAssetDto,
    projectService
} from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetsTable from '@/components/tables/PromptAssetsTable';
import PromptAssetForm from '@/components/form/PromptAssetForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import Link from 'next/link';

const PromptAssetsPage: React.FC = () => {
    const params = useParams();
    const projectId = params.projectId as string;

    const [itemsList, setItemsList] = useState<PromptAsset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAsset | null>(null);

    const [project, setProject] = useState<Project | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!projectId) return;
        setBreadcrumbLoading(true);
        projectService.findOne(projectId)
            .then(data => setProject(data))
            .catch(err => {
                console.error("Error fetching project for breadcrumbs:", err);
                showErrorToast("Failed to load project details for breadcrumbs.");
                setProject(null);
            })
            .finally(() => setBreadcrumbLoading(false));
    }, [projectId]);

    const fetchData = useCallback(async () => {
        if (!projectId) {
            setError("Project ID is missing from URL.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetService.getAll(projectId);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to fetch items.';
            setError(apiErrorMessage);
            showErrorToast(apiErrorMessage);
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId && isAuthenticated) {
            fetchData();
        } else if (!projectId) {
            setItemsList([]);
            setLoading(false);
            setError("No Project ID provided in the URL.");
        } else if (!isAuthenticated) {
            setItemsList([]);
            setLoading(false);
            setError("User not authenticated.");
        }
    }, [projectId, fetchData, isAuthenticated]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAsset) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (assetKey: string) => {
        if (!projectId) {
            showErrorToast("Cannot delete, Project ID missing.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the asset with key: ${assetKey}? This might affect linked prompt versions.`)) {
            setLoading(true);
            try {
                await promptAssetService.remove(projectId, assetKey);
                showSuccessToast("Prompt Asset deleted successfully!");
                fetchData();
            } catch (err) {
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete item.';
                setError(apiErrorMessage);
                console.error(err);
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: any /* CreatePromptAssetDto | UpdatePromptAssetDto */) => {
        if (!projectId) {
            showErrorToast("Cannot save, Project ID missing.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingItem) {
                const updatePayload: UpdatePromptAssetDto = {
                    name: payload.name,
                    type: payload.type,
                    description: payload.description,
                    category: payload.category,
                    enabled: payload.enabled,
                };
                await promptAssetService.update(projectId, editingItem.key, updatePayload);
                message = "Prompt Asset updated successfully!";
            } else {
                await promptAssetService.create(projectId, payload as CreatePromptAssetDto);
                message = "Prompt Asset created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save item.';
            setError(apiErrorMessage);
            console.error(err);
            showErrorToast(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: breadcrumbLoading ? projectId : (project?.name || projectId), href: `/projects/${projectId}/assets` },
        { label: "Assets" }
    ];

    if (!projectId) {
        return <p className="text-red-500">Error: Project ID not found in URL.</p>;
    }
    if (breadcrumbLoading || loading) return <p>Loading asset details...</p>;
    if (error && !loading) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    disabled={loading || breadcrumbLoading}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Add Prompt Asset
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 && !loading ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt assets found for project {project?.name || projectId}.</p>
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
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? `Edit Asset: ${editingItem.key}` : 'Add New Prompt Asset'}
                        </h3>
                        <PromptAssetForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                        {loading && <p className="text-sm text-center mt-2">Saving...</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptAssetsPage; 