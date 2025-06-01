"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import EnvironmentForm from '@/components/form/EnvironmentForm';
import EnvironmentsDisplay from '@/components/environments/EnvironmentsDisplay';
import { environmentService, CreateEnvironmentDto, UpdateEnvironmentDto } from '@/services/api';
// Usaremos CreateEnvironmentDto como base, asumiendo que el backend le añade 'id'
// No hay un 'EnvironmentDto' exportado directamente con 'id' en la definición base de CreateEnvironmentDto.
import { useProjects } from '@/context/ProjectContext';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { EnvironmentData } from '@/components/environments/EnvironmentCardItem';

// Interfaz local para el objeto que esperamos del backend, incluyendo el id
interface ApiEnvironment extends CreateEnvironmentDto {
    id: string;
}

const EnvironmentsPage: React.FC = () => {
    const { selectedProjectId } = useProjects();
    const [environments, setEnvironments] = useState<EnvironmentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingEnvironment, setEditingEnvironment] = useState<EnvironmentData | null>(null);

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Environments" }
    ];

    const mapApiEnvironmentToUi = (apiEnv: ApiEnvironment): EnvironmentData => ({
        id: apiEnv.id,
        name: apiEnv.name,
        description: apiEnv.description,
    });

    const fetchEnvironments = useCallback(async () => {
        if (!selectedProjectId) {
            setEnvironments([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Asumimos que environmentService.findAll devuelve CreateEnvironmentDto[] PERO con 'id' incluido por el backend.
            const data = await environmentService.findAll(selectedProjectId) as ApiEnvironment[];
            setEnvironments(data.map(mapApiEnvironmentToUi));
        } catch (err: any) {
            console.error("Failed to fetch environments:", err);
            setError(err.message || 'Failed to fetch environments.');
            setEnvironments([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        fetchEnvironments();
    }, [fetchEnvironments]);

    const handleAddEnvironment = () => {
        setEditingEnvironment(null);
        setShowForm(true);
    };

    const handleEditEnvironment = (environment: EnvironmentData) => {
        setEditingEnvironment(environment);
        setShowForm(true);
    };

    const handleDeleteEnvironment = async (id: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this environment?')) {
            try {
                await environmentService.remove(selectedProjectId, id);
                showSuccessToast('Environment deleted successfully');
                fetchEnvironments();
                if (editingEnvironment && editingEnvironment.id === id) {
                    setShowForm(false);
                    setEditingEnvironment(null);
                }
            } catch (error: any) {
                console.error("Error deleting environment:", error);
                showErrorToast(error.message || 'Failed to delete environment.');
            }
        }
    };

    const handleSaveEnvironment = async (data: CreateEnvironmentDto | UpdateEnvironmentDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        try {
            if (editingEnvironment) {
                await environmentService.update(selectedProjectId, editingEnvironment.id, data as UpdateEnvironmentDto);
                showSuccessToast('Environment updated successfully');
            } else {
                await environmentService.create(selectedProjectId, data as CreateEnvironmentDto);
                showSuccessToast('Environment created successfully');
            }
            setShowForm(false);
            setEditingEnvironment(null);
            fetchEnvironments();
        } catch (error: any) {
            console.error("Error saving environment:", error);
            showErrorToast(error.message || 'Error saving environment.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingEnvironment(null);
    };

    if (!selectedProjectId) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Environments</h1>
                    <p className="text-center text-gray-600 dark:text-gray-300">Please select a project to manage environments.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <p className="text-base font-medium dark:text-white">
                    Configure deployment environments for your project.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleAddEnvironment}
                        className="px-4 py-2 text-white bg-brand-500 rounded hover:bg-brand-600 disabled:opacity-50"
                        disabled={showForm || loading}
                    >
                        {showForm && editingEnvironment ? 'Editing Environment...' : showForm ? 'Adding Environment...' : 'Add New Environment'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingEnvironment ? 'Edit Environment' : 'Add New Environment'}
                        </h3>
                        <EnvironmentForm
                            initialData={editingEnvironment ? { name: editingEnvironment.name, description: editingEnvironment.description || '' } : null}
                            onSave={handleSaveEnvironment}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}

                {loading && <p className="text-center py-4">Loading environments...</p>}
                {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

                {!loading && !error && (
                    <EnvironmentsDisplay
                        environmentsList={environments}
                        onEditEnvironment={handleEditEnvironment}
                        onDeleteEnvironment={handleDeleteEnvironment}
                    />
                )}
            </div>
        </>
    );
};

export default EnvironmentsPage; 