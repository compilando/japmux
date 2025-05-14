"use client";

import React, { useState, useEffect } from 'react';
import {
    Environment,
    environmentService,
    CreateEnvironmentDto,
    UpdateEnvironmentDto,
    Project,
    projectService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import EnvironmentsTable from '@/components/tables/EnvironmentsTable';
import EnvironmentForm from '@/components/form/EnvironmentForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const EnvironmentsPage: React.FC = () => {
    const [environmentsList, setEnvironmentsList] = useState<Environment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);
    const { selectedProjectId, selectedProjectFull, isLoadingSelectedProjectFull } = useProjects();

    const fetchData = async () => {
        if (!selectedProjectId) {
            setLoading(false);
            setError("Please select a project first.");
            setEnvironmentsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await environmentService.findAll(selectedProjectId);
            if (Array.isArray(data)) {
                setEnvironmentsList(data);
            } else {
                console.error("API response for /environments is not an array:", data);
                setError('Received invalid data format for environments.');
                setEnvironmentsList([]);
            }
        } catch (err) {
            console.error("Error fetching environments:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch environments.');
            setEnvironmentsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        } else {
            setEnvironmentsList([]);
            setLoading(false);
            setError("Please select a project to manage environments.");
        }
    }, [selectedProjectId]);

    const handleAdd = () => {
        setEditingEnvironment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (environment: Environment) => {
        setEditingEnvironment(environment);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this environment?')) {
            setLoading(true);
            try {
                await environmentService.remove(selectedProjectId, id);
                showSuccessToast('Environment deleted successfully!');
                fetchData();
            } catch (err) {
                console.error("Error deleting environment:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreateEnvironmentDto | UpdateEnvironmentDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingEnvironment && editingEnvironment.id) {
                await environmentService.update(selectedProjectId, editingEnvironment.id, payload as UpdateEnvironmentDto);
                message = 'Environment updated successfully!';
            } else {
                await environmentService.create(selectedProjectId, payload as CreateEnvironmentDto);
                message = 'Environment created successfully!';
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            console.error("Error saving environment:", err);
        } finally {
            setLoading(false);
        }
    };

    let breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs.push({
            label: isLoadingSelectedProjectFull ? selectedProjectId : (selectedProjectFull?.name || selectedProjectId),
        });
        breadcrumbs.push({ label: "Environments" });
    } else {
        breadcrumbs.push({ label: "Environments (Select Project)" });
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Environments
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all Environments in the system.
                </p>
            </div>

            {!selectedProjectId ? (
                <p className="text-center text-yellow-500 dark:text-yellow-400">Please select a project from the header dropdown to manage environments.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Add Environment
                        </button>
                    </div>
                    {(loading || isLoadingSelectedProjectFull) && <p>Loading environments...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && !isLoadingSelectedProjectFull && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <EnvironmentsTable
                                environments={environmentsList}
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
                            {editingEnvironment ? 'Edit Environment' : 'Add New Environment'}
                        </h3>
                        <EnvironmentForm
                            initialData={editingEnvironment}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EnvironmentsPage; 