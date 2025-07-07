"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    regionService,
    CreateRegionDto,
    UpdateRegionDto,
    projectService
} from '@/services/api';
import * as generated from '../../../../generated/japmux-api';
import { useProjects } from '@/context/ProjectContext';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import RegionsTable from '@/components/tables/RegionsTable';
import RegionForm from '@/components/form/RegionForm';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

const RegionsPage: React.FC = () => {
    const [regions, setRegions] = useState<generated.CreateRegionDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para el modal/formulario
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRegion, setEditingRegion] = useState<generated.CreateRegionDto | null>(null);
    const { selectedProjectId, selectedProjectFull, isLoadingSelectedProjectFull } = useProjects();

    // Efecto para cargar nombre del proyecto
    useEffect(() => {
        if (selectedProjectId) {
            setLoading(true);
            projectService.findOne(selectedProjectId)
                .then(data => {
                    console.log("API response for project received:", data);
                })
                .catch(err => {
                    console.error("Error fetching project for breadcrumbs:", err);
                    showErrorToast("Failed to load project details for breadcrumbs.");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [selectedProjectId]);

    // Usar useCallback para evitar re-crear la función en cada render
    const fetchRegions = useCallback(async () => {
        if (!selectedProjectId) {
            setLoading(false);
            setError("Please select a project first to manage regions.");
            setRegions([]);
            return;
        }
        setLoading(true);
        setError(null);
        console.log("Attempting to fetch regions for project:", selectedProjectId);
        try {
            const data = await regionService.findAll(selectedProjectId);
            console.log("API response for regions received:", data);
            if (Array.isArray(data)) {
                setRegions(data as generated.CreateRegionDto[]);
            } else {
                console.error("API response for /regions is not an array:", data);
                setError('Received invalid data format for regions.');
                setRegions([]);
            }
        } catch (err) {
            console.error("Error fetching regions:", err);
            if ((axios as any).isAxiosError && (axios as any).isAxiosError(err)) {
                console.error("Axios error details:", (err as any).response?.status, (err as any).response?.data);
            }
            setError('Failed to fetch regions. Check console and network tab for details.');
            setRegions([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchRegions();
        } else {
            setRegions([]);
            setLoading(false);
            setError("Please select a project to manage regions.");
        }
    }, [selectedProjectId, fetchRegions]);

    const handleAdd = () => {
        if (!selectedProjectId) {
            showErrorToast("Please select a project first.");
            return;
        }
        setEditingRegion(null);
        setIsModalOpen(true);
    };

    const handleEdit = (region: generated.CreateRegionDto) => {
        if (!selectedProjectId) return;
        setEditingRegion(region);
        setIsModalOpen(true);
    };

    const handleDelete = async (languageCode: string) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the region for ${languageCode}?`)) {
            setLoading(true);
            try {
                await regionService.remove(selectedProjectId, languageCode);
                showSuccessToast('Region deleted successfully!');
                fetchRegions();
            } catch (err) {
                console.error("Error deleting region:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreateRegionDto | UpdateRegionDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        setLoading(true);
        try {
            let message = "";
            if (editingRegion && editingRegion.languageCode) {
                await regionService.update(selectedProjectId, editingRegion.languageCode, payload as UpdateRegionDto);
                message = 'Region updated successfully!';
            } else {
                await regionService.create(selectedProjectId, payload as CreateRegionDto);
                message = 'Region created successfully!';
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchRegions();
        } catch (err) {
            console.error("Error saving region:", err);
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
            { label: isLoadingSelectedProjectFull ? selectedProjectId : (selectedProjectFull?.name || selectedProjectId) },
            { label: "Regions" }
        ];
    } else {
        breadcrumbs = [
            ...breadcrumbs,
            { label: "Regions (Select Project)" }
        ];
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Regions</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-brand-500 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={!selectedProjectId || isModalOpen}
                    >
                        Add New Region
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
                            {editingRegion ? 'Edit Region' : 'Add New Region'}
                        </h3>
                        <RegionForm
                            initialData={editingRegion}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            projectId={selectedProjectId}
                        />
                    </div>
                )}

                <RegionsTable
                    regions={regions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </>
    );
};

export default RegionsPage; 