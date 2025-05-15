"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    CreateProjectDto,
    CreatePromptAssetVersionDto,
    UpdatePromptAssetVersionDto,
} from '@/services/generated/api';
import {
    promptAssetService,
    projectService,
} from '@/services/api';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetVersionsTable from '@/components/tables/PromptAssetVersionsTable';
import PromptAssetVersionForm from '@/components/form/PromptAssetVersionForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import axios from 'axios';
// La importación de PromptAssetData se hará desde la tabla de assets, si es necesaria, o se usará un tipo local.
// Por ahora, para el asset en breadcrumbs, podemos usar un tipo más genérico o el DTO de la API.
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';

const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

export interface AssetVersionUIData extends CreatePromptAssetVersionDto {
    id: string;
    versionTag: string;
    createdAt?: string;
}

const getLatestAssetVersionTag = (versions: AssetVersionUIData[]): string | null => {
    if (!versions || versions.length === 0) return null;
    const sorted = [...versions].sort((a, b) => {
        const tagA = a.versionTag?.startsWith('v') ? a.versionTag.substring(1) : a.versionTag;
        const tagB = b.versionTag?.startsWith('v') ? b.versionTag.substring(1) : b.versionTag;
        return (tagB || '').localeCompare(tagA || '');
    });
    return sorted[0].versionTag || null;
};

const PromptAssetVersionsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<AssetVersionUIData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<AssetVersionUIData | null>(null);
    const [latestVersionTagForForm, setLatestVersionTagForForm] = useState<string | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [asset, setAsset] = useState<PromptAssetData | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    // Usar projectId consistentemente
    const projectId = params.projectId as string;
    const promptId = params.promptId as string;
    const assetKey = params.assetKey as string;

    useEffect(() => {
        if (!projectId || !promptId || !assetKey) return; // Actualizado
        setBreadcrumbLoading(true);
        Promise.all([
            projectService.findOne(projectId), // Actualizado
            promptAssetService.findOne(projectId, promptId, assetKey) // Actualizado
        ]).then(([projectData, assetData]) => {
            setProject(projectData as CreateProjectDto);
            setAsset(assetData as PromptAssetData);
        }).catch(err => {
            console.error("Error fetching breadcrumb data (project/asset):", err);
            const defaultMsg = "Failed to load project or asset details for breadcrumbs.";
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            showErrorToast(apiErrorMessage);
            setProject(null);
            setAsset(null);
        }).finally(() => {
            setBreadcrumbLoading(false);
        });
    }, [projectId, promptId, assetKey]); // Actualizado

    const fetchData = useCallback(async () => {
        if (!projectId || !promptId || !assetKey) { // Actualizado
            setError("Project ID, Prompt ID, or Asset Key is missing.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const data = await promptAssetService.findVersions(projectId, promptId, assetKey); // Actualizado
            if (Array.isArray(data)) {
                const versionsData = data.map(v => ({
                    ...v,
                    id: typeof v.versionTag === 'string' ? v.versionTag : String(Date.now() + Math.random()),
                    versionTag: typeof v.versionTag === 'string' ? v.versionTag : 'N/A',
                })) as AssetVersionUIData[];
                setItemsList(versionsData);
                const latestTag = getLatestAssetVersionTag(versionsData);
                setLatestVersionTagForForm(latestTag);
            } else {
                console.error("API response for asset versions is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
                setLatestVersionTagForForm(null);
            }
        } catch (err: unknown) {
            console.error("Error fetching asset versions:", err);
            const defaultMsg = 'Failed to fetch asset versions.';
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            setError(apiErrorMessage);
            setItemsList([]);
            setLatestVersionTagForForm(null);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, assetKey]); // Actualizado

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AssetVersionUIData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (versionTagToDelete: string) => {
        if (!projectId || !promptId || !assetKey) return; // Actualizado
        if (window.confirm(`Are you sure you want to delete version "${versionTagToDelete}" for asset "${assetKey}"?`)) {
            setLoading(true);
            try {
                await promptAssetService.removeVersion(projectId, promptId, assetKey, versionTagToDelete); // Actualizado
                showSuccessToast(`Version ${versionTagToDelete} deleted successfully!`);
                fetchData();
            } catch (err: unknown) {
                console.error("Error deleting version:", err);
                const defaultMsg = 'Failed to delete version.';
                const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
                setError(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto) => {
        if (!projectId || !promptId || !assetKey) return; // Actualizado
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.versionTag) {
                await promptAssetService.updateVersion(projectId, promptId, assetKey, editingItem.versionTag, payload as UpdatePromptAssetVersionDto); // Actualizado
                message = `Version ${editingItem.versionTag} updated successfully!`;
            } else {
                const createPayload = payload as CreatePromptAssetVersionDto;
                await promptAssetService.createVersion(projectId, promptId, assetKey, createPayload); // Actualizado
                message = "New version created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) {
            console.error("Error saving version:", err);
            const defaultMsg = 'Failed to save version.';
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
    if (projectId) { // Actualizado
        breadcrumbs.push({
            label: breadcrumbLoading ? projectId : (project?.name || projectId), // Actualizado
            href: `/projects/${projectId}/prompts`
        });
    }
    if (projectId && promptId) { // Actualizado para usar projectId
        breadcrumbs.push({
            label: breadcrumbLoading ? promptId : (asset?.promptName || promptId),
            href: `/projects/${projectId}/prompts/${promptId}/assets`
        });
    }
    if (assetKey) {
        breadcrumbs.push({
            label: breadcrumbLoading ? assetKey : (asset?.name || asset?.key || assetKey),
        });
        breadcrumbs.push({ label: "Versions" });
    }

    if (breadcrumbLoading || loading) return <p>Loading asset version details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    disabled={loading}
                    title="Add New Asset Version"
                >
                    Add Version
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No versions found for this asset.</p>
                ) : (
                    <PromptAssetVersionsTable
                        promptAssetVersions={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        projectId={projectId} // Actualizado para pasar projectId
                        promptId={promptId}
                        assetKey={assetKey}
                        loading={loading}
                    />
                )}
            </div>
            {isModalOpen && (
                <PromptAssetVersionForm
                    onCancel={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={editingItem}
                    latestVersionTag={latestVersionTagForForm ?? undefined}
                />
            )}
        </>
    );
};

export default PromptAssetVersionsPage; 