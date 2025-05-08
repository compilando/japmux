"use client";

import React, { useState, useEffect } from 'react';
import {
    tagService,
    CreateTagDto,
    UpdateTagDto,
    projectService
} from '@/services/api';
import * as generated from '../../../../generated/japmux-api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import TagsTable from '@/components/tables/TagsTable';
import TagForm from '@/components/form/TagForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const TagsPage: React.FC = () => {
    const [tagsList, setTagsList] = useState<generated.TagDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTag, setEditingTag] = useState<generated.TagDto | null>(null);
    const { selectedProjectId } = useProjects();

    const [project, setProject] = useState<generated.CreateProjectDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    useEffect(() => {
        if (selectedProjectId) {
            setBreadcrumbLoading(true);
            projectService.findOne(selectedProjectId)
                .then(data => setProject(data))
                .catch(err => {
                    console.error("Error fetching project for breadcrumbs:", err);
                    showErrorToast("Failed to load project details for breadcrumbs.");
                    setProject(null);
                })
                .finally(() => setBreadcrumbLoading(false));
        } else {
            setProject(null);
            setBreadcrumbLoading(false);
        }
    }, [selectedProjectId]);

    const fetchData = async () => {
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
                setTagsList(data);
            } else {
                console.error("API response for /tags is not an array:", data);
                setError('Received invalid data format for tags.');
                setTagsList([]);
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
            showErrorToast('Failed to fetch tags.');
            setTagsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedProjectId]);

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
            try {
                await tagService.delete(selectedProjectId, id);
                showSuccessToast("Tag deleted successfully.");
                fetchData();
            } catch (err: any) {
                showErrorToast(err.response?.data?.message || err.message || 'Failed to delete tag.');
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: CreateTagDto | UpdateTagDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        try {
            if (editingTag) {
                await tagService.update(selectedProjectId, editingTag.id, payload as UpdateTagDto);
                showSuccessToast("Tag updated successfully.");
            } else {
                await tagService.create(selectedProjectId, payload as CreateTagDto);
                showSuccessToast("Tag created successfully.");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            showErrorToast(err.response?.data?.message || err.message || 'Failed to save tag.');
            console.error(err);
        }
    };

    let breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs = [
            ...breadcrumbs,
            { label: breadcrumbLoading ? selectedProjectId : (project?.name || selectedProjectId), href: `/projects/${selectedProjectId}/prompts` },
            { label: "Tags" }
        ];
    } else {
        breadcrumbs = [
            ...breadcrumbs,
            { label: "Tags (Select Project)" }
        ];
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            {!selectedProjectId ? (
                <p className="text-center text-red-500">Please select a project from the header dropdown to manage tags.</p>
            ) : (
                <>
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