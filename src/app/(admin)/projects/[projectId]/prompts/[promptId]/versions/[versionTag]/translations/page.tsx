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
import { LanguageIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

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

            {/* Header con información del proyecto y prompt */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-8 pt-6 pb-8 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">Manage Translations</h1>
                    <span className="px-3 py-1 text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-500/20 dark:text-brand-400 rounded-full">Version {versionTag}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage translations for this version of your prompt. Each translation allows the prompt to be served in a different language, adapting its content while maintaining the core structure and variables.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Sección del texto original y traducciones en layout horizontal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna del texto original */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <DocumentDuplicateIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            Original Prompt Text
                        </h3>
                    </div>
                    <div className="p-6">
                        <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono bg-[#343541] p-4 rounded-lg border border-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {versionText || 'Loading original text...'}
                        </pre>
                    </div>
                </div>

                {/* Columna de traducciones */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <LanguageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            Translations
                        </h3>
                        {!loading && !error && !allLanguagesTranslated && (
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={loading || breadcrumbLoading || availableLanguagesForNewTranslation.length === 0}
                            >
                                <LanguageIcon className="w-4 h-4" />
                                Add Translation
                            </button>
                        )}
                    </div>

                    <div className="p-6">
                        {loading && (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                            </div>
                        )}

                        {!loading && allLanguagesTranslated && (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Languages Translated!</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">You have successfully translated this version into all available languages.</p>
                            </div>
                        )}

                        {!loading && itemsList.length === 0 && !allLanguagesTranslated && (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900/30 mb-4">
                                    <LanguageIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Translations Yet</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Start by adding a translation for one of the available languages.</p>
                                <button
                                    onClick={handleAdd}
                                    className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                    disabled={loading || breadcrumbLoading || availableLanguagesForNewTranslation.length === 0}
                                >
                                    <LanguageIcon className="w-4 h-4" />
                                    Add Translation
                                </button>
                            </div>
                        )}

                        {!loading && itemsList.length > 0 && (
                            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                <PromptTranslationsTable
                                    promptTranslations={itemsList}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    projectId={projectId}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de traducción */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-xl bg-white dark:bg-gray-800">
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