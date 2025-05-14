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
    const { selectedProjectId } = useProjects();

    // Estados para breadcrumb
    const [project, setProject] = useState<generated.CreateProjectDto | null>(null);
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
                setRegions(data);
            } else {
                console.error("API response for /regions is not an array:", data);
                setError('Received invalid data format for regions.');
                setRegions([]);
            }
        } catch (err) {
            console.error("Error fetching regions:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch regions. Check console and network tab for details.');
            setRegions([]);
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        fetchRegions();
    }, [fetchRegions]); // fetchRegions es ahora estable gracias a useCallback

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
            try {
                await regionService.remove(selectedProjectId, languageCode);
                fetchRegions();
            } catch (err) {
                setError('Failed to delete region');
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: CreateRegionDto | UpdateRegionDto) => {
        if (!selectedProjectId) {
            showErrorToast("No project selected.");
            return;
        }
        try {
            if (editingRegion) {
                await regionService.update(selectedProjectId, editingRegion.languageCode, payload as UpdateRegionDto);
            } else {
                await regionService.create(selectedProjectId, payload as CreateRegionDto);
            }
            setIsModalOpen(false);
            fetchRegions();
        } catch (err) {
            setError('Failed to save region');
            console.error(err);
        }
    };

    // Definir crumbs
    let breadcrumbs: { label: string; href?: string }[] = [
        { label: "Home", href: "/" },
    ];
    if (selectedProjectId) {
        breadcrumbs = [
            ...breadcrumbs,
            { label: breadcrumbLoading ? selectedProjectId : (project?.name || selectedProjectId), href: `/projects/${selectedProjectId}/regions` },
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

            {/* Page Title and Subtitle */}
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Regions
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Create, view, and manage all Regions in the system.
                </p>
            </div>

            {!selectedProjectId ? (
                <p className="text-center text-red-500">Please select a project from the header dropdown to manage regions.</p>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Add Region
                        </button>
                    </div>
                    {loading && <p>Loading regions...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <RegionsTable
                                regions={regions}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            {regions.length === 0 && <p>No regions found for this project.</p>}
                        </div>
                    )}
                </>
            )}
            {isModalOpen && selectedProjectId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
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
                </div>
            )}
        </>
    );
};

export default RegionsPage; 