"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CreatePromptAssetDto,
    UpdatePromptAssetDto,
} from '@/services/generated/api';
import {
    promptAssetService,
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetsTable, { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import PromptAssetForm from '@/components/form/PromptAssetForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import axios from 'axios';

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

const PromptAssetsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAssetData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetData | null>(null);

    const params = useParams();
    const router = useRouter();
    const urlProjectId = params.projectId as string;

    const {
        selectedProjectId: contextProjectId,
        selectedProjectFull,
        isLoading: projectContextIsLoading
    } = useProjects();

    console.log("[PromptAssetsPage] Rendering. urlProjectId:", urlProjectId, "contextProjectId:", contextProjectId, "projectContextIsLoading:", projectContextIsLoading, "selectedProjectFull:", selectedProjectFull?.name);

    useEffect(() => {
        if (contextProjectId && urlProjectId && contextProjectId !== urlProjectId && !projectContextIsLoading) {
            console.log(`[PromptAssetsPage] URL projectId (${urlProjectId}) differs from context projectId (${contextProjectId}). Navigating...`);
            router.replace(`/projects/${contextProjectId}/prompt-assets`);
        }
    }, [contextProjectId, urlProjectId, projectContextIsLoading, router]);

    const fetchData = useCallback(async () => {
        if (!contextProjectId) {
            console.log("[PromptAssetsPage] fetchData: No contextProjectId, skipping fetch.");
            setError("Project ID from context is missing.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        console.log(`[PromptAssetsPage] fetchData: Fetching for contextProjectId: ${contextProjectId}`);
        setError(null);
        setLoading(true);
        try {
            const data = await promptAssetService.findAll(contextProjectId);
            if (Array.isArray(data)) {
                setItemsList(data as PromptAssetData[]);
            } else {
                console.error("API response for assets is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err: unknown) {
            console.error("[PromptAssetsPage] Error fetching assets:", err);
            const defaultMsg = 'Failed to fetch prompt assets.';
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            setError(apiErrorMessage);
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [contextProjectId]);

    useEffect(() => {
        if (!projectContextIsLoading && contextProjectId) {
            console.log("[PromptAssetsPage] useEffect[fetchData]: Context ready. Calling fetchData.");
            fetchData();
        } else {
            console.log("[PromptAssetsPage] useEffect[fetchData]: Context loading or no contextProjectId. Data will not be fetched yet.");
            setItemsList([]);
            if (projectContextIsLoading) setLoading(true);
            else setLoading(false);
        }
    }, [projectContextIsLoading, contextProjectId, fetchData]);

    const handleAdd = () => {
        if (!contextProjectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetData) => {
        if (!contextProjectId) {
            showErrorToast("Cannot edit, no project selected.");
            return;
        }
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (assetKey: string) => {
        if (!contextProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete asset "${assetKey}"?`)) {
            setLoading(true);
            try {
                await promptAssetService.remove(contextProjectId, assetKey);
                showSuccessToast(`Asset ${assetKey} deleted successfully!`);
                fetchData();
            } catch (err: unknown) {
                console.error("Error deleting asset:", err);
                const defaultMsg = 'Failed to delete asset.';
                const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
                setError(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptAssetDto | UpdatePromptAssetDto) => {
        if (!contextProjectId) {
            showErrorToast("Cannot save, no project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.key) {
                await promptAssetService.update(contextProjectId, editingItem.key, payload as UpdatePromptAssetDto);
                message = `Asset ${editingItem.key} updated successfully!`;
            } else {
                const createPayload = payload as CreatePromptAssetDto;
                if (!createPayload.key) {
                    showErrorToast("Asset key is required for creation.");
                    setLoading(false);
                    return;
                }
                await promptAssetService.create(contextProjectId, createPayload);
                message = `Asset ${createPayload.key} created successfully!`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) {
            console.error("Error saving asset:", err);
            const defaultMsg = 'Failed to save asset.';
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            setError(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (contextProjectId) {
        breadcrumbs.push({
            label: projectContextIsLoading ? urlProjectId : (selectedProjectFull?.name || contextProjectId),
            href: `/projects/${contextProjectId}/prompts`
        });
        breadcrumbs.push({ label: "Assets" });
    } else if (urlProjectId && !projectContextIsLoading) {
        breadcrumbs.push({ label: urlProjectId });
        breadcrumbs.push({ label: "Assets (Project from URL - check selection)" });
    } else {
        breadcrumbs.push({ label: "Assets (Select Project)" });
    }

    if (projectContextIsLoading) {
        return <p>Loading project information...</p>;
    }
    if (!contextProjectId && !projectContextIsLoading) {
        return <p className="text-yellow-600 dark:text-yellow-400">Please select a project to view assets.</p>;
    }
    if ((contextProjectId && !selectedProjectFull && !error) || loading) {
        return <p>Loading assets for {selectedProjectFull?.name || contextProjectId}...</p>;
    }
    if (error && contextProjectId) return <p className="text-red-500 py-2">Error: {error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Prompt Assets for {selectedProjectFull?.name || contextProjectId}
                </h2>
                <p className="text-base font-medium text-white">
                    Create, view, and manage all prompt assets associated with this prompt.
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    disabled={loading || projectContextIsLoading || !contextProjectId}
                    title="Add New Prompt Asset"
                >
                    Add Asset
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {!loading && itemsList.length === 0 && !error ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt assets found for project {selectedProjectFull?.name || contextProjectId}.</p>
                ) : (
                    <PromptAssetsTable
                        promptAssets={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        projectId={contextProjectId || ''}
                        loading={loading}
                    />
                )}
            </div>

            {isModalOpen && contextProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
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