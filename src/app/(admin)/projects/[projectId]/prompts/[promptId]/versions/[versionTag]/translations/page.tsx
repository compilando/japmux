"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    promptTranslationService,
    CreatePromptTranslationDto,
    UpdatePromptTranslationDto,
    projectService,
    promptService,
    promptVersionService,
    CreateProjectDto,
    PromptDto,
    regionService,
    CreateRegionDto,
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptTranslationsTable from '@/components/tables/PromptTranslationsTable';
import PromptTranslationForm from '@/components/form/PromptTranslationForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

const PromptTranslationsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<CreatePromptTranslationDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<CreatePromptTranslationDto | null>(null);
    const [versionText, setVersionText] = useState<string>('');

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [prompt, setPrompt] = useState<PromptDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const [projectRegions, setProjectRegions] = useState<CreateRegionDto[]>([]);
    const [availableLanguagesForNewTranslation, setAvailableLanguagesForNewTranslation] = useState<{ code: string; name: string }[]>([]);
    const [allLanguagesTranslated, setAllLanguagesTranslated] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const params = useParams();

    const projectId = params.projectId as string;
    const promptId = params.promptId as string;
    const versionTag = params.versionTag as string;
    const versionIdQueryParam = searchParams.get('versionId');

    const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

    useEffect(() => {
        setCurrentVersionId(versionIdQueryParam);
    }, [versionIdQueryParam]);

    useEffect(() => {
        if (!projectId || !promptId) return;

        const fetchBreadcrumbData = async () => {
            setBreadcrumbLoading(true);
            try {
                const [projectData, promptData, regionsData] = await Promise.all([
                    projectService.findOne(projectId),
                    promptService.findOne(projectId, promptId),
                    regionService.findAll(projectId)
                ]);
                setProject(projectData);
                setPrompt(promptData);
                setProjectRegions(regionsData);
            } catch (err: unknown) {
                console.error("Error fetching breadcrumb data:", err);
                const defaultMsg = "Failed to load project or prompt details for breadcrumbs.";
                showErrorToast(getApiErrorMessage(err, defaultMsg));
                setProject(null);
                setPrompt(null);
                setProjectRegions([]);
            } finally {
                setBreadcrumbLoading(false);
            }
        };

        fetchBreadcrumbData();
    }, [projectId, promptId]);

    useEffect(() => {
        const fetchVersionText = async () => {
            if (!projectId || !promptId || !versionTag) return;
            try {
                const version = await promptVersionService.findOne(projectId, promptId, versionTag);
                if (version?.promptText) {
                    setVersionText(version.promptText);
                }
            } catch (err: unknown) {
                console.error('Error fetching version text:', err);
            }
        };

        fetchVersionText();
    }, [projectId, promptId, versionTag]);

    const fetchData = useCallback(async () => {
        if (!projectId || !promptId || !versionTag) {
            setError("Missing Project, Prompt or Version Tag in URL.");
            setLoading(false);
            setItemsList([]);
            setAvailableLanguagesForNewTranslation([]);
            setAllLanguagesTranslated(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await promptTranslationService.findAll(projectId, promptId, versionTag);
            if (Array.isArray(data)) {
                setItemsList(data);

                const translatedLanguageCodes = new Set(data.map(t => t.languageCode));
                const allPossibleLanguagesFromProject = projectRegions.map(region => ({
                    code: region.languageCode,
                    name: region.name
                }));

                const remainingLanguages = allPossibleLanguagesFromProject.filter(lang => !translatedLanguageCodes.has(lang.code));
                setAvailableLanguagesForNewTranslation(remainingLanguages);
                setAllLanguagesTranslated(remainingLanguages.length === 0 && allPossibleLanguagesFromProject.length > 0);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
                setAvailableLanguagesForNewTranslation([]);
                setAllLanguagesTranslated(false);
            }
        } catch (err: unknown) {
            console.error("Error fetching items:", err);
            const defaultMsg = 'Failed to fetch translations.';
            setError(getApiErrorMessage(err, defaultMsg));
            setItemsList([]);
            setAvailableLanguagesForNewTranslation([]);
            setAllLanguagesTranslated(false);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, versionTag, projectRegions]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: CreatePromptTranslationDto) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemToDelete: CreatePromptTranslationDto) => {
        if (!projectId || !promptId || !versionTag || !itemToDelete?.languageCode) return;
        if (window.confirm(`Are you sure you want to delete the translation for ${itemToDelete.languageCode}?`)) {
            setLoading(true);
            try {
                await promptTranslationService.remove(projectId, promptId, versionTag, itemToDelete.languageCode);
                showSuccessToast(`Translation for ${itemToDelete.languageCode} deleted.`);
                fetchData();
            } catch (err: unknown) {
                console.error("Error deleting translation:", err);
                const defaultMsg = 'Failed to delete translation.';
                setError(getApiErrorMessage(err, defaultMsg));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptTranslationDto | UpdatePromptTranslationDto) => {
        if (!projectId || !promptId || !versionTag) return;

        let finalPayload: CreatePromptTranslationDto | UpdatePromptTranslationDto = payload;
        if (!editingItem && currentVersionId && !(payload as CreatePromptTranslationDto).versionId) {
            finalPayload = { ...payload, versionId: currentVersionId } as CreatePromptTranslationDto;
        }

        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.languageCode) {
                await promptTranslationService.update(projectId, promptId, versionTag, editingItem.languageCode, payload as UpdatePromptTranslationDto);
                message = `Translation for ${editingItem.languageCode} updated.`;
            } else {
                await promptTranslationService.create(projectId, promptId, versionTag, finalPayload as CreatePromptTranslationDto);
                message = `Translation for ${(finalPayload as CreatePromptTranslationDto).languageCode} created.`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) {
            console.error("Error saving translation:", err);
            const defaultMsg = 'Failed to save translation.';
            setError(getApiErrorMessage(err, defaultMsg));
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: breadcrumbLoading ? projectId : (project?.name || projectId), href: `/projects/${projectId}/prompts` },
        { label: breadcrumbLoading ? promptId : (prompt?.name || promptId), href: `/projects/${projectId}/prompts/${promptId}/versions` },
        { label: `Version ${versionTag}` },
        { label: "Translations" }
    ];

    if (!projectId || !promptId || !versionTag) {
        return <p className="text-red-500">Error: Missing Project, Prompt or Version Tag in URL.</p>;
    }
    if (breadcrumbLoading) return <p>Loading page details...</p>;
    if (error && !itemsList.length) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-4">
                <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Manage Translations</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage translations for a specific version of your prompt. Each translation allows the prompt to be served in a different language, adapting its content while maintaining the core structure and variables of the base prompt version.
                </p>
            </div>
            {error && <p className="text-red-500 py-2">Error loading translations: {error}</p>}

            <div className="my-4 p-4 border rounded-md shadow bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-1 text-black dark:text-white">Original Prompt Text (Version: {versionTag})</h3>
                <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-black dark:text-gray-200 whitespace-pre-wrap">
                    {versionText || 'Loading original text...'}
                </pre>
            </div>

            {!loading && !error && (
                allLanguagesTranslated ? (
                    <div className="mb-4 p-3 text-center bg-green-100 dark:bg-green-700 border border-green-300 dark:border-green-600 rounded-md">
                        <p className="text-green-700 dark:text-green-200 font-medium">
                            All available languages translated! ✅
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-black dark:text-white">Translations for Version: {versionTag}</h2>
                        <button 
                            onClick={handleAdd} 
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" 
                            disabled={loading || breadcrumbLoading || availableLanguagesForNewTranslation.length === 0}
                        >
                            Add Prompt Translation
                        </button>
                    </div>
                )
            )}

            {loading && <p>Loading translations...</p>}
            {!loading && itemsList.length === 0 && !allLanguagesTranslated && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No translations found for this version.</p>
            )}
            {!loading && itemsList.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <PromptTranslationsTable
                        promptTranslations={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <PromptTranslationForm
                                initialData={editingItem}
                                versionId={currentVersionId || undefined}
                                onSave={handleSave}
                                onCancel={() => setIsModalOpen(false)}
                                versionText={versionText}
                                availableLanguages={availableLanguagesForNewTranslation}
                                isEditing={!!editingItem}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptTranslationsPage; 