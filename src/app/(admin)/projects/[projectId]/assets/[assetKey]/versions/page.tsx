"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    Project,
    PromptAsset,
    PromptAssetVersion,
    promptAssetService,
    CreatePromptAssetVersionDto,
    UpdatePromptAssetVersionDto,
    projectService
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetVersionsTable from '@/components/tables/PromptAssetVersionsTable';
import PromptAssetVersionForm from '@/components/form/PromptAssetVersionForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptAssetVersionsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAssetVersion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetVersion | null>(null);

    const [project, setProject] = useState<Project | null>(null);
    const [asset, setAsset] = useState<PromptAsset | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const projectId = params.projectId as string;
    const assetKey = params.assetKey as string;

    useEffect(() => {
        if (!projectId || !assetKey) return;

        const fetchBreadcrumbData = async () => {
            setBreadcrumbLoading(true);
            try {
                const [projectData, assetData] = await Promise.all([
                    projectService.findOne(projectId),
                    promptAssetService.findOneByKey(projectId, assetKey)
                ]);
                setProject(projectData);
                setAsset(assetData);
            } catch (error) {
                console.error("Error fetching breadcrumb data:", error);
                showErrorToast("Failed to load project or asset details for breadcrumbs.");
                setProject(null);
                setAsset(null);
            } finally {
                setBreadcrumbLoading(false);
            }
        };
        fetchBreadcrumbData();
    }, [projectId, assetKey]);

    const fetchData = useCallback(async () => {
        if (!projectId || !assetKey) {
            setError("Missing Project ID or Asset Key in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetService.getAllVersions(projectId, assetKey);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to fetch asset versions.';
            console.error("Error fetching asset versions:", err);
            setError(apiErrorMessage);
            showErrorToast(apiErrorMessage);
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId, assetKey]);

    useEffect(() => {
        if (projectId && assetKey) {
            fetchData();
        }
    }, [projectId, assetKey, fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetVersion) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (versionTag: string) => {
        if (!projectId || !assetKey || !versionTag) {
            showErrorToast("Missing project ID, asset key, or version tag to delete.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete version ${versionTag}?`)) {
            setLoading(true);
            try {
                await promptAssetService.removeVersion(projectId, assetKey, versionTag);
                showSuccessToast("Version deleted successfully!");
                fetchData();
            } catch (err) {
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete version.';
                setError(apiErrorMessage);
                console.error(err);
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto) => {
        if (!projectId || !assetKey) return;
        setLoading(true);
        try {
            let message = "";
            if (editingItem) {
                if (!editingItem.versionTag) {
                    throw new Error("Cannot update version without versionTag.");
                }
                const updatePayload: UpdatePromptAssetVersionDto = { value: payload.value, changeMessage: payload.changeMessage };
                await promptAssetService.updateVersion(projectId, assetKey, editingItem.versionTag, updatePayload);
                message = "Version updated successfully!";
            } else {
                await promptAssetService.createVersion(projectId, assetKey, payload as CreatePromptAssetVersionDto);
                message = "Version created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save version.';
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
        { label: breadcrumbLoading ? assetKey : (asset?.name || assetKey), href: `/projects/${projectId}/assets/${assetKey}/versions` },
        { label: "Versions" }
    ];

    if (!projectId || !assetKey) {
        return <p className="text-red-500">Error: Missing Project ID or Asset Key in URL.</p>;
    }
    if (breadcrumbLoading || loading) return <p>Loading asset version details...</p>;
    if (error && !loading) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={loading || breadcrumbLoading}>
                    Add New Version
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 && !loading ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No versions found for asset {asset?.name || assetKey}.</p>
                ) : (
                    <PromptAssetVersionsTable
                        promptAssetVersions={itemsList}
                        projectId={projectId}
                        assetKey={assetKey}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        loading={loading}
                    />
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? `Edit Version ${editingItem.versionTag}` : 'Add New Version'}
                        </h3>
                        <PromptAssetVersionForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                        {loading && <p>Saving...</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptAssetVersionsPage; 