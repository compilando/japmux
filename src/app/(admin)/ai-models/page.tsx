"use client";

import React, { useState, useEffect } from 'react';
import {
    CreateAiModelDto,
    UpdateAiModelDto,
    AiModelResponseDto
} from '@/services/generated/api';
import { aiModelService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import AiModelsDisplay from '@/components/ai-models/AiModelsDisplay';
import AiModelForm from '@/components/form/AiModelForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const AiModelsPage: React.FC = () => {
    const [aiModelsList, setAiModelsList] = useState<AiModelResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingModel, setEditingModel] = useState<AiModelResponseDto | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);

    const {
        selectedProjectId,
        selectedProjectFull,
        isLoadingSelectedProjectFull
    } = useProjects();

    const fetchData = async (projectId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await aiModelService.findAll(projectId);
            if (Array.isArray(data)) {
                setAiModelsList(data);
            } else {
                console.error("API response for /ai-models is not an array:", data);
                setError('Received invalid data format for AI models.');
                setAiModelsList([]);
            }
        } catch (err) {
            console.error("Error fetching AI models:", err);
            let errorMessage = 'Failed to fetch AI models.';
            if (err instanceof Error) {
                errorMessage += `: ${err.message}`;
            } else {
                errorMessage += `: ${String(err)}`;
            }
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = `Failed to fetch AI models: ${err.response.data.message}`;
            }
            setError(errorMessage);
            setAiModelsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProjectId) {
            fetchData(selectedProjectId);
        } else {
            setLoading(false);
            setError("Please select a project to view AI models.");
            setAiModelsList([]);
        }
    }, [selectedProjectId]);

    const handleAdd = () => {
        setEditingModel(null);
        setShowForm(true);
    };

    const handleEdit = (model: AiModelResponseDto) => {
        setEditingModel(model);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot delete model without a selected project.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this AI model?')) {
            try {
                await aiModelService.remove(selectedProjectId, id);
                showSuccessToast('AI Model deleted successfully!');
                if (selectedProjectId) {
                    fetchData(selectedProjectId);
                }
                if (editingModel && editingModel.id === id) {
                    setShowForm(false);
                    setEditingModel(null);
                }
            } catch (err) {
                console.error("Error deleting AI Model:", err);
                showErrorToast(err instanceof Error ? err.message : 'Error deleting AI model');
            }
        }
    };

    const handleSave = async (payload: CreateAiModelDto | UpdateAiModelDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot save model without a selected project.");
            setShowForm(false);
            return;
        }
        try {
            let message = "";
            if (editingModel && editingModel.id) {
                await aiModelService.update(selectedProjectId, editingModel.id, payload as UpdateAiModelDto);
                message = 'AI Model updated successfully!';
            } else {
                await aiModelService.create(selectedProjectId, payload as CreateAiModelDto);
                message = 'AI Model created successfully!';
            }
            setShowForm(false);
            setEditingModel(null);
            showSuccessToast(message);
            if (selectedProjectId) {
                fetchData(selectedProjectId);
            }
        } catch (err) {
            console.error("Error saving AI Model:", err);
            showErrorToast(err instanceof Error ? err.message : 'Error saving AI model');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingModel(null);
    }

    const breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs.push({
            label: isLoadingSelectedProjectFull ? selectedProjectId : (selectedProjectFull?.name || selectedProjectId),
        });
        breadcrumbs.push({ label: "AI Models" });
    } else {
        breadcrumbs.push({ label: "AI Models (Select Project)" });
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    AI Models
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all AI Models in the system.
                </p>
            </div>

            {!selectedProjectId && !loading && (
                <p className="text-yellow-600 dark:text-yellow-400">Please select a project to manage AI Models.</p>
            )}
            {selectedProjectId && (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            disabled={showForm}
                        >
                            Add AI Model
                        </button>
                    </div>
                    {(loading || (selectedProjectId && isLoadingSelectedProjectFull)) && <p>Loading AI models...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (!selectedProjectId || !isLoadingSelectedProjectFull) && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            {showForm && (
                                <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                        {editingModel ? 'Edit AI Model' : 'Add New AI Model'}
                                    </h3>
                                    <AiModelForm
                                        initialData={editingModel}
                                        onSave={handleSave}
                                        onCancel={handleCancelForm}
                                        projectId={selectedProjectId || ''}
                                    />
                                </div>
                            )}
                            <AiModelsDisplay
                                aiModelsList={aiModelsList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default AiModelsPage; 