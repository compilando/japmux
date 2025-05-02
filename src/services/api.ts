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

// --- Funciones específicas para el API de Environments ---

export interface Environment {
    id: string;
    name: string;
    // TODO: Añadir aquí los campos reales de Environment (e.g., description, url, apiKey)
}

export type EnvironmentCreatePayload = {
    name: string;
    // TODO: Añadir aquí los campos reales para crear Environment
};

export type EnvironmentUpdatePayload = Partial<EnvironmentCreatePayload>;

export const getEnvironments = async (): Promise<Environment[]> => {
    const response = await apiClient.get('/environments');
    return response.data;
};

export const getEnvironmentById = async (id: string): Promise<Environment> => {
    const response = await apiClient.get(`/environments/${id}`);
    return response.data;
};

export const createEnvironment = async (payload: EnvironmentCreatePayload): Promise<Environment> => {
    const response = await apiClient.post('/environments', payload);
    return response.data;
};

export const updateEnvironment = async (id: string, payload: EnvironmentUpdatePayload): Promise<Environment> => {
    const response = await apiClient.patch(`/environments/${id}`, payload);
    return response.data;
};

export const deleteEnvironment = async (id: string): Promise<void> => {
    await apiClient.delete(`/environments/${id}`);
};

// --- Funciones específicas para el API de Tags ---

export interface Tag {
    id: string;
    name: string;
    // TODO: Añadir aquí los campos reales de Tag (e.g., description, color) si existen
}

export type TagCreatePayload = {
    name: string;
    // TODO: Añadir aquí los campos reales para crear Tag
};

export type TagUpdatePayload = Partial<TagCreatePayload>;

export const getTags = async (): Promise<Tag[]> => {
    const response = await apiClient.get('/tags');
    return response.data;
};

export const getTagById = async (id: string): Promise<Tag> => {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data;
};

export const createTag = async (payload: TagCreatePayload): Promise<Tag> => {
    const response = await apiClient.post('/tags', payload);
    return response.data;
};

export const updateTag = async (id: string, payload: TagUpdatePayload): Promise<Tag> => {
    const response = await apiClient.patch(`/tags/${id}`, payload);
    return response.data;
};

export const deleteTag = async (id: string): Promise<void> => {
    await apiClient.delete(`/tags/${id}`);
};

// --- Funciones específicas para el API de Users ---
// Basado en el openapi.json parcial visto anteriormente

// Asumiendo que la respuesta y CreateUserDto tienen estos campos.
// Es posible que necesites ajustar esto según la definición completa.
export interface User {
    id: string; // Asumiendo que la respuesta incluye un ID
    email: string;
    name?: string;
    // TODO: Añadir otros campos si existen (roles, etc.)
}

// Basado en CreateUserDto
export type UserCreatePayload = {
    email: string;
    password?: string; // La contraseña podría ser requerida solo al crear
    name?: string;
    // TODO: Añadir otros campos requeridos/opcionales para crear
};

// Basado en UpdateUserDto (asumiendo campos similares, todos opcionales)
export type UserUpdatePayload = {
    email?: string;
    password?: string; // Podría no ser actualizable o tener un endpoint diferente
    name?: string;
    // TODO: Añadir otros campos actualizables
};


export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    // Asumiendo que la respuesta devuelve un array de objetos User (puede diferir de CreateUserDto si, por ejemplo, no incluye la password)
    return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (payload: UserCreatePayload): Promise<User> => {
    // El endpoint devolvía CreateUserDto, ajustamos para devolver User si la estructura difiere
    const response = await apiClient.post('/users', payload);
    return response.data;
};

export const updateUser = async (id: string, payload: UserUpdatePayload): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, payload);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};

// --- Funciones específicas para el API de Prompts ---

export interface Prompt {
    name: string; // ID único
    description?: string;
    tacticId?: string;
    tags?: Tag[]; // <-- CAMBIO: Ahora es un array de objetos Tag
    id: string; // CUID
}

// Los payloads siguen esperando IDs (string[]) para los tags
export type PromptCreatePayload = {
    name: string;
    promptText: string;
    description?: string;
    tacticId?: string;
    tags?: string[]; // <-- SIN CAMBIOS: Array de IDs
    initialTranslations?: { languageCode: string; promptText: string }[];
};

export type PromptUpdatePayload = {
    description?: string;
    tacticId?: string | null;
    tagIds?: string[]; // <-- CAMBIO: Usar tagIds para la actualización
};

// Modificar las funciones getPrompts y getPromptById para asegurar que tags sea Tag[] si la API devuelve otra cosa
// Asumimos que la API ya devuelve los tags como objetos [{id, name}, ...]

export const getPrompts = async (): Promise<Prompt[]> => {
    const response = await apiClient.get('/prompts');
    // Aseguramos que cada prompt tenga la estructura correcta, incluyendo el CUID id y los tags como objetos
    return response.data.map((p: any) => ({
        ...p,
        id: p.id || p.name, // Usar CUID si existe, si no el name
        tags: p.tags || [], // Asumir que p.tags ya es Tag[] o []
    }));
};

export const getPromptById = async (name: string): Promise<Prompt> => {
    const response = await apiClient.get(`/prompts/${name}`);
    return {
        ...response.data,
        id: response.data.id || response.data.name,
        tags: response.data.tags || [], // Asumir que response.data.tags ya es Tag[] o []
    };
};

// createPrompt y updatePrompt no necesitan cambio aquí, ya que los payloads no cambiaron
export const createPrompt = async (payload: PromptCreatePayload): Promise<Prompt> => {
    const response = await apiClient.post('/prompts', payload);
    return {
        ...response.data,
        id: response.data.id || response.data.name,
        tags: response.data.tags || [],
    };
};

export const updatePrompt = async (name: string, payload: PromptUpdatePayload): Promise<Prompt> => {
    const response = await apiClient.patch(`/prompts/${name}`, payload);
    return {
        ...response.data,
        id: response.data.id || response.data.name,
        tags: response.data.tags || [],
    };
};

export const deletePrompt = async (name: string): Promise<void> => {
    await apiClient.delete(`/prompts/${name}`);
};

// --- Funciones específicas para el API de PromptAssets ---

export interface PromptAsset {
    key: string; // ID único
    id: string; // CUID devuelto por el backend
    name: string;
    type?: string;
    description?: string;
    category?: string;
    enabled?: boolean;
    projectId?: string;
    // initialValue etc son de Create, no necesariamente parte de la entidad devuelta
}

// Basado en CreatePromptAssetDto
export type PromptAssetCreatePayload = {
    key: string;
    name: string;
    initialValue: string;
    type?: string;
    description?: string;
    category?: string;
    initialChangeMessage?: string;
    projectId?: string;
};

// Basado en UpdatePromptAssetDto
export type PromptAssetUpdatePayload = {
    name?: string;
    type?: string;
    description?: string;
    category?: string;
    enabled?: boolean;
    projectId?: string | null;
};

export const getPromptAssets = async (): Promise<PromptAsset[]> => {
    // GET devuelve CreatePromptAssetDto, ajustamos
    const response = await apiClient.get('/prompt-assets');
    return response.data.map((a: any) => ({ ...a, id: a.key })); // Asumiendo que 'key' es el ID principal de negocio
};

// Usamos 'key' como ID en la ruta
export const getPromptAssetById = async (key: string): Promise<PromptAsset> => {
    const response = await apiClient.get(`/prompt-assets/${key}`);
    return { ...response.data, id: response.data.key };
};

export const createPromptAsset = async (payload: PromptAssetCreatePayload): Promise<PromptAsset> => {
    const response = await apiClient.post('/prompt-assets', payload);
    return { ...response.data, id: response.data.key };
};

// Usamos 'key' como ID en la ruta
export const updatePromptAsset = async (key: string, payload: PromptAssetUpdatePayload): Promise<PromptAsset> => {
    const response = await apiClient.patch(`/prompt-assets/${key}`, payload);
    return { ...response.data, id: response.data.key };
};

// Usamos 'key' como ID en la ruta
export const deletePromptAsset = async (key: string): Promise<void> => {
    // Delete devuelve el objeto eliminado, pero lo ignoramos
    await apiClient.delete(`/prompt-assets/${key}`);
};


// --- Funciones específicas para el API de PromptAssetLinks ---

// Basado en PromptAssetLinkResponse
export interface PromptAssetLink {
    id: string; // CUID
    promptVersionId: string;
    assetVersionId: string;
    usageContext?: string;
    position?: number;
    insertionLogic?: string;
    isRequired?: boolean;
    prompt?: Prompt; // Objeto anidado
    asset?: PromptAsset; // Objeto anidado
}

// Basado en CreatePromptAssetLinkDto
export type PromptAssetLinkCreatePayload = {
    promptVersionId: string;
    assetVersionId: string;
    usageContext?: string;
    position?: number;
    insertionLogic?: string;
    isRequired?: boolean;
};

// Basado en UpdatePromptAssetLinkDto
export type PromptAssetLinkUpdatePayload = {
    usageContext?: string;
    position?: number;
    insertionLogic?: string;
    isRequired?: boolean;
};

export const getPromptAssetLinks = async (): Promise<PromptAssetLink[]> => {
    const response = await apiClient.get('/prompt-asset-links');
    return response.data;
};

export const getPromptAssetLinkById = async (id: string): Promise<PromptAssetLink> => {
    const response = await apiClient.get(`/prompt-asset-links/${id}`);
    return response.data;
};

export const createPromptAssetLink = async (payload: PromptAssetLinkCreatePayload): Promise<PromptAssetLink> => {
    const response = await apiClient.post('/prompt-asset-links', payload);
    return response.data;
};

export const updatePromptAssetLink = async (id: string, payload: PromptAssetLinkUpdatePayload): Promise<PromptAssetLink> => {
    const response = await apiClient.patch(`/prompt-asset-links/${id}`, payload);
    return response.data;
};

export const deletePromptAssetLink = async (id: string): Promise<void> => {
    await apiClient.delete(`/prompt-asset-links/${id}`);
};


// --- Funciones específicas para el API de PromptAssetVersions ---

export interface PromptAssetVersion {
    id: string; // CUID
    assetId: string; // Key del asset padre
    value: string;
    versionTag: string;
    changeMessage?: string;
    // Podrían existir createdAt, updatedAt etc.
}

// Basado en CreatePromptAssetVersionDto
export type PromptAssetVersionCreatePayload = {
    assetId: string; // Key del asset padre
    value: string;
    versionTag?: string; // 'v1.0.0' por defecto en API?
    changeMessage?: string;
};

// Basado en UpdatePromptAssetVersionDto
export type PromptAssetVersionUpdatePayload = {
    value?: string;
    changeMessage?: string;
};

export const getPromptAssetVersions = async (): Promise<PromptAssetVersion[]> => {
    // Respuesta usa CreatePromptAssetVersionDto, adaptamos
    const response = await apiClient.get('/prompt-asset-versions');
    return response.data;
};

export const getPromptAssetVersionById = async (id: string): Promise<PromptAssetVersion> => {
    const response = await apiClient.get(`/prompt-asset-versions/${id}`);
    return response.data;
};

export const createPromptAssetVersion = async (payload: PromptAssetVersionCreatePayload): Promise<PromptAssetVersion> => {
    const response = await apiClient.post('/prompt-asset-versions', payload);
    return response.data;
};

export const updatePromptAssetVersion = async (id: string, payload: PromptAssetVersionUpdatePayload): Promise<PromptAssetVersion> => {
    const response = await apiClient.patch(`/prompt-asset-versions/${id}`, payload);
    return response.data;
};

export const deletePromptAssetVersion = async (id: string): Promise<void> => {
    // Delete devuelve el objeto eliminado, pero lo ignoramos
    await apiClient.delete(`/prompt-asset-versions/${id}`);
};

// --- Funciones específicas para el API de PromptTranslations ---

export interface PromptTranslation {
    id: string; // CUID
    versionId: string; // ID de PromptVersion
    languageCode: string; // xx-XX
    promptText: string;
    // Podrían existir createdAt, updatedAt etc.
}

// Basado en CreatePromptTranslationDto
export type PromptTranslationCreatePayload = {
    versionId: string;
    languageCode: string;
    promptText: string;
};

// Basado en UpdatePromptTranslationDto
export type PromptTranslationUpdatePayload = {
    promptText?: string;
};

// El GET puede filtrar por versionId
export const getPromptTranslations = async (versionId?: string): Promise<PromptTranslation[]> => {
    const params = versionId ? { versionId } : {};
    const response = await apiClient.get('/prompt-translation', { params });
    return response.data;
};

export const getPromptTranslationById = async (id: string): Promise<PromptTranslation> => {
    const response = await apiClient.get(`/prompt-translation/${id}`);
    return response.data;
};

export const createPromptTranslation = async (payload: PromptTranslationCreatePayload): Promise<PromptTranslation> => {
    const response = await apiClient.post('/prompt-translation', payload);
    return response.data;
};

export const updatePromptTranslation = async (id: string, payload: PromptTranslationUpdatePayload): Promise<PromptTranslation> => {
    const response = await apiClient.patch(`/prompt-translation/${id}`, payload);
    return response.data;
};

export const deletePromptTranslation = async (id: string): Promise<void> => {
    await apiClient.delete(`/prompt-translation/${id}`);
};


// --- Funciones específicas para el API de PromptVersions ---

export interface PromptVersion {
    id: string; // CUID
    promptId: string; // Name del Prompt padre
    promptText: string;
    versionTag: string;
    changeMessage?: string;
    isActive?: boolean; // Asumiendo posible campo para activar/desactivar
    // Podrían existir createdAt, updatedAt etc.
}

// Basado en CreatePromptVersionDto
export type PromptVersionCreatePayload = {
    promptId: string; // Name del Prompt padre
    promptText: string;
    versionTag?: string; // 'v1.0.0' por defecto en API?
    changeMessage?: string;
};

// Basado en UpdatePromptVersionDto
export type PromptVersionUpdatePayload = {
    promptText?: string;
    changeMessage?: string;
    // Podría haber un campo para activar/desactivar aquí o en un endpoint dedicado
    // isActive?: boolean;
};

// El GET puede filtrar por promptId
export const getPromptVersions = async (promptId?: string): Promise<PromptVersion[]> => {
    const params = promptId ? { promptId } : {};
    // Respuesta usa CreatePromptVersionDto, adaptamos
    const response = await apiClient.get('/prompt-versions', { params });
    return response.data;
};

export const getPromptVersionById = async (id: string): Promise<PromptVersion> => {
    const response = await apiClient.get(`/prompt-versions/${id}`);
    return response.data;
};

export const createPromptVersion = async (payload: PromptVersionCreatePayload): Promise<PromptVersion> => {
    const response = await apiClient.post('/prompt-versions', payload);
    return response.data;
};

export const updatePromptVersion = async (id: string, payload: PromptVersionUpdatePayload): Promise<PromptVersion> => {
    const response = await apiClient.patch(`/prompt-versions/${id}`, payload);
    return response.data;
};

export const deletePromptVersion = async (id: string): Promise<void> => {
    // Delete devuelve el objeto eliminado, pero lo ignoramos
    await apiClient.delete(`/prompt-versions/${id}`);
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

// --- Funciones específicas para Health Check ---

export interface HealthCheckResponse {
    status: 'ok' | string; // 'ok' u otro estado
    info?: {
        prisma?: { status: 'up' | string }
        // Otros servicios si existen
    };
    error?: object; // Detalles del error si status no es 'ok'
    details?: {
        prisma?: { status: 'up' | string }
        // Otros servicios si existen
    };
}

export const getApiHealth = async (): Promise<HealthCheckResponse> => {
    // Usamos axios directamente para poder manejar errores de red más fácil
    try {
        const response = await apiClient.get<HealthCheckResponse>('/health');
        return response.data;
    } catch (error) {
        // Si hay un error de red o el backend no responde, simulamos una respuesta de error
        console.error("API Health Check failed:", error);
        return {
            status: 'error',
            error: { message: 'Failed to connect to the API or API returned an error.' },
            details: {},
        };
    }
}; 