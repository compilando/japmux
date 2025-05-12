"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    CreateProjectDto,
    CreatePromptAssetDto,
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
} from '@/services/generated/api';
import * as generated from '@/services/generated/api';
import {
    promptAssetService,
    projectService
} from '@/services/api';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetTranslationsTable from '@/components/tables/PromptAssetTranslationsTable';
import PromptAssetTranslationForm from '@/components/form/PromptAssetTranslationForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

type AssetTranslationUIData = CreateAssetTranslationDto;

// Extender el DTO para incluir el id que necesitamos para las traducciones
interface PromptAssetVersionData extends generated.CreatePromptAssetVersionDto {
    id: string; // ID necesario para las traducciones
}

const PromptAssetTranslationsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<AssetTranslationUIData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<AssetTranslationUIData | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [asset, setAsset] = useState<CreatePromptAssetDto | null>(null);
    const [version, setVersion] = useState<PromptAssetVersionData | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const projectId = params.projectId as string;
    const assetKey = params.assetKey as string;
    const versionTag = params.versionTag as string;

    useEffect(() => {
        if (!projectId || !assetKey || !versionTag) return;
        setBreadcrumbLoading(true);
        Promise.all([
            projectService.findOne(projectId),
            promptAssetService.findOne(projectId, assetKey),
            promptAssetService.findVersions(projectId, assetKey)
        ]).then(([projectData, assetData, versionsData]) => {
            setProject(projectData as CreateProjectDto);
            setAsset(assetData as CreatePromptAssetDto);

            const versionExists = versionsData.some(v => v.versionTag === versionTag);
            if (!versionExists) {
                throw new Error(`Version "${versionTag}" not found for asset "${assetKey}". Available versions: ${versionsData.map(v => v.versionTag).join(', ')}`);
            }

            return promptAssetService.findOneVersion(projectId, assetKey, versionTag);
        }).then(versionData => {
            setVersion(versionData as PromptAssetVersionData);
        }).catch((err: unknown) => {
            console.error("Error fetching breadcrumb data (project/asset/version):", err);
            const apiErrorMessage = (err as any)?.response?.data?.message || (err as Error)?.message || 'Failed to load project, asset, or version details.';
            showErrorToast(apiErrorMessage);
            setProject(null);
            setAsset(null);
            setVersion(null);
            setError(apiErrorMessage);
        }).finally(() => {
            setBreadcrumbLoading(false);
        });
    }, [projectId, assetKey, versionTag]);

    const fetchData = useCallback(async () => {
        if (!projectId || !assetKey || !versionTag) {
            setError("Missing Project ID, Asset Key, or Version Tag in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (!version) {
            setError(`Asset version "${versionTag}" not found for asset "${assetKey}".`);
            setLoading(false);
            setItemsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetService.findAssetTranslations(projectId, assetKey, versionTag);
            if (Array.isArray(data)) {
                setItemsList(data as AssetTranslationUIData[]);
            } else {
                console.error("API response for asset translations is not an array:", data);
                setError('Received invalid data format.');
            }
        } catch (err: unknown) {
            const apiErrorMessage = (err as any)?.response?.data?.message || (err as Error)?.message || 'Failed to fetch asset translations.';
            console.error("Error fetching asset translations:", err);
            setError(apiErrorMessage);
            showErrorToast(apiErrorMessage);
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId, assetKey, versionTag, version]);

    useEffect(() => {
        if (projectId && assetKey && versionTag) {
            fetchData();
        }
    }, [projectId, assetKey, versionTag, fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AssetTranslationUIData) => {
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
                await promptAssetService.removeAssetTranslation(projectId, assetKey, versionTag, languageCode);
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

    const handleSave = async (payloadFromForm: CreateAssetTranslationDto | UpdateAssetTranslationDto) => {
        if (!projectId || !assetKey || !versionTag) return;
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.languageCode) {
                const updatePayload: UpdateAssetTranslationDto = { value: (payloadFromForm as UpdateAssetTranslationDto).value };
                await promptAssetService.updateAssetTranslation(projectId, assetKey, versionTag, editingItem.languageCode, updatePayload);
                message = `Translation for ${editingItem.languageCode} updated successfully!`;
            } else {
                const createPayload = payloadFromForm as CreateAssetTranslationDto;
                if (!createPayload.languageCode || !createPayload.value) {
                    showErrorToast("Language code and value are required for a new translation.");
                    setLoading(false);
                    return;
                }
                await promptAssetService.createAssetTranslation(projectId, assetKey, versionTag, createPayload);
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

    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (projectId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? projectId : (project?.name || projectId),
            href: `/projects/${projectId}/prompt-assets`
        });
        if (assetKey) {
            breadcrumbs.push({
                label: breadcrumbLoading ? assetKey : (asset?.name || assetKey),
                href: `/projects/${projectId}/prompt-assets/${assetKey}/versions`
            });
            if (versionTag) {
                breadcrumbs.push({
                    label: `Version ${versionTag}`,
                    href: `/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}`
                });
                breadcrumbs.push({ label: "Translations" });
            }
        }
    }

    if (!projectId || !assetKey || !versionTag) {
        return <p className="text-red-500">Error: Missing Project ID, Asset Key, or Version Tag in URL.</p>;
    }
    if (breadcrumbLoading || loading) return <p>Loading asset translation details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!project || !asset || !version) return <p className="text-red-500">Could not load project, asset, or version details.</p>;

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
                    <p className="text-center text-gray-500 dark:text-gray-400">No translations found for this version.</p>
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <PromptAssetTranslationForm
                                initialData={editingItem}
                                onSave={handleSave}
                                onCancel={() => setIsModalOpen(false)}
                                versionId={version.id}
                                versionText={version.value}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptAssetTranslationsPage; 