"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    Project,
    PromptAsset,
    PromptAssetTranslation,
    promptAssetService,
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
    projectService
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetTranslationsTable from '@/components/tables/PromptAssetTranslationsTable';
import PromptAssetTranslationForm from '@/components/form/PromptAssetTranslationForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptAssetTranslationsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAssetTranslation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetTranslation | null>(null);

    const [project, setProject] = useState<Project | null>(null);
    const [asset, setAsset] = useState<PromptAsset | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const projectId = params.projectId as string;
    const assetKey = params.assetKey as string;
    const versionTag = params.versionTag as string;

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
        if (!projectId || !assetKey || !versionTag) {
            setError("Missing Project ID, Asset Key, or Version Tag in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetService.getAllTranslations(projectId, assetKey, versionTag);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to fetch asset translations.';
            console.error("Error fetching asset translations:", err);
            setError(apiErrorMessage);
            showErrorToast(apiErrorMessage);
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId, assetKey, versionTag]);

    useEffect(() => {
        if (projectId && assetKey && versionTag) {
            fetchData();
        }
    }, [projectId, assetKey, versionTag, fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetTranslation) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (languageCode: string) => {
        if (!projectId || !assetKey || !versionTag || !languageCode) {
            showErrorToast("Missing required IDs to delete translation.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the translation for ${languageCode}?`)) {
            setLoading(true);
            try {
                await promptAssetService.removeTranslation(projectId, assetKey, versionTag, languageCode);
                showSuccessToast("Translation deleted successfully!");
                fetchData();
            } catch (err) {
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete translation.';
                setError(apiErrorMessage);
                console.error(err);
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreateAssetTranslationDto | UpdateAssetTranslationDto) => {
        if (!projectId || !assetKey || !versionTag) return;
        setLoading(true);
        try {
            let message = "";
            if (editingItem) {
                if (!editingItem.languageCode) {
                    throw new Error("Cannot update translation without languageCode.");
                }
                const updatePayload: UpdateAssetTranslationDto = { value: payload.value };
                await promptAssetService.updateTranslation(projectId, assetKey, versionTag, editingItem.languageCode, updatePayload);
                message = "Translation updated successfully!";
            } else {
                const createPayload = payload as CreateAssetTranslationDto;
                await promptAssetService.createTranslation(projectId, assetKey, versionTag, createPayload);
                message = `Translation for ${createPayload.languageCode} created successfully!`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save translation.';
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
        { label: `Version ${versionTag}`, href: `/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations` },
        { label: "Translations" }
    ];

    if (!projectId || !assetKey || !versionTag) {
        return <p className="text-red-500">Error: Missing Project ID, Asset Key, or Version Tag in URL.</p>;
    }
    if (breadcrumbLoading || loading) return <p>Loading asset translation details...</p>;
    if (error && !loading) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={loading || breadcrumbLoading}>
                    Add New Translation
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 && !loading ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No translations found for asset {asset?.name || assetKey} version {versionTag}.</p>
                ) : (
                    <PromptAssetTranslationsTable
                        translations={itemsList}
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
                            {editingItem ? `Edit Translation (${editingItem.languageCode})` : 'Add New Translation'}
                        </h3>
                        <PromptAssetTranslationForm
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

export default PromptAssetTranslationsPage; 