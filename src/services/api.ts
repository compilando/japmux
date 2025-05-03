import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showErrorToast } from '@/utils/toastUtils'; // Importar la utilidad

// --- Configuración Global de Axios ---

const AUTH_TOKEN_KEY = 'authToken';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Usar /api como fallback

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request: Añade token de autenticación
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log('[Interceptor Request] Running for URL:', config.url);
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            console.log('[Interceptor Request] Token found in localStorage:', token ? 'Yes' : 'No');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[Interceptor Request] Authorization header SET.');
            } else {
                console.log('[Interceptor Request] Authorization header NOT set (no token).');
            }
        } else {
            console.log('[Interceptor Request] Cannot access localStorage (not window).');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Response: Manejo global de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => { // Tipar el error si es posible
        const errorMessage = error.response?.data?.message || // Intentar obtener mensaje de la API
            (error.response?.data as any)?.error || // Otra posible estructura de error
            error.message; // Fallback al mensaje genérico del error

        if (error.response?.status === 401) {
            console.error('API Error: Unauthorized (401).');
            // No mostrar toast para 401, la redirección es suficiente
            if (typeof window !== 'undefined') {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                // Considerar si la redirección debe hacerse aquí o en AuthContext
                // window.location.href = '/signin';
            }
        } else if (error.response?.status === 403) {
            console.error('API Error: Forbidden (403).');
            // Mostrar toast específico para Forbidden
            showErrorToast(errorMessage || 'Forbidden: You do not have permission to access this resource.');
        } else {
            // Para otros errores, mostrar el toast de error
            console.error('API call error:', errorMessage, error.response); // Mantener log para debug
            showErrorToast(errorMessage || 'An unexpected API error occurred.');
        }
        return Promise.reject(error);
    }
);

// --- Tipos Generados desde OpenAPI ---

// Schemas from components.schemas

export interface CreateUserDto {
    email: string;
    /** @example "John Doe" */
    name?: string;
    /** @format password */
    password?: string;
    role?: string; // Assuming 'UserRole' enum maps to string
}

export interface UpdateUserDto {
    email?: string;
    /** @example "John Doe" */
    name?: string;
    /** @format password */
    password?: string;
    role?: string; // Assuming 'UserRole' enum maps to string
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: string; // Assuming 'UserRole' enum maps to string
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface RegisterDto {
    /** @example "john.doe@example.com" */
    email: string;
    /** @example "John Doe" */
    name?: string;
    /** @format password */
    password?: string;
}

export interface UserProfileResponse {
    /** @example "clxyz12340000abcd1234efgh" */
    id: string;
    /** @example "john.doe@example.com" */
    email: string;
    /** @example "John Doe" */
    name?: string;
}

export interface LoginDto {
    /** @example "john.doe@example.com" */
    email: string;
    /** @format password */
    password?: string;
}

export interface LoginResponse {
    access_token: string;
}

export interface CreateProjectDto {
    /** @minLength 1 */
    name: string;
    description?: string;
}

export interface UpdateProjectDto {
    /** @minLength 1 */
    name?: string;
    description?: string;
    ownerUserId?: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    ownerUserId: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface CreateRegionDto {
    /** @pattern ^[a-z]{2}(?:-[A-Z]{2})?$ */
    languageCode: string;
    /** @minLength 1 */
    name: string;
    parentRegionId?: string;
    /** @example "America/New_York" */
    timeZone?: string;
    defaultFormalityLevel?: string; // Assuming 'FormalityLevel' enum maps to string
    notes?: string;
}

export interface UpdateRegionDto {
    /** @minLength 1 */
    name?: string;
    parentRegionId?: string;
    /** @example "America/New_York" */
    timeZone?: string;
    defaultFormalityLevel?: string; // Assuming 'FormalityLevel' enum maps to string
    notes?: string;
}

export interface Region {
    /** @pattern ^[a-z]{2}(?:-[A-Z]{2})?$ */
    languageCode: string;
    name: string;
    parentRegionId?: string;
    timeZone?: string;
    defaultFormalityLevel: string; // Assuming 'FormalityLevel' enum maps to string
    notes?: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface CreateEnvironmentDto {
    /** @minLength 1 */
    name: string;
    description?: string;
}

export interface UpdateEnvironmentDto {
    /** @minLength 1 */
    name?: string;
    description?: string;
}

export interface Environment {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface CreateTacticDto {
    /** @minLength 1 */
    name: string;
    description?: string;
}

export interface UpdateTacticDto {
    /** @minLength 1 */
    name?: string;
    description?: string;
}

export interface Tactic {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface CreateTagDto {
    /** @minLength 1 */
    name: string;
    description?: string;
}

export interface UpdateTagDto {
    /** @minLength 1 */
    name?: string;
    description?: string;
}

export interface Tag {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface PromptTranslation {
    id: string;
    versionId: string;
    languageCode: string;
    promptText: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface PromptVersion {
    id: string;
    promptId: string;
    promptText: string;
    versionTag: string;
    changeMessage?: string;
    isActive: boolean;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
    translations: PromptTranslation[];
}

export interface Prompt {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    tacticId?: string | null;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
    tags: Tag[];
    versions: PromptVersion[];
}

export interface CreatePromptVersionDto {
    /** @minLength 1 */
    promptText: string;
    versionTag?: string;
    changeMessage?: string;
    assetLinks: string[];
}

export interface InitialTranslationDto {
    languageCode: string;
    promptText: string;
}

export interface CreatePromptDto {
    /** @minLength 1 */
    name: string;
    description?: string;
    tacticId?: string | null;
    tagIds?: string[];
    /** @minLength 1 */
    initialPromptText: string;
    initialVersionTag?: string;
    initialChangeMessage?: string;
    initialTranslations?: InitialTranslationDto[];
}

export interface UpdatePromptDto {
    description?: string | null;
    tacticId?: string | null;
    tagIds?: string[];
}

export interface CreatePromptTranslationDto {
    versionId: string;
    languageCode: string;
    promptText: string;
}

export interface UpdatePromptTranslationDto {
    promptText?: string;
}

export interface UpdatePromptVersionDto {
    promptText?: string;
    changeMessage?: string;
}

export interface ActivatePromptVersionDto {
    isActive?: boolean;
}

export interface PromptAssetVersion {
    id: string;
    assetId: string;
    value: string;
    versionTag: string;
    changeMessage?: string;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
}

export interface PromptAsset {
    id: string;
    projectId: string;
    /** @pattern ^[a-zA-Z0-9_\-]+$ */
    key: string;
    name: string;
    type?: string;
    description?: string;
    category?: string;
    enabled: boolean;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
    versions: PromptAssetVersion[];
}

export interface CreatePromptAssetDto {
    /** @pattern ^[a-zA-Z0-9_\-]+$ @minLength 1 */
    key: string;
    /** @minLength 1 */
    name: string;
    type?: string;
    description?: string;
    category?: string;
    /** @minLength 1 */
    initialValue: string;
    initialVersionTag?: string;
    initialChangeMessage?: string;
}

export interface UpdatePromptAssetDto {
    /** @minLength 1 */
    name?: string;
    type?: string;
    description?: string;
    category?: string;
    enabled?: boolean;
}

export interface CreatePromptAssetVersionDto {
    /** @minLength 1 */
    value: string;
    versionTag?: string;
    changeMessage?: string;
}

export interface UpdatePromptAssetVersionDto {
    value?: string;
    changeMessage?: string;
}

// --- Asset Translation Types ---
export interface PromptAssetTranslation {
    id: string;               // ID de la traducción (CUID)
    versionId: string;        // ID de la PromptAssetVersion a la que pertenece (CUID)
    languageCode: string;     // Código de idioma (e.g., "es-ES")
    value: string;            // Valor del asset traducido
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAssetTranslationDto {
    languageCode: string;     // Código de idioma (e.g., "es-ES")
    value: string;            // Valor del asset traducido
}

export interface UpdateAssetTranslationDto {
    value?: string;           // Nuevo valor del asset traducido (opcional)
}

export interface PromptAssetLink {
    id: string;
    promptVersionId: string;
    assetVersionId: string;
    usageContext?: string;
    position?: number;
    insertionLogic?: string;
    isRequired: boolean;
    createdAt: string; // Should be date-time
    updatedAt: string; // Should be date-time
    promptVersion?: PromptVersion;
    assetVersion?: PromptAssetVersion;
}

export interface CreatePromptAssetLinkDto {
    promptVersionId: string;
    assetVersionId: string;
    usageContext?: string;
    position?: number;
    insertionLogic?: string;
    isRequired?: boolean;
}

export interface UpdatePromptAssetLinkDto {
    usageContext?: string;
    position?: number;
    insertionLogic?: string;
    isRequired?: boolean;
}

export interface HealthCheckResult {
    status: string;
    info?: object | null;
    error?: object | null;
    details: object;
}

export interface ServePromptDto {
    languageCode?: string;
    versionTag?: string;
    useLatestActive?: boolean;
    context?: object;
    userId?: string;
}

export interface ServePromptResponse {
    servedText: string;
    promptId: string;
    promptVersionId: string;
    promptVersionTag: string;
    languageCode?: string;
    usedContext?: object;
    traceId?: string;
}

export interface ServePromptByTacticDto {
    languageCode?: string;
    context?: object;
    userId?: string;
}

export interface ServePromptByTacticResponse {
    servedText: string;
    promptId: string;
    promptVersionId: string;
    promptVersionTag: string;
    tacticId: string;
    languageCode?: string;
    usedContext?: object;
    traceId?: string;
}


// --- Servicios API ---

// Servicio de Autenticación
export const authService = {
    register: async (payload: RegisterDto): Promise<UserProfileResponse> => {
        const response = await apiClient.post<UserProfileResponse>('/auth/register', payload);
        return response.data;
    },
    login: async (payload: LoginDto): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', payload);
        // Guardar token después del login exitoso
        if (response.data.access_token && typeof window !== 'undefined') {
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
        }
        return response.data;
    },
    getCurrentUserProfile: async (): Promise<UserProfileResponse> => {
        const response = await apiClient.get<UserProfileResponse>('/auth/profile');
        return response.data;
    },
    logout: () => {
        // Simplemente elimina el token localmente
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        // No hay llamada API para logout en la spec, asumir que es solo local
    },
    isAuthenticated: (): boolean => {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        return !!token; // Devuelve true si el token existe
    },
};

// Servicio de Usuarios (Global)
export const userService = {
    create: async (payload: CreateUserDto): Promise<User> => {
        // OpenAPI usa CreateUserDto como respuesta para 201, pero User es más probable
        const response = await apiClient.post<User>('/users', payload);
        return response.data;
    },
    findAll: async (): Promise<User[]> => {
        // OpenAPI usa CreateUserDto[], ajustar a User[] si es más correcto
        const response = await apiClient.get<User[]>('/users');
        return response.data;
    },
    findOne: async (id: string): Promise<User> => {
        // OpenAPI usa CreateUserDto, ajustar a User si es más correcto
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },
    update: async (id: string, payload: UpdateUserDto): Promise<User> => {
        // OpenAPI usa CreateUserDto, ajustar a User si es más correcto
        const response = await apiClient.patch<User>(`/users/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    },
};

// Servicio de Proyectos (Global, pero 'mine' es específico del usuario)
export const projectService = {
    create: async (payload: CreateProjectDto): Promise<Project> => {
        const response = await apiClient.post<Project>('/projects', payload);
        return response.data;
    },
    findAll: async (): Promise<Project[]> => {
        const response = await apiClient.get<Project[]>('/projects');
        return response.data;
    },
    /** Obtiene los proyectos pertenecientes al usuario autenticado */
    getMine: async (): Promise<Project[]> => {
        const response = await apiClient.get<Project[]>('/projects/mine');
        return response.data;
    },
    findOne: async (id: string): Promise<Project> => {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },
    update: async (id: string, payload: UpdateProjectDto): Promise<Project> => {
        const response = await apiClient.patch<Project>(`/projects/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        await apiClient.delete(`/projects/${id}`);
    },
};

// Servicio de Regiones (ESPECÍFICO DE PROYECTO)
export const regionService = {
    create: async (projectId: string, payload: CreateRegionDto): Promise<Region> => {
        // Ruta actualizada para incluir projectId
        const response = await apiClient.post<Region>(`/projects/${projectId}/regions`, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<Region[]> => {
        // Ruta actualizada para incluir projectId
        const response = await apiClient.get<Region[]>(`/projects/${projectId}/regions`);
        return response.data;
    },
    findOne: async (projectId: string, languageCode: string): Promise<Region> => {
        // Ruta actualizada para incluir projectId
        const response = await apiClient.get<Region>(`/projects/${projectId}/regions/${languageCode}`);
        return response.data;
    },
    update: async (projectId: string, languageCode: string, payload: UpdateRegionDto): Promise<Region> => {
        // Ruta actualizada para incluir projectId
        const response = await apiClient.patch<Region>(`/projects/${projectId}/regions/${languageCode}`, payload);
        return response.data;
    },
    remove: async (projectId: string, languageCode: string): Promise<void> => {
        // Ruta actualizada para incluir projectId
        await apiClient.delete(`/projects/${projectId}/regions/${languageCode}`);
    },
};


// --- Servicios Específicos de Proyecto ---

// Servicio de Environments
export const environmentService = {
    create: async (projectId: string, payload: CreateEnvironmentDto): Promise<Environment> => {
        const response = await apiClient.post<Environment>(`/projects/${projectId}/environments`, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<Environment[]> => {
        const response = await apiClient.get<Environment[]>(`/projects/${projectId}/environments`);
        return response.data;
    },
    findOne: async (projectId: string, id: string): Promise<Environment> => {
        const response = await apiClient.get<Environment>(`/projects/${projectId}/environments/${id}`);
        return response.data;
    },
    update: async (projectId: string, id: string, payload: UpdateEnvironmentDto): Promise<Environment> => {
        const response = await apiClient.patch<Environment>(`/projects/${projectId}/environments/${id}`, payload);
        return response.data;
    },
    remove: async (projectId: string, id: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/environments/${id}`);
    },
};

// Servicio de Tactics
export const tacticService = {
    create: async (projectId: string, payload: CreateTacticDto): Promise<Tactic> => {
        const response = await apiClient.post<Tactic>(`/projects/${projectId}/tactics`, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<Tactic[]> => {
        const response = await apiClient.get<Tactic[]>(`/projects/${projectId}/tactics`);
        return response.data;
    },
    findOne: async (projectId: string, id: string): Promise<Tactic> => {
        const response = await apiClient.get<Tactic>(`/projects/${projectId}/tactics/${id}`);
        return response.data;
    },
    update: async (projectId: string, id: string, payload: UpdateTacticDto): Promise<Tactic> => {
        const response = await apiClient.patch<Tactic>(`/projects/${projectId}/tactics/${id}`, payload);
        return response.data;
    },
    remove: async (projectId: string, id: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/tactics/${id}`);
    },
};

// Servicio de Tags
export const tagService = {
    create: async (projectId: string, payload: CreateTagDto): Promise<Tag> => {
        const response = await apiClient.post<Tag>(`/projects/${projectId}/tags`, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<Tag[]> => {
        const response = await apiClient.get<Tag[]>(`/projects/${projectId}/tags`);
        return response.data;
    },
    findOne: async (projectId: string, id: string): Promise<Tag> => {
        const response = await apiClient.get<Tag>(`/projects/${projectId}/tags/${id}`);
        return response.data;
    },
    update: async (projectId: string, id: string, payload: UpdateTagDto): Promise<Tag> => {
        const response = await apiClient.patch<Tag>(`/projects/${projectId}/tags/${id}`, payload);
        return response.data;
    },
    remove: async (projectId: string, id: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/tags/${id}`);
    },
};

// Servicio de Prompts
export const promptService = {
    create: async (projectId: string, payload: CreatePromptDto): Promise<Prompt> => {
        const response = await apiClient.post<Prompt>(`/projects/${projectId}/prompts`, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<Prompt[]> => {
        const response = await apiClient.get<Prompt[]>(`/projects/${projectId}/prompts`);
        return response.data;
    },
    findOne: async (projectId: string, id: string): Promise<Prompt> => {
        const response = await apiClient.get<Prompt>(`/projects/${projectId}/prompts/${id}`);
        return response.data;
    },
    /** Busca un prompt por su nombre único dentro del proyecto */
    findByName: async (projectId: string, name: string): Promise<Prompt> => {
        const response = await apiClient.get<Prompt>(`/projects/${projectId}/prompts/by-name/${name}`);
        return response.data;
    },
    update: async (projectId: string, id: string, payload: UpdatePromptDto): Promise<Prompt> => {
        const response = await apiClient.patch<Prompt>(`/projects/${projectId}/prompts/${id}`, payload);
        return response.data;
    },
    remove: async (projectId: string, id: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/prompts/${id}`);
    },
};

// Servicio de PromptVersions (sub-recurso de Prompts)
export const promptVersionService = {
    create: async (projectId: string, promptId: string, payload: CreatePromptVersionDto): Promise<PromptVersion> => {
        const response = await apiClient.post<PromptVersion>(`/projects/${projectId}/prompts/${promptId}/versions`, payload);
        return response.data;
    },
    findAll: async (projectId: string, promptId: string): Promise<PromptVersion[]> => {
        const response = await apiClient.get<PromptVersion[]>(`/projects/${projectId}/prompts/${promptId}/versions`);
        return response.data;
    },
    findOne: async (projectId: string, promptId: string, versionTag: string): Promise<PromptVersion> => {
        const response = await apiClient.get<PromptVersion>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}`);
        return response.data;
    },
    update: async (projectId: string, promptId: string, versionTag: string, payload: UpdatePromptVersionDto): Promise<PromptVersion> => {
        const response = await apiClient.patch<PromptVersion>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}`, payload);
        return response.data;
    },
    remove: async (projectId: string, promptId: string, versionTag: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}`);
    },
    activate: async (projectId: string, promptId: string, versionTag: string, payload: ActivatePromptVersionDto): Promise<PromptVersion> => {
        const response = await apiClient.patch<PromptVersion>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/activate`, payload);
        return response.data;
    },
};

// Servicio de PromptTranslations (sub-recurso de PromptVersions)
export const promptTranslationService = {
    create: async (projectId: string, promptId: string, versionTag: string, payload: CreatePromptTranslationDto): Promise<PromptTranslation> => {
        const response = await apiClient.post<PromptTranslation>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations`, payload);
        return response.data;
    },
    findAll: async (projectId: string, promptId: string, versionTag: string): Promise<PromptTranslation[]> => {
        const response = await apiClient.get<PromptTranslation[]>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations`);
        return response.data;
    },
    /** Busca una traducción por código de idioma */
    findByLanguage: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<PromptTranslation> => {
        const response = await apiClient.get<PromptTranslation>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations/by-language/${languageCode}`);
        return response.data;
    },
    update: async (projectId: string, promptId: string, versionTag: string, languageCode: string, payload: UpdatePromptTranslationDto): Promise<PromptTranslation> => {
        const response = await apiClient.patch<PromptTranslation>(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations/${languageCode}`, payload);
        return response.data;
    },
    remove: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations/${languageCode}`);
    },
};


// --- Prompt Asset Service ---
// Manages Assets (by assetKey), their Versions (by versionTag), and Translations (by languageCode)
export const promptAssetService = {
    // == Prompt Assets ==

    async create(projectId: string, payload: CreatePromptAssetDto): Promise<PromptAsset> {
        // POST /api/projects/{projectId}/prompt-assets
        const response = await apiClient.post<PromptAsset>(`/api/projects/${projectId}/prompt-assets`, payload);
        return response.data;
    },

    async getAll(projectId: string): Promise<PromptAsset[]> {
        // GET /api/projects/{projectId}/prompt-assets
        const response = await apiClient.get<PromptAsset[]>(`/api/projects/${projectId}/prompt-assets`);
        return response.data;
    },

    async findOneByKey(projectId: string, assetKey: string): Promise<PromptAsset> {
        // GET /api/projects/{projectId}/prompt-assets/{assetKey}
        const response = await apiClient.get<PromptAsset>(`/api/projects/${projectId}/prompt-assets/${assetKey}`);
        return response.data;
    },

    async update(projectId: string, assetKey: string, payload: UpdatePromptAssetDto): Promise<PromptAsset> {
        // PATCH /api/projects/{projectId}/prompt-assets/{assetKey}
        const response = await apiClient.patch<PromptAsset>(`/api/projects/${projectId}/prompt-assets/${assetKey}`, payload);
        return response.data;
    },

    async remove(projectId: string, assetKey: string): Promise<void> {
        // DELETE /api/projects/{projectId}/prompt-assets/{assetKey}
        await apiClient.delete(`/api/projects/${projectId}/prompt-assets/${assetKey}`);
    },

    // == Prompt Asset Versions (using assetKey and versionTag) ==

    async createVersion(projectId: string, assetKey: string, payload: CreatePromptAssetVersionDto): Promise<PromptAssetVersion> {
        // POST /api/projects/{projectId}/assets/{assetKey}/versions
        const response = await apiClient.post<PromptAssetVersion>(`/api/projects/${projectId}/assets/${assetKey}/versions`, payload);
        return response.data;
    },

    async getAllVersions(projectId: string, assetKey: string): Promise<PromptAssetVersion[]> {
        // GET /api/projects/{projectId}/assets/{assetKey}/versions
        const response = await apiClient.get<PromptAssetVersion[]>(`/api/projects/${projectId}/assets/${assetKey}/versions`);
        return response.data;
    },

    async findOneVersionByTag(projectId: string, assetKey: string, versionTag: string): Promise<PromptAssetVersion> {
        // GET /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}
        const response = await apiClient.get<PromptAssetVersion>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`);
        return response.data;
    },

    async updateVersion(projectId: string, assetKey: string, versionTag: string, payload: UpdatePromptAssetVersionDto): Promise<PromptAssetVersion> {
        // PATCH /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}
        const response = await apiClient.patch<PromptAssetVersion>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`, payload);
        return response.data;
    },

    async removeVersion(projectId: string, assetKey: string, versionTag: string): Promise<void> {
        // DELETE /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`);
    },

    // == Prompt Asset Translations (using assetKey, versionTag, languageCode) ==

    async createTranslation(projectId: string, assetKey: string, versionTag: string, payload: CreateAssetTranslationDto): Promise<PromptAssetTranslation> {
        // POST /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations
        // Assuming the backend returns the created PromptAssetTranslation object
        const response = await apiClient.post<PromptAssetTranslation>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations`, payload);
        return response.data;
    },

    async getAllTranslations(projectId: string, assetKey: string, versionTag: string): Promise<PromptAssetTranslation[]> {
        // GET /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations
        const response = await apiClient.get<PromptAssetTranslation[]>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations`);
        return response.data;
    },

    async findOneTranslationByCode(projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<PromptAssetTranslation> {
        // GET /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode}
        const response = await apiClient.get<PromptAssetTranslation>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
        return response.data;
    },

    async updateTranslation(projectId: string, assetKey: string, versionTag: string, languageCode: string, payload: UpdateAssetTranslationDto): Promise<PromptAssetTranslation> {
        // PATCH /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode}
        // Assuming the backend returns the updated PromptAssetTranslation object
        const response = await apiClient.patch<PromptAssetTranslation>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`, payload);
        return response.data;
    },

    async removeTranslation(projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<void> {
        // DELETE /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode}
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
    },
};

// --- Prompt Asset Link Service ---
// Links an Asset Version to a Prompt Version (using promptVersionId CUID)
export const promptAssetLinkService = {
    async create(projectId: string, promptVersionId: string, payload: CreatePromptAssetLinkDto): Promise<PromptAssetLink> {
        const response = await apiClient.post(`projects/${projectId}/prompt-versions/${promptVersionId}/links`, payload);
        return response.data;
    },

    async getAll(projectId: string, promptVersionId: string): Promise<PromptAssetLink[]> {
        const response = await apiClient.get(`projects/${projectId}/prompt-versions/${promptVersionId}/links`);
        return response.data;
    },

    async findOne(projectId: string, promptVersionId: string, linkId: string): Promise<PromptAssetLink> {
        const response = await apiClient.get(`projects/${projectId}/prompt-versions/${promptVersionId}/links/${linkId}`);
        return response.data;
    },

    async update(projectId: string, promptVersionId: string, linkId: string, payload: UpdatePromptAssetLinkDto): Promise<PromptAssetLink> {
        const response = await apiClient.patch(`projects/${projectId}/prompt-versions/${promptVersionId}/links/${linkId}`, payload);
        return response.data;
    },

    async remove(projectId: string, promptVersionId: string, linkId: string): Promise<void> {
        await apiClient.delete(`projects/${projectId}/prompt-versions/${promptVersionId}/links/${linkId}`);
    },
};

// Servicio de Health Check (Global)
export const healthService = {
    check: async (): Promise<HealthCheckResult> => {
        const response = await apiClient.get<HealthCheckResult>('/health');
        return response.data;
    },
};

// Servicio de "Serve" (nivel superior dentro del proyecto)
export const serveService = {
    /** Sirve un prompt específico por su ID */
    servePromptById: async (projectId: string, promptId: string, payload: ServePromptDto): Promise<ServePromptResponse> => {
        const response = await apiClient.post<ServePromptResponse>(`/projects/${projectId}/serve/prompt/${promptId}`, payload);
        return response.data;
    },
    /** Sirve un prompt por el nombre único del prompt */
    servePromptByName: async (projectId: string, promptName: string, payload: ServePromptDto): Promise<ServePromptResponse> => {
        const response = await apiClient.post<ServePromptResponse>(`/projects/${projectId}/serve/prompt-by-name/${promptName}`, payload);
        return response.data;
    },
    /** Sirve un prompt basado en una Tactic ID */
    servePromptByTactic: async (projectId: string, tacticId: string, payload: ServePromptByTacticDto): Promise<ServePromptByTacticResponse> => {
        const response = await apiClient.post<ServePromptByTacticResponse>(`/projects/${projectId}/serve/tactic/${tacticId}`, payload);
        return response.data;
    },
    /** Sirve un prompt basado en el nombre único de la Tactic */
    servePromptByTacticName: async (projectId: string, tacticName: string, payload: ServePromptByTacticDto): Promise<ServePromptByTacticResponse> => {
        const response = await apiClient.post<ServePromptByTacticResponse>(`/projects/${projectId}/serve/tactic-by-name/${tacticName}`, payload);
        return response.data;
    },
};

// --- Placeholder: AI Models --- 
// TODO: Reemplazar 'any' con las interfaces reales de tu API
export interface AiModel {
    id: string;
    // No projectId, es global
    name: string;
    provider?: string;
    description?: string;
    apiIdentifier?: string;
    // Añadir otros campos si existen en la respuesta real (e.g., createdAt, updatedAt)
}
export interface CreateAiModelDto {
    name: string;
    provider?: string;
    description?: string;
    apiIdentifier?: string;
}
export interface UpdateAiModelDto {
    name?: string;
    provider?: string;
    description?: string;
    apiIdentifier?: string;
}

// Implementación real de las llamadas a la API para AI Models (globales)
export const aiModelService = {
    findAll: async (): Promise<AiModel[]> => {
        // Ruta global sin projectId
        const response = await apiClient.get<AiModel[]>('/ai-models');
        return response.data;
    },
    findOne: async (id: string): Promise<AiModel> => {
        // Ruta global sin projectId
        const response = await apiClient.get<AiModel>(`/ai-models/${id}`);
        return response.data;
    },
    create: async (payload: CreateAiModelDto): Promise<AiModel> => {
        // Ruta global sin projectId
        const response = await apiClient.post<AiModel>('/ai-models', payload);
        return response.data; // La API devuelve el objeto creado, incluyendo el ID
    },
    update: async (id: string, payload: UpdateAiModelDto): Promise<AiModel> => {
        // Ruta global sin projectId
        const response = await apiClient.patch<AiModel>(`/ai-models/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        // Ruta global sin projectId
        await apiClient.delete(`/ai-models/${id}`);
    },
};

// --- Implementación Real: Cultural Data (por Proyecto) --- 
export interface CulturalData extends CulturalDataResponse { // Usamos el tipo de respuesta como base
    // CulturalDataResponse ya tiene: id, regionId, formalityLevel?, style?, considerations?, notes?, projectId, region
}
export interface CreateCulturalDataDto {
    id: string; // ID tipo slug es requerido al crear
    regionId: string; // Código de idioma es requerido al crear
    formalityLevel?: number;
    style?: string;
    considerations?: string;
    notes?: string;
}
export interface UpdateCulturalDataDto {
    formalityLevel?: number;
    style?: string;
    considerations?: string;
    notes?: string;
}
// Necesitamos el tipo de respuesta definido en openapi.json
export interface CulturalDataResponse {
    id: string;
    regionId: string;
    formalityLevel?: number;
    style?: string;
    considerations?: string;
    notes?: string;
    region: Region; // Asumiendo que ya tienes definida la interfaz Region
    projectId: string;
}


// Implementación real de las llamadas a la API para Cultural Data (por proyecto)
export const culturalDataService = {
    findAll: async (projectId: string): Promise<CulturalDataResponse[]> => {
        const response = await apiClient.get<CulturalDataResponse[]>(`/projects/${projectId}/cultural-data`);
        return response.data;
    },
    findOne: async (projectId: string, culturalDataId: string): Promise<CulturalDataResponse> => {
        const response = await apiClient.get<CulturalDataResponse>(`/projects/${projectId}/cultural-data/${culturalDataId}`);
        return response.data;
    },
    create: async (projectId: string, payload: CreateCulturalDataDto): Promise<CulturalDataResponse> => {
        const response = await apiClient.post<CulturalDataResponse>(`/projects/${projectId}/cultural-data`, payload);
        return response.data;
    },
    update: async (projectId: string, culturalDataId: string, payload: UpdateCulturalDataDto): Promise<CulturalDataResponse> => {
        const response = await apiClient.patch<CulturalDataResponse>(`/projects/${projectId}/cultural-data/${culturalDataId}`, payload);
        return response.data;
    },
    remove: async (projectId: string, culturalDataId: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/cultural-data/${culturalDataId}`);
    },
};


// Exportación predeterminada del cliente Axios configurado
export default apiClient;
