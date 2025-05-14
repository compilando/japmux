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
    const { selectedProjectId } = useProjects();

    // Estados para breadcrumb
    const [project, setProject] = useState<Project | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    // Efecto para cargar nombre del proyecto
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
        fetchData();
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
            alert("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this environment?')) {
            try {
                await environmentService.remove(selectedProjectId, id);
                fetchData();
            } catch (err) {
                setError('Failed to delete environment');
                console.error(err);
                if (axios.isAxiosError(err)) {
                    alert(`Error deleting: ${err.response?.data?.message || err.message}`);
                } else if (err instanceof Error) {
                    alert(`Error deleting: ${err.message}`);
                }
            }
        }
    };

    const handleSave = async (payload: CreateEnvironmentDto | UpdateEnvironmentDto) => {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }
        try {
            if (editingEnvironment) {
                await environmentService.update(selectedProjectId, editingEnvironment.id, payload as UpdateEnvironmentDto);
            } else {
                await environmentService.create(selectedProjectId, payload as CreateEnvironmentDto);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError('Failed to save environment');
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    // Definir crumbs con estructura explícita
    let breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs = [
            ...breadcrumbs,
            { label: breadcrumbLoading ? selectedProjectId : (project?.name || selectedProjectId), href: `/projects/${selectedProjectId}/environments` }, // Penúltimo con href
            { label: "Environments" } // Último sin href
        ];
    } else {
        breadcrumbs = [
            ...breadcrumbs,
            { label: "Environments (Select Project)" } // Último sin href
        ];
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
                <p className="text-center text-red-500">Please select a project from the header dropdown to manage environments.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Add Environment
                        </button>
                    </div>
                    {loading && <p>Loading environments...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
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