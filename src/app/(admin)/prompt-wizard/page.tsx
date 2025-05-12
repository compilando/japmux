"use client";

import React, { useState } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { promptService } from '@/services/api';
import { showErrorToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext'; // Importar contexto de proyectos

const PromptWizardPage: React.FC = () => {
    const { selectedProjectId } = useProjects(); // Obtener projectId del contexto
    const [promptContent, setPromptContent] = useState<string>('');
    const [generatedJson, setGeneratedJson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Prompt Wizard" }
    ];

    const handleGenerateStructure = async () => {
        if (!selectedProjectId) {
            showErrorToast('Por favor, selecciona un proyecto primero.');
            return;
        }
        if (!promptContent.trim()) {
            showErrorToast('Por favor, escribe el prompt en el área de texto.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedJson(null);
        try {
            const result = await promptService.generatePromptStructure(selectedProjectId, promptContent);
            setGeneratedJson(result);
        } catch (err) {
            console.error("Error generando estructura:", err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Error al generar la estructura del prompt.';
            setError(apiErrorMessage);
            showErrorToast(apiErrorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Prompt Wizard</h1>

                <div className="mb-6">
                    <label htmlFor="prompt-editor" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Escribe tu prompt (opcional por ahora):
                    </label>
                    <textarea
                        id="prompt-editor"
                        rows={10}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value)}
                        placeholder="Este campo no se usa para generar la estructura actualmente..."
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center justify-end mb-6">
                    <button
                        onClick={handleGenerateStructure}
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading || !selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                        disabled={isLoading || !selectedProjectId}
                        title={!selectedProjectId ? "Selecciona un proyecto para continuar" : ""}
                    >
                        {isLoading ? 'Generando...' : 'Generar Estructura'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {generatedJson && (
                    <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Estructura Generada:</h2>
                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                            {JSON.stringify(generatedJson, null, 2)}
                        </pre>
                    </div>
                )}

            </div>
        </>
    );
};

export default PromptWizardPage; 