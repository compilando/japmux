"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProjects } from '@/context/ProjectContext';
import {
    Prompt,
    PromptVersion,
    PromptTranslation,
    CreateAiModelDto,
    ExecuteLlmDto
} from '@/services/generated/api';
import {
    promptService,
    promptVersionService,
    promptTranslationService,
    aiModelService,
    llmExecutionService,
} from '@/services/api';
import Select, { SingleValue } from 'react-select';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import axios from 'axios';

interface StringMap { [key: string]: string; }

// Add 'id' to Prompt type if it's missing from generated types
// Ideally, regenerate types to include it properly.
interface PromptWithId extends Prompt {
    id: string; // Assuming ID is a string (e.g., UUID)
}

// Usar CreateAiModelDto directamente si el ID está en el DTO (o añadirlo si no)
// (OpenAPI Generator a veces incluye 'id' en DTOs de respuesta aunque no en los de creación)
// Vamos a asumir que CreateAiModelDto devuelto por findAll SÍ tiene id para el Select
interface SelectOption { value: string; label: string; }

const ServePromptPage: React.FC = () => {
    const { selectedProjectId } = useProjects();

    // --- Estados para Selecciones ---
    const [prompts, setPrompts] = useState<PromptWithId[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<SingleValue<SelectOption>>(null);
    const [versions, setVersions] = useState<PromptVersion[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<SingleValue<SelectOption>>(null);
    const [translations, setTranslations] = useState<PromptTranslation[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<SingleValue<SelectOption>>(null);
    const [aiModels, setAiModels] = useState<CreateAiModelDto[]>([]);
    const [selectedAiModel, setSelectedAiModel] = useState<SingleValue<SelectOption>>(null);

    // --- Estados para Datos del Prompt ---
    const [currentPromptText, setCurrentPromptText] = useState<string>('');
    const [promptVariables, setPromptVariables] = useState<StringMap>({});
    const [variableInputs, setVariableInputs] = useState<StringMap>({});

    // --- Estados para Ejecución ---
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    // --- Estados UI/Generales ---
    const [loadingPrompts, setLoadingPrompts] = useState<boolean>(false);
    const [loadingVersions, setLoadingVersions] = useState<boolean>(false);
    const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<boolean>(false);
    const [loadingAiModels, setLoadingAiModels] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- Opciones para Selects (Memoizadas) ---
    const promptOptions: SelectOption[] = useMemo(() => prompts.map(p => ({ value: p.id, label: p.name })), [prompts]);
    const versionOptions: SelectOption[] = useMemo(() => versions.map(v => ({ value: v.versionTag, label: v.versionTag })), [versions]);
    const languageOptions: SelectOption[] = useMemo(() => [
        { value: '__BASE__', label: 'Base Text' }, // Opción para usar el texto base
        ...translations.map(t => ({ value: t.languageCode, label: t.languageCode }))
    ], [translations]);
    const aiModelOptions: SelectOption[] = useMemo(() => aiModels.map(m => ({ value: (m as any).id, label: m.name })), [aiModels]);

    // --- Función para extraer variables del texto ---
    const extractVariables = (text: string): string[] => {
        const regex = /{{\s*(\w+)\s*}}/g;
        const matches = text.matchAll(regex);
        const vars = new Set<string>();
        for (const match of matches) {
            vars.add(match[1]);
        }
        return Array.from(vars);
    };

    // --- Efecto para cargar Prompts ---
    useEffect(() => {
        if (!selectedProjectId) {
            setPrompts([]);
            setSelectedPrompt(null);
            setError('Please select a project first.');
            return;
        }
        setLoadingPrompts(true);
        setError(null);
        promptService.findAll(selectedProjectId)
            .then(data => {
                // Cast data to PromptWithId[]
                setPrompts(Array.isArray(data) ? (data as PromptWithId[]) : []);
                setSelectedPrompt(null);
            })
            .catch(err => {
                console.error("Error fetching prompts:", err);
                setError('Failed to fetch prompts.');
                showErrorToast('Failed to fetch prompts.');
                setPrompts([]);
            })
            .finally(() => setLoadingPrompts(false));
    }, [selectedProjectId]);

    // --- Efecto para cargar Versiones ---
    useEffect(() => {
        setVersions([]);
        setSelectedVersion(null);
        setCurrentPromptText('');
        setPromptVariables({});
        setVariableInputs({});
        setExecutionResult(null);

        if (!selectedProjectId || !selectedPrompt?.value) {
            return;
        }
        setLoadingVersions(true);
        promptVersionService.findAll(selectedProjectId, selectedPrompt.value)
            .then((data: PromptVersion[]) => {
                setVersions(Array.isArray(data) ? data : []);
            })
            .catch((err: Error) => {
                console.error("Error fetching versions:", err);
                setError('Failed to fetch prompt versions.');
                showErrorToast('Failed to fetch prompt versions.');
                setVersions([]);
            })
            .finally(() => setLoadingVersions(false));
    }, [selectedProjectId, selectedPrompt]);

    // --- Efecto para cargar Traducciones ---
    useEffect(() => {
        setTranslations([]);
        setSelectedLanguage(null);

        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value) {
            return;
        }
        setLoadingTranslations(true);
        promptTranslationService.findAll(selectedProjectId, selectedPrompt.value, selectedVersion.value)
            .then((data: PromptTranslation[]) => {
                setTranslations(Array.isArray(data) ? data : []);
                if (!data || data.length === 0) {
                    setSelectedLanguage({ value: '__BASE__', label: 'Base Text' });
                } else {
                    setSelectedLanguage(null);
                }
            })
            .catch((err: Error) => {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    console.log("No translations found for this version.");
                    setTranslations([]);
                    setSelectedLanguage({ value: '__BASE__', label: 'Base Text' });
                } else {
                    console.error("Error fetching translations:", err);
                    setError('Failed to fetch translations.');
                    showErrorToast('Failed to fetch translations.');
                    setTranslations([]);
                    setSelectedLanguage(null);
                }
            })
            .finally(() => setLoadingTranslations(false));
    }, [selectedProjectId, selectedPrompt, selectedVersion]);

    // --- Efecto para cargar AI Models (Ahora depende de selectedProjectId) ---
    useEffect(() => {
        // Limpiar estado si no hay proyecto
        if (!selectedProjectId) {
            setAiModels([]);
            setSelectedAiModel(null);
            // Podrías poner un error aquí o simplemente no cargar
            // setError('Select a project to load AI Models');
            return;
        }

        setLoadingAiModels(true);
        setError(null); // Limpiar error previo
        aiModelService.findAll(selectedProjectId) // Pasar projectId
            .then((data: CreateAiModelDto[]) => {
                // data ya es CreateAiModelDto[]
                setAiModels(Array.isArray(data) ? data : []);
            })
            .catch((err: Error) => {
                console.error("Error fetching AI models:", err);
                setError('Failed to fetch AI models.');
                showErrorToast('Failed to fetch AI models.');
                setAiModels([]);
            })
            .finally(() => setLoadingAiModels(false));
    }, [selectedProjectId]); // Añadir dependencia

    // --- Efecto para cargar Texto del Prompt y extraer Variables ---
    useEffect(() => {
        setCurrentPromptText('');
        setPromptVariables({});
        setVariableInputs({});
        setExecutionResult(null);

        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value || !selectedLanguage?.value) {
            return;
        }

        setLoadingText(true);
        let fetchPromise: Promise<any>;

        if (selectedLanguage.value === '__BASE__') {
            fetchPromise = promptVersionService.findOne(selectedProjectId, selectedPrompt.value, selectedVersion.value);
        } else {
            fetchPromise = promptTranslationService.findByLanguage(selectedProjectId, selectedPrompt.value, selectedVersion.value, selectedLanguage.value);
        }

        fetchPromise
            .then((data: PromptVersion | PromptTranslation) => {
                const text = data?.promptText || '';
                setCurrentPromptText(text);
                const vars = extractVariables(text);
                const initialVarInputs: StringMap = {};
                vars.forEach(v => { initialVarInputs[v] = ''; });
                setPromptVariables(initialVarInputs);
                setVariableInputs(initialVarInputs);
            })
            .catch((err: Error) => {
                console.error("Error fetching prompt text:", err);
                setError('Failed to fetch prompt text.');
                showErrorToast('Failed to fetch prompt text.');
                setCurrentPromptText('');
                setPromptVariables({});
                setVariableInputs({});
            })
            .finally(() => setLoadingText(false));

    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage]);


    // --- Handler para actualizar input de variable ---
    const handleVariableInputChange = (varName: string, value: string) => {
        setVariableInputs(prev => ({ ...prev, [varName]: value }));
    };

    // --- Handlers para cambios en Select --- (Usan SingleValue)
    const handlePromptChange = (selectedOption: SingleValue<SelectOption>) => {
        setSelectedPrompt(selectedOption);
    };
    const handleVersionChange = (selectedOption: SingleValue<SelectOption>) => {
        setSelectedVersion(selectedOption);
    };
    const handleLanguageChange = (selectedOption: SingleValue<SelectOption>) => {
        setSelectedLanguage(selectedOption);
    };
    const handleAiModelChange = (selectedOption: SingleValue<SelectOption>) => {
        setSelectedAiModel(selectedOption);
    };

    // --- Handler para Ejecutar Prompt (Usando el servicio generado) ---
    const handleExecute = async () => {
        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value || !selectedAiModel?.value) {
            showErrorToast("Please select a project, prompt, version, and AI model.");
            return;
        }

        setIsExecuting(true);
        setExecutionResult(null);
        setError(null);

        const payload: ExecuteLlmDto = {
            modelId: selectedAiModel.value,
            promptText: currentPromptText,
            variables: variableInputs,
        };

        try {
            const responseData = await llmExecutionService.execute(payload);
            setExecutionResult(responseData);
            showSuccessToast("Prompt executed successfully via LLM!");
        } catch (err: unknown) {
            console.error("Error executing prompt via LLM service:", err);
            let errorMsg = 'Failed to execute prompt via LLM.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            setError(errorMsg);
            // showErrorToast(errorMsg); // Comentado temporalmente para depurar
            setExecutionResult(null);
        } finally {
            setIsExecuting(false);
        }
    };


    // --- Renderizado (Modificado) ---
    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Serve Prompt</h1>

            {!selectedProjectId && (
                <p className="text-yellow-600 dark:text-yellow-400">Please select a project from the header dropdown to begin.</p>
            )}

            {selectedProjectId && (
                <>
                    {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}

                    {/* --- Selección (Añadir AI Model) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="prompt-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
                            <Select
                                id="prompt-select"
                                options={promptOptions}
                                value={selectedPrompt}
                                onChange={handlePromptChange}
                                isLoading={loadingPrompts}
                                isDisabled={loadingPrompts || prompts.length === 0}
                                placeholder={loadingPrompts ? "Loading..." : prompts.length === 0 ? "No prompts found" : "Select Prompt..."}
                                styles={{ /* Estilos opcionales si quieres dark mode etc */ }}
                            />
                        </div>
                        <div>
                            <label htmlFor="version-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version</label>
                            <Select
                                id="version-select"
                                options={versionOptions}
                                value={selectedVersion}
                                onChange={handleVersionChange}
                                isLoading={loadingVersions}
                                isDisabled={loadingVersions || !selectedPrompt || versions.length === 0}
                                placeholder={!selectedPrompt ? "Select prompt first" : loadingVersions ? "Loading..." : versions.length === 0 ? "No versions found" : "Select Version..."}
                            />
                        </div>
                        <div>
                             <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language/Text</label>
                            <Select
                                id="language-select"
                                options={languageOptions}
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                isLoading={loadingTranslations}
                                isDisabled={loadingTranslations || !selectedVersion || languageOptions.length <= 1}
                                placeholder={!selectedVersion ? "Select version first" : loadingTranslations ? "Loading..." : "Select Language..."}
                            />
                        </div>
                        <div>
                            <label htmlFor="ai-model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Model</label>
                            <Select
                                id="ai-model-select"
                                options={aiModelOptions}
                                value={selectedAiModel}
                                onChange={handleAiModelChange}
                                isLoading={loadingAiModels}
                                isDisabled={loadingAiModels || aiModels.length === 0}
                                placeholder={loadingAiModels ? "Loading..." : aiModels.length === 0 ? "No models found" : "Select AI Model..."}
                            />
                        </div>
                    </div>

                    {/* --- Texto y Variables --- */}
                    {selectedVersion && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Text (Read-only)</label>
                                {loadingText ? (
                                     <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-36 w-full"></div>
                                ) : (
                                    <textarea
                                        readOnly
                                        value={currentPromptText}
                                        rows={12}
                                        className="mt-1 block w-full rounded-md shadow-sm sm:text-sm font-mono p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 whitespace-pre-wrap cursor-text"
                                    />
                                )}
                            </div>

                            {Object.keys(promptVariables).length > 0 && (
                                <div className="space-y-2 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded">
                                    <h3 className="text-lg font-medium text-black dark:text-white mb-2">Variables</h3>
                                    {Object.keys(promptVariables).map(varName => (
                                        <div key={varName}>
                                            <label htmlFor={`var-${varName}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{varName}</label>
                                            <input
                                                type="text"
                                                id={`var-${varName}`}
                                                value={variableInputs[varName] || ''}
                                                onChange={(e) => handleVariableInputChange(varName, e.target.value)}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- Ejecución (Actualizar disabled) --- */}
                            <div className="text-right">
                                <button
                                    onClick={handleExecute}
                                    disabled={isExecuting || loadingText || !selectedProjectId || !selectedPrompt || !selectedVersion || !selectedLanguage || !selectedAiModel}
                                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExecuting ? 'Executing via LLM...' : 'Execute Prompt via LLM'}
                                </button>
                            </div>

                             {/* --- Resultado --- */}
                            {executionResult !== null && (
                                <div>
                                     <h3 className="text-lg font-medium text-black dark:text-white mb-2">Result</h3>
                                     <pre className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                                         {typeof executionResult === 'object' ? JSON.stringify(executionResult, null, 2) : String(executionResult)}
                                     </pre>
                                 </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ServePromptPage; 