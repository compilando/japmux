"use client";

import React, { useState, useEffect } from 'react';
import {
    Tag,
    getTags,
    createTag,
    updateTag,
    deleteTag,
    TagCreatePayload,
    TagUpdatePayload
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import TagsTable from '@/components/tables/TagsTable'; // Ajustado
import TagForm from '@/components/form/TagForm';     // Ajustado
import axios from 'axios';

const TagsPage: React.FC = () => {
    const [tagsList, setTagsList] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTags();
            if (Array.isArray(data)) {
                setTagsList(data);
            } else {
                console.error("API response for /tags is not an array:", data);
                setError('Received invalid data format for tags.');
                setTagsList([]);
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch tags.');
            setTagsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingTag(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await deleteTag(id);
                fetchData(); // Recargar datos después de borrar
            } catch (err) {
                setError('Failed to delete tag');
                console.error(err);
                if (axios.isAxiosError(err)) {
                    alert(`Error deleting: ${err.response?.data?.message || err.message}`);
                } else if (err instanceof Error) {
                    alert(`Error deleting: ${err.message}`);
                }
            }
        }
    };

    const handleSave = async (payload: TagCreatePayload | TagUpdatePayload) => {
        try {
            if (editingTag) {
                await updateTag(editingTag.id, payload as TagUpdatePayload);
            } else {
                await createTag(payload as TagCreatePayload);
            }
            setIsModalOpen(false);
            fetchData(); // Recargar datos después de guardar
        } catch (err) {
            setError('Failed to save tag');
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
            <Breadcrumb pageTitle="Tags" />
            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Add Tag
                </button>
            </div>
            {loading && <p>Loading tags...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <TagsTable
                        tags={tagsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingTag ? 'Edit Tag' : 'Add New Tag'}
                        </h3>
                        <TagForm
                            initialData={editingTag}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default TagsPage; 