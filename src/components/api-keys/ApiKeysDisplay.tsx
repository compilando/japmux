'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProjects } from '@/context/ProjectContext';
import * as generated from '@/services/generated/api';
import { apiKeyService } from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import ApiKeyForm from '../form/ApiKeyForm';
import { Modal } from '../ui/modal';
import { PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import CopyButton from '@/components/common/CopyButton';

type ApiKeyDto = any;
type CreateApiKeyDto = generated.CreateApiKeyDto;

const ApiKeysDisplay: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKeyDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingKey, setViewingKey] = useState<ApiKeyDto | null>(null);
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const { selectedProjectId } = useProjects();

    const fetchApiKeys = useCallback(async () => {
        if (!selectedProjectId) {
            setApiKeys([]);
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const keys = await apiKeyService.findAll();
            setApiKeys(keys);
            setError(null);
        } catch (err) {
            setError('Failed to fetch API keys.');
            showErrorToast('Failed to fetch API keys.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchApiKeys();
        }
    }, [selectedProjectId, fetchApiKeys]);

    const handleNew = () => {
        setIsFormModalOpen(true);
    };

    const handleView = async (keyId: string) => {
        try {
            const keyDetails = await apiKeyService.findOne(keyId);
            setViewingKey(keyDetails);
            setIsViewModalOpen(true);
        } catch (err) {
            showErrorToast('Failed to fetch API key details.');
            console.error(err);
        }
    };

    const handleDelete = async (keyId: string) => {
        if (window.confirm('Are you sure you want to delete this API key?')) {
            try {
                await apiKeyService.remove(keyId);
                showSuccessToast('API Key deleted successfully.');
                fetchApiKeys();
            } catch (err) {
                showErrorToast('Failed to delete API key.');
            }
        }
    };

    const handleFormSubmit = async (data: CreateApiKeyDto) => {
        try {
            const newKey = await apiKeyService.create(data);
            showSuccessToast('API Key created successfully!');
            fetchApiKeys();
            setIsFormModalOpen(false);

            // La siguiente lógica depende de que el endpoint de creación (`POST /api/api-keys`)
            // devuelva el objeto completo de la clave, incluyendo la propiedad `apiKey`.
            if (newKey && newKey.apiKey) {
                setNewlyCreatedKey(newKey.apiKey);
                setIsKeyModalOpen(true);
            }
        } catch (err) {
            showErrorToast('Failed to save API key.');
            console.error(err);
        }
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
    }

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingKey(null);
    }

    const handleCloseKeyModal = () => {
        setIsKeyModalOpen(false);
        setNewlyCreatedKey(null);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">API Keys</h1>
                <button
                    onClick={handleNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!selectedProjectId}
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New API Key
                </button>
            </div>

            {!selectedProjectId ? (
                <div className="text-center py-10">
                    <p>Please select a project to manage API keys.</p>
                </div>
            ) : isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {apiKeys.map(key => (
                            <li key={key.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{key.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{key.displayKey}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleView(key.id)}
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        title="View Details"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(key.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        title="Delete Key"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isFormModalOpen && (
                <Modal
                    isOpen={isFormModalOpen}
                    onClose={handleCloseFormModal}
                >
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                            Create API Key
                        </h3>
                        <ApiKeyForm
                            onSubmit={handleFormSubmit}
                            onCancel={handleCloseFormModal}
                        />
                    </div>
                </Modal>
            )}

            {isKeyModalOpen && newlyCreatedKey && (
                <Modal
                    isOpen={isKeyModalOpen}
                    onClose={handleCloseKeyModal}
                    widthClass="w-full max-w-md"
                >
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Key Created Successfully</h3>
                        <div className="mt-4 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Please copy this key and store it in a safe place. This is the only time you will be able to see it.
                            </p>
                        </div>
                        <div className="mt-4 relative p-3 flex items-center justify-between rounded-md bg-gray-100 dark:bg-gray-800">
                            <code className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-200 break-words mr-4">
                                {newlyCreatedKey}
                            </code>
                            <CopyButton textToCopy={newlyCreatedKey} />
                        </div>
                        <div className="mt-6 text-right">
                            <button
                                type="button"
                                onClick={handleCloseKeyModal}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {viewingKey && (
                <Modal isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                            API Key Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Name</h4>
                                <p className="text-gray-600 dark:text-gray-300">{viewingKey.name}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">ID</h4>
                                <p className="text-gray-600 dark:text-gray-300">{viewingKey.id}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Display Key</h4>
                                <p className="text-gray-600 dark:text-gray-300">{viewingKey.displayKey}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Status</h4>
                                <p className={`text-sm font-semibold ${!viewingKey.revoked ? 'text-green-600' : 'text-red-600'}`}>
                                    {viewingKey.revoked ? 'Revoked' : 'Active'}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Created At</h4>
                                <p className="text-gray-600 dark:text-gray-300">{new Date(viewingKey.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Expires At</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {viewingKey.expiresAt ? new Date(viewingKey.expiresAt).toLocaleString() : 'Never'}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Last Used At</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {viewingKey.lastUsedAt ? new Date(viewingKey.lastUsedAt).toLocaleString() : 'Never'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 mt-5 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={handleCloseViewModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default ApiKeysDisplay; 