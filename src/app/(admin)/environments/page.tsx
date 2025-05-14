"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    environmentService,
    CreateEnvironmentDto,
    UpdateEnvironmentDto,
} from '@/services/api';
// Ya no necesitamos EnvironmentResponseDto, usaremos CreateEnvironmentDto de @/services/api
// import { EnvironmentResponseDto } from '@/services/generated/api'; 
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import EnvironmentsTable from '@/components/tables/EnvironmentsTable';
import EnvironmentForm from '@/components/form/EnvironmentForm';
// import axios from 'axios'; // Eliminado
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

// Interfaz local para el Environment que incluye el ID y otros campos esperados del backend
interface EnvironmentWithId extends CreateEnvironmentDto {
    id: string;
    projectId: string; // Asumiendo que el backend también devuelve projectId
    // createdAt?: string; // Descomentar si es necesario
    // updatedAt?: string; // Descomentar si es necesario
}

const EnvironmentsPage: React.FC = () => {
    const [environmentsList, setEnvironmentsList] = useState<EnvironmentWithId[]>([]); // Usar EnvironmentWithId
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingEnvironment, setEditingEnvironment] = useState<EnvironmentWithId | null>(null); // Usar EnvironmentWithId
    const { selectedProjectId, selectedProjectFull, isLoadingSelectedProjectFull } = useProjects();

    const fetchData = useCallback(async () => {
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
                setEnvironmentsList(data as EnvironmentWithId[]);
            } else {
                console.error("API response for /environments is not an array:", data);
                setError('Received invalid data format for environments.');
                setEnvironmentsList([]);
            }
        } catch (err) {
            console.error("Error fetching environments:", err);
            setError('Failed to fetch environments.');
            setEnvironmentsList([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        } else {
            setEnvironmentsList([]);
            setLoading(false);
            setError("Please select a project to manage environments.");
        }
    }, [selectedProjectId, fetchData]);

    const handleAdd = () => {
        setEditingEnvironment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (environment: EnvironmentWithId) => { // Usar EnvironmentWithId
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
                fetchData(); // Volver a cargar datos
            } catch (err) {
                console.error("Error deleting environment:", err);
                // El interceptor de Axios debería manejar el showErrorToast para errores de API
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
            if (editingEnvironment && editingEnvironment.id) { // Ahora .id es válido
                await environmentService.update(selectedProjectId, editingEnvironment.id, payload as UpdateEnvironmentDto);
                message = 'Environment updated successfully!';
            } else {
                await environmentService.create(selectedProjectId, payload as CreateEnvironmentDto);
                message = 'Environment created successfully!';
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData(); // Volver a cargar datos
        } catch (err) {
            console.error("Error saving environment:", err);
            // El interceptor de Axios debería manejar el showErrorToast para errores de API
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
                            initialData={editingEnvironment} // Pasa EnvironmentWithId | null
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