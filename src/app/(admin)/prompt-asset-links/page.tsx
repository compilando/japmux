"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    PromptAssetLink,
    promptAssetLinkService,
    CreatePromptAssetLinkDto,
    UpdatePromptAssetLinkDto
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { usePrompts } from '@/context/PromptContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetLinksTable from '@/components/tables/PromptAssetLinksTable';
import PromptAssetLinkForm from '@/components/form/PromptAssetLinkForm';
import axios from 'axios';

const PromptAssetLinksPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAssetLink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetLink | null>(null);
    const { selectedProjectId } = useProjects();
    const { selectedPromptId } = usePrompts();

    const fetchData = useCallback(async () => {
        if (!selectedProjectId) {
            setLoading(false);
            setError("Please select a project first.");
            setItemsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetLinkService.findAll(selectedProjectId);
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
    }, [selectedProjectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        if (!selectedProjectId) {
            alert("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetLink) => {
        if (!selectedProjectId) return;
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (linkId: string) => {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this link?')) {
            try {
                await promptAssetLinkService.remove(selectedProjectId, linkId);
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

    const handleSave = async (payload: CreatePromptAssetLinkDto | UpdatePromptAssetLinkDto) => {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }
        try {
            if (editingItem) {
                await promptAssetLinkService.update(selectedProjectId, editingItem.id, payload as UpdatePromptAssetLinkDto);
            } else {
                await promptAssetLinkService.create(selectedProjectId, payload as CreatePromptAssetLinkDto);
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

    return (
        <>
            <Breadcrumb pageTitle="Prompt Asset Links" />
            {selectedPromptId && (
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    (Currently selected prompt context: {selectedPromptId.substring(0, 8)}...)
                </p>
            )}
            {!selectedProjectId ? (
                <p className="text-center text-red-500">Please select a project from the header dropdown to manage links.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Add Prompt Asset Link
                        </button>
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <PromptAssetLinksTable
                                promptAssetLinks={itemsList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </>
            )}
            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt Asset Link' : 'Add New Prompt Asset Link'}
                        </h3>
                        <PromptAssetLinkForm
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

export default PromptAssetLinksPage; 