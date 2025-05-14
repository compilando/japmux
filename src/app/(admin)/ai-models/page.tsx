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
import AiModelsTable from '@/components/tables/AiModelsTable';
import AiModelForm from '@/components/form/AiModelForm';
import axios from 'axios';

const AiModelsPage: React.FC = () => {
    const [aiModelsList, setAiModelsList] = useState<AiModelResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingModel, setEditingModel] = useState<AiModelResponseDto | null>(null);
    const { selectedProjectId } = useProjects();

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
        setIsModalOpen(true);
    };

    const handleEdit = (model: AiModelResponseDto) => {
        setEditingModel(model);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            setError("Cannot delete model without a selected project.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this AI model?')) {
            try {
                await aiModelService.remove(selectedProjectId, id);
                if (selectedProjectId) {
                    fetchData(selectedProjectId);
                }
            } catch (err) {
                setError('Failed to delete AI model');
                console.error(err);
            }
            setIsModalOpen(false);
            if (selectedProjectId) {
                fetchData(selectedProjectId);
            }
        }
    };

    const handleSave = async (payload: CreateAiModelDto | UpdateAiModelDto) => {
        if (!selectedProjectId) {
            setError("Cannot save model without a selected project.");
            setIsModalOpen(false);
            return;
        }
        try {
            if (editingModel && editingModel.id) {
                await aiModelService.update(selectedProjectId, editingModel.id, payload as UpdateAiModelDto);
            } else {
                await aiModelService.create(selectedProjectId, payload as CreateAiModelDto);
            }
            setIsModalOpen(false);
            if (selectedProjectId) {
                fetchData(selectedProjectId);
            }
        } catch (err) {
            setError(`Failed to save AI model: ${err instanceof Error ? err.message : String(err)}`);
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "AI Models" }
    ];

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
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Add AI Model
                        </button>
                    </div>
                    {loading && <p>Loading AI models...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <AiModelsTable
                                aiModels={aiModelsList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingModel ? 'Edit AI Model' : 'Add New AI Model'}
                        </h3>
                        <AiModelForm
                            initialData={editingModel}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            projectId={selectedProjectId || ''}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AiModelsPage; 