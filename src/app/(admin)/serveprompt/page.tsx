"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { useSearchParams } from 'next/navigation';
import {
    CreatePromptDto,
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
import axiosInstance from '@/services/axiosInstance'; // <-- Importar la instancia correcta
import axios from 'axios'; // Importar axios para la comprobación de errores
import styles from './ServePromptPage.module.css'; // Importar CSS Modules
import CopyButton from '@/components/common/CopyButton'; // Importar CopyButton
import Breadcrumb from '@/components/common/PageBreadCrumb'; // Asegurar que la importación esté presente
import ContextInfoBanner from '@/components/common/ContextInfoBanner'; // <-- Importar el nuevo componente

interface StringMap { [key: string]: string; }

// Restaurar SelectOption
interface SelectOption { value: string; label: string; }

// Define los tamaños posibles
type FontSize = 's' | 'm' | 'l' | 'xl';
const fontSizes: FontSize[] = ['s', 'm', 'l', 'xl'];

// Interface for the expected structure of LLM execution results
interface LlmExecutionResponse {
    result: string;
    modelUsed?: string;
    providerUsed?: string;
    assets?: any[]; // Propiedad para los assets
    // Add other potential properties if known
}

// Interface to represent version data as expected for select options
// CreatePromptVersionDto might not have id/versionTag if it's strictly for creation payloads.
// Data fetched from API for listing versions usually includes these.
interface PromptVersionForSelect extends CreatePromptVersionDto {
    id?: string; // Often present in fetched data
    versionTag: string; // Should be present and non-optional for selection logic based on current code
}

// Tipo personalizado para un prompt existente con id
type PromptWithId = CreatePromptDto & { id: string };

// Constantes para los mensajes placeholder
const CURL_PLACEHOLDER_MSG = '# Select a project, prompt, and version to see the commands.';
const BASH_PLACEHOLDER_MSG = '# Select a project, prompt, and version to generate the example script.\n# Ensure jq is installed (e.g., sudo apt install jq) for token extraction.';

const ServePromptPage: React.FC = () => {
    const { selectedProjectId, selectedProjectFull } = useProjects();
    const [isClient, setIsClient] = useState(false); // Estado para saber si estamos en cliente
    const searchParams = useSearchParams();

    // --- Estados para Selecciones (usar PromptDto) ---
    const [selectedPrompt, setSelectedPrompt] = useState<SingleValue<SelectOption>>(null);
    const [versions, setVersions] = useState<PromptVersionForSelect[]>([]); // Use extended type
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
    const [executionResult, setExecutionResult] = useState<LlmExecutionResponse | null>(null); // Use defined interface
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    // --- Estado para Tamaño de Fuente ---
    const [selectedFontSize, setSelectedFontSize] = useState<FontSize>('m'); // Default 'm'
    const [isProcessed, setIsProcessed] = useState<boolean>(false); // Nuevo estado para el checkbox
    const [includeAssets, setIncludeAssets] = useState<boolean>(false); // Nuevo estado para incluir assets

    // --- Estados UI/Generales ---
    const [loadingVersions, setLoadingVersions] = useState<boolean>(false);
    const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);
    const [loadingAiModels, setLoadingAiModels] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- Nuevo Estado para el Comando cURL ---
    const [curlCommand, setCurlCommand] = useState<string>('');
    const [displayedCurlBaseUrl, setDisplayedCurlBaseUrl] = useState<string>(''); // Estado para la URL base del cURL
    const [bashScriptExample, setBashScriptExample] = useState<string>(''); // Estado para el script de Bash de ejemplo
    const [activeCommandTab, setActiveCommandTab] = useState<'curl' | 'bash'>('curl'); // Estado para la pestaña activa

    // Definición de breadcrumbs
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Serve Prompt" }
    ];

    // --- Efecto para detectar montaje en cliente ---
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- Información contextual para mostrar ---
    const projectNameForDisplay = useMemo(() => {
        return selectedProjectFull?.name || null;
    }, [selectedProjectFull]);

    const promptNameForDisplay = useMemo(() => {
        if (!selectedPrompt?.label) return null;
        // El label es como "[TIPO]: Nombre Prompt"
        const labelParts = selectedPrompt.label.split(': ');
        if (labelParts.length > 1) {
            return labelParts.slice(1).join(': ').trim();
        }
        return selectedPrompt.label; // Fallback
    }, [selectedPrompt]);

    const versionForDisplay = useMemo(() => {
        return selectedVersion?.label || null;
    }, [selectedVersion]);

    // --- Efecto para preseleccionar el prompt desde la URL ---
    useEffect(() => {
        console.log('[ServePromptPage] Preselection effect triggered. isClient:', isClient, 'selectedProjectId:', selectedProjectId, 'hasSearchParams:', !!searchParams);

        if (!isClient || !searchParams || !selectedProjectId) {
            console.log('[ServePromptPage] Preselection effect: Aborting, pre-conditions not met.');
            return;
        }

        const promptIdFromQuery = searchParams.get('promptId');
        console.log('[ServePromptPage] promptIdFromQuery:', promptIdFromQuery);
        console.log('[ServePromptPage] current selectedPrompt state:', selectedPrompt);

        if (promptIdFromQuery && !selectedPrompt) {
            console.log(`[ServePromptPage] Conditions met: Attempting to fetch prompt with ID: ${promptIdFromQuery} for project: ${selectedProjectId}`);

            // Cargar los datos del prompt específico para tener el 'label' (nombre)
            // Asumimos que promptService.findOne(projectId, promptId) existe y devuelve { id, name, ... }
            // Si findOne no existe o tiene otra firma, esto necesitará ajuste.
            // Por ahora, vamos a simular la carga o asumir que necesitamos obtener el nombre de alguna forma.
            // Lo ideal sería una llamada como:
            promptService.findOne(selectedProjectId, promptIdFromQuery)
                .then((promptData: PromptWithId) => {
                    console.log('[ServePromptPage] Fetched promptData:', promptData);
                    if (promptData && promptData.id && promptData.name) {
                        const newSelectedPrompt = { value: promptData.id, label: promptData.name };
                        console.log('[ServePromptPage] Setting selectedPrompt to:', newSelectedPrompt);
                        setSelectedPrompt(newSelectedPrompt);
                        // No necesitas llamar a loadPromptOptions aquí directamente,
                        // AsyncSelect se encargará de cargar más opciones si el usuario interactúa.
                    } else {
                        console.warn(`[ServePromptPage] Prompt with ID ${promptIdFromQuery} not found or data incomplete. promptData:`, promptData);
                        // No hacer nada si el prompt no se encuentra, el usuario puede seleccionar manualmente.
                    }
                })
                .catch(err => {
                    console.error(`[ServePromptPage] Error fetching prompt by ID ${promptIdFromQuery}:`, err);
                    // showErrorToast(`Failed to load prompt: ${promptIdFromQuery}`);
                    // No hacer nada si falla, el usuario puede seleccionar manualmente.
                });
        } else {
            console.log('[ServePromptPage] Conditions NOT met for fetching. promptIdFromQuery:', promptIdFromQuery, 'selectedPrompt:', selectedPrompt);
        }
    }, [isClient, searchParams, selectedProjectId, selectedPrompt, setSelectedPrompt]);

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
    const versionOptions: SelectOption[] = useMemo(() => [
        { value: 'latest', label: 'Latest Version' },
        ...versions.map(v => ({
            value: v.versionTag || v.id || String(Date.now() + Math.random()), // Prioritize versionTag, then id, then fallback
            label: v.versionTag || v.id || 'Unknown Version'
        }))
    ], [versions]);
    const languageOptions: SelectOption[] = useMemo(() => [
        { value: '__BASE__', label: 'Base Text' }, // Opción para usar el texto base
        ...translations.map(t => ({ value: t.languageCode, label: t.languageCode }))
    ], [translations]);
    const aiModelOptions: SelectOption[] = useMemo(() => aiModels.map(m => ({ value: m.id, label: m.name })), [aiModels]);

    // --- Función para extraer variables del texto ---
    const extractVariables = (text: string): string[] => {
        const regex = /{{\s*([\w-]+)\s*}}/g;
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
            const fetchedPrompts = await promptService.findAll(selectedProjectId);
            let options: PromptWithId[] = [];
            if (Array.isArray(fetchedPrompts)) {
                options = fetchedPrompts as PromptWithId[];
            }

            // Filtrar opciones basadas en inputValue si es necesario (filtrado del lado del cliente)
            const filteredOptions = options.filter(option =>
                option.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            return filteredOptions.map(p => {
                // Extraer el tipo del ID (asumiendo que el ID tiene un formato como "type-name")
                const typeMatch = p.id.match(/^([^-]+)-/);
                const type = typeMatch ? typeMatch[1].toUpperCase() : 'PROMPT';

                return {
                    value: p.id,
                    label: `[${type}]: ${p.name}`
                };
            });

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
                setVersions(Array.isArray(data) ? (data as PromptVersionForSelect[]) : []);
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
                if ((axios as any).isAxiosError && (axios as any).isAxiosError(err) && (err as any).response?.status === 404) {
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

        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value) {
            return;
        }

        // Si la versión seleccionada es "latest", usar la versión más reciente
        const versionToUse = selectedVersion.value === 'latest' ? 'latest' : selectedVersion.value;

        let fetchPromise: Promise<CreatePromptVersionDto | CreatePromptTranslationDto | null | undefined>;

        if (!selectedLanguage || selectedLanguage.value === '__BASE__') {
            // Cargar el texto base de la versión
            fetchPromise = promptVersionService.findOne(selectedProjectId, selectedPrompt.value, versionToUse, isProcessed);
        } else {
            // Cargar la traducción seleccionada
            fetchPromise = promptTranslationService.findByLanguage(
                selectedProjectId,
                selectedPrompt.value,
                versionToUse,
                selectedLanguage.value,
                isProcessed
            );
        }

        fetchPromise
            .then((data: CreatePromptVersionDto | CreatePromptTranslationDto | null | undefined) => {
                if (data) {
                    const text = data.promptText || '';
                    setCurrentPromptText(text);
                    const vars = extractVariables(text);
                    const initialVarInputs: StringMap = {};
                    vars.forEach(v => { initialVarInputs[v] = ''; });
                    setPromptVariables(initialVarInputs);
                    setVariableInputs(initialVarInputs);
                } else {
                    setCurrentPromptText('');
                    setPromptVariables({});
                    setVariableInputs({});
                }
            })
            .catch((err: Error) => {
                console.error("Error fetching prompt text:", err);
                setError('Failed to fetch prompt text.');
                showErrorToast('Failed to fetch prompt text.');
                setCurrentPromptText('');
                setPromptVariables({});
                setVariableInputs({});
            });

    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage, isProcessed]);

    // --- Efecto para generar el comando cURL y el script Bash ---
    useEffect(() => {
        const defaultApiUrl = 'http://localhost:3000';
        const currentApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || defaultApiUrl).replace(/\/+$/, '');
        setDisplayedCurlBaseUrl(currentApiBaseUrl);

        if (!selectedProjectId || !selectedPrompt?.value || !selectedPrompt?.label || !selectedVersion?.value) {
            setCurlCommand(CURL_PLACEHOLDER_MSG);
            setBashScriptExample(BASH_PLACEHOLDER_MSG);
            return;
        }

        const projectId = selectedProjectId;
        const promptName = selectedPrompt.value;
        const versionTag = selectedVersion.value === 'latest' ? 'latest' : selectedVersion.value;

        let promptApiPath;
        if (selectedLanguage?.value && selectedLanguage.value !== '__BASE__') {
            const languageCode = selectedLanguage.value;
            promptApiPath = `/api/serve-prompt/execute/${encodeURIComponent(projectId)}/${encodeURIComponent(promptName)}/${encodeURIComponent(versionTag)}/lang/${encodeURIComponent(languageCode)}`;
        } else {
            promptApiPath = `/api/serve-prompt/execute/${encodeURIComponent(projectId)}/${encodeURIComponent(promptName)}/${encodeURIComponent(versionTag)}/base`;
        }

        const queryParams = new URLSearchParams();
        if (includeAssets) {
            queryParams.append('includeAssets', 'true');
        }
        if (isProcessed) {
            queryParams.append('processed', 'true');
        }
        const queryString = queryParams.toString();
        const fullPromptApiUrl = `${currentApiBaseUrl}${promptApiPath}${queryString ? `?${queryString}` : ''}`;

        const bodyPayload: { variables?: StringMap } = {};

        // Solo añadir 'variables' si el objeto no está vacío
        const activeVariables = Object.entries(variableInputs)
            .filter(([, val]) => val.trim() !== '')
            .reduce((obj, [key, val]) => { obj[key] = val; return obj; }, {} as StringMap);

        if (Object.keys(activeVariables).length > 0) {
            bodyPayload.variables = activeVariables;
        }

        // 1. Generar el comando cURL simple
        let CurlCommand = `curl -X POST "${fullPromptApiUrl}" \\
     -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\
     -H "x-api-key: YOUR_API_KEY" \\
     -H "Content-Type: application/json"`;

        if (Object.keys(bodyPayload).length > 0) {
            CurlCommand += ` \\
     -d '${JSON.stringify(bodyPayload, null, 2)}'`;
        }

        CurlCommand += `\n\n--------------------------`;
        CurlCommand += `\nChoose one of Authorization: Bearer or x-api-key`;

        let curlNote = `\n`;
        if (includeAssets) {
            curlNote += `\n# The 'includeAssets=true' parameter is added to fetch associated assets.`;
        }
        if (isProcessed) {
            curlNote += `\n# The 'processed=true' parameter ensures the final prompt text is returned.`;
        }
        CurlCommand += curlNote;
        setCurlCommand(CurlCommand);

        // 2. Generar el script Bash de ejemplo
        const loginEndpointExample = `${currentApiBaseUrl}/api/auth/login`;
        const jqTokenPathExample = ".access_token";

        let servePromptCurlInScript = `curl -s -X POST "${fullPromptApiUrl}" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json"`;

        // Asegurar que el cuerpo del script también incluye 'processed' si es necesario
        const scriptBodyPayload: { variables?: StringMap } = {};
        if (bodyPayload.variables && Object.keys(bodyPayload.variables).length > 0) {
            scriptBodyPayload.variables = bodyPayload.variables;
        }

        // Siempre añadir -d si hay variables
        if (Object.keys(scriptBodyPayload).length > 0) {
            servePromptCurlInScript += ` \\
  -d '${JSON.stringify(scriptBodyPayload, null, 2)}'`;
        }

        const fullBashScript = `#!/bin/bash

# Example script to: 
# 1. Authenticate to an API and get an access token.
# 2. Use the token to call the prompt serving API.

# --- Configuration (USER MUST MODIFY THESE) --- 
LOGIN_ENDPOINT_URL="${loginEndpointExample}" # VERIFY: Your API's login endpoint
USERNAME="YOUR_USERNAME_OR_EMAIL"          # VERIFY: Your username
PASSWORD="***"                            # VERIFY: Your password (consider env vars or prompt for security)
JQ_TOKEN_PATH="${jqTokenPathExample}"

# Ensure jq is installed: (e.g., sudo apt install jq / brew install jq)
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, please install it." 
    exit 1
fi

echo "Step 1: Authenticating to $LOGIN_ENDPOINT_URL..."
# Construct JSON payload safely for login
JSON_LOGIN_PAYLOAD=$(printf '{"email":"%s","password":"%s"}' "$USERNAME" "$PASSWORD")

echo "Using login payload: $JSON_LOGIN_PAYLOAD" # Imprimir el payload para depuración

AUTH_RESPONSE=$(curl -s -X POST "$LOGIN_ENDPOINT_URL" \
  -H "Content-Type: application/json" \
  -d "$JSON_LOGIN_PAYLOAD")

TOKEN=$(echo "$AUTH_RESPONSE" | jq -r "$JQ_TOKEN_PATH")

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Error: Authentication failed or token not found."
  echo "Login URL: $LOGIN_ENDPOINT_URL"
  echo "Response: $AUTH_RESPONSE"
  echo "Please check your credentials, LOGIN_ENDPOINT_URL, and JQ_TOKEN_PATH."
  exit 1
fi
echo "Authentication successful. Token obtained."

echo "Step 2: Calling the Prompt Serving API..."
API_RESPONSE=$( ${servePromptCurlInScript} )

echo "API Call Complete."
echo "Response:"
if echo "$API_RESPONSE" | jq . &> /dev/null; then
    echo "$API_RESPONSE" | jq .
else
    echo "Warning: API response is not valid JSON or jq failed. Displaying raw response:"
    echo "$API_RESPONSE"
fi

`;
        setBashScriptExample(fullBashScript);

    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage, variableInputs, displayedCurlBaseUrl, includeAssets, isProcessed]);

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
        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value || !selectedLanguage?.value) {
            showErrorToast("Please select project, prompt, version, and language.");
            return;
        }

        setIsExecuting(true);
        setError(null);
        setExecutionResult(null);

        // Construir la URL y el cuerpo de la petición correctamente
        const currentApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
        const versionToUse = selectedVersion.value === 'latest' ? 'latest' : selectedVersion.value;

        let promptApiPath;
        if (selectedLanguage.value && selectedLanguage.value !== '__BASE__') {
            promptApiPath = `/api/serve-prompt/execute/${encodeURIComponent(selectedProjectId)}/${encodeURIComponent(selectedPrompt.value)}/${encodeURIComponent(versionToUse)}/lang/${encodeURIComponent(selectedLanguage.value)}`;
        } else {
            promptApiPath = `/api/serve-prompt/execute/${encodeURIComponent(selectedProjectId)}/${encodeURIComponent(selectedPrompt.value)}/${encodeURIComponent(versionToUse)}/base`;
        }

        const queryParams = new URLSearchParams();
        if (includeAssets) {
            queryParams.append('includeAssets', 'true');
        }
        if (isProcessed) {
            queryParams.append('processed', 'true');
        }

        const queryString = queryParams.toString();
        const fullPromptApiUrl = `${currentApiBaseUrl}${promptApiPath}${queryString ? `?${queryString}` : ''}`;

        const bodyPayload: { variables?: StringMap } = {};

        // Solo añadir 'variables' si el objeto no está vacío
        const activeVariables = Object.entries(variableInputs)
            .filter(([, val]) => val.trim() !== '')
            .reduce((obj, [key, val]) => { obj[key] = val; return obj; }, {} as StringMap);

        if (Object.keys(activeVariables).length > 0) {
            bodyPayload.variables = activeVariables;
        }

        try {
            // Usar axiosInstance para asegurar que la autenticación se incluye
            const response = await axiosInstance.post(fullPromptApiUrl, bodyPayload.variables ? bodyPayload : undefined, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log("--> [Debug] API Response from Execute button:", response.data); // Log para depurar

            // Manejo de respuesta flexible
            if (typeof response.data === 'object' && response.data !== null) {
                const responseData = response.data as any;
                // Dar prioridad a 'processedPrompt'
                const resultText = responseData.processedPrompt || responseData.result || responseData.completion || responseData.text || JSON.stringify(responseData);

                const finalResult: LlmExecutionResponse = {
                    ...responseData,
                    result: resultText,
                };
                setExecutionResult(finalResult);

            } else if (typeof response.data === 'string') {
                setExecutionResult({ result: response.data });
            } else {
                setExecutionResult({ result: "Received an unexpected response format." });
            }

            showSuccessToast("Prompt preprocessed successfully!");
        } catch (err: unknown) {
            console.error("--- PROMPT EXECUTION ERROR ---", err);
            let finalErrorMessage = 'Failed to preprocess prompt. Check console for details.';

            if ((axios as any).isAxiosError && (axios as any).isAxiosError(err)) {
                console.log("--> [Debug] Error is an AxiosError.");
                if ((err as any).response) {
                    console.log("--> [Debug] Error has a response object:", (err as any).response);
                    const responseData = (err as any).response.data;
                    if (responseData) {
                        console.log("--> [Debug] Error response has data:", responseData);
                        const serverMessage = responseData.message;
                        console.log("--> [Debug] Server message:", serverMessage);
                        if (Array.isArray(serverMessage) && serverMessage.length > 0) {
                            finalErrorMessage = serverMessage.join('; ');
                            console.log("--> [Debug] Extracted error from array:", finalErrorMessage);
                        } else if (serverMessage) {
                            finalErrorMessage = String(serverMessage);
                            console.log("--> [Debug] Extracted error from string/other:", finalErrorMessage);
                        } else {
                            console.log("--> [Debug] No 'message' property found in response data. Stringifying.");
                            finalErrorMessage = JSON.stringify(responseData);
                        }
                    } else {
                        console.log("--> [Debug] Error response has no data.");
                    }
                } else {
                    console.log("--> [Debug] Error has no response object.");
                }
            } else if (err instanceof Error) {
                console.log("--> [Debug] Error is a standard Error instance.");
                finalErrorMessage = err.message;
            }

            console.log("--> [Debug] Final error message to be displayed:", finalErrorMessage);
            setError(finalErrorMessage);
            showErrorToast(finalErrorMessage);
        } finally {
            setIsExecuting(false);
        }
    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage, variableInputs, includeAssets, isProcessed]);

    // --- Handler para Ejecución con LLM ---
    const handleExecuteWithLLM = useCallback(async () => {
        if (!selectedProjectId || !selectedPrompt?.value || !selectedVersion?.value || !selectedLanguage?.value) {
            showErrorToast("Please select project, prompt, version, and language.");
            return;
        }

        setIsExecuting(true);
        setError(null);
        setExecutionResult(null);

        // Construir la URL y el cuerpo de la petición para LLM execution
        const currentApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
        const versionToUse = selectedVersion.value === 'latest' ? 'latest' : selectedVersion.value;

        let promptApiPath;
        if (selectedLanguage.value && selectedLanguage.value !== '__BASE__') {
            promptApiPath = `/api/serve-prompt/execute/${encodeURIComponent(selectedProjectId)}/${encodeURIComponent(selectedPrompt.value)}/${encodeURIComponent(versionToUse)}/lang/${encodeURIComponent(selectedLanguage.value)}`;
        } else {
            promptApiPath = `/api/serve-prompt/execute/${encodeURIComponent(selectedProjectId)}/${encodeURIComponent(selectedPrompt.value)}/${encodeURIComponent(versionToUse)}/base`;
        }

        const queryParams = new URLSearchParams();
        if (includeAssets) {
            queryParams.append('includeAssets', 'true');
        }
        if (isProcessed) {
            queryParams.append('processed', 'true');
        }

        const queryString = queryParams.toString();
        const fullPromptApiUrl = `${currentApiBaseUrl}${promptApiPath}${queryString ? `?${queryString}` : ''}`;

        const bodyPayload: { variables?: StringMap } = {};

        // Solo añadir 'variables' si el objeto no está vacío
        const activeVariables = Object.entries(variableInputs)
            .filter(([, val]) => val.trim() !== '')
            .reduce((obj, [key, val]) => { obj[key] = val; return obj; }, {} as StringMap);

        if (Object.keys(activeVariables).length > 0) {
            bodyPayload.variables = activeVariables;
        }

        try {
            // Primero obtener el prompt procesado
            const preprocessResponse = await axiosInstance.post(fullPromptApiUrl, bodyPayload.variables ? bodyPayload : undefined, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let processedPromptText = '';
            if (typeof preprocessResponse.data === 'object' && preprocessResponse.data !== null) {
                const responseData = preprocessResponse.data as any;
                processedPromptText = responseData.processedPrompt || responseData.result || responseData.completion || responseData.text || JSON.stringify(responseData);
            } else if (typeof preprocessResponse.data === 'string') {
                processedPromptText = preprocessResponse.data;
            } else {
                throw new Error("Failed to get processed prompt text");
            }

            // Ahora ejecutar con LLM
            const llmExecutionPayload = {
                modelId: selectedAiModel?.value || '',
                promptText: processedPromptText,
                // Opcionalmente, también puedes incluir:
                // projectId: selectedProjectId,
                // promptId: selectedPrompt?.value,
                // versionTag: selectedVersion?.value,
                // languageCode: selectedLanguage?.value,
                // variables: activeVariables
            };

            const llmResponse = await axiosInstance.post(`${currentApiBaseUrl}/api/llm-execution/execute`, llmExecutionPayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log("--> [Debug] LLM API Response:", llmResponse.data);

            // Manejo de respuesta del LLM
            if (typeof llmResponse.data === 'object' && llmResponse.data !== null) {
                const responseData = llmResponse.data as any;
                const resultText = responseData.response || responseData.result || responseData.completion || responseData.text || JSON.stringify(responseData);

                const finalResult: LlmExecutionResponse = {
                    ...responseData,
                    result: resultText,
                };
                setExecutionResult(finalResult);

            } else if (typeof llmResponse.data === 'string') {
                setExecutionResult({ result: llmResponse.data });
            } else {
                setExecutionResult({ result: "Received an unexpected response format from LLM." });
            }

            showSuccessToast("Prompt executed with LLM successfully!");
        } catch (err: unknown) {
            console.error("--- LLM EXECUTION ERROR ---", err);
            let finalErrorMessage = 'Failed to execute prompt with LLM. Check console for details.';

            if ((axios as any).isAxiosError && (axios as any).isAxiosError(err)) {
                console.log("--> [Debug] Error is an AxiosError.");
                if ((err as any).response) {
                    console.log("--> [Debug] Error has a response object:", (err as any).response);
                    const responseData = (err as any).response.data;
                    if (responseData) {
                        console.log("--> [Debug] Error response has data:", responseData);
                        const serverMessage = responseData.message;
                        console.log("--> [Debug] Server message:", serverMessage);
                        if (Array.isArray(serverMessage) && serverMessage.length > 0) {
                            finalErrorMessage = serverMessage.join('; ');
                            console.log("--> [Debug] Extracted error from array:", finalErrorMessage);
                        } else if (serverMessage) {
                            finalErrorMessage = String(serverMessage);
                            console.log("--> [Debug] Extracted error from string/other:", finalErrorMessage);
                        } else {
                            console.log("--> [Debug] No 'message' property found in response data. Stringifying.");
                            finalErrorMessage = JSON.stringify(responseData);
                        }
                    } else {
                        console.log("--> [Debug] Error response has no data.");
                    }
                } else {
                    console.log("--> [Debug] Error has no response object.");
                }
            } else if (err instanceof Error) {
                console.log("--> [Debug] Error is a standard Error instance.");
                finalErrorMessage = err.message;
            }

            console.log("--> [Debug] Final error message to be displayed:", finalErrorMessage);
            setError(finalErrorMessage);
            showErrorToast(finalErrorMessage);
        } finally {
            setIsExecuting(false);
        }
    }, [selectedProjectId, selectedPrompt, selectedVersion, selectedLanguage, selectedAiModel, variableInputs, includeAssets, isProcessed]);

    // --- Placeholder para API Token (debe ser gestionado de forma segura) ---
    const API_TOKEN_PLACEHOLDER = 'YOUR_AUTH_TOKEN'; // Mover a .env o configuración

    // --- Efecto para resetear selecciones cuando cambia el proyecto global ---
    useEffect(() => {
        if (!isClient) return; // Asegurar que esto solo se ejecute después del montaje inicial y cuando selectedProjectId realmente cambie
        console.log('[ServePromptPage] selectedProjectId from context changed to:', selectedProjectId, '- Resetting dependent states.');

        setSelectedPrompt(null);
        setVersions([]);
        setSelectedVersion(null);
        setTranslations([]);
        setSelectedLanguage(null);
        setCurrentPromptText('');
        setPromptVariables({});
        setVariableInputs({});
        setExecutionResult(null);
        setCurlCommand(CURL_PLACEHOLDER_MSG);
        setBashScriptExample(BASH_PLACEHOLDER_MSG);
        setError(null);

    }, [selectedProjectId, isClient]);

    // --- Render ---
    return (
        <>
            <style jsx global>{`
                .react-select__control {
                    min-height: 38px; /* Altura mínima por defecto */
                    height: auto; /* Altura automática para acomodar contenido */
                }
                .react-select__menu {
                    min-width: 100%;
                    width: auto; /* El menú se ajusta al contenido */
                }
                .react-select__option, .react-select__single-value {
                    white-space: normal; /* Permite que el texto se divida en varias líneas */
                    word-wrap: break-word; /* Para navegadores más antiguos */
                    overflow-wrap: break-word; /* Estándar actual */
                    max-width: 100%; /* Asegura que no se desborde del contenedor */
                }
            `}</style>
            <Breadcrumb crumbs={breadcrumbs} />

            {/* --- Bloque de Información del Prompt y Proyecto --- */}
            <ContextInfoBanner
                projectName={projectNameForDisplay}
                promptName={promptNameForDisplay}
                versionName={versionForDisplay}
                isLoading={!isClient} // No mostrar si aún no está montado en cliente o faltan datos
            />

            <div className={`${styles.servePromptContainer} bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen`}>
                {error && (
                    <div className={`${styles.errorBanner} bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600`}>
                        Error: {error}
                    </div>
                )}

                {/* --- Caja de Comandos con Pestañas --- */}
                <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                    {/* Contenedor de Pestañas */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600 mb-4">
                        <button
                            onClick={() => setActiveCommandTab('curl')}
                            className={`px-4 py-2 -mb-px font-medium text-sm rounded-t-lg
                                        ${activeCommandTab === 'curl'
                                    ? 'border-gray-300 dark:border-gray-600 border-l border-t border-r text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                        focus:outline-none transition-colors duration-150 ease-in-out`}
                        >
                            Direct API cURL
                        </button>
                        <button
                            onClick={() => setActiveCommandTab('bash')}
                            className={`px-4 py-2 -mb-px font-medium text-sm rounded-t-lg
                                        ${activeCommandTab === 'bash'
                                    ? 'border-gray-300 dark:border-gray-600 border-l border-t border-r text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                        focus:outline-none transition-colors duration-150 ease-in-out`}
                        >
                            Bash Script Example
                        </button>
                    </div>

                    {/* Contenido de la Pestaña Activa */}
                    {activeCommandTab === 'curl' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Direct API cURL Command (Single Call)</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                This command calls the prompt serving API directly. You will need to replace <code>YOUR_AUTH_TOKEN</code> with a valid token.
                            </p>
                            {isClient && curlCommand && curlCommand !== CURL_PLACEHOLDER_MSG && (
                                <div className="mb-2 flex items-center space-x-2">
                                    <CopyButton textToCopy={curlCommand} />
                                </div>
                            )}
                            <div className="relative">
                                <pre id="curl-command-display" className="p-3 bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                                    {curlCommand}
                                </pre>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                The API base URL for this command is <code>{displayedCurlBaseUrl}</code>.
                            </p>
                        </div>
                    )}

                    {activeCommandTab === 'bash' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Example Bash Script (Login &amp; API Call)</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                This script demonstrates a common pattern: first, authenticate to get a token, then use that token to make the API call to serve the prompt.
                                You will need <code>jq</code> installed to parse the JSON response for the token (e.g., <code>sudo apt install jq</code> or <code>brew install jq</code>).
                            </p>
                            {isClient && bashScriptExample && bashScriptExample !== BASH_PLACEHOLDER_MSG && (
                                <div className="mb-2 flex items-center space-x-2">
                                    <CopyButton textToCopy={bashScriptExample} />
                                </div>
                            )}
                            <div className="relative">

                                <pre className="p-3 bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                                    {bashScriptExample}
                                </pre>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <strong>Important:</strong> This is an example. You MUST adjust the configuration variables at the top of the script (<code>LOGIN_ENDPOINT_URL</code>, <code>USERNAME</code>, <code>PASSWORD</code>) to match your specific API's authentication mechanism and user credentials.
                                <br />An error like <strong>401 Unauthorized</strong> during "Step 1: Authenticating" typically means the <code>USERNAME</code>, <code>PASSWORD</code>, or <code>LOGIN_ENDPOINT_URL</code> in the script are incorrect for your API.
                                <br />The script assumes the login endpoint is on the same base URL (<code>{displayedCurlBaseUrl}</code>) as the prompt serving API; adjust <code>LOGIN_ENDPOINT_URL</code> if it's different.
                            </p>
                        </div>
                    )}
                </div>

                {/* Selectors Grid */}
                <div className={styles.selectorsGrid}>
                    <input id="project-select" type="hidden" value={selectedProjectId || 'No Project Selected'} readOnly disabled className={`${styles.inputDisplay} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`} />
                    <div className={styles.selectWrapper}>
                        <label htmlFor="prompt-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">1. Select Prompt:</label>
                        <AsyncSelect
                            key={selectedProjectId || 'no-project'}
                            id="prompt-select"
                            cacheOptions
                            defaultOptions
                            loadOptions={loadPromptOptions}
                            value={selectedPrompt}
                            onChange={handlePromptChange}
                            isDisabled={!selectedProjectId}
                            placeholder={selectedProjectId ? "Type to search prompts..." : "Select a project first"}
                            classNamePrefix="react-select"
                            className="react-select-container dark:react-select-container-dark"
                        />
                    </div>
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
                    <div className={styles.selectWrapper}>
                        <label htmlFor="aimodel-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">4. Select AI Model:</label>
                        <Select
                            id="aimodel-select"
                            options={aiModelOptions}
                            value={selectedAiModel}
                            onChange={handleAiModelChange}
                            isLoading={loadingAiModels}
                            isDisabled={loadingAiModels || !selectedProjectId}
                            placeholder={selectedProjectId ? "Select AI Model..." : "Select a project first"}
                            classNamePrefix="react-select"
                            className="react-select-container dark:react-select-container-dark"
                        />
                    </div>
                </div>

                {/* Checkbox para procesar el prompt y para incluir assets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={isProcessed}
                            onChange={(e) => setIsProcessed(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span>Process prompt references and variables (final result after replacements)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={includeAssets}
                            onChange={(e) => setIncludeAssets(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span>Include assets in API response</span>
                    </label>
                </div>

                {isClient && selectedPrompt && selectedVersion && (
                    <div className={`${styles.detailsResultsContainer} md:grid md:grid-cols-2 md:gap-6`}>
                        <div className={`${styles.promptDetailsSection} bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow`}>
                            <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Prompt Details & Variables</h2>
                            <div className="mb-4">
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
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleExecute}
                                    disabled={isExecuting || !currentPromptText}
                                    className={`${styles.executeButton} flex-1 py-2 px-4 rounded-md text-white font-semibold transition-colors duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-500`}
                                >
                                    {isExecuting ? 'Processing...' : 'Preprocess Prompt'}
                                </button>
                                <button
                                    onClick={handleExecuteWithLLM}
                                    disabled={isExecuting || !currentPromptText || !selectedAiModel}
                                    className={`${styles.executeButton} flex-1 py-2 px-4 rounded-md text-white font-semibold transition-colors duration-150 ease-in-out bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-600 dark:disabled:bg-gray-500`}
                                    title={!selectedAiModel ? "Select an AI Model first" : "Execute prompt with LLM"}
                                >
                                    {isExecuting ? 'Executing...' : 'Execute with LLM'}
                                </button>
                            </div>
                        </div>
                        <div className={`${styles.resultsSection} bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow`}>
                            <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Execution Results</h2>
                            {executionResult && (
                                <>
                                    <div className={`${styles.metadataContainer} text-gray-600 dark:text-gray-400 mb-3`}>
                                        {executionResult.modelUsed && (
                                            <p><span className={`${styles.infoLabel} text-gray-800 dark:text-gray-200`}>Model Used:</span> {executionResult.modelUsed}</p>
                                        )}
                                        {executionResult.providerUsed && (
                                            <p><span className={`${styles.infoLabel} text-gray-800 dark:text-gray-200`}>Provider Used:</span> {executionResult.providerUsed}</p>
                                        )}
                                    </div>
                                    <textarea
                                        id="execution-result-text"
                                        readOnly
                                        value={executionResult.result || "No result text received."}
                                        className={`font-mono ${getFontSizeClass(selectedFontSize)} w-full p-3 border border-gray-700 dark:border-gray-600 rounded-md bg-gray-800 dark:bg-gray-800 text-gray-100 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 resize-none`}
                                        rows={16}
                                    />

                                    {/* --- Nueva caja para Assets --- */}
                                    {includeAssets && executionResult.assets && executionResult.assets.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Returned Assets</h3>
                                            <textarea
                                                id="execution-assets-text"
                                                readOnly
                                                value={JSON.stringify(executionResult.assets, null, 2)}
                                                className={`font-mono ${getFontSizeClass(selectedFontSize)} w-full p-3 border border-gray-700 dark:border-gray-600 rounded-md bg-gray-800 dark:bg-gray-800 text-gray-100 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 resize-none`}
                                                rows={10}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            {!executionResult && !isExecuting && (
                                <p className="text-gray-500 dark:text-gray-400">Execute a prompt to see the results here.</p>
                            )}
                            {isExecuting && (
                                <p className="text-gray-500 dark:text-gray-400">Executing...</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ServePromptPage; 