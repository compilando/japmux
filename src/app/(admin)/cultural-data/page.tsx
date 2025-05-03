"use client";

import React, { useState, useEffect } from 'react';
import {
    CulturalData,
    culturalDataService,
    CreateCulturalDataDto,
    UpdateCulturalDataDto,
    Project,
    projectService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import CulturalDataTable from '@/components/tables/CulturalDataTable';
import CulturalDataForm from '@/components/form/CulturalDataForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const CulturalDataPage: React.FC = () => {
    const [culturalDataList, setCulturalDataList] = useState<CulturalData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para el modal/formulario
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingCulturalData, setEditingCulturalData] = useState<CulturalData | null>(null);
    const { selectedProjectId } = useProjects();

    // Estados para breadcrumb
    const [project, setProject] = useState<Project | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const fetchData = async () => {
        if (!selectedProjectId) {
            setCulturalDataList([]);
            setError("Please select a project to view cultural data.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        console.log("Attempting to fetch cultural data for project:", selectedProjectId);
        try {
            const data = await culturalDataService.findAll(selectedProjectId);
            console.log(`API response for /projects/${selectedProjectId}/cultural-data received:`, data);

            if (Array.isArray(data)) {
                setCulturalDataList(data);
            } else {
                console.error("API response for /cultural-data is not an array:", data);
                setError('Received invalid data format for cultural data.');
                setCulturalDataList([]);
            }
        } catch (err) {
            console.error("Error fetching cultural data:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError(`Failed to fetch cultural data: ${err instanceof Error ? err.message : String(err)}`);
            setCulturalDataList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedProjectId]);

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

    const handleAdd = () => {
        setEditingCulturalData(null);
        setIsModalOpen(true);
        console.log("Add new cultural data");
    };

    const handleEdit = (data: CulturalData) => {
        setEditingCulturalData(data);
        setIsModalOpen(true);
        console.log("Edit cultural data:", data);
    };

    const handleDelete = async (id: string) => {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this cultural data?')) {
            try {
                await culturalDataService.remove(selectedProjectId, id);
                fetchData();
            } catch (err) {
                setError('Failed to delete cultural data');
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: CreateCulturalDataDto | UpdateCulturalDataDto) => {
        if (!selectedProjectId) {
            alert("No project selected.");
            return;
        }
        try {
            if (editingCulturalData) {
                await culturalDataService.update(selectedProjectId, editingCulturalData.id, payload as UpdateCulturalDataDto);
            } else {
                await culturalDataService.create(selectedProjectId, payload as CreateCulturalDataDto);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError(`Failed to save cultural data: ${err instanceof Error ? err.message : String(err)}`);
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    // Definir crumbs
    let breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs = [
            ...breadcrumbs,
            { label: breadcrumbLoading ? selectedProjectId : (project?.name || selectedProjectId), href: `/projects/${selectedProjectId}/cultural-data` },
            { label: "Cultural Data" }
        ];
    } else {
        breadcrumbs = [
            ...breadcrumbs,
            { label: "Cultural Data (Select Project)" }
        ];
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {!selectedProjectId ? (
                <p className="text-center text-red-500">Please select a project from the header dropdown to manage cultural data.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Add Cultural Data
                        </button>
                    </div>

                    {loading && <p>Loading cultural data...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <CulturalDataTable
                                culturalDataList={culturalDataList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            {/* {culturalDataList.length === 0 && <p>No cultural data found.</p>} // Mensaje ya dentro de la tabla */}
                        </div>
                    )}
                </>
            )}

            {/* Modal con Formulario - Mostrar solo si hay proyecto */}
            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingCulturalData ? 'Edit Cultural Data' : 'Add New Cultural Data'}
                        </h3>
                        <CulturalDataForm
                            initialData={editingCulturalData}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CulturalDataPage; 