"use client";

import React, { useState } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { promptService } from '@/services/api';
import { loadPromptStructure } from '@/services/promptApi';
import { LoadPromptStructureDto } from '@/types/prompt-structure';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext'; // Importar contexto de proyectos

// Definir interfaces para los datos generados
interface PromptInfo {
    name: string;
    description: string;
}

interface Translation {
    languageCode: string;
    promptText?: string;
    value?: string;
}

interface VersionInfo {
    promptText: string;
    changeMessage?: string;
    assets?: string[];
    translations?: Translation[];
}

interface AssetInfo {
    key: string;
    value: string;
    changeMessage?: string;
    translations?: Translation[];
}

interface StructureData {
    prompt?: PromptInfo;
    version?: VersionInfo;
    assets?: AssetInfo[];
}

const PromptWizardPage: React.FC = () => {
    const { selectedProjectId } = useProjects(); // Obtener projectId del contexto
    const [promptContent, setPromptContent] = useState<string>('');
    const [generatedJson, setGeneratedJson] = useState<StructureData | null>(null);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
    const [errorGenerate, setErrorGenerate] = useState<string | null>(null);

    // jsonToLoadInput será el estado para el textarea unificado
    const [jsonToLoadInput, setJsonToLoadInput] = useState<string>('');
    const [isLoadingLoad, setIsLoadingLoad] = useState<boolean>(false);
    const [loadStatusMessage, setLoadStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

        setIsLoadingGenerate(true);
        setErrorGenerate(null);
        setGeneratedJson(null);
        try {
            const result = await promptService.generatePromptStructure(selectedProjectId, promptContent);
            setGeneratedJson(result as StructureData);
            setJsonToLoadInput(JSON.stringify(result, null, 2));
            showSuccessToast('Estructura generada exitosamente a partir del prompt.');
        } catch (err: unknown) {
            console.error("Error generando estructura:", err);
            let apiErrorMessage = 'Error al generar la estructura del prompt.';
            if (err && typeof err === 'object' && 'response' in err &&
                err.response && typeof err.response === 'object' &&
                'data' in err.response && err.response.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data) {
                apiErrorMessage = String(err.response.data.message);
            }
            setErrorGenerate(apiErrorMessage);
            showErrorToast(apiErrorMessage);
        } finally {
            setIsLoadingGenerate(false);
        }
    };

    // Función eliminada: handleFinalGeneration

    // Componente para visualización bonita del JSON
    const GeneratedStructureDisplay = ({ data }: { data: StructureData }) => {
        if (!data) return null;

        const renderBlock = (title: string, content: React.ReactNode, bgColorClass: string) => (
            <div className={`mb-4 p-4 border border-gray-300 dark:border-gray-500 rounded-lg shadow ${bgColorClass}`}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
                {content}
            </div>
        );

        const renderKeyValue = (key: string, value: unknown) => (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">{key}: </span>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </p>
        );

        const renderList = <T,>(items: T[], renderItem: (item: T, index: number) => React.ReactNode) => (
            <ul className="list-disc list-inside pl-4 space-y-1">
                {items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                        {renderItem(item, index)}
                    </li>
                ))}
            </ul>
        );

        return (
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Visualización de la Estructura:</h2>

                {data.prompt && renderBlock("Detalles del Prompt", <>
                    {renderKeyValue("Nombre", data.prompt.name)}
                    {renderKeyValue("Descripción", data.prompt.description)}
                </>, "bg-sky-50 dark:bg-sky-800/30")}

                {data.version && renderBlock("Detalles de la Versión", <>
                    {renderKeyValue("Texto del Prompt", data.version.promptText)}
                    {renderKeyValue("Mensaje de Cambio", data.version.changeMessage)}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2 mb-1">Assets Referenciados:</p>
                    {data.version.assets && data.version.assets.length > 0 ? renderList(data.version.assets, (assetName: string) => <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">{assetName}</span>) : <p className="text-xs text-gray-500 dark:text-gray-400">Ninguno</p>}

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2 mb-1">Traducciones de la Versión:</p>
                    {data.version.translations && data.version.translations.length > 0 ? renderList(data.version.translations, (trans: Translation) => (
                        <><strong>{trans.languageCode}:</strong> {trans.promptText}</>
                    )) : <p className="text-xs text-gray-500 dark:text-gray-400">Ninguna</p>}
                </>, "bg-teal-50 dark:bg-teal-800/30")}

                {data.assets && data.assets.length > 0 && renderBlock("Assets Definidos",
                    <div className="space-y-3">
                        {data.assets.map((asset: AssetInfo, index: number) => (
                            <div key={index} className="p-3 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800">
                                {renderKeyValue("Key", asset.key)}
                                {renderKeyValue("Valor por Defecto", asset.value)}
                                {renderKeyValue("Mensaje de Cambio", asset.changeMessage)}
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1 mb-0.5">Traducciones del Asset:</p>
                                {asset.translations && asset.translations.length > 0 ? renderList(asset.translations, (trans: Translation) => (
                                    <><strong>{trans.languageCode}:</strong> {trans.value}</>
                                )) : <p className="text-xs text-gray-500 dark:text-gray-400">Ninguna</p>}
                            </div>
                        ))}
                    </div>
                    , "bg-indigo-50 dark:bg-indigo-800/30")}
            </div>
        );
    };

    // Nueva función para manejar la carga de la estructura JSON
    const handleLoadStructure = async () => {
        if (!selectedProjectId) {
            showErrorToast('Por favor, selecciona un proyecto primero para cargar la estructura.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Proyecto no seleccionado.' });
            return;
        }
        if (!jsonToLoadInput.trim()) {
            showErrorToast('El JSON a cargar no puede estar vacío.');
            setLoadStatusMessage({ type: 'error', message: 'Error: El campo JSON está vacío.' });
            return;
        }

        let parsedJson: LoadPromptStructureDto;
        try {
            parsedJson = JSON.parse(jsonToLoadInput);
        } catch {
            showErrorToast('El texto ingresado no es un JSON válido.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Formato JSON inválido.' });
            return;
        }

        setIsLoadingLoad(true);
        setLoadStatusMessage(null);

        try {
            const result = await loadPromptStructure(selectedProjectId, parsedJson);
            if (result.success) {
                const successMessage = result.message || 'Estructura JSON cargada exitosamente.';
                showSuccessToast(successMessage);
                setLoadStatusMessage({ type: 'success', message: successMessage });
                setGeneratedJson(parsedJson as StructureData);
            } else {
                let detailedErrorMessage = result.message || 'Error al cargar la estructura JSON.';
                if (result.errorDetails) {
                    const detailsString = typeof result.errorDetails === 'string'
                        ? result.errorDetails
                        : JSON.stringify(result.errorDetails, null, 2);
                    detailedErrorMessage += `\nDetalles: ${detailsString}`;
                }
                showErrorToast(detailedErrorMessage);
                setLoadStatusMessage({ type: 'error', message: `KO. ${detailedErrorMessage}` });
            }
        } catch (err: unknown) {
            // Este catch es para errores inesperados en la propia función loadPromptStructure o de red, no errores de API manejados
            console.error("Error inesperado llamando a loadPromptStructure:", err);
            const unexpectedError = (err instanceof Error) ? err.message : 'Error inesperado en la operación de carga.';
            showErrorToast(unexpectedError);
            setLoadStatusMessage({ type: 'error', message: `KO. ${unexpectedError}` });
        } finally {
            setIsLoadingLoad(false);
        }
    };

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">

                <div className="mb-8 p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">1. Generar/Editar Estructura</h2>
                    <div className="mb-4">
                        <label htmlFor="prompt-editor" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Escribe tu prompt para que la IA sugiera una estructura:
                        </label>
                        <textarea
                            id="prompt-editor"
                            rows={5}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                            value={promptContent}
                            onChange={(e) => setPromptContent(e.target.value)}
                            placeholder="Ej: Crear un mensaje de bienvenida para nuevos usuarios en inglés y español..."
                            disabled={isLoadingGenerate}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            onClick={handleGenerateStructure}
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoadingGenerate || !selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                            disabled={isLoadingGenerate || !selectedProjectId}
                            title={!selectedProjectId ? "Selecciona un proyecto para generar estructura" : "Generar estructura basada en el prompt"}
                        >
                            {isLoadingGenerate ? 'Generando...' : 'Sugerir Estructura por IA'}
                        </button>
                    </div>
                    {errorGenerate && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error al generar: </strong>
                            <span className="block sm:inline">{errorGenerate}</span>
                        </div>
                    )}
                </div>

                {/* Visualización y Edición de JSON + Acciones de Carga */}
                {(generatedJson || jsonToLoadInput) && (
                    <div className="mt-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Columna Izquierda: Visualización Estructurada (solo si hay generatedJson) */}
                            {generatedJson && (
                                <div className="md:w-1/2 w-full">
                                    <GeneratedStructureDisplay data={generatedJson} />
                                </div>
                            )}

                            {/* Columna Derecha: Textarea Unificado para Edición y Carga */}
                            <div className={generatedJson ? "md:w-1/2 w-full" : "w-full"}>
                                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner h-full flex flex-col">
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editor JSON</h2>
                                    <textarea
                                        id="json-unified-editor"
                                        className="w-full flex-grow p-3 border border-gray-700 dark:border-gray-600 rounded-md bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 text-sm font-mono whitespace-pre focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        rows={generatedJson ? 20 : 25}
                                        value={jsonToLoadInput}
                                        onChange={(e) => setJsonToLoadInput(e.target.value)}
                                        placeholder='Pega aquí el JSON de la estructura, o genera uno con la IA.'
                                        disabled={isLoadingLoad || isLoadingGenerate}
                                    />
                                    <div className="mt-4 flex items-center justify-end">
                                        <button
                                            onClick={handleLoadStructure}
                                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoadingLoad || !selectedProjectId || !jsonToLoadInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            type="button"
                                            disabled={isLoadingLoad || !selectedProjectId || !jsonToLoadInput.trim()}
                                            title={!selectedProjectId ? "Selecciona un proyecto para cargar estructura" : !jsonToLoadInput.trim() ? "El JSON no puede estar vacío" : "Cargar esta estructura JSON al proyecto"}
                                        >
                                            {isLoadingLoad ? 'Loading...' : 'Load Prompt in Project'}
                                        </button>
                                    </div>
                                    {loadStatusMessage && (
                                        <div className={`mt-4 px-4 py-3 rounded relative border ${loadStatusMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
                                            <strong className="font-bold">{loadStatusMessage.type === 'success' ? 'Éxito:' : 'Error:'} </strong>
                                            <span className="block sm:inline whitespace-pre-wrap">{loadStatusMessage.message}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PromptWizardPage; 