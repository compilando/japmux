"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Project, // Importar
    Tactic, // Importar tipo Tactic
    tacticService, // Importar tacticService
    CreateTacticDto, // Importar DTOs
    UpdateTacticDto,
    projectService // Importar projectService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
// Importar componentes reales
import TacticsTable from '@/components/tables/TacticsTable';
import TacticForm from '@/components/form/TacticForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const TacticsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<Tactic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Tactic | null>(null);
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

    // Callback para cargar Tactics
    const fetchData = useCallback(async () => {
        if (!selectedProjectId) {
            setLoading(false);
            setError("Please select a project first.");
            setItemsList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await tacticService.findAll(selectedProjectId);
            if (Array.isArray(data)) {
                setItemsList(data);
            } else {
                console.error("API response for /tactics is not an array:", data);
                setError('Received invalid data format for tactics.');
                setItemsList([]);
            }
        } catch (err) {
            setError('Failed to fetch tactics.');
            showErrorToast('Failed to fetch tactics.');
            setItemsList([]);
            console.error("Error fetching tactics:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Depender de fetchData que depende de selectedProjectId

    // Handlers CRUD
    const handleAdd = () => {
        if (!selectedProjectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Tactic) => {
        if (!selectedProjectId) return;
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this tactic?')) {
            setLoading(true);
            try {
                await tacticService.remove(selectedProjectId, id);
                showSuccessToast("Tactic deleted successfully!");
                fetchData();
            } catch (err) {
                setError('Failed to delete tactic');
                showErrorToast('Failed to delete tactic.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreateTacticDto | UpdateTacticDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingItem) {
                await tacticService.update(selectedProjectId, editingItem.id, payload as UpdateTacticDto);
                message = "Tactic updated successfully!";
            } else {
                await tacticService.create(selectedProjectId, payload as CreateTacticDto);
                message = "Tactic created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            setError('Failed to save tactic');
            showErrorToast('Failed to save tactic.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Definir crumbs
    let breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs = [
            ...breadcrumbs,
            // Enlace del proyecto apunta a la página principal del proyecto
            { label: breadcrumbLoading ? selectedProjectId : (project?.name || selectedProjectId), href: `/projects/${selectedProjectId}/prompts` },
            { label: "Tactics", href: "/tactics" } // Enlace a sí misma
        ];
        // Quitar href del último elemento
        if (breadcrumbs.length > 0) {
            delete breadcrumbs[breadcrumbs.length - 1].href;
        }
    } else {
        breadcrumbs = [
            ...breadcrumbs,
            { label: "Tactics (Select Project)" }
        ];
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            {!selectedProjectId ? (
                <p className="text-center text-red-500">Please select a project from the header dropdown to manage tactics.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={loading || breadcrumbLoading}>
                            Add Tactic
                        </button>
                    </div>
                    {loading && <p>Loading tactics...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            {/* Usar tabla real */}
                            <TacticsTable
                                tactics={itemsList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            {itemsList.length === 0 && !loading && (
                                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No tactics found for this project.</p>
                            )}
                        </div>
                    )}
                </>
            )}
            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Tactic' : 'Add New Tactic'}
                        </h3>
                        {/* Usar formulario real */}
                        <TacticForm
                            initialData={editingItem}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                        {loading && <p className="text-sm text-center mt-2">Saving...</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default TacticsPage; 