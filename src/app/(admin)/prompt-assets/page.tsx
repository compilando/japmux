"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    PromptAsset,
    promptAssetService,
    CreatePromptAssetDto,
    UpdatePromptAssetDto,
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetsTable from '@/components/tables/PromptAssetsTable';
import PromptAssetForm from '@/components/form/PromptAssetForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const PromptAssetsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAsset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAsset | null>(null);

    const { selectedProjectId, isLoading: isLoadingProject } = useProjects();
    const { isAuthenticated } = useAuth();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const projectId = selectedProjectId as string;
            const data = await promptAssetService.findAll(projectId);
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
            setItemsList([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId && isAuthenticated) {
            fetchData();
        } else if (!isLoadingProject && !selectedProjectId) {
            setItemsList([]);
            setLoading(false);
            setError("Please select a project to view prompt assets.");
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

    const handleEdit = (item: PromptAsset) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot edit, no project selected.");
            return;
        }
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (key: string) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot delete, no project selected.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the asset with key: ${key}?`)) {
            try {
                await promptAssetService.removeByKey(selectedProjectId, key);
                showSuccessToast("Prompt Asset deleted successfully!");
                fetchData();
            } catch (err) {
                setError('Failed to delete item');
                console.error(err);
                showErrorToast("Failed to delete prompt asset.");
            }
        }
    };

    const handleSave = async (payload: CreatePromptAssetDto | UpdatePromptAssetDto) => {
        if (!selectedProjectId) {
            showErrorToast("Cannot save, no project selected.");
            return;
        }
        try {
            let message = "";
            if (editingItem) {
                await promptAssetService.update(selectedProjectId, editingItem.key, payload as UpdatePromptAssetDto);
                message = "Prompt Asset updated successfully!";
            } else {
                await promptAssetService.create(selectedProjectId, payload as CreatePromptAssetDto);
                message = "Prompt Asset created successfully!";
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
            <Breadcrumb pageTitle="Prompt Assets" />
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${!selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={!selectedProjectId}
                    title={!selectedProjectId ? "Select a project to add an asset" : "Add New Prompt Asset"}
                >
                    Add Prompt Asset
                </button>
            </div>
            {loading && !error && <p>Loading prompt assets...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {itemsList.length === 0 ? (
                        <p>No prompt assets found for the selected project.</p>
                    ) : (
                        <PromptAssetsTable
                            promptAssets={itemsList}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            )}
            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt Asset' : 'Add New Prompt Asset'}
                        </h3>
                        <PromptAssetForm
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

export default PromptAssetsPage; 