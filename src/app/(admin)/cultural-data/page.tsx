"use client";

import React, { useState, useEffect } from 'react';
import {
    CulturalData,
    getCulturalData,
    createCulturalData,
    updateCulturalData,
    deleteCulturalData,
    CulturalDataCreatePayload,
    CulturalDataUpdatePayload
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import CulturalDataTable from '@/components/tables/CulturalDataTable';
import CulturalDataForm from '@/components/form/CulturalDataForm';
import axios from 'axios';

const CulturalDataPage: React.FC = () => {
    const [culturalDataList, setCulturalDataList] = useState<CulturalData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para el modal/formulario
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingCulturalData, setEditingCulturalData] = useState<CulturalData | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        console.log("Attempting to fetch cultural data...");
        try {
            const data = await getCulturalData();
            console.log("API response for /cultural-data received:", data);

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
            setError('Failed to fetch cultural data. Check console and network tab for details.');
            setCulturalDataList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
        if (window.confirm('Are you sure you want to delete this cultural data?')) {
            try {
                await deleteCulturalData(id);
                fetchData(); // Refrescar la lista
            } catch (err) {
                setError('Failed to delete cultural data');
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: CulturalDataCreatePayload | CulturalDataUpdatePayload) => {
        try {
            if (editingCulturalData) {
                const updatePayload: CulturalDataUpdatePayload = payload as CulturalDataUpdatePayload;
                await updateCulturalData(editingCulturalData.id, updatePayload);
            } else {
                const createPayload: CulturalDataCreatePayload = payload as CulturalDataCreatePayload;
                await createCulturalData(createPayload);
            }
            setIsModalOpen(false);
            fetchData(); // Recargar datos
        } catch (err) {
            setError('Failed to save cultural data');
            console.error(err);
            // Mostrar error en el formulario o notificación
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };


    return (
        <>
            <Breadcrumb pageTitle="Cultural Data" />

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

            {/* Modal con Formulario */}
            {isModalOpen && (
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