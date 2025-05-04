"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProjects } from '@/context/ProjectContext';
import {
    CreatePromptDto,
    CreatePromptVersionDto,
    CreatePromptTranslationDto,
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
import styles from './ServePromptPage.module.css'; // Importar CSS Modules

interface StringMap { [key: string]: string; }

// Reintroducir interfaz para asegurar que tenemos el ID de la BD
// Asumimos que la API devuelve 'id' (CUID) además de los campos de CreatePromptDto
interface PromptData extends CreatePromptDto {
    id: string; // El ID real de la base de datos (e.g., CUID)
}

// Usar CreateAiModelDto directamente si el ID está en el DTO (o añadirlo si no)
// (OpenAPI Generator a veces incluye 'id' en DTOs de respuesta aunque no en los de creación)
// Vamos a asumir que CreateAiModelDto devuelto por findAll SÍ tiene id para el Select
interface SelectOption { value: string; label: string; }

// Define los tamaños posibles
type FontSize = 's' | 'm' | 'l' | 'xl';
const fontSizes: FontSize[] = ['s', 'm', 'l', 'xl'];

const ServePromptPage: React.FC = () => {
    const { selectedProjectId } = useProjects();

    // --- Estados para Selecciones (usar PromptData) ---
    const [prompts, setPrompts] = useState<PromptData[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<SingleValue<SelectOption>>(null);
    const [versions, setVersions] = useState<CreatePromptVersionDto[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<SingleValue<SelectOption>>(null);
    const [translations, setTranslations] = useState<CreatePromptTranslationDto[]>([]);
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

    // --- Estado para Tamaño de Fuente ---
    const [selectedFontSize, setSelectedFontSize] = useState<FontSize>('m'); // Default 'm'

    // --- Estados UI/Generales ---
    const [loadingPrompts, setLoadingPrompts] = useState<boolean>(false);
    const [loadingVersions, setLoadingVersions] = useState<boolean>(false);
    const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<boolean>(false);
    const [loadingAiModels, setLoadingAiModels] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- Efecto para cargar/guardar tamaño de fuente desde localStorage ---
    useEffect(() => {
        const storedSize = localStorage.getItem('promptFontSize') as FontSize | null;
        if (storedSize && fontSizes.includes(storedSize)) {
            setSelectedFontSize(storedSize);
        }
    }, []); // Solo al montar

    useEffect(() => {
        localStorage.setItem('promptFontSize', selectedFontSize);
    }, [selectedFontSize]); // Cada vez que cambie

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
                // Usar PromptData[] y asegurar que data tiene 'id'
                // Puede ser necesario ajustar el cast si la API no devuelve 'id' explícitamente
                setPrompts(Array.isArray(data) ? (data as PromptData[]) : []);
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
        <div className={styles.servePromptContainer}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* --- INICIO: Selector de Tamaño de Fuente --- */}
            <div className={styles.fontSizeSelectorContainer}>
                <span className={styles.fontSizeSelectorLabel}>Font Size:</span>
                <div className={styles.fontSizeSelector}>
                    {fontSizes.map(size => (
                        <button
                            key={size}
                            onClick={() => handleFontSizeChange(size)}
                            className={`${styles.fontSizeButton} ${selectedFontSize === size ? styles.active : ''}`}
                        >
                            {size.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            {/* --- FIN: Selector de Tamaño de Fuente --- */}

            <div className={styles.selectorsGrid}>
                {/* Selector Proyecto (asumiendo que viene del contexto) */}
                <input id="project-select" type="hidden" value={selectedProjectId || 'No Project Selected'} readOnly disabled className={styles.inputDisplay} />

                {/* Selector Prompt */}
                <div>
                    <label htmlFor="prompt-select">Prompt</label>
                    <div className={styles.selectWrapper}>
                        <Select
                            id="prompt-select"
                            options={promptOptions}
                            value={selectedPrompt}
                            onChange={handlePromptChange}
                            isLoading={loadingPrompts}
                            isDisabled={!selectedProjectId || loadingPrompts}
                            placeholder="Select a prompt..."
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                {/* Selector Versión */}
                <div>
                    <label htmlFor="version-select">Version</label>
                    <div className={styles.selectWrapper}>
                        <Select
                            id="version-select"
                            options={versionOptions}
                            value={selectedVersion}
                            onChange={handleVersionChange}
                            isLoading={loadingVersions}
                            isDisabled={!selectedPrompt || loadingVersions}
                            placeholder="Select a version..."
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                {/* Selector Idioma */}
                <div>
                    <label htmlFor="language-select">Language / Text</label>
                    <div className={styles.selectWrapper}>
                        <Select
                            id="language-select"
                            options={languageOptions}
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            isLoading={loadingTranslations}
                            isDisabled={!selectedVersion || loadingTranslations}
                            placeholder="Select language or Base Text..."
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                {/* Selector AI Model */}
                <div>
                    <label htmlFor="ai-model-select">AI Model</label>
                    <div className={styles.selectWrapper}>
                        <Select
                            id="ai-model-select"
                            options={aiModelOptions}
                            value={selectedAiModel}
                            onChange={handleAiModelChange}
                            isLoading={loadingAiModels}
                            isDisabled={!selectedProjectId || loadingAiModels} // Depende de proyecto
                            placeholder="Select an AI Model..."
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>
            </div>

            {/* ---- INICIO: Nuevo Contenedor para Detalles y Resultados ---- */}
            <div className={styles.detailsResultsContainer}>
                {/* Sección de Texto del Prompt y Variables */}
                {loadingText && <div className={styles.loadingIndicator}>Loading prompt text...</div>}
                {currentPromptText && !loadingText && (
                    <div className={styles.promptDetailsSection}>
                        <h2>Prompt Text & Variables</h2>
                        <textarea
                            // Añadir clase de tamaño dinámicamente
                            className={`${styles.promptPreview} ${getFontSizeClass(selectedFontSize)}`}
                            value={currentPromptText}
                            // Quitar readOnly para permitir edición
                            onChange={(e) => setCurrentPromptText(e.target.value)}
                            rows={30}
                        />

                        {Object.keys(promptVariables).length > 0 && (
                            <div className={styles.variablesSection}>
                                <h3>Variables</h3>
                                {Object.keys(promptVariables).map(varName => (
                                    <div key={varName} className={styles.variableInput}>
                                        <label htmlFor={`var-${varName}`}>{`{{${varName}}}`}</label>
                                        <input
                                            type="text"
                                            id={`var-${varName}`}
                                            value={variableInputs[varName] || ''}
                                            onChange={(e) => handleVariableInputChange(varName, e.target.value)}
                                            placeholder={`Enter value for ${varName}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Sección de Resultados */}
                {isExecuting && <div className={styles.loadingIndicator}>Executing... Please wait.</div>}
                {executionResult && !isExecuting && (
                    <div className={styles.resultsSection}>
                        <h2>Execution Result</h2>
                        <div className={styles.metadataContainer}>
                            {executionResult.modelUsed && (
                                <p><span className={styles.infoLabel}>Model Used:</span> {executionResult.modelUsed}</p>
                            )}
                            {executionResult.providerUsed && (
                                <p><span className={styles.infoLabel}>Provider Used:</span> {executionResult.providerUsed}</p>
                            )}
                        </div>
                        <textarea
                            // Añadir clase de tamaño dinámicamente
                            className={`${styles.resultTextarea} ${getFontSizeClass(selectedFontSize)}`}
                            value={formattedPromptResult} // Usar el valor formateado
                            readOnly
                            rows={25} // Aumentar filas por defecto
                        />
                    </div>
                )}
            </div>
            {/* ---- FIN: Nuevo Contenedor ---- */}

            {/* Botón de Ejecución */}
            <button
                onClick={handleExecute}
                disabled={isExecuting || !selectedProjectId || !selectedPrompt || !selectedVersion || !selectedLanguage || !selectedAiModel || loadingText}
                className={styles.executeButton}
            >
                {isExecuting ? 'Executing...' : 'Execute Prompt'}
            </button>
        </div>
    );
};

export default ServePromptPage; 