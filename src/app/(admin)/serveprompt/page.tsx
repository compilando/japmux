"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProjects } from '@/context/ProjectContext';
import {
    PromptDto,
    CreatePromptVersionDto,
    CreatePromptTranslationDto,
    AiModelResponseDto,
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
import AsyncSelect from 'react-select/async'; // Import AsyncSelect
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import axios from 'axios';
import styles from './ServePromptPage.module.css'; // Importar CSS Modules
import CopyButton from '@/components/common/CopyButton'; // Importar CopyButton

interface StringMap { [key: string]: string; }

// Restaurar SelectOption
interface SelectOption { value: string; label: string; }

// Define los tamaños posibles
type FontSize = 's' | 'm' | 'l' | 'xl';
const fontSizes: FontSize[] = ['s', 'm', 'l', 'xl'];

const ServePromptPage: React.FC = () => {
    const { selectedProjectId } = useProjects();
    const [isClient, setIsClient] = useState(false); // Estado para saber si estamos en cliente

    // --- Estados para Selecciones (usar PromptDto) ---
    const [selectedPrompt, setSelectedPrompt] = useState<SingleValue<SelectOption>>(null);
    const [versions, setVersions] = useState<CreatePromptVersionDto[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<SingleValue<SelectOption>>(null);
    const [translations, setTranslations] = useState<CreatePromptTranslationDto[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<SingleValue<SelectOption>>(null);
    const [aiModels, setAiModels] = useState<AiModelResponseDto[]>([]);
    const [selectedAiModel, setSelectedAiModel] = useState<SingleValue<SelectOption>>(null);

    // --- Estados para Datos del Prompt ---
    const [currentPromptText, setCurrentPromptText] = useState<string>('');
    const [promptVariables, setPromptVariables] = useState<StringMap>({});
    const [variableInputs, setVariableInputs] = useState<StringMap>({});

    // --- Estados para Ejecución ---
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    // --- Estado para Tamaño de Fuente ---
    const [selectedFontSize, setSelectedFontSize] = useState<FontSize>('m'); // Default 'm'

    // --- Estados UI/Generales ---
    const [loadingVersions, setLoadingVersions] = useState<boolean>(false);
    const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<boolean>(false);
    const [loadingAiModels, setLoadingAiModels] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- Nuevo Estado para el Comando cURL ---
    const [curlCommand, setCurlCommand] = useState<string>('');

    // --- Efecto para detectar montaje en cliente ---
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- Efecto para cargar tamaño de fuente (SOLO en cliente) ---
    useEffect(() => {
        if (isClient) { // Asegurarse de ejecutar solo en cliente
            const storedSize = localStorage.getItem('promptFontSize') as FontSize | null;
            if (storedSize && fontSizes.includes(storedSize)) {
                setSelectedFontSize(storedSize);
            }
        }
    }, [isClient]);

    // --- Efecto para guardar tamaño de fuente (SOLO en cliente) ---
    useEffect(() => {
        if (isClient) { // Asegurarse de ejecutar solo en cliente
            localStorage.setItem('promptFontSize', selectedFontSize);
        }
    }, [selectedFontSize, isClient]);

    // --- Helper para obtener la clase CSS del tamaño de fuente ---
    const getFontSizeClass = (size: FontSize): string => {
        switch (size) {
            case 's': return styles.fontSizeS;
            case 'l': return styles.fontSizeL;
            case 'xl': return styles.fontSizeXL;
            case 'm':
            default: return styles.fontSizeM;
        }
    };

    // --- Handler para cambio de tamaño de fuente ---
    const handleFontSizeChange = (size: FontSize) => {
        setSelectedFontSize(size);
    };

    // --- Opciones para Selects (Memoizadas) ---
    const versionOptions: SelectOption[] = useMemo(() => versions.map(v => ({ value: (v as any).versionTag || (v as any).id || '', label: (v as any).versionTag || (v as any).id || 'Unknown Version' })), [versions]);
    const languageOptions: SelectOption[] = useMemo(() => [
        { value: '__BASE__', label: 'Base Text' }, // Opción para usar el texto base
        ...translations.map(t => ({ value: t.languageCode, label: t.languageCode }))
    ], [translations]);
    const aiModelOptions: SelectOption[] = useMemo(() => aiModels.map(m => ({ value: m.id, label: m.name })), [aiModels]);

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

    // --- Función para cargar Prompts Asíncronamente ---
    const loadPromptOptions = async (inputValue: string): Promise<SelectOption[]> => {
        if (!selectedProjectId) {
            return [];
        }
        try {
            // promptService.findAll no toma un segundo argumento para búsqueda/filtrado.
            // AsyncSelect cargará todos y filtrará en el cliente.
            const fetchedPrompts = await promptService.findAll(selectedProjectId);
            let options: PromptDto[] = [];
            if (Array.isArray(fetchedPrompts)) {
                options = fetchedPrompts as PromptDto[];
            }

            // Filtrar opciones basadas en inputValue si es necesario (filtrado del lado del cliente)
            const filteredOptions = options.filter(option =>
                option.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            return filteredOptions.map(p => ({ value: p.id, label: p.name }));

        } catch (err) {
            console.error("Error fetching prompts for async select:", err);
            showErrorToast('Failed to load prompts.');
            return []; // Devuelve un array vacío en caso de error para que AsyncSelect no se rompa
        }
    };

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
            .then((data: CreatePromptVersionDto[]) => {
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
            .then((data: CreatePromptTranslationDto[]) => {
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
            .then((data: AiModelResponseDto[]) => {
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
    }, [selectedProjectId]);

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
            .then((data: CreatePromptVersionDto | CreatePromptTranslationDto) => {
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

    // --- Efecto para generar el comando cURL ---
    useEffect(() => {
        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value || !selectedAiModel?.value) {
            setCurlCommand('# Select a project, prompt, version, and AI model to see the cURL command.');
            return;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'; // Usar la misma base que apiClient
        // Asegurarse de que no haya doble /api si apiBaseUrl ya lo contiene
        const cleanApiBaseUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl.substring(0, apiBaseUrl.length - 4) : apiBaseUrl;
        const endpoint = `${cleanApiBaseUrl}/api/projects/${selectedProjectId}/prompts/${selectedPrompt.value}/versions/${selectedVersion.value}/serve/${selectedAiModel.value}`;

        let command = `curl -X POST "${window.location.origin}${endpoint}" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
     -H "Content-Type: application/json"`;

        const body: { languageCode?: string; variables?: StringMap } = {};
        let hasBody = false;

        if (selectedLanguage?.value && selectedLanguage.value !== '__BASE__') {
            body.languageCode = selectedLanguage.value;
            hasBody = true;
        }

        const activeVariables = Object.entries(variableInputs)
            .filter(([_, val]) => val.trim() !== '') // Solo incluir variables con valor
            .reduce((obj, [key, val]) => {
                obj[key] = val;
                return obj;
            }, {} as StringMap);

        if (Object.keys(activeVariables).length > 0) {
            body.variables = activeVariables;
            hasBody = true;
        }

        if (hasBody) {
            command += ` \
     -d '${JSON.stringify(body, null, 2)}'`; // pretty print JSON body
        }

        setCurlCommand(command);

    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage, selectedAiModel, variableInputs]);

    // --- Handler para actualizar input de variable ---
    const handleVariableInputChange = (varName: string, value: string) => {
        setVariableInputs(prev => ({ ...prev, [varName]: value }));
    };

    // --- Handlers para cambios en Select --- (Usan SingleValue)
    const handlePromptChange = useCallback((selectedOption: SingleValue<SelectOption>) => {
        setSelectedPrompt(selectedOption);
        // Resetear selecciones dependientes
        setSelectedVersion(null);
        setVersions([]);
        setSelectedLanguage(null);
        setTranslations([]);
        setCurrentPromptText('');
        setPromptVariables({});
        setVariableInputs({});
        setExecutionResult(null);
    }, [setSelectedPrompt, setSelectedVersion, setVersions, setSelectedLanguage, setTranslations, setCurrentPromptText, setPromptVariables, setVariableInputs, setExecutionResult]);

    const handleVersionChange = useCallback((selectedOption: SingleValue<SelectOption>) => {
        setSelectedVersion(selectedOption);
        // Resetear selecciones dependientes
        setSelectedLanguage(null);
        setTranslations([]);
        setCurrentPromptText('');
        setPromptVariables({});
        setVariableInputs({});
        setExecutionResult(null);
    }, [setSelectedVersion, setSelectedLanguage, setTranslations, setCurrentPromptText, setPromptVariables, setVariableInputs, setExecutionResult]);

    const handleLanguageChange = useCallback((selectedOption: SingleValue<SelectOption>) => {
        setSelectedLanguage(selectedOption);
        setExecutionResult(null); // Limpiar resultado al cambiar idioma
    }, [setSelectedLanguage, setExecutionResult]);

    const handleAiModelChange = useCallback((selectedOption: SingleValue<SelectOption>) => {
        setSelectedAiModel(selectedOption);
        setExecutionResult(null); // Limpiar resultado al cambiar modelo AI
    }, [setSelectedAiModel, setExecutionResult]);

    // --- Handler para Ejecución ---
    const handleExecute = useCallback(async () => {
        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value || !selectedAiModel?.value || !selectedLanguage?.value) {
            showErrorToast("Please select project, prompt, version, language, and AI model.");
            return;
        }

        setIsExecuting(true);
        setError(null);
        setExecutionResult(null); // Limpiar resultado anterior

        // --- Corregido: Crear DTO según la definición de ExecuteLlmDto ---
        const executionDto: ExecuteLlmDto = {
            modelId: selectedAiModel.value, // Usar el ID del modelo seleccionado
            promptText: currentPromptText, // Usar el texto del prompt ya cargado/seleccionado
            variables: variableInputs, // Pasar las variables (opcional según DTO, pero útil)
        };

        try {
            const result = await llmExecutionService.execute(executionDto);
            setExecutionResult(result); // Guardar TODO el resultado
            showSuccessToast("Prompt executed successfully!");
        } catch (err: any) {
            console.error("Error executing prompt:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to execute prompt.';
            setError(errorMessage);
            showErrorToast(errorMessage);
        } finally {
            setIsExecuting(false);
        }
    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage, selectedAiModel, variableInputs]);

    // --- Limpiar resultado del prompt formateado (extraer de ```) ---
    const formattedPromptResult = useMemo(() => {
        if (!executionResult || typeof executionResult.result !== 'string') {
            return '';
        }
        let content = executionResult.result;
        // Quitar ```<lang> y ``` si existen
        content = content.replace(/^```[a-zA-Z]*\\n/, ''); // Inicio
        content = content.replace(/\\n```$/, ''); // Final
        return content.trim();
    }, [executionResult]);

    // --- Render ---
    return (
        <div className={`${styles.servePromptContainer} bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen`}>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Serve & Test Prompt</h1>

            {error && (
                <div className={`${styles.errorBanner} bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600`}>
                    Error: {error}
                </div>
            )}

            {/* --- Caja de Comando cURL --- */}
            <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Direct API cURL Command:</label>
                <div className="relative">
                    <pre className="p-3 bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                        {curlCommand}
                    </pre>
                    {isClient && curlCommand && !curlCommand.startsWith('#') && (
                        <CopyButton textToCopy={curlCommand} className="absolute top-2 right-2" />
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Note: Replace <code>YOUR_AUTH_TOKEN</code> with your actual authentication token.
                    The base URL (<code>{typeof window !== 'undefined' ? window.location.origin : ''}</code>) assumes the API is served from the same domain. Adjust if your API is elsewhere.
                </p>
            </div>

            {/* Selectors Grid */}
            <div className={styles.selectorsGrid}>
                {/* Project Selector (si se decide añadirlo o si selectedProjectId no fuera global) */}
                <input id="project-select" type="hidden" value={selectedProjectId || 'No Project Selected'} readOnly disabled className={`${styles.inputDisplay} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`} />

                {/* Prompt Selector (Async) */}
                <div className={styles.selectWrapper}>
                    <label htmlFor="prompt-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">1. Select Prompt:</label>
                    <AsyncSelect
                        id="prompt-select"
                        cacheOptions // Opcional: cachea las opciones cargadas
                        defaultOptions // Opcional: carga un conjunto inicial de opciones
                        loadOptions={loadPromptOptions}
                        value={selectedPrompt}
                        onChange={handlePromptChange}
                        isDisabled={!selectedProjectId} // Se deshabilita si no hay proyecto
                        placeholder={selectedProjectId ? "Type to search prompts..." : "Select a project first"}
                        classNamePrefix="react-select"
                        className="react-select-container dark:react-select-container-dark"
                    // key={selectedProjectId} // Forzar recarga si cambia el proyecto y queremos limpiar caché/defaultOptions
                    />
                </div>

                {/* Version Selector */}
                <div className={styles.selectWrapper}>
                    <label htmlFor="version-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">2. Select Version:</label>
                    <Select
                        id="version-select"
                        options={versionOptions}
                        value={selectedVersion}
                        onChange={handleVersionChange}
                        isLoading={loadingVersions}
                        isDisabled={!selectedPrompt || loadingVersions}
                        placeholder={selectedPrompt ? "Select version..." : "Select prompt first"}
                        classNamePrefix="react-select"
                        className="react-select-container dark:react-select-container-dark"
                    />
                </div>

                {/* Language Selector */}
                <div className={styles.selectWrapper}>
                    <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">3. Select Language:</label>
                    <Select
                        id="language-select"
                        options={languageOptions}
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        isLoading={loadingTranslations}
                        isDisabled={!selectedVersion || loadingTranslations}
                        placeholder={selectedVersion ? "Select language (or base)..." : "Select version first"}
                        classNamePrefix="react-select"
                        className="react-select-container dark:react-select-container-dark"
                    />
                </div>

                {/* AI Model Selector */}
                <div className={styles.selectWrapper}>
                    <label htmlFor="aimodel-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">4. Select AI Model:</label>
                    <Select
                        id="aimodel-select"
                        options={aiModelOptions}
                        value={selectedAiModel}
                        onChange={handleAiModelChange}
                        isLoading={loadingAiModels}
                        isDisabled={loadingAiModels || !selectedProjectId} // Habilitar si hay proyecto
                        placeholder={selectedProjectId ? "Select AI Model..." : "Select a project first"}
                        classNamePrefix="react-select"
                        className="react-select-container dark:react-select-container-dark"
                    />
                </div>
            </div>

            {isClient && selectedPrompt && selectedVersion && (
                <div className={`${styles.detailsResultsContainer} md:grid md:grid-cols-2 md:gap-6`}>
                    <div className={`${styles.promptDetailsSection} bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow`}>
                        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Prompt Details & Variables</h2>

                        <div className="mb-4">
                            <label htmlFor="font-size-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Size:</label>
                            <div className={styles.fontSizeSelectorContainer}>
                                <span className={`${styles.fontSizeSelectorLabel} text-gray-700 dark:text-gray-300`}>Font Size:</span>
                                <div className={styles.fontSizeSelector}>
                                    {fontSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => handleFontSizeChange(size)}
                                            className={`${styles.fontSizeButton} ${selectedFontSize === size ? styles.active : 'dark:bg-gray-600 dark:text-gray-200'}`}
                                        >
                                            {size.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <textarea
                            id="prompt-preview"
                            readOnly
                            value={currentPromptText || "Loading prompt text..."}
                            className={`${styles.promptPreview} ${getFontSizeClass(selectedFontSize)} w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500`}
                            rows={10}
                        />

                        {Object.keys(promptVariables).length > 0 && (
                            <div className={`${styles.variablesSection} mt-4 pt-4 border-t border-gray-300 dark:border-gray-600`}>
                                <h3 className="text-lg font-medium mb-2 text-black dark:text-white">Variables:</h3>
                                {Object.entries(promptVariables).map(([varName, defaultValue]) => (
                                    <div key={varName} className={`${styles.variableInput} mb-3`}>
                                        <label htmlFor={`var-${varName}`} className={`${styles.variableLabel} font-mono font-semibold text-sm text-gray-700 dark:text-gray-300`}>{`{{${varName}}}:`}</label>
                                        <input
                                            type="text"
                                            id={`var-${varName}`}
                                            value={variableInputs[varName] || ''}
                                            onChange={(e) => handleVariableInputChange(varName, e.target.value)}
                                            placeholder={`Enter value for ${varName}${defaultValue ? ` (default: ${defaultValue})` : ''}`}
                                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={handleExecute}
                            disabled={isExecuting || !selectedAiModel || !currentPromptText}
                            className={`${styles.executeButton} mt-6 w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-500`}
                        >
                            {isExecuting ? 'Executing...' : 'Execute Prompt'}
                        </button>
                    </div>

                    <div className={`${styles.resultsSection} bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow`}>
                        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Execution Results</h2>
                        {executionResult && (
                            <div className={`${styles.metadataContainer} text-gray-600 dark:text-gray-400`}>
                                {executionResult.modelUsed && (
                                    <p><span className={`${styles.infoLabel} text-gray-800 dark:text-gray-200`}>Model Used:</span> {executionResult.modelUsed}</p>
                                )}
                                {executionResult.providerUsed && (
                                    <p><span className={`${styles.infoLabel} text-gray-800 dark:text-gray-200`}>Provider Used:</span> {executionResult.providerUsed}</p>
                                )}
                            </div>
                        )}
                        {/* El resultTextarea ya está estilizado para dark mode desde el CSS Module */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServePromptPage; 