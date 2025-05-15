"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    promptAssetService,
    projectService,
    promptService,
} from '@/services/api';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import PromptAssetsTable from '@/components/tables/PromptAssetsTable';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CreateProjectDto, PromptDto } from '@/services/generated';

const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (error instanceof Error) {
        const axiosError = error as any;
        if (axiosError.isAxiosError && axiosError.response && axiosError.response.data && axiosError.response.data.message) {
            return axiosError.response.data.message;
        }
        return error.message;
    }
    return defaultMessage;
};

const PromptAssetsListPage: React.FC = () => {
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<PromptDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const router = useRouter();

    // Usar projectId consistentemente
    const projectId = params.projectId as string;
    const promptId = params.promptId as string;

    console.log("DEBUG: assets/page.tsx - projectId from URL:", projectId);
    console.log("DEBUG: assets/page.tsx - promptId from URL:", promptId);

    const fetchPageData = useCallback(async () => {
        if (!projectId || !promptId) { // Actualizado
            setError("Project ID or Prompt ID is missing from URL.");
            setLoading(false);
            setBreadcrumbLoading(false);
            return;
        }
        setLoading(true);
        setBreadcrumbLoading(true);
        setError(null);

        try {
            // Usar projectId para las llamadas
            const projectDataPromise = projectService.findOne(projectId);
            const promptDataPromise = promptService.findOne(projectId, promptId);
            const assetDataPromise = promptAssetService.findAll(projectId, promptId);

            const [projectData, promptData, assetData] = await Promise.all([
                projectDataPromise,
                promptDataPromise,
                assetDataPromise
            ]);

            setProject(projectData);
            setCurrentPrompt(promptData);
            setAssets(assetData);

        } catch (err) {
            console.error("Error fetching prompt assets or breadcrumb data:", err);
            const apiErrorMessage = getApiErrorMessage(err, "Failed to load page data.");
            showErrorToast(apiErrorMessage);
            setError(apiErrorMessage);
        } finally {
            setLoading(false);
            setBreadcrumbLoading(false);
        }
    }, [projectId, promptId]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const handleEditAsset = (asset: PromptAssetData) => {
        // console.log("Edit asset:", asset);
        router.push(`/projects/${projectId}/prompts/${promptId}/assets/${asset.key}/edit`);
        // showErrorToast("Edit functionality for assets not yet implemented on this page."); // Comentado o eliminado
    };

    const handleDeleteAsset = async (assetKey: string) => {
        if (!projectId || !promptId) return; // Actualizado
        if (window.confirm(`Are you sure you want to delete asset "${assetKey}"? This action cannot be undone.`)) {
            setLoading(true);
            try {
                // Usar projectId para la llamada
                await promptAssetService.remove(projectId, promptId, assetKey);
                showSuccessToast(`Asset ${assetKey} deleted successfully.`);
                await fetchPageData();
            } catch (err) {
                const apiErrorMessage = getApiErrorMessage(err, "Failed to delete asset.");
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (projectId) { // Actualizado
        breadcrumbs.push({
            label: breadcrumbLoading ? projectId : (project?.name || projectId), // Actualizado
            href: `/projects/${projectId}/prompts` // Actualizado
        });
    }
    if (promptId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? promptId : (currentPrompt?.name || currentPrompt?.id || promptId),
            href: `/projects/${projectId}/prompts/${promptId}` // Actualizado
        });
        breadcrumbs.push({ label: "Assets" });
    }

    if (error && !loading) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Prompt Assets for: <span className="text-indigo-600 dark:text-indigo-400">{breadcrumbLoading ? promptId : (currentPrompt?.name || promptId)}</span>
                    </h1>
                    <Link
                        href={`/projects/${projectId}/prompts/${promptId}/assets/new`} // Actualizado
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create New Asset
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">Loading assets...</p>
                ) : assets.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No assets found for this prompt.</p>
                        <p className="mt-2">
                            <Link
                                href={`/projects/${projectId}/prompts/${promptId}/assets/new`} // Actualizado
                                className="text-indigo-600 hover:text-indigo-700"
                            >
                                Create the first asset.
                            </Link>
                        </p>
                    </div>
                ) : (
                    <PromptAssetsTable
                        promptAssets={assets}
                        projectId={projectId} // Actualizado para pasar projectId
                        promptId={promptId}
                        onEdit={handleEditAsset}
                        onDelete={handleDeleteAsset}
                        loading={loading}
                    />
                )}
            </div>
        </>
    );
};

export default PromptAssetsListPage; 