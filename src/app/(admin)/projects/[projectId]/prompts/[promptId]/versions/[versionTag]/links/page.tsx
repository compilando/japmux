"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    Project,
    Prompt,
    PromptAssetLink,
    promptAssetService,
    CreatePromptAssetLinkDto,
    UpdatePromptAssetLinkDto,
    promptVersionService,
    PromptVersion,
    projectService,
    promptService
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetLinksTable from '@/components/tables/PromptAssetLinksTable';
import PromptAssetLinkForm from '@/components/form/PromptAssetLinkForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptAssetLinksPage: React.FC = () => {
    const [linksList, setLinksList] = useState<PromptAssetLink[]>([]);
    const [linksLoading, setLinksLoading] = useState<boolean>(true);
    const [linksError, setLinksError] = useState<string | null>(null);

    const [promptVersion, setPromptVersion] = useState<PromptVersion | null>(null);
    const [versionLoading, setVersionLoading] = useState<boolean>(true);
    const [versionError, setVersionError] = useState<string | null>(null);

    const [project, setProject] = useState<Project | null>(null);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetLink | null>(null);

    const params = useParams();
    const projectId = params.projectId as string;
    const promptId = params.promptId as string;
    const versionTag = params.versionTag as string;

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

    useEffect(() => {
        if (!projectId || !promptId || !versionTag) {
            setVersionError("Missing Project ID, Prompt ID, or Version Tag in URL.");
            setVersionLoading(false);
            return;
        }
        setVersionLoading(true);
        setVersionError(null);
        const fetchVersion = async () => {
            try {
                const versionData = await promptVersionService.findOne(projectId, promptId, versionTag);
                console.log('Fetched version data:', versionData);
                setPromptVersion(versionData);
            } catch (err) {
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to fetch prompt version details.';
                console.error("Error fetching prompt version:", err);
                setVersionError(apiErrorMessage);
                showErrorToast(apiErrorMessage);
            } finally {
                setVersionLoading(false);
            }
        };
        fetchVersion();
    }, [projectId, promptId, versionTag]);

    const promptVersionId = promptVersion?.id;

    const fetchLinks = useCallback(async () => {
        console.log('Attempting to fetch links with projectId:', projectId, 'and promptVersionId:', promptVersionId);
        if (!projectId || !promptVersionId) {
            if (!versionLoading) {
                setLinksError("Cannot fetch links without a valid Prompt Version ID.");
            }
            setLinksLoading(false);
            setLinksList([]);
            return;
        }
        setLinksLoading(true);
        setLinksError(null);
        try {
            const data = await promptAssetService.findAssetLinks(projectId, promptVersionId);
            if (Array.isArray(data)) {
                setLinksList(data);
            } else {
                console.error("API response is not an array:", data);
                setLinksError('Received invalid data format.');
                setLinksList([]);
            }
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to fetch links.';
            console.error("Error fetching links:", err);
            setLinksError(apiErrorMessage);
            showErrorToast(apiErrorMessage);
            setLinksList([]);
        } finally {
            setLinksLoading(false);
        }
    }, [projectId, promptVersionId, versionLoading]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleAdd = () => {
        if (!projectId || !promptVersionId) {
            showErrorToast("Cannot add link: Project or Prompt Version ID missing.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetLink) => {
        if (!projectId || !promptVersionId) {
            showErrorToast("Cannot edit link: Project or Prompt Version ID missing.");
            return;
        }
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (linkId: string) => {
        if (!projectId || !promptVersionId) return;
        if (window.confirm('Are you sure you want to delete this link?')) {
            setLinksLoading(true);
            try {
                await promptAssetService.removeAssetLink(projectId, promptVersionId, linkId);
                showSuccessToast("Link deleted successfully!");
                fetchLinks();
            } catch (err) {
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete link.';
                setLinksError(apiErrorMessage);
                console.error(err);
                showErrorToast(apiErrorMessage);
            } finally {
                setLinksLoading(false);
            }
        }
    };

    const handleSave = async (payload: any) => {
        if (!projectId || !promptVersionId) return;
        setLinksLoading(true);
        try {
            let message = "";
            if (editingItem) {
                await promptAssetService.updateAssetLink(projectId, promptVersionId, editingItem.id, payload as UpdatePromptAssetLinkDto);
                message = "Link updated successfully!";
            } else {
                const createPayload = { ...payload, promptVersionId } as CreatePromptAssetLinkDto;
                await promptAssetService.createAssetLink(projectId, promptVersionId, createPayload);
                message = "Link created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchLinks();
        } catch (err) {
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save link.';
            setLinksError(apiErrorMessage);
            console.error(err);
            showErrorToast(apiErrorMessage);
        } finally {
            setLinksLoading(false);
        }
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: breadcrumbLoading ? projectId : (project?.name || projectId), href: `/projects/${projectId}/prompts` },
        { label: breadcrumbLoading ? promptId : (prompt?.name || promptId), href: `/projects/${projectId}/prompts/${promptId}/versions` },
        { label: `Version ${versionTag}`, href: `/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations` },
        { label: "Asset Links" }
    ];

    if (breadcrumbLoading || versionLoading) return <p>Loading page details...</p>;
    if (versionError) return <p className="text-red-500">Error loading version: {versionError}</p>;
    if (!promptVersionId) return <p className="text-red-500">Error: Could not retrieve Prompt Version ID.</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={linksLoading || breadcrumbLoading}>
                    Link Asset Version
                </button>
            </div>

            {linksLoading && <p>Loading links...</p>}
            {linksError && <p className="text-red-500">{linksError}</p>}
            {!linksLoading && !linksError && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {linksList.length === 0 ? (
                        <p>No asset versions linked to this prompt version.</p>
                    ) : (
                        <PromptAssetLinksTable
                            promptAssetLinks={linksList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Asset Link' : 'Link New Asset Version'}
                        </h3>
                        <PromptAssetLinkForm
                            initialData={editingItem}
                            promptVersionId={promptVersionId}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                        {linksLoading && <p>Saving...</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptAssetLinksPage; 