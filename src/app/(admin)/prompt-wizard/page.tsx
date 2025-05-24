"use client";

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { promptService, promptAssetService, regionService } from '@/services/api';
import { loadPromptStructure } from '@/services/promptApi';
import { LoadPromptStructureDto } from '@/types/prompt-structure';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext'; // Importar contexto de proyectos
import PromptEditor from '@/components/common/PromptEditor';

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
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Structure Visualization:</h2>

                {data.prompt && renderBlock("Prompt Details", <>
                    {renderKeyValue("Name", data.prompt.name)}
                    {renderKeyValue("Description", data.prompt.description)}
                </>, "bg-sky-50 dark:bg-sky-800/30")}

                {data.version && renderBlock("Version Details", <>
                    {renderKeyValue("Prompt Text", data.version.promptText)}
                    {renderKeyValue("Change Message", data.version.changeMessage)}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2 mb-1">Referenced Assets:</p>
                    {data.version.assets && data.version.assets.length > 0 ? renderList(data.version.assets, (assetName: string) => <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">{assetName}</span>) : <p className="text-xs text-gray-500 dark:text-gray-400">None</p>}

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2 mb-1">Version Translations:</p>
                    {data.version.translations && data.version.translations.length > 0 ? renderList(data.version.translations, (trans: PromptVersionTranslationDto) => (
                        <><strong>{trans.languageCode}:</strong> {trans.promptText}</>
                    )) : <p className="text-xs text-gray-500 dark:text-gray-400">None</p>}
                </>, "bg-teal-50 dark:bg-teal-800/30")}

                {data.assets && data.assets.length > 0 && renderBlock("Defined Assets",
                    <div className="space-y-3">
                        {data.assets.map((asset: PromptAssetStructureDto, index: number) => (
                            <div key={index} className="p-3 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800">
                                {renderKeyValue("Key", asset.key)}
                                {renderKeyValue("Name", asset.name)}
                                {renderKeyValue("Default Value", asset.value)}
                                {renderKeyValue("Change Message", asset.changeMessage)}
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1 mb-0.5">Asset Translations:</p>
                                {asset.translations && asset.translations.length > 0 ? renderList(asset.translations, (trans: AssetTranslationStructureDto) => (
                                    <><strong>{trans.languageCode}:</strong> {trans.value}</>
                                )) : <p className="text-xs text-gray-500 dark:text-gray-400">None</p>}
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
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">

                <div className="mb-8 p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
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
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoadingGenerate || !selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                            disabled={isLoadingGenerate || !selectedProjectId}
                            title={!selectedProjectId ? "Select a project to generate structure" : "Generate structure based on the prompt"}
                        >
                            {isLoadingGenerate ? 'Generating...' : 'Suggest Structure by AI'}
                        </button>
                    </div>
                    {errorGenerate && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error generating: </strong>
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
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">JSON Editor</h2>
                                    <textarea
                                        id="json-unified-editor"
                                        className="w-full flex-grow p-3 border border-gray-700 dark:border-gray-600 rounded-md bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 text-sm font-mono whitespace-pre focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        rows={generatedJson ? 20 : 25}
                                        value={jsonToLoadInput}
                                        onChange={(e) => setJsonToLoadInput(e.target.value)}
                                        placeholder='Paste the structure JSON here, or generate one with the AI.'
                                        disabled={isLoadingLoad || isLoadingGenerate}
                                    />

                                    {/* Configuración para carga de prompt */}
                                    <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
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
                                        <button
                                            onClick={handleLoadStructure}
                                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoadingLoad || !selectedProjectId || !jsonToLoadInput.trim() || !promptName.trim() || !validatePromptName(promptName) || !selectedLanguageCode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            type="button"
                                            disabled={isLoadingLoad || !selectedProjectId || !jsonToLoadInput.trim() || !promptName.trim() || !validatePromptName(promptName) || !selectedLanguageCode}
                                            title={!selectedProjectId ? "Select a project to load structure" : !jsonToLoadInput.trim() ? "JSON cannot be empty" : !promptName.trim() ? "Prompt name is required" : !validatePromptName(promptName) ? "Invalid prompt name format" : !selectedLanguageCode ? "Language selection required" : "Load this JSON structure to the project"}
                                        >
                                            {isLoadingLoad ? 'Loading...' : 'Load Prompt in Project'}
                                        </button>
                                    </div>
                                    {loadStatusMessage && (
                                        <div className={`mt-4 px-4 py-3 rounded relative border ${loadStatusMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
                                            <strong className="font-bold">{loadStatusMessage.type === 'success' ? 'Success:' : 'Error:'} </strong>
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