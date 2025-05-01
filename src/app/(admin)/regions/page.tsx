"use client";

import React, { useState, useEffect } from 'react';
import { Region, getRegions, createRegion, updateRegion, deleteRegion } from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import RegionsTable from '@/components/tables/RegionsTable';
import RegionForm, { RegionCreatePayload, RegionUpdatePayload } from '@/components/form/RegionForm';
import axios from 'axios';

const RegionsPage: React.FC = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para el modal/formulario
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);

    const fetchRegions = async () => {
        setLoading(true);
        setError(null);
        console.log("Attempting to fetch regions..."); // Log inicio
        try {
            const data = await getRegions();
            console.log("API response for /regions received:", data); // Log datos recibidos

            if (Array.isArray(data)) {
                setRegions(data);
            } else {
                // Si no es un array, loguea un error y establece un array vacío
                console.error("API response for /regions is not an array:", data);
                setError('Received invalid data format for regions.');
                setRegions([]); // Asegura que regions sea siempre un array
            }
        } catch (err) {
            console.error("Error fetching regions:", err); // Log completo del error
            // Intentar loguear detalles específicos del error de axios si existen
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch regions. Check console and network tab for details.');
            setRegions([]); // Asegura que regions sea siempre un array en caso de error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    const handleAdd = () => {
        setEditingRegion(null); // Asegura que no estamos editando
        setIsModalOpen(true);
        console.log("Add new region");
        // Aquí iría la lógica para mostrar el formulario de creación
    };

    const handleEdit = (region: Region) => {
        setEditingRegion(region);
        setIsModalOpen(true);
        console.log("Edit region:", region);
        // Aquí iría la lógica para mostrar el formulario de edición con los datos de region
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this region?')) {
            try {
                await deleteRegion(id);
                // Refrescar la lista después de borrar
                fetchRegions();
            } catch (err) {
                setError('Failed to delete region');
                console.error(err);
                // Podrías mostrar una notificación de error
            }
        }
    };

    const handleSave = async (payload: RegionCreatePayload | RegionUpdatePayload) => {
        try {
            if (editingRegion) {
                // El payload ya viene como RegionUpdatePayload desde el form
                await updateRegion(editingRegion.languageCode, payload as RegionUpdatePayload);
            } else {
                // El payload ya viene como RegionCreatePayload desde el form
                await createRegion(payload as RegionCreatePayload);
            }
            setIsModalOpen(false);
            fetchRegions(); // Recargar datos
        } catch (err) {
            setError('Failed to save region');
            console.error(err);
            // Mostrar error en el formulario o notificación
        }
    };


    return (
        <>
            <Breadcrumb pageTitle="Regions" />

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
                    {regions.length === 0 && <p>No regions found.</p>}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">{editingRegion ? 'Edit Region' : 'Add New Region'}</h3>
                        <RegionForm
                            initialData={editingRegion}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default RegionsPage; 