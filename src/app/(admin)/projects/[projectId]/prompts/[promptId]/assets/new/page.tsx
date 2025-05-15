"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { promptAssetService, projectService, promptService } from '@/services/api';
import { CreatePromptAssetDto, CreateProjectDto, PromptDto } from '@/services/generated/api';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import Link from 'next/link';

// Helper para obtener mensajes de error
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

const NewPromptAssetPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();

    const projectId = params.projectId as string;
    const promptId = params.promptId as string;

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<PromptDto | null>(null);

    const [assetKey, setAssetKey] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [initialValue, setInitialValue] = useState('');
    const [initialChangeMessage, setInitialChangeMessage] = useState('');

    const [loadingBreadcrumb, setLoadingBreadcrumb] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId || !promptId) return;
        setLoadingBreadcrumb(true);
        Promise.all([
            projectService.findOne(projectId),
            promptService.findOne(projectId, promptId)
        ]).then(([projectData, promptData]) => {
            setProject(projectData);
            setCurrentPrompt(promptData);
        }).catch(err => {
            console.error("Error fetching breadcrumb data:", err);
            showErrorToast(getApiErrorMessage(err, "Failed to load project/prompt details."));
            // Considerar redirección si los datos críticos no cargan
        }).finally(() => {
            setLoadingBreadcrumb(false);
        });
    }, [projectId, promptId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !promptId) {
            showErrorToast("Cannot save: Missing Project or Prompt ID.");
            return;
        }
        if (!assetKey.trim() || !name.trim() || !initialValue.trim()) {
            showErrorToast("Asset Key, Name, and Initial Value are required.");
            return;
        }

        // Obtener tenantId del proyecto cargado. Asumir que project.tenantId existe.
        // Si la API no lo necesita o lo infiere, esto podría ser opcional o manejado de otra forma.
        // La especificación de CreatePromptAssetDto lo marca como requerido.
        const tenantId = project?.tenantId;
        if (!tenantId) {
            showErrorToast("Tenant ID is missing from project data. Cannot create asset.");
            // Podrías intentar recuperarlo o mostrar un error más específico.
            // Por ahora, bloqueamos la creación.
            console.error("Tenant ID is missing in project data", project);
            setSaving(false);
            return;
        }

        setSaving(true);
        setError(null);

        const payload: CreatePromptAssetDto = {
            key: assetKey.trim(),
            name: name.trim(),
            category: category.trim() || undefined,
            initialValue: initialValue.trim(),
            initialChangeMessage: initialChangeMessage.trim() || undefined,
            tenantId: tenantId, // Se añade tenantId aquí
        };

        try {
            await promptAssetService.create(projectId, promptId, payload);
            showSuccessToast(`Asset "${name.trim()}" created successfully!`);
            router.push(`/projects/${projectId}/prompts/${promptId}/assets`);
        } catch (err) {
            console.error("Error creating asset:", err);
            const apiErrorMessage = getApiErrorMessage(err, "Failed to create asset.");
            showErrorToast(apiErrorMessage);
            setError(apiErrorMessage);
        } finally {
            setSaving(false);
        }
    };

    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (project) {
        breadcrumbs.push({
            label: loadingBreadcrumb ? projectId : (project.name || projectId),
            href: `/projects/${projectId}/prompts`
        });
    }
    if (currentPrompt) {
        breadcrumbs.push({
            label: loadingBreadcrumb ? promptId : (currentPrompt.name || promptId),
            href: `/projects/${projectId}/prompts/${promptId}/assets`
        });
        breadcrumbs.push({ label: "New Asset" });
    } else if (promptId) {
        breadcrumbs.push({ label: promptId, href: `/projects/${projectId}/prompts/${promptId}/assets` });
        breadcrumbs.push({ label: "New Asset" });
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="p-4 md:p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                    Create New Prompt Asset
                </h1>

                <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div>
                        <label htmlFor="assetKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Asset Key <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="assetKey"
                            id="assetKey"
                            value={assetKey}
                            onChange={(e) => setAssetKey(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., greeting_formal"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Unique identifier for this asset within the prompt (e.g., a slug).</p>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Display Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Formal Greeting"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">User-friendly name for display purposes.</p>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Salutations, Closings"
                        />
                    </div>

                    <div>
                        <label htmlFor="initialValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Initial Value (for v1.0.0) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="initialValue"
                            name="initialValue"
                            rows={4}
                            value={initialValue}
                            onChange={(e) => setInitialValue(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="Enter the text/content for the first version of this asset..."
                        />
                    </div>

                    <div>
                        <label htmlFor="initialChangeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Initial Change Message (for v1.0.0)
                        </label>
                        <input
                            type="text"
                            name="initialChangeMessage"
                            id="initialChangeMessage"
                            value={initialChangeMessage}
                            onChange={(e) => setInitialChangeMessage(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Initial creation"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                    <div className="flex justify-end space-x-3">
                        <Link href={`/projects/${projectId}/prompts/${promptId}/assets`}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {saving ? 'Creating...' : 'Create Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NewPromptAssetPage; 