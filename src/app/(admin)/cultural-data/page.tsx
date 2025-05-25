"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    culturalDataService,
    CreateCulturalDataDto,
    UpdateCulturalDataDto,
    regionService,
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
    const [regionsList, setRegionsList] = useState<generated.CreateRegionDto[]>([]);
    // Loading state removed - not used in UI
    const [error, setError] = useState<string | null>(null);

    // Estados para el modal/formulario
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingCulturalData, setEditingCulturalData] = useState<generated.CulturalDataResponse | null>(null);
    const { selectedProjectId, selectedProjectFull, isLoadingSelectedProjectFull } = useProjects();

    const fetchData = useCallback(async () => {
        if (!selectedProjectId) {
            setCulturalDataList([]);
            setRegionsList([]);
            setError("Please select a project to view cultural data.");
            return;
        }

        setError(null);
        console.log("Attempting to fetch cultural data for project:", selectedProjectId);
        try {
            const culturalData = await culturalDataService.findAll(selectedProjectId);
            console.log(`API response for /projects/${selectedProjectId}/cultural-data received:`, culturalData);

            if (Array.isArray(culturalData)) {
                setCulturalDataList(culturalData as generated.CulturalDataResponse[]);
            } else {
                console.error("API response for /cultural-data is not an array:", culturalData);
                setError('Received invalid data format for cultural data.');
                setCulturalDataList([]);
            }

            const regions = await regionService.findAll(selectedProjectId);
            if (Array.isArray(regions)) {
                setRegionsList(regions as generated.CreateRegionDto[]);
            } else {
                console.error("API response for /regions is not an array:", regions);
                setRegionsList([]);
            }

        } catch (err) {
            console.error("Error fetching cultural data:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError(`Failed to fetch cultural data: ${err instanceof Error ? err.message : String(err)}`);
            setCulturalDataList([]);
            setRegionsList([]);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        } else {
            setCulturalDataList([]);
            setRegionsList([]);
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
            try {
                await culturalDataService.remove(selectedProjectId, itemKey);
                fetchData();
                showSuccessToast("Cultural data deleted successfully.");
            } catch (err) {
                console.error("Error deleting cultural data:", err);
            }
        }
    };

    const handleSave = async (payload: CreateCulturalDataDto | UpdateCulturalDataDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
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
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cultural Data</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-brand-500 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={!selectedProjectId || isModalOpen}
                    >
                        Add New Cultural Data
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isModalOpen && selectedProjectId && (
                    <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingCulturalData ? 'Edit Cultural Data' : 'Add New Cultural Data'}
                        </h3>
                        <CulturalDataForm
                            initialData={editingCulturalData}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                )}

                <CulturalDataTable
                    culturalDataList={culturalDataList}
                    regions={regionsList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </>
    );
};

export default CulturalDataPage; 