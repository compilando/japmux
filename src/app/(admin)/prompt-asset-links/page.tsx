"use client";

import React, { useState, useEffect } from 'react';
import {
    PromptAssetLink,
    getPromptAssetLinks,
    createPromptAssetLink,
    updatePromptAssetLink,
    deletePromptAssetLink,
    PromptAssetLinkCreatePayload,
    PromptAssetLinkUpdatePayload
} from '@/services/api';
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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPromptAssetLinks();
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PromptAssetLink) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deletePromptAssetLink(id);
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

    const handleSave = async (payload: PromptAssetLinkCreatePayload | PromptAssetLinkUpdatePayload) => {
        try {
            if (editingItem) {
                await updatePromptAssetLink(editingItem.id, payload as PromptAssetLinkUpdatePayload);
            } else {
                await createPromptAssetLink(payload as PromptAssetLinkCreatePayload);
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
                        promptAssetLinks={itemsList} // Prop name changed
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            {isModalOpen && (
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