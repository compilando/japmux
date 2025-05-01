import axios from 'axios';

// Crea una instancia de axios con la configuración base
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Lee la URL desde las variables de entorno
    headers: {
        'Content-Type': 'application/json',
        // Aquí podrías añadir headers por defecto, como los de autenticación si los tuvieras
        // 'Authorization': `Bearer ${token}`
    },
});

// Puedes añadir interceptors si necesitas manejar errores globalmente o modificar requests/responses
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     // Manejo de errores global
//     console.error('API call error:', error);
//     return Promise.reject(error);
//   }
// );

export default apiClient;

// --- Funciones específicas para el API de Regions ---

export interface Region {
    languageCode: string; // ID principal es languageCode
    name: string;
    parentRegionId?: string;
    timeZone?: string;
    defaultFormalityLevel?: string;
    notes?: string;
    // Añade aquí otros campos que tenga tu modelo Region
}

// Tipado para los datos al crear/actualizar (sin el id)
// Ajustamos Omit para usar languageCode
type RegionData = Omit<Region, 'languageCode'>; // Los datos para crear/actualizar no necesitan el languageCode (se pone en URL o se genera)

export const getRegions = async (): Promise<Region[]> => {
    const response = await apiClient.get('/regions');
    return response.data;
};

export const getRegionById = async (id: string): Promise<Region> => {
    const response = await apiClient.get(`/regions/${id}`);
    return response.data;
};

export const createRegion = async (regionData: { languageCode: string; name: string; parentRegionId?: string; timeZone?: string; defaultFormalityLevel?: string; notes?: string }): Promise<Region> => {
    const response = await apiClient.post('/regions', regionData);
    return response.data;
};

export const updateRegion = async (id: string, regionData: Omit<Region, 'languageCode'>): Promise<Region> => {
    const response = await apiClient.patch(`/regions/${id}`, regionData);
    return response.data;
};

export const deleteRegion = async (id: string): Promise<void> => {
    await apiClient.delete(`/regions/${id}`);
};

// --- Funciones específicas para el API de CulturalData ---

// Interfaz basada en CulturalDataResponse
export interface CulturalData {
    id: string; // Nuevo ID principal (slug)
    regionId: string;
    formalityLevel?: number;
    style?: string;
    considerations?: string;
    notes?: string;
    region?: Region; // Objeto Region anidado en la respuesta
}

// Payload de creación ahora requiere id y regionId
export type CulturalDataCreatePayload = {
    id: string;
    regionId: string;
    formalityLevel?: number;
    style?: string;
    considerations?: string;
    notes?: string;
};

// Payload de actualización no incluye id ni regionId
export type CulturalDataUpdatePayload = {
    formalityLevel?: number;
    style?: string;
    considerations?: string;
    notes?: string;
};

export const getCulturalData = async (): Promise<CulturalData[]> => {
    const response = await apiClient.get('/cultural-data');
    return response.data;
};

// ID es el nuevo id string
export const getCulturalDataById = async (id: string): Promise<CulturalData> => {
    const response = await apiClient.get(`/cultural-data/${id}`);
    return response.data;
};

// Payload es CulturalDataCreatePayload
export const createCulturalData = async (payload: CulturalDataCreatePayload): Promise<CulturalData> => {
    const response = await apiClient.post('/cultural-data', payload);
    return response.data;
};

// ID es el nuevo id string, Payload es CulturalDataUpdatePayload
export const updateCulturalData = async (id: string, payload: CulturalDataUpdatePayload): Promise<CulturalData> => {
    const response = await apiClient.patch(`/cultural-data/${id}`, payload);
    return response.data;
};

// ID es el nuevo id string
export const deleteCulturalData = async (id: string): Promise<void> => {
    await apiClient.delete(`/cultural-data/${id}`);
};

// --- Funciones específicas para el API de AI Models ---

export interface AiModel {
    id: string; // ID autogenerado (CUID)
    name: string;
    provider?: string;
    description?: string;
    apiIdentifier?: string;
    // Añadir más campos si la respuesta real los incluye (e.g., createdAt, updatedAt)
}

// Payload para Crear (solo los campos definidos en CreateAiModelDto)
export type AiModelCreatePayload = {
    name: string;
    provider?: string;
    description?: string;
    apiIdentifier?: string;
};

// Payload para Actualizar (todos opcionales según UpdateAiModelDto)
export type AiModelUpdatePayload = Partial<AiModelCreatePayload>;

export const getAiModels = async (): Promise<AiModel[]> => {
    const response = await apiClient.get('/ai-models');
    return response.data;
};

export const getAiModelById = async (id: string): Promise<AiModel> => {
    const response = await apiClient.get(`/ai-models/${id}`);
    return response.data;
};

export const createAiModel = async (payload: AiModelCreatePayload): Promise<AiModel> => {
    const response = await apiClient.post('/ai-models', payload);
    return response.data;
};

export const updateAiModel = async (id: string, payload: AiModelUpdatePayload): Promise<AiModel> => {
    const response = await apiClient.patch(`/ai-models/${id}`, payload);
    return response.data;
};

export const deleteAiModel = async (id: string): Promise<void> => {
    // La respuesta OpenAPI para DELETE /ai-models/{id} devuelve el objeto eliminado, 
    // pero nuestra firma es void. Ajustamos para no esperar contenido.
    await apiClient.delete(`/ai-models/${id}`);
};

// --- Funciones específicas para el API de Projects ---

export interface Project {
    id: string; // ID autogenerado (CUID)
    name: string;
    description?: string;
    ownerUserId?: string; // Relación con User
    // Añadir más campos si la respuesta real los incluye
}

// Payload para Crear (según CreateProjectDto)
export type ProjectCreatePayload = {
    name: string;
    description?: string;
    ownerUserId?: string;
};

// Payload para Actualizar (según UpdateProjectDto)
export type ProjectUpdatePayload = Partial<ProjectCreatePayload>;

export const getProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
};

export const createProject = async (payload: ProjectCreatePayload): Promise<Project> => {
    const response = await apiClient.post('/projects', payload);
    return response.data;
};

export const updateProject = async (id: string, payload: ProjectUpdatePayload): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}`, payload);
    return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    // OpenAPI indica que DELETE /projects/{id} devuelve el objeto, ajustamos a void.
    await apiClient.delete(`/projects/${id}`);
};

// --- Funciones específicas para Serve Prompt ---

interface ServePromptParams {
    promptId?: string;
    tacticId?: string;
    languageCode?: string;
    versionTag?: string;
    useLatestActive?: boolean;
}

// La función devuelve directamente el string del prompt ensamblado
export const servePrompt = async (params: ServePromptParams): Promise<string> => {
    // Construir los query parameters eliminando los undefined o vacíos
    const queryParams = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== '')
        .reduce((acc, [key, value]) => {
            acc[key] = String(value); // Asegurar que todos los valores son strings para URLSearchParams
            return acc;
        }, {} as Record<string, string>);

    const response = await apiClient.get<string>('/serve-prompt', {
        params: queryParams
    });
    // Axios devuelve la respuesta completa, el string está en response.data
    return response.data;
}; 