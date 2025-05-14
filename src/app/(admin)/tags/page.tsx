"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    tagService,
    CreateTagDto,
    UpdateTagDto,
} from '@/services/api';
import * as generated from '../../../../generated/japmux-api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import TagsTable from '@/components/tables/TagsTable';
import TagForm from '@/components/form/TagForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message: string }).message) || defaultMessage;
    }
    return defaultMessage;
};

const TagsPage: React.FC = () => {
    const [tagsList, setTagsList] = useState<generated.TagDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTag, setEditingTag] = useState<generated.TagDto | null>(null);

    const {
        selectedProjectId,
        selectedProjectFull,
        isLoadingSelectedProjectFull
    } = useProjects();

    const fetchData = useCallback(async () => {
        if (!selectedProjectId) {
            setLoading(false);
            setError("Please select a project first.");
            setTagsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await tagService.findAll(selectedProjectId);
            if (Array.isArray(data)) {
                setTagsList(data as generated.TagDto[]);
            } else {
                console.error("API response for /tags is not an array:", data);
                setError('Received invalid data format for tags.');
                setTagsList([]);
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
            setError(getApiErrorMessage(err, 'Failed to fetch tags.'));
            setTagsList([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        } else {
            setTagsList([]);
            setLoading(false);
            setError("Please select a project to manage tags.");
        }
    }, [selectedProjectId, fetchData]);

    const handleAdd = () => {
        setEditingTag(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tag: generated.TagDto) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this tag?')) {
            setLoading(true);
            try {
                await tagService.delete(selectedProjectId, id);
                showSuccessToast("Tag deleted successfully.");
                fetchData();
            } catch (err: unknown) {
                console.error("Error deleting tag:", err);
                showErrorToast(getApiErrorMessage(err, "Failed to delete tag."));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreateTagDto | UpdateTagDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingTag && editingTag.id) {
                await tagService.update(selectedProjectId, editingTag.id, payload as UpdateTagDto);
                message = "Tag updated successfully.";
            } else {
                await tagService.create(selectedProjectId, payload as CreateTagDto);
                message = "Tag created successfully.";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) {
            console.error("Error saving tag:", err);
            showErrorToast(getApiErrorMessage(err, "Failed to save tag."));
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs.push({
            label: isLoadingSelectedProjectFull ? selectedProjectId : (selectedProjectFull?.name || selectedProjectId),
        });
        breadcrumbs.push({ label: "Tags" });
    } else {
        breadcrumbs.push({ label: "Tags (Select Project)" });
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Tags
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all Tags in the system.
                </p>
            </div>

            {!selectedProjectId ? (
                <p className="text-center text-yellow-500 dark:text-yellow-400">Please select a project from the header dropdown to manage tags.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Add Tag
                        </button>
                    </div>
                    {(loading || isLoadingSelectedProjectFull) && <p>Loading tags...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && !isLoadingSelectedProjectFull && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <TagsTable
                                tags={tagsList}
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