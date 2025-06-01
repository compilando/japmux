"use client";

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { promptService, promptAssetService, regionService } from '@/services/api';
import { loadPromptStructure } from '@/services/promptApi';
import { LoadPromptStructureDto } from '@/types/prompt-structure';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext'; // Importar contexto de proyectos
import PromptEditor from '@/components/common/PromptEditor';
import JsonTreeViewer from '@/components/common/JsonTreeViewer';

// Tipos locales para los que no están exportados
type PromptAssetStructureDto = any;
type PromptMetaDto = any;
type PromptVersionStructureDto = any;
type PromptVersionTranslationDto = any;
type AssetTranslationStructureDto = any;

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

type StructureData = LoadPromptStructureDto;

const PromptWizardPage: React.FC = () => {
    const { selectedProjectId } = useProjects(); // Obtener projectId del contexto
    const [promptContent, setPromptContent] = useState<string>('');
    const [generatedJson, setGeneratedJson] = useState<StructureData | null>(null);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
    const [errorGenerate, setErrorGenerate] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false); // Nuevo estado para controlar si ya se cargó

    // jsonToLoadInput será el estado para el textarea unificado
    const [jsonToLoadInput, setJsonToLoadInput] = useState<string>('');
    const [isLoadingLoad, setIsLoadingLoad] = useState<boolean>(false);
    const [loadStatusMessage, setLoadStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Estados para configuración de carga
    const [promptName, setPromptName] = useState<string>('');
    const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('');
    const [regions, setRegions] = useState<any[]>([]);
    const [loadingRegions, setLoadingRegions] = useState<boolean>(false);

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Prompt Wizard" }
    ];

    // Efecto para cargar regiones cuando se selecciona un proyecto
    useEffect(() => {
        if (selectedProjectId) {
            setLoadingRegions(true);
            regionService.findAll(selectedProjectId)
                .then(regionData => {
                    setRegions(regionData);
                    // Establecer idioma por defecto si hay regiones disponibles
                    if (regionData.length > 0 && !selectedLanguageCode) {
                        const defaultRegion = regionData.find(r => r.languageCode === 'en-US') || regionData[0];
                        setSelectedLanguageCode(defaultRegion.languageCode);
                    }
                })
                .catch(err => {
                    console.error('Error loading regions:', err);
                    setRegions([]);
                })
                .finally(() => {
                    setLoadingRegions(false);
                });
        }
    }, [selectedProjectId]);

    // Función para validar el nombre del prompt
    const validatePromptName = (name: string): boolean => {
        // Solo letras minúsculas, números y guiones bajos
        const validPattern = /^[a-z0-9_]+$/;
        return validPattern.test(name);
    };

    // Función para generar un nombre válido desde el nombre sugerido
    const generateValidPromptName = (suggestedName: string): string => {
        return suggestedName
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    };

    const handleGenerateStructure = async () => {
        if (!selectedProjectId) {
            showErrorToast('Please select a project first to generate the structure.');
            return;
        }

        setIsLoadingGenerate(true);
        setErrorGenerate(null);
        setGeneratedJson(null);
        try {
            const result = await promptService.generatePromptStructure(selectedProjectId, promptContent);
            console.log('Generated structure result:', result);

            // Verificar si result.structure existe (formato esperado según OpenAPI)
            let structureData = result.structure;

            // Si no existe result.structure, verificar si result mismo es la estructura
            // Castear a any porque el servidor podría devolver un formato diferente al especificado en la API
            const resultAny = result as any;
            if (!structureData && resultAny && (resultAny.prompt || resultAny.version || resultAny.assets)) {
                console.log('Structure found directly in result, not in result.structure');
                structureData = resultAny;
            }

            if (structureData) {
                setGeneratedJson(structureData as StructureData);
                setJsonToLoadInput(JSON.stringify(structureData, null, 2));

                // Sugerir un nombre de prompt válido basado en el nombre generado
                const structureDataAny = structureData as any;
                if (structureDataAny.prompt?.name && !promptName) {
                    const suggestedName = generateValidPromptName(structureDataAny.prompt.name);
                    setPromptName(suggestedName);
                }

                showSuccessToast('Structure generated successfully from the prompt.');
            } else {
                console.log('No structure found in result:', result);
                showErrorToast('No structure data received from the API.');
                setErrorGenerate('No structure data received from the API.');
            }
        } catch (err: unknown) {
            console.error("Error generando estructura:", err);
            let apiErrorMessage = 'Error generating prompt structure.';
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

    // Componente para visualización del JSON como árbol colapsable
    const GeneratedStructureDisplay = ({ data }: { data: StructureData }) => {
        if (!data) return null;

        return (
            <JsonTreeViewer
                data={data}
                title="Structure Visualization"
                className="mt-6"
            />
        );
    };

    // Nueva función para manejar la carga de la estructura JSON
    const handleLoadStructure = async () => {
        if (!selectedProjectId) {
            showErrorToast('Please select a project first to load the structure.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Project not selected.' });
            return;
        }
        if (!jsonToLoadInput.trim()) {
            showErrorToast('The JSON to load cannot be empty.');
            setLoadStatusMessage({ type: 'error', message: 'Error: JSON field is empty.' });
            return;
        }
        if (!promptName.trim()) {
            showErrorToast('Please enter a prompt name.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Prompt name is required.' });
            return;
        }
        if (!validatePromptName(promptName)) {
            showErrorToast('Prompt name must contain only lowercase letters, numbers, and underscores.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Invalid prompt name format.' });
            return;
        }
        if (!selectedLanguageCode) {
            showErrorToast('Please select a language.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Language selection is required.' });
            return;
        }

        let parsedJson: LoadPromptStructureDto;
        try {
            parsedJson = JSON.parse(jsonToLoadInput);
        } catch {
            showErrorToast('The entered text is not valid JSON.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Invalid JSON format.' });
            return;
        }

        // Validar que la estructura tenga los campos necesarios
        if (!parsedJson.version || !parsedJson.version.promptText) {
            showErrorToast('Invalid structure: missing required version text.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Invalid structure format.' });
            return;
        }

        setIsLoadingLoad(true);
        setLoadStatusMessage(null);

        try {
            console.log('Creating prompt structure:', parsedJson);

            // 1. Crear el prompt principal usando los valores configurados por el usuario
            const promptPayload = {
                name: promptName, // Usar el nombre configurado por el usuario
                description: parsedJson.prompt?.description || `Generated prompt: ${promptName}`,
                tags: new Set<string>(), // Tags vacíos por ahora
                type: { type: 'GENERAL' }, // Tipo por defecto
                promptText: parsedJson.version.promptText,
                languageCode: selectedLanguageCode, // Usar el idioma seleccionado por el usuario
                initialTranslations: parsedJson.version.translations?.map(t => ({
                    languageCode: t.languageCode,
                    promptText: t.promptText || parsedJson.version.promptText
                })) || []
            };

            console.log('Creating prompt with payload:', promptPayload);
            const createdPrompt = await promptService.create(selectedProjectId, promptPayload as any);
            console.log('Prompt created:', createdPrompt);

            // 2. Crear los assets si existen
            if (parsedJson.assets && parsedJson.assets.length > 0) {
                console.log('Creating assets:', parsedJson.assets);
                for (const asset of parsedJson.assets) {
                    try {
                        const assetPayload = {
                            key: asset.key,
                            name: (asset as any).name || asset.key,
                            category: 'Generated', // Categoría por defecto
                            initialValue: (asset as any).value,
                            initialChangeMessage: (asset as any).changeMessage || 'Initial asset from structure'
                        };

                        console.log('Creating asset:', assetPayload);
                        await promptAssetService.create(selectedProjectId, createdPrompt.id, assetPayload);
                        console.log('Asset created:', asset.key);
                    } catch (assetError) {
                        console.error(`Error creating asset ${asset.key}:`, assetError);
                        // Continuar con otros assets aunque uno falle
                    }
                }
            }

            showSuccessToast(`Prompt "${promptName}" and structure loaded successfully!`);
            setLoadStatusMessage({
                type: 'success',
                message: `Success: Prompt "${promptName}" created with ${parsedJson.assets?.length || 0} assets.`
            });
            setGeneratedJson(parsedJson);
            setIsLoaded(true); // Marcar como cargado exitosamente

        } catch (error) {
            console.error("Error loading structure:", error);
            let errorMessage = 'Error loading JSON structure.';
            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' &&
                'data' in error.response && error.response.data &&
                typeof error.response.data === 'object' &&
                'message' in error.response.data) {
                errorMessage = String(error.response.data.message);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showErrorToast(errorMessage);
            setLoadStatusMessage({ type: 'error', message: errorMessage });
        } finally {
            setIsLoadingLoad(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-200/10 dark:bg-brand-800/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative">
                <Breadcrumb crumbs={breadcrumbs} />

                {/* Header section with glassmorphism */}
                <div className="my-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl rounded-2xl"></div>
                        <div className="relative p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Generate intelligent prompt structures using AI assistance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content with glassmorphism */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl">

                        {/* Generate/Edit Structure section */}
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 dark:from-gray-800/40 dark:via-gray-700/20 dark:to-gray-800/40 backdrop-blur-sm rounded-2xl"></div>
                            <div className="relative p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-600/30">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">1. Generate/Edit Structure</h2>
                                <div className="mb-4">
                                    <label htmlFor="prompt-editor" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                        Write your prompt for the AI to suggest a structure:
                                    </label>
                                    <PromptEditor
                                        value={promptContent}
                                        onChange={setPromptContent}
                                        placeholder="e.g.: Create a welcome message for new users in English and Spanish..."
                                        rows={8}
                                        assets={[]} // Sin assets para evitar funcionalidad de insertar variables
                                        readOnly={isLoadingGenerate}
                                        showHistory={true}
                                        id="prompt-editor"
                                        aria-label="Prompt content editor"
                                    // Sin extraToolbarButtons para evitar insertar prompts/assets
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={handleGenerateStructure}
                                        className={`px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isLoadingGenerate || !selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        type="button"
                                        disabled={isLoadingGenerate || !selectedProjectId}
                                        title={!selectedProjectId ? "Select a project to generate structure" : "Generate structure based on the prompt"}
                                    >
                                        {isLoadingGenerate ? 'Generating, please wait...' : 'Suggest Structure by AI'}
                                    </button>
                                </div>
                                {errorGenerate && (
                                    <div className="mt-4 p-4 bg-red-100/80 dark:bg-red-900/40 border border-red-400/50 dark:border-red-600/50 text-red-700 dark:text-red-300 rounded-xl backdrop-blur-sm" role="alert">
                                        <strong className="font-bold">Error generating: </strong>
                                        <span className="block sm:inline">{errorGenerate}</span>
                                    </div>
                                )}
                            </div>
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
                                        <div className="relative">
                                            {/* Glassmorphism background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-2xl"></div>

                                            <div className="relative p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-xl h-full flex flex-col">
                                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">JSON Editor</h2>
                                                <textarea
                                                    id="json-unified-editor"
                                                    className="w-full flex-grow p-3 border border-gray-700 dark:border-gray-600 rounded-md bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 text-sm font-mono whitespace-pre focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                                                    rows={generatedJson ? 20 : 25}
                                                    value={jsonToLoadInput}
                                                    onChange={(e) => setJsonToLoadInput(e.target.value)}
                                                    placeholder='Paste the structure JSON here, or generate one with the AI.'
                                                    disabled={isLoadingLoad || isLoadingGenerate}
                                                />

                                                {/* Configuración para carga de prompt */}
                                                <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm">
                                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Configure Prompt</h3>

                                                    {/* Campo para nombre del prompt */}
                                                    <div className="mb-4">
                                                        <label htmlFor="prompt-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Prompt Name (lowercase, numbers, underscores only)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="prompt-name"
                                                            value={promptName}
                                                            onChange={(e) => setPromptName(e.target.value)}
                                                            placeholder="e.g. welcome_message_v1"
                                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${!validatePromptName(promptName) && promptName ? 'border-red-500' : 'border-gray-300'}`}
                                                            disabled={isLoadingLoad}
                                                        />
                                                        {promptName && !validatePromptName(promptName) && (
                                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                                Only lowercase letters, numbers, and underscores allowed
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Selector de idioma base */}
                                                    <div className="mb-4">
                                                        <label htmlFor="language-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Base Language
                                                        </label>
                                                        <select
                                                            id="language-code"
                                                            value={selectedLanguageCode}
                                                            onChange={(e) => setSelectedLanguageCode(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                            disabled={isLoadingLoad || loadingRegions}
                                                        >
                                                            {loadingRegions ? (
                                                                <option>Loading languages...</option>
                                                            ) : regions.length > 0 ? (
                                                                regions.map(region => (
                                                                    <option key={region.languageCode} value={region.languageCode}>
                                                                        {region.languageCode.toUpperCase()} - {region.name || region.languageCode}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option value="">No languages available</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-end">
                                                    {!isLoaded && (
                                                        <button
                                                            onClick={handleLoadStructure}
                                                            className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isLoadingLoad || !selectedProjectId || !jsonToLoadInput.trim() || !promptName.trim() || !validatePromptName(promptName) || !selectedLanguageCode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            type="button"
                                                            disabled={isLoadingLoad || !selectedProjectId || !jsonToLoadInput.trim() || !promptName.trim() || !validatePromptName(promptName) || !selectedLanguageCode}
                                                            title={!selectedProjectId ? "Select a project to load structure" : !jsonToLoadInput.trim() ? "JSON cannot be empty" : !promptName.trim() ? "Prompt name is required" : !validatePromptName(promptName) ? "Invalid prompt name format" : !selectedLanguageCode ? "Language selection required" : "Load this JSON structure to the project"}
                                                        >
                                                            {isLoadingLoad ? 'Loading...' : 'Load Prompt in Project'}
                                                        </button>
                                                    )}
                                                </div>
                                                {loadStatusMessage && (
                                                    <div className={`mt-4 px-4 py-3 rounded-xl backdrop-blur-sm border ${loadStatusMessage.type === 'success' ? 'bg-green-100/80 dark:bg-green-900/40 border-green-400/50 dark:border-green-600/50 text-green-700 dark:text-green-300' : 'bg-red-100/80 dark:bg-red-900/40 border-red-400/50 dark:border-red-600/50 text-red-700 dark:text-red-300'}`} role="alert">
                                                        <strong className="font-bold">{loadStatusMessage.type === 'success' ? 'Success:' : 'Error:'} </strong>
                                                        <span className="block sm:inline whitespace-pre-wrap">{loadStatusMessage.message}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptWizardPage;