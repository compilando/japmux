"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Project,
    Prompt,
    PromptTranslation,
    promptTranslationService,
    CreatePromptTranslationDto,
    UpdatePromptTranslationDto,
    projectService,
    promptService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptTranslationsTable from '@/components/tables/PromptTranslationsTable';
import PromptTranslationForm from '@/components/form/PromptTranslationForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptTranslationsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptTranslation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptTranslation | null>(null);

    const [project, setProject] = useState<Project | null>(null);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { selectedProjectId } = useProjects();
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
                const [projectData, promptData] = await Promise.all([
                    projectService.findOne(projectId),
                    promptService.findOne(projectId, promptId)
                ]);
                setProject(projectData);
                setPrompt(promptData);
            } catch (error) {
                console.error("Error fetching breadcrumb data:", error);
                showErrorToast("Failed to load project or prompt details for breadcrumbs.");
                setProject(null);
                setPrompt(null);
            } finally {
                setBreadcrumbLoading(false);
            }
        };

        fetchBreadcrumbData();
    }, [projectId, promptId]);

    const fetchData = useCallback(async () => {
        if (!projectId || !promptId || !versionTag) {
            setError("Missing Project, Prompt or Version Tag in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await promptTranslationService.findAll(projectId, promptId, versionTag);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            setError('Failed to fetch items.');
            showErrorToast('Failed to fetch translations.');
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, versionTag]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptTranslation) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemToDelete: PromptTranslation) => {
        if (!projectId || !promptId || !versionTag || !itemToDelete?.languageCode) return;
        if (window.confirm(`Are you sure you want to delete the translation for ${itemToDelete.languageCode}?`)) {
            setLoading(true);
            try {
                await promptTranslationService.remove(projectId, promptId, versionTag, itemToDelete.languageCode);
                showSuccessToast(`Translation for ${itemToDelete.languageCode} deleted.`);
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete translation.';
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptTranslationDto | UpdatePromptTranslationDto) => {
        if (!projectId || !promptId || !versionTag) return;
        let finalPayload: any = payload;
        if (!editingItem && currentVersionId && !(payload as CreatePromptTranslationDto).versionId) {
            finalPayload = { ...payload, versionId: currentVersionId };
        }

        setLoading(true);
        try {
            let message = "";
            if (editingItem) {
                await promptTranslationService.update(projectId, promptId, versionTag, editingItem.languageCode, payload as UpdatePromptTranslationDto);
                message = `Translation for ${editingItem.languageCode} updated.`;
            } else {
                await promptTranslationService.create(projectId, promptId, versionTag, finalPayload as CreatePromptTranslationDto);
                message = `Translation for ${finalPayload.languageCode} created.`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save translation.';
            showErrorToast(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: breadcrumbLoading ? projectId : (project?.name || projectId), href: `/projects/${projectId}/prompts` },
        { label: breadcrumbLoading ? promptId : (prompt?.name || promptId), href: `/projects/${projectId}/prompts/${promptId}/versions` },
        { label: `Version ${versionTag}`, href: `/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations` },
        { label: "Translations" }
    ];

    if (!projectId || !promptId || !versionTag) {
        return <p className="text-red-500">Error: Missing Project, Prompt or Version Tag in URL.</p>;
    }
    if (breadcrumbLoading || loading) return <p>Loading translation details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={breadcrumbLoading || loading}>
                    Add Prompt Translation
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 && !loading ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No translations found for this version.</p>
                ) : (
                    <PromptTranslationsTable
                        promptTranslations={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? `Edit Translation (${editingItem.languageCode})` : 'Add New Prompt Translation'}
                        </h3>
                        <PromptTranslationForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            versionId={!editingItem && currentVersionId ? currentVersionId : undefined}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptTranslationsPage; 