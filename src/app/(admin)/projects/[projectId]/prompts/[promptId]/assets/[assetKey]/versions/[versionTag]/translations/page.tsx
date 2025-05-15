"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CreateProjectDto,
    PromptDto,
    CreatePromptAssetDto,
    CreatePromptAssetVersionDto,
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
} from '@/services/generated/api';
import {
    promptAssetService,
    projectService,
    promptService,
} from '@/services/api';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetTranslationsTable from '@/components/tables/PromptAssetTranslationsTable';
import PromptAssetTranslationForm from '@/components/form/PromptAssetTranslationForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import axios from 'axios';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';

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

interface AssetTranslationUIData extends CreateAssetTranslationDto {
    id?: string;
}

const PromptAssetTranslationsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<AssetTranslationUIData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<AssetTranslationUIData | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<PromptDto | null>(null);
    const [asset, setAsset] = useState<PromptAssetData | null>(null);
    const [version, setVersion] = useState<CreatePromptAssetVersionDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;
    const promptId = params.promptId as string;
    const assetKey = params.assetKey as string;
    const versionTag = params.versionTag as string;

    useEffect(() => {
        if (!projectId || !promptId || !assetKey || !versionTag) return;
        setBreadcrumbLoading(true);
        Promise.all([
            projectService.findOne(projectId),
            promptService.findOne(projectId, promptId),
            promptAssetService.findOne(projectId, promptId, assetKey),
            promptAssetService.findOneVersion(projectId, promptId, assetKey, versionTag)
        ]).then(([projectData, promptData, assetData, versionData]) => {
            setProject(projectData as CreateProjectDto);
            setCurrentPrompt(promptData as PromptDto);
            setAsset(assetData as PromptAssetData);
            setVersion(versionData as CreatePromptAssetVersionDto);
        }).catch((err: unknown) => {
            console.error("Error fetching breadcrumb data (project/prompt/asset/version):", err);
            const defaultMsg = 'Failed to load project, prompt, asset, or version details.';
            showErrorToast(getApiErrorMessage(err, defaultMsg));
            setProject(null);
            setCurrentPrompt(null);
            setAsset(null);
            setVersion(null);
            setError(getApiErrorMessage(err, defaultMsg));
        }).finally(() => {
            setBreadcrumbLoading(false);
        });
    }, [projectId, promptId, assetKey, versionTag]);

    const fetchData = useCallback(async () => {
        if (!projectId || !promptId || !assetKey || !versionTag) {
            setError("Missing Project ID, Prompt ID, Asset Key, or Version Tag in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (!version && !breadcrumbLoading) {
            setError(`Asset version "${versionTag}" may not exist or failed to load.`);
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (!version) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetService.findTranslations(projectId, promptId, assetKey, versionTag);
            if (Array.isArray(data)) {
                setItemsList(data.map(t => ({ ...t, id: t.languageCode })) as AssetTranslationUIData[]);
            } else {
                console.error("API response for asset translations is not an array:", data);
                setError('Received invalid data format for translations.');
                setItemsList([]);
            }
        } catch (err: unknown) {
            console.error("Error fetching asset translations:", err);
            setError(getApiErrorMessage(err, 'Failed to fetch asset translations.'));
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, assetKey, versionTag, version, breadcrumbLoading]);

    useEffect(() => {
        if (projectId && promptId && assetKey && versionTag && !breadcrumbLoading) {
            fetchData();
        }
    }, [projectId, promptId, assetKey, versionTag, fetchData, breadcrumbLoading]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AssetTranslationUIData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (languageCode: string) => {
        if (!projectId || !promptId || !assetKey || !versionTag || !languageCode) {
            showErrorToast("Missing required IDs to delete translation.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the translation for ${languageCode}?`)) {
            setLoading(true);
            try {
                await promptAssetService.removeTranslation(projectId, promptId, assetKey, versionTag, languageCode);
                showSuccessToast("Translation deleted successfully!");
                fetchData();
            } catch (err: unknown) {
                setError(getApiErrorMessage(err, 'Failed to delete translation.'));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payloadFromForm: CreateAssetTranslationDto | UpdateAssetTranslationDto) => {
        if (!projectId || !promptId || !assetKey || !versionTag) return;
        setLoading(true);
        try {
            let message = "";
            const langCode = editingItem?.languageCode || (payloadFromForm as CreateAssetTranslationDto).languageCode;
            if (!langCode) {
                showErrorToast("Language code is missing.");
                setLoading(false);
                return;
            }

            if (editingItem && editingItem.languageCode) {
                const updatePayload: UpdateAssetTranslationDto = { value: (payloadFromForm as UpdateAssetTranslationDto).value };
                await promptAssetService.updateTranslation(projectId, promptId, assetKey, versionTag, editingItem.languageCode, updatePayload);
                message = `Translation for ${editingItem.languageCode} updated successfully!`;
            } else {
                const createPayload = payloadFromForm as CreateAssetTranslationDto;
                if (!createPayload.languageCode || !createPayload.value) {
                    showErrorToast("Language code and value are required for a new translation.");
                    setLoading(false);
                    return;
                }
                await promptAssetService.createTranslation(projectId, promptId, assetKey, versionTag, createPayload);
                message = `Translation for ${createPayload.languageCode} created successfully!`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Failed to save translation.'));
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
    }
    if (promptId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? promptId : (currentPrompt?.name || promptId),
            href: `/projects/${projectId}/prompts/${promptId}/assets`
        });
    }
    if (assetKey) {
        breadcrumbs.push({
            label: breadcrumbLoading ? assetKey : (asset?.name || asset?.key || assetKey),
            href: `/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/edit`
        });
    }
    if (versionTag) {
        breadcrumbs.push({
            label: breadcrumbLoading ? `Version ${versionTag}` : (version?.versionTag ? `Version ${version.versionTag}` : `Version ${versionTag}`),
            href: `/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions`
        });
        breadcrumbs.push({ label: "Translations" });
    }

    if (breadcrumbLoading) return <p>Loading page details...</p>;
    if (!project || !currentPrompt || !asset || !version) {
        if (error) return <p className="text-red-500">Error: {error}</p>;
        return <p>Error loading essential details (project, prompt, asset, or version). Please check the console and try again.</p>;
    }
    if (error && !loading) return <p className="text-red-500">Error fetching translations: {error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="text-2xl font-semibold mb-1 text-black dark:text-white">
                    Translations for Asset Version: <span className="text-indigo-600 dark:text-indigo-400">{version?.versionTag || versionTag}</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Asset: <span className="font-medium">{asset?.name || assetKey}</span> | Prompt: <span className="font-medium">{currentPrompt?.name || promptId}</span>
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors duration-150"
                    disabled={loading}
                >
                    Add New Translation
                </button>
            </div>

            {loading && itemsList.length === 0 && <p>Loading translations...</p>}

            {!loading && itemsList.length === 0 && !error && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No translations found for this asset version.</p>
            )}

            {itemsList.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <PromptAssetTranslationsTable
                        translations={itemsList.map(t => ({ ...t, id: t.languageCode || Date.now().toString() }))}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            {isModalOpen && (
                <PromptAssetTranslationForm
                    onCancel={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={editingItem}
                    versionText={version?.value || ''}
                />
            )}
        </>
    );
};

export default PromptAssetTranslationsPage; 