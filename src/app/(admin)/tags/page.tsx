"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    tagService,
    CreateTagDto,
    UpdateTagDto,
    TagDto as ApiTagResponse,
} from '@/services/api';
import * as generated from '../../../../generated/japmux-api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import TagsDisplay from '@/components/tags/TagsDisplay';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { TagResponse } from '@/components/tags/TagCardItem';

const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message: string }).message) || defaultMessage;
    }
    return defaultMessage;
};

const TagsPage: React.FC = () => {
    const { selectedProjectId } = useProjects();
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para la edición inline
    const [editingTagId, setEditingTagId] = useState<string | null>(null);
    const [editTagName, setEditTagName] = useState('');
    const [editTagDescription, setEditTagDescription] = useState('');

    // Estados para la adición inline
    const [isAdding, setIsAdding] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Tags" }
    ];

    const mapApiTagToUiTag = (apiTag: ApiTagResponse): TagResponse => ({
        id: apiTag.id,
        name: apiTag.name,
        description: apiTag.description,
    });

    const fetchTags = useCallback(async () => {
        if (!selectedProjectId) {
            setTags([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await tagService.findAll(selectedProjectId);
            setTags(data.map(mapApiTagToUiTag));
        } catch (err: any) {
            console.error("Failed to fetch tags:", err);
            setError(err.message || 'Failed to fetch tags.');
            setTags([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    // Funciones para la edición
    const handleStartEdit = (tag: TagResponse) => {
        setIsAdding(false); // Cancelar adición si se inicia edición
        setEditingTagId(tag.id);
        setEditTagName(tag.name);
        setEditTagDescription(tag.description || '');
    };

    const handleCancelEdit = () => {
        setEditingTagId(null);
        setEditTagName('');
        setEditTagDescription('');
    };

    const handleSaveEdit = async (tagId: string) => {
        if (!editTagName.trim()) {
            showErrorToast('Tag name cannot be empty.');
            return;
        }
        if (!selectedProjectId) {
            showErrorToast('No project selected.');
            return;
        }

        const updateDto: UpdateTagDto = {
            name: editTagName,
            description: editTagDescription,
        };

        try {
            await tagService.update(selectedProjectId, tagId, updateDto);
            showSuccessToast('Tag updated successfully!');
            setEditingTagId(null);
            fetchTags(); // Recargar tags
        } catch (error: any) {
            console.error("Error updating tag:", error);
            showErrorToast(error.message || 'Failed to update tag.');
        }
    };

    const handleDeleteTag = async (id: string) => {
        if (!selectedProjectId) {
            showErrorToast('No project selected for deletion.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await tagService.delete(selectedProjectId, id);
                showSuccessToast('Tag deleted successfully');
                fetchTags();
                if (editingTagId === id) {
                    handleCancelEdit();
                }
            } catch (error: any) {
                console.error("Error deleting tag:", error);
                showErrorToast(error.message || 'Failed to delete tag.');
            }
        }
    };

    // Funciones para añadir nuevo tag
    const handleAddNewTag = () => {
        handleCancelEdit(); // Cancelar edición si se inicia adición
        setIsAdding(true);
        setNewTagName('');
        setNewTagDescription('');
    };

    const handleCancelNewTag = () => {
        setIsAdding(false);
        setNewTagName('');
        setNewTagDescription('');
    };

    const handleSaveNewTag = async () => {
        if (!newTagName.trim()) {
            showErrorToast('Tag name cannot be empty.');
            return;
        }
        if (!selectedProjectId) {
            showErrorToast('Cannot add tag: No project selected.');
            return;
        }

        const createDto: CreateTagDto = {
            name: newTagName,
            description: newTagDescription,
        };

        try {
            await tagService.create(selectedProjectId, createDto);
            showSuccessToast('Tag added successfully!');
            setIsAdding(false);
            setNewTagName('');
            setNewTagDescription('');
            fetchTags(); // Recargar tags
        } catch (error: any) {
            console.error("Error creating tag:", error);
            showErrorToast(error.message || 'Failed to create tag.');
        }
    };

    if (!selectedProjectId) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tags Management</h1>
                    <p className="text-center text-gray-600 dark:text-gray-300">Please select a project to manage tags.</p>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tags Management</h1>
                    <p className="text-center text-gray-600 dark:text-gray-300">Loading tags...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tags Management</h1>
                    <p className="text-center text-red-500">Error loading tags: {error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Tags Management
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Organize and manage your tags for the selected project.
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <TagsDisplay
                    tagsList={tags}
                    editingTagId={editingTagId}
                    editTagName={editTagName}
                    editTagDescription={editTagDescription}
                    isAdding={isAdding}
                    newTagName={newTagName}
                    newTagDescription={newTagDescription}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    onDeleteTag={handleDeleteTag}
                    onEditTagNameChange={setEditTagName}
                    onEditTagDescriptionChange={setEditTagDescription}
                    onAddNewTag={handleAddNewTag}
                    onCancelNewTag={handleCancelNewTag}
                    onSaveNewTag={handleSaveNewTag}
                    onNewTagNameChange={setNewTagName}
                    onNewTagDescriptionChange={setNewTagDescription}
                />
            </div>
        </>
    );
};

export default TagsPage; 