"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    culturalDataService,
    CreateCulturalDataDto,
    UpdateCulturalDataDto,
} from '@/services/api';
import * as generated from '../../../../generated/japmux-api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import CulturalDataTable from '@/components/tables/CulturalDataTable';
import CulturalDataForm from '@/components/form/CulturalDataForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const CulturalDataPage: React.FC = () => {
    const [culturalDataList, setCulturalDataList] = useState<generated.CulturalDataResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para el modal/formulario
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingCulturalData, setEditingCulturalData] = useState<generated.CulturalDataResponse | null>(null);
    const { selectedProjectId, selectedProjectFull, isLoadingSelectedProjectFull } = useProjects();

    const fetchData = useCallback(async () => {
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
                setCulturalDataList(data as generated.CulturalDataResponse[]);
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
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        } else {
            setCulturalDataList([]);
            setLoading(false);
            setError("Please select a project to manage cultural data.");
        }
    }, [selectedProjectId, fetchData]);

    const handleAdd = () => {
        setEditingCulturalData(null);
        setIsModalOpen(true);
        console.log("Add new cultural data");
    };

    const handleEdit = (data: generated.CulturalDataResponse) => {
        setEditingCulturalData(data);
        setIsModalOpen(true);
        console.log("Edit cultural data:", data);
    };

    const handleDelete = async (itemKey: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete cultural data with key: ${itemKey}?`)) {
            setLoading(true);
            try {
                await culturalDataService.remove(selectedProjectId, itemKey);
                fetchData();
                showSuccessToast("Cultural data deleted successfully.");
            } catch (err) {
                console.error("Error deleting cultural data:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreateCulturalDataDto | UpdateCulturalDataDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingCulturalData && editingCulturalData.key) {
                await culturalDataService.update(selectedProjectId, editingCulturalData.key, payload as UpdateCulturalDataDto);
                message = "Cultural data updated successfully.";
            } else {
                await culturalDataService.create(selectedProjectId, payload as CreateCulturalDataDto);
                message = "Cultural data created successfully.";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err) {
            console.error("Error saving cultural data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Definir crumbs
    const breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs.push({
            label: isLoadingSelectedProjectFull ? selectedProjectId : (selectedProjectFull?.name || selectedProjectId),
        });
        breadcrumbs.push({ label: "Cultural Data" });
    } else {
        breadcrumbs.push({ label: "Cultural Data (Select Project)" });
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Cultural Data
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all Cultural Data in the system.
                </p>
            </div>

            {!selectedProjectId ? (
                <p className="text-center text-yellow-500 dark:text-yellow-400">Please select a project from the header dropdown to manage cultural data.</p>
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

                    {(loading || isLoadingSelectedProjectFull) && <p>Loading cultural data...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && !isLoadingSelectedProjectFull && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <CulturalDataTable
                                culturalDataList={culturalDataList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
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