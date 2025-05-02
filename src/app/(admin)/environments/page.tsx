"use client";

import React, { useState, useEffect } from 'react';
import {
    Environment,
    getEnvironments,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    EnvironmentCreatePayload,
    EnvironmentUpdatePayload
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import EnvironmentsTable from '@/components/tables/EnvironmentsTable'; // Ajustado
import EnvironmentForm from '@/components/form/EnvironmentForm';     // Ajustado
import axios from 'axios';

const EnvironmentsPage: React.FC = () => {
    const [environmentsList, setEnvironmentsList] = useState<Environment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEnvironments();
            if (Array.isArray(data)) {
                setEnvironmentsList(data);
            } else {
                console.error("API response for /environments is not an array:", data);
                setError('Received invalid data format for environments.');
                setEnvironmentsList([]);
            }
        } catch (err) {
            console.error("Error fetching environments:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch environments.');
            setEnvironmentsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingEnvironment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (environment: Environment) => {
        setEditingEnvironment(environment);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this environment?')) {
            try {
                await deleteEnvironment(id);
                fetchData(); // Recargar datos después de borrar
            } catch (err) {
                setError('Failed to delete environment');
                console.error(err);
                if (axios.isAxiosError(err)) {
                    alert(`Error deleting: ${err.response?.data?.message || err.message}`);
                } else if (err instanceof Error) {
                    alert(`Error deleting: ${err.message}`);
                }
            }
        }
    };

    const handleSave = async (payload: EnvironmentCreatePayload | EnvironmentUpdatePayload) => {
        try {
            if (editingEnvironment) {
                await updateEnvironment(editingEnvironment.id, payload as EnvironmentUpdatePayload);
            } else {
                await createEnvironment(payload as EnvironmentCreatePayload);
            }
            setIsModalOpen(false);
            fetchData(); // Recargar datos después de guardar
        } catch (err) {
            setError('Failed to save environment');
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    return (
        <>
            <Breadcrumb pageTitle="Environments" />
            <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Add Environment
                </button>
            </div>
            {loading && <p>Loading environments...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <EnvironmentsTable
                        environments={environmentsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingEnvironment ? 'Edit Environment' : 'Add New Environment'}
                        </h3>
                        <EnvironmentForm
                            initialData={editingEnvironment}
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