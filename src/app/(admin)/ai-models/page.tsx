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
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { PlusIcon } from '@heroicons/react/24/outline';

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
        } catch (err: any) {
            console.error("Error fetching AI models:", err);
            let errorMessage = 'Failed to fetch AI models.';
            if (err instanceof Error) {
                errorMessage += `: ${err.message}`;
            } else {
                errorMessage += `: ${String(err)}`;
            }
            if (err.response && err.response.data && err.response.data.message) {
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

    if (!selectedProjectId && !loading) {
        return (
            <div className="relative min-h-screen">
                {/* Background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-200/10 dark:bg-brand-800/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative">
                    <Breadcrumb crumbs={breadcrumbs} />

                    <div className="min-h-screen flex items-center justify-center">
                        <div className="relative">
                            {/* Glassmorphism background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                            <div className="relative p-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-lg text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Project Selected</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Please select a project to manage AI Models.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-200/10 dark:bg-brand-800/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative">
                <Breadcrumb crumbs={breadcrumbs} />

                {/* Header section with glassmorphism */}
                <div className="my-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl rounded-2xl"></div>
                        <div className="relative p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                AI Models
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Create, view, and manage all AI Models in the system.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content with glassmorphism */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl">
                        {/* Action button */}
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={handleAdd}
                                className="relative px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={showForm}
                            >
                                <PlusIcon className="h-5 w-5 inline-block mr-2" />
                                Add AI Model
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Loading state */}
                        {(loading || (selectedProjectId && isLoadingSelectedProjectFull)) && (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                                        <div className="w-8 h-8 mx-auto mb-4 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading AI models...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-red-50/40 to-red-50/60 dark:from-red-900/60 dark:via-red-900/40 dark:to-red-900/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-red-50/30 dark:bg-red-900/30 backdrop-blur-sm rounded-2xl border border-red-200/30 dark:border-red-700/40 shadow-lg">
                                        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form section */}
                        {showForm && (
                            <div className="mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-brand-50/40 to-brand-50/60 dark:from-brand-950/60 dark:via-brand-950/40 dark:to-brand-950/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-brand-50/30 dark:bg-brand-950/30 backdrop-blur-sm rounded-2xl border border-brand-200/30 dark:border-brand-700/40 shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                            {editingModel ? 'Edit AI Model' : 'Add New AI Model'}
                                        </h3>
                                        <AiModelForm
                                            initialData={editingModel}
                                            onSave={handleSave}
                                            onCancel={handleCancelForm}
                                            projectId={selectedProjectId || ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Models display */}
                        {!loading && !error && (!selectedProjectId || !isLoadingSelectedProjectFull) && (
                            <AiModelsDisplay
                                aiModelsList={aiModelsList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiModelsPage; 