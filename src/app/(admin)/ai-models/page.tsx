"use client";

import React, { useState, useEffect } from 'react';
import {
    AiModel,
    getAiModels,
    createAiModel,
    updateAiModel,
    deleteAiModel,
    AiModelCreatePayload,
    AiModelUpdatePayload
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import AiModelsTable from '@/components/tables/AiModelsTable';
import AiModelForm from '@/components/form/AiModelForm';
import axios from 'axios';

const AiModelsPage: React.FC = () => {
    const [aiModelsList, setAiModelsList] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingModel, setEditingModel] = useState<AiModel | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAiModels();
            if (Array.isArray(data)) {
                setAiModelsList(data);
            } else {
                console.error("API response for /ai-models is not an array:", data);
                setError('Received invalid data format for AI models.');
                setAiModelsList([]);
            }
        } catch (err) {
            console.error("Error fetching AI models:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch AI models.');
            setAiModelsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingModel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (model: AiModel) => {
        setEditingModel(model);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this AI model?')) {
            try {
                await deleteAiModel(id);
                fetchData();
            } catch (err) {
                setError('Failed to delete AI model');
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: AiModelCreatePayload | AiModelUpdatePayload) => {
        try {
            if (editingModel) {
                await updateAiModel(editingModel.id, payload as AiModelUpdatePayload);
            } else {
                await createAiModel(payload as AiModelCreatePayload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError('Failed to save AI model');
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    return (
        <>
            <Breadcrumb pageTitle="AI Models" />
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
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AiModelsPage; 