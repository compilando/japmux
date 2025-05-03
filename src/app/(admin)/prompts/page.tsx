"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Project,
    Prompt,
    promptService,
    CreatePromptDto,
    UpdatePromptDto,
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptsTable from '@/components/tables/PromptsTable';
import PromptForm from '@/components/form/PromptForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Prompt | null>(null);

    const { selectedProjectId, isLoading: isLoadingProject } = useProjects();
    const { isAuthenticated } = useAuth();

    const fetchData = useCallback(async () => {
        if (!selectedProjectId) {
            setError("Please select a project first.");
            setLoading(false);
            setItemsList([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const projectId = selectedProjectId as string;
            const data = await promptService.findAll(projectId);
            console.log("<<< DEBUG: Raw data received from API >>>:", data);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response for /prompts is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
            }
        } catch (err) {
            console.error("Error fetching prompts:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch prompts.');
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId && isAuthenticated) {
            console.log(`PromptsPage: Project selected (${selectedProjectId}), fetching prompts...`);
            fetchData();
        } else if (!isLoadingProject && !selectedProjectId) {
            console.log("PromptsPage: No project selected.");
            setItemsList([]);
            setLoading(false);
            setError("Please select a project to view prompts.");
        }
    }, [selectedProjectId, fetchData, isAuthenticated, isLoadingProject]);

    const handleAdd = () => {
        if (!selectedProjectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Prompt) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot edit, no project selected.");
            return;
        }
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this prompt?')) {
            try {
                await promptService.remove(selectedProjectId, id);
                showSuccessToast("Prompt deleted successfully!");
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                showErrorToast("Failed to delete prompt.");
            }
        }
    };

    const handleSave = async (payload: CreatePromptDto | UpdatePromptDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot save, no project selected.");
            return;
        }
        try {
            let message = "";
            if (editingItem) {
                await promptService.update(selectedProjectId, editingItem.id, payload as UpdatePromptDto);
                message = "Prompt updated successfully!";
            } else {
                await promptService.create(selectedProjectId, payload as CreatePromptDto);
                message = "Prompt created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
        }
    };

    if (isLoadingProject) {
        return <p>Loading project context...</p>;
    }

    return (
        <>
            <Breadcrumb pageTitle="Prompts" />
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${!selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={!selectedProjectId}
                    title={!selectedProjectId ? "Select a project to add a prompt" : "Add New Prompt"}
                >
                    Add Prompt
                </button>
            </div>
            {loading && !error && <p>Loading prompts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {itemsList.length === 0 ? (
                        <p>No prompts found for the selected project.</p>
                    ) : (
                        <PromptsTable
                            prompts={itemsList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            projectId={selectedProjectId || undefined}
                        />
                    )}
                </div>
            )}
            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt' : 'Add New Prompt'}
                        </h3>
                        <PromptForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            projectId={selectedProjectId}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptsPage; 