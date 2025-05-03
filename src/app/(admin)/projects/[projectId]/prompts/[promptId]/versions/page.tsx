"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    PromptVersion,
    promptVersionService,
    CreatePromptVersionDto,
    UpdatePromptVersionDto,
    ActivatePromptVersionDto
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { usePrompts } from '@/context/PromptContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptVersionsTable from '@/components/tables/PromptVersionsTable';
import PromptVersionForm from '@/components/form/PromptVersionForm';
import axios from 'axios';

const PromptVersionsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptVersion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptVersion | null>(null);

    const params = useParams();
    const router = useRouter();
    const { selectedProjectId } = useProjects();
    const { selectedPromptId } = usePrompts();

    const projectId = params.projectId as string;
    const promptId = params.promptId as string;

    const fetchData = useCallback(async () => {
        if (!projectId || !promptId) {
            setError("Missing Project or Prompt ID in URL.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (projectId !== selectedProjectId) {
            setError("Project ID in URL does not match selected project.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        if (selectedPromptId && promptId !== selectedPromptId) {
            setError(`Error: URL prompt ID (${promptId.substring(0, 6)}...) does not match context prompt ID (${selectedPromptId.substring(0, 6)}...). Clear selection or navigate from Prompts table.`);
            setLoading(false);
            setItemsList([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await promptVersionService.findAll(projectId, promptId);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch items.');
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, selectedProjectId, selectedPromptId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptVersion) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemToDelete: PromptVersion) => {
        if (!projectId || !promptId) return;
        if (window.confirm(`Are you sure you want to delete version tag "${itemToDelete.versionTag}"?`)) {
            try {
                await promptVersionService.remove(projectId, promptId, itemToDelete.versionTag);
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                if (axios.isAxiosError(err)) {
                    alert(`Error deleting: ${err.response?.data?.message || err.message}`);
                } else if (err instanceof Error) {
                    alert(`Error deleting: ${err.message}`);
                }
            }
        }
    };

    const handleSave = async (payload: CreatePromptVersionDto | UpdatePromptVersionDto) => {
        if (!projectId || !promptId) return;
        try {
            if (editingItem) {
                await promptVersionService.update(projectId, promptId, editingItem.versionTag, payload as UpdatePromptVersionDto);
            } else {
                await promptVersionService.create(projectId, promptId, payload as CreatePromptVersionDto);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    const handleToggleActive = async (itemToToggle: PromptVersion) => {
        if (!projectId || !promptId) return;
        const payload: ActivatePromptVersionDto = { isActive: !itemToToggle.isActive };
        try {
            await promptVersionService.activate(projectId, promptId, itemToToggle.versionTag, payload);
            fetchData();
        } catch (err) {
            setError('Failed to toggle active state');
            console.error(err);
            alert('Failed to toggle active state');
        }
    };

    if (!projectId || !promptId) {
        return <p className="text-red-500">Error: Missing Project or Prompt ID in URL.</p>;
    }

    if (projectId !== selectedProjectId) {
        return <p className="text-red-500">Error: Project ID in URL ({projectId}) does not match selected project ({selectedProjectId}).</p>;
    }

    if (selectedPromptId && promptId !== selectedPromptId) {
        return <p className="text-yellow-600 dark:text-yellow-400">Warning: Navigated directly? URL prompt ID ({promptId.substring(0, 6)}...) differs from last selected prompt ({selectedPromptId.substring(0, 6)}...).</p>;
    }

    return (
        <>
            <Breadcrumb pageTitle={`Versions for Prompt ${(selectedPromptId || promptId).substring(0, 6)}...`} />
            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Add Prompt Version
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <PromptVersionsTable
                        promptVersions={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        projectId={projectId}
                    />
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt Version' : 'Add New Prompt Version'}
                        </h3>
                        <PromptVersionForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptVersionsPage; 