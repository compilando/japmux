"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    PromptAssetVersion,
    promptAssetVersionService,
    CreatePromptAssetVersionDto,
    UpdatePromptAssetVersionDto
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import PromptAssetVersionsTable from '@/components/tables/PromptAssetVersionsTable';
import PromptAssetVersionForm from '@/components/form/PromptAssetVersionForm';
import axios from 'axios';

const PromptAssetVersionsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<PromptAssetVersion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<PromptAssetVersion | null>(null);

    const params = useParams();
    const router = useRouter();
    const { selectedProjectId } = useProjects();

    const projectId = params.projectId as string;
    const assetId = params.assetId as string;

    const fetchData = useCallback(async () => {
        if (!projectId || !assetId) {
            setError("Missing Project or Asset ID in URL.");
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

        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetVersionService.findAll(projectId, assetId);
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
    }, [projectId, assetId, selectedProjectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetVersion) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (versionId: string) => {
        if (!projectId || !assetId) return;
        if (window.confirm('Are you sure you want to delete this version?')) {
            try {
                await promptAssetVersionService.remove(projectId, assetId, versionId);
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

    const handleSave = async (payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto) => {
        if (!projectId || !assetId) return;
        try {
            if (editingItem) {
                await promptAssetVersionService.update(projectId, assetId, editingItem.id, payload as UpdatePromptAssetVersionDto);
            } else {
                await promptAssetVersionService.create(projectId, assetId, payload as CreatePromptAssetVersionDto);
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

    if (!projectId || !assetId) {
        return <p className="text-red-500">Error: Missing Project or Asset ID in URL.</p>;
    }

    if (projectId !== selectedProjectId) {
        return <p className="text-red-500">Error: Project ID in URL ({projectId}) does not match selected project ({selectedProjectId}).</p>;
    }

    return (
        <>
            <Breadcrumb pageTitle={`Versions for Asset ${assetId.substring(0, 6)}...`} />
            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Add Prompt Asset Version
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <PromptAssetVersionsTable
                        promptAssetVersions={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Prompt Asset Version' : 'Add New Prompt Asset Version'}
                        </h3>
                        <PromptAssetVersionForm
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

export default PromptAssetVersionsPage; 