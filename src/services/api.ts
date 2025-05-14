import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showErrorToast } from '@/utils/toastUtils'; // Importar la utilidad
// Importar todo lo exportado por el cliente generado
import * as generated from './generated';
// Eliminar esta importación, apiClient se define abajo
// import { apiClient } from '../axiosClient';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';

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
        console.log('[Interceptor Request apiClient] Running for URL:', config.url); // Log distintivo
        if (typeof window !== 'undefined') {
            let token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (!token) {
                token = sessionStorage.getItem(AUTH_TOKEN_KEY);
                if (token) {
                    console.log('[Interceptor Request apiClient] Token found in sessionStorage.');
                } else {
                    console.log('[Interceptor Request apiClient] Token not found in localStorage or sessionStorage.');
                }
            } else {
                console.log('[Interceptor Request apiClient] Token found in localStorage.');
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[Interceptor Request apiClient] Authorization header SET.');
            } else {
                console.log('[Interceptor Request apiClient] Authorization header NOT set (no token).');
            }
        } else {
            console.log('[Interceptor Request apiClient] Cannot access storage (not window).');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Response: Manejo global de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<unknown>) => { // Tipar el error si es posible
        const errorMessage = error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data
                ? String(error.response.data.error)
                : error.message; // Fallback al mensaje genérico del error

        if (error.response?.status === 401) {
            console.error('API Error: Unauthorized (401).');
            // No mostrar toast para 401, la redirección es suficiente
            if (typeof window !== 'undefined') {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                sessionStorage.removeItem(AUTH_TOKEN_KEY); // Also remove from sessionStorage
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

// --- Instancias de Servicios API Generados ---
// Usaremos estas instancias para llamar a los métodos generados
// El apiClient configurado se pasa al constructor de la clase API generada
// NO pasar basePath aquí, ya está en apiClient.baseURL
const generatedApiConfig = new generated.Configuration({ /* basePath: API_BASE_URL */ });

const llmExecutionGeneratedApi = new generated.LLMExecutionApi(generatedApiConfig, undefined, apiClient);
const aiModelsGeneratedApi = new generated.AIModelsProjectSpecificApi(generatedApiConfig, undefined, apiClient);
// Instancia otras APIs generadas aquí si las necesitas, p.ej.:
const promptsGeneratedApi = new generated.PromptsApi(generatedApiConfig, undefined, apiClient);
const promptVersionsGeneratedApi = new generated.PromptVersionsWithinProjectPromptApi(generatedApiConfig, undefined, apiClient);
const promptTranslationsGeneratedApi = new generated.PromptTranslationsWithinProjectPromptVersionApi(generatedApiConfig, undefined, apiClient);
const systemPromptsGeneratedApi = new generated.SystemPromptsApi(generatedApiConfig, undefined, apiClient);
const rawExecutionGeneratedApi = new generated.RawExecutionApi(generatedApiConfig, undefined, apiClient);
const tagsGeneratedApi = new generated.TagsApi(generatedApiConfig, undefined, apiClient);
const environmentsGeneratedApi = new generated.EnvironmentsApi(generatedApiConfig, undefined, apiClient);
// Instanciar PromptAssetsApi aquí para que esté disponible para el servicio
const promptAssetsGeneratedApi = new generated.PromptAssetsApi(generatedApiConfig, undefined, apiClient);
// Instanciar PromptAssetVersionsApi aquí para que esté disponible para el servicio
const promptAssetVersionsGeneratedApi = new generated.PromptAssetVersionsWithinProjectAssetApi(generatedApiConfig, undefined, apiClient);
// Instanciar PromptAssetTranslationsApi aquí para que esté disponible para el servicio
// Esta constante no se utiliza actualmente, podría ser necesaria en el futuro
// const promptAssetTranslationsGeneratedApi = new generated.AssetTranslationsWithinProjectAssetVersionApi(generatedApiConfig, undefined, apiClient);
// const authGeneratedApi = new generated.AuthenticationApi(generatedApiConfig, undefined, apiClient); // Si decides reemplazar authService

// --- Servicios Manuales (Wrapper sobre los generados o lógica personalizada) ---

// --- AI Model Service ---
export const aiModelService = {
    /**
     * Fetches the available Langchain provider types.
     * Uses a manual API call due to issues with the generated client function
     * not correctly handling the projectId path parameter for this specific endpoint.
     */
    getProviderTypes: async (projectId: string): Promise<string[]> => {
        // Manual call to ensure projectId is correctly inserted into the URL
        const response = await apiClient.get<string[]>(`/api/projects/${projectId}/aimodels/providers/types`);
        return response.data;
    },
    // Puedes añadir aquí otros métodos de aiModelsGeneratedApi que quieras exponer
    // Por ejemplo, para crear un modelo:
    create: async (projectId: string, payload: generated.CreateAiModelDto): Promise<generated.AiModelResponseDto> => {
        const response = await aiModelsGeneratedApi.aiModelControllerCreate(projectId, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<generated.AiModelResponseDto[]> => {
        const response = await aiModelsGeneratedApi.aiModelControllerFindAll(projectId);
        return response.data;
    },
    findOne: async (projectId: string, aiModelId: string): Promise<generated.AiModelResponseDto> => {
        const response = await aiModelsGeneratedApi.aiModelControllerFindOne(projectId, aiModelId);
        return response.data;
    },
    update: async (projectId: string, aiModelId: string, payload: generated.UpdateAiModelDto): Promise<generated.AiModelResponseDto> => {
        const response = await aiModelsGeneratedApi.aiModelControllerUpdate(projectId, aiModelId, payload);
        return response.data;
    },
    remove: async (projectId: string, aiModelId: string): Promise<generated.AiModelResponseDto> => { // OpenAPI spec has this returning the deleted model
        const response = await aiModelsGeneratedApi.aiModelControllerRemove(projectId, aiModelId);
        return response.data;
    }
};

// Servicio de Autenticación (Mantener manual por ahora, o reemplazar con generated.AuthenticationApi)
export const authService = {
    register: async (payload: generated.RegisterDto): Promise<generated.UserProfileResponse> => {
        // Podrías reemplazar esto con:
        // const response = await authGeneratedApi.authControllerRegister(payload);
        // return response.data;
        const response = await apiClient.post<generated.UserProfileResponse>('/api/auth/register', payload);
        return response.data;
    },
    login: async (payload: generated.LoginDto, rememberMe: boolean = false): Promise<generated.LoginResponse> => {
        // Podrías reemplazar esto con:
        // const response = await authGeneratedApi.authControllerLogin(payload);
        const response = await apiClient.post<generated.LoginResponse>('/api/auth/login', payload);
        if (response.data.access_token && typeof window !== 'undefined') {
            if (rememberMe) {
                localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
                console.log('authService: Token stored in localStorage (rememberMe=true).');
            } else {
                sessionStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
                console.log('authService: Token stored in sessionStorage (rememberMe=false).');
            }
        }
        return response.data;
    },
    getCurrentUserProfile: async (): Promise<generated.UserProfileResponse> => {
        // Podrías reemplazar esto con:
        // const response = await authGeneratedApi.authControllerGetProfile();
        const response = await apiClient.get<generated.UserProfileResponse>('/api/auth/profile');
        return response.data;
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            sessionStorage.removeItem(AUTH_TOKEN_KEY); // Also remove from sessionStorage
            console.log('authService: Token removed from localStorage and sessionStorage.');
        }
    },
    isAuthenticated: (): boolean => {
        if (typeof window === 'undefined') return false;
        let token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) return true;
        token = sessionStorage.getItem(AUTH_TOKEN_KEY); // Check sessionStorage if not in localStorage
        return !!token;
    },
};

// Servicio de Usuarios (Mantener manual o reemplazar con generated.UsersApi)
export const userService = {
    findAll: async (): Promise<generated.UserProfileResponse[]> => { // Usar UserProfileResponse
        // Reemplazar con: const response = await usersGeneratedApi.userControllerFindAll(); return response.data;
        // Nota: El endpoint /api/users devuelve CreateUserDto[] según api.ts, pero usaremos UserProfileResponse consistentemente si es posible
        const response = await apiClient.get<generated.UserProfileResponse[]>('/api/users');
        return response.data;
    },
    findOne: async (id: string): Promise<generated.UserProfileResponse> => { // Usar UserProfileResponse
        // Reemplazar con: const response = await usersGeneratedApi.userControllerFindOne(id); return response.data;
        const response = await apiClient.get<generated.UserProfileResponse>(`/api/users/${id}`);
        return response.data;
    },
    create: async (payload: generated.CreateUserDto): Promise<generated.UserProfileResponse> => { // Usar UserProfileResponse
        // Reemplazar con: const response = await usersGeneratedApi.userControllerCreate(payload); return response.data;
        const response = await apiClient.post<generated.UserProfileResponse>('/api/users', payload);
        return response.data;
    },
    update: async (id: string, payload: object): Promise<generated.UserProfileResponse> => { // Usar object para payload y UserProfileResponse como retorno
        // Reemplazar con: const response = await usersGeneratedApi.userControllerUpdate(id, payload); return response.data;
        // Nota: el método generado 'userControllerUpdate' espera 'body: object'
        const response = await apiClient.patch<generated.UserProfileResponse>(`/api/users/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        // Reemplazar con: await usersGeneratedApi.userControllerRemove(id);
        await apiClient.delete(`/api/users/${id}`);
    },
};

// Servicio de Proyectos (Mantener manual o reemplazar con generated.ProjectsApi)
export const projectService = {
    findAll: async (): Promise<generated.CreateProjectDto[]> => { // Usar CreateProjectDto
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerFindAll(); return response.data;
        const response = await apiClient.get<generated.CreateProjectDto[]>('/api/projects');
        return response.data;
    },
    findMine: async (): Promise<generated.CreateProjectDto[]> => { // Usar CreateProjectDto
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerFindMine(); return response.data;
        const response = await apiClient.get<generated.CreateProjectDto[]>('/api/projects/mine');
        return response.data;
    },
    findOne: async (id: string): Promise<generated.CreateProjectDto> => { // Usar CreateProjectDto
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerFindOne(id); return response.data;
        const response = await apiClient.get<generated.CreateProjectDto>(`/api/projects/${id}`);
        return response.data;
    },
    create: async (payload: generated.CreateProjectDto): Promise<generated.CreateProjectDto> => { // Usar CreateProjectDto
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerCreate(payload); return response.data;
        const response = await apiClient.post<generated.CreateProjectDto>('/api/projects', payload);
        return response.data;
    },
    update: async (id: string, payload: generated.UpdateProjectDto): Promise<generated.CreateProjectDto> => { // Usar CreateProjectDto como retorno
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerUpdate(id, payload); return response.data;
        const response = await apiClient.patch<generated.CreateProjectDto>(`/api/projects/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        // Reemplazar con: await projectsGeneratedApi.projectControllerRemove(id);
        await apiClient.delete(`/api/projects/${id}`);
    },
};

// Servicio de Regiones (Mantener manual o reemplazar con generated.RegionsApi)
export const regionService = {
    findAll: async (projectId: string): Promise<generated.CreateRegionDto[]> => { // Usar CreateRegionDto
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.CreateRegionDto[]>(`/api/projects/${projectId}/regions`);
        return response.data;
    },
    findOne: async (projectId: string, languageCode: string): Promise<generated.CreateRegionDto> => { // Usar CreateRegionDto
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerFindOne(languageCode, projectId); return response.data;
        const response = await apiClient.get<generated.CreateRegionDto>(`/api/projects/${projectId}/regions/${languageCode}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreateRegionDto): Promise<generated.CreateRegionDto> => { // Usar CreateRegionDto
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.CreateRegionDto>(`/api/projects/${projectId}/regions`, payload);
        return response.data;
    },
    update: async (projectId: string, languageCode: string, payload: generated.UpdateRegionDto): Promise<generated.CreateRegionDto> => { // Usar CreateRegionDto como retorno
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerUpdate(languageCode, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.CreateRegionDto>(`/api/projects/${projectId}/regions/${languageCode}`, payload);
        return response.data;
    },
    remove: async (projectId: string, languageCode: string): Promise<void> => {
        // Reemplazar con: await regionsGeneratedApi.regionControllerRemove(languageCode, projectId);
        await apiClient.delete(`/api/projects/${projectId}/regions/${languageCode}`);
    },
};

// Servicio de Entornos (Actualizado para usar generado)
export const environmentService = {
    create: async (projectId: string, payload: generated.CreateEnvironmentDto): Promise<generated.CreateEnvironmentDto> => {
        const response = await environmentsGeneratedApi.environmentControllerCreate(projectId, payload);
        return response.data;
    },
    findAll: async (projectId: string): Promise<generated.CreateEnvironmentDto[]> => {
        const response = await environmentsGeneratedApi.environmentControllerFindAll(projectId);
        return response.data;
    },
    findOne: async (projectId: string, environmentId: string): Promise<generated.CreateEnvironmentDto> => {
        // Asegurar el orden correcto de parámetros para el servicio generado si es diferente
        const response = await environmentsGeneratedApi.environmentControllerFindOne(environmentId, projectId); // El generado usa (environmentId, projectId)
        return response.data;
    },
    // findByName se mantiene si existe y se usa, la API generada parece tenerlo.
    findByName: async (projectId: string, name: string): Promise<generated.CreateEnvironmentDto | null> => {
        try {
            const response = await environmentsGeneratedApi.environmentControllerFindByName(name, projectId);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 404) {
                    return null;
                }
            }
            console.error(`[environmentService.findByName] Error: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
            showErrorToast(`Failed to find environment by name: ${name}`);
            throw error;
        }
    },
    update: async (projectId: string, environmentId: string, payload: generated.UpdateEnvironmentDto): Promise<generated.CreateEnvironmentDto> => {
        // Asegurar el orden correcto de parámetros para el servicio generado si es diferente
        const response = await environmentsGeneratedApi.environmentControllerUpdate(environmentId, projectId, payload); // El generado usa (environmentId, projectId, payload)
        return response.data;
    },
    remove: async (projectId: string, environmentId: string): Promise<generated.CreateEnvironmentDto> => {
        // Asegurar el orden correcto de parámetros para el servicio generado si es diferente
        const response = await environmentsGeneratedApi.environmentControllerRemove(environmentId, projectId); // El generado usa (environmentId, projectId)
        return response.data;
    }
};

// Servicio de Tags (Actualizado para usar generado y TagDto con ID)
export const tagService = {
    findAll: async (projectId: string): Promise<generated.TagDto[]> => {
        const response = await tagsGeneratedApi.tagControllerFindAll(projectId);
        return response.data;
    },
    findOne: async (projectId: string, tagId: string): Promise<generated.TagDto> => {
        const response = await tagsGeneratedApi.tagControllerFindOne(tagId, projectId);
        return response.data;
    },
    create: async (projectId: string, data: generated.CreateTagDto): Promise<generated.TagDto> => {
        const response = await tagsGeneratedApi.tagControllerCreate(projectId, data);
        return response.data;
    },
    update: async (projectId: string, tagId: string, data: generated.UpdateTagDto): Promise<generated.TagDto> => {
        const response = await tagsGeneratedApi.tagControllerUpdate(tagId, projectId, data);
        return response.data;
    },
    delete: async (projectId: string, tagId: string): Promise<generated.TagDto> => {
        const response = await tagsGeneratedApi.tagControllerRemove(tagId, projectId);
        return response.data;
    }
};

// Servicio de Prompts (Actualizado para usar generado donde aplique)
export const promptService = {
    findAll: async (projectId: string): Promise<generated.PromptDto[]> => {
        const response = await apiClient.get<generated.PromptDto[]>(`/api/projects/${projectId}/prompts`);
        return response.data;
    },
    findOne: async (projectId: string, promptNameOrId: string): Promise<generated.PromptDto> => {
        const response = await apiClient.get<generated.PromptDto>(`/api/projects/${projectId}/prompts/${promptNameOrId}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreatePromptDto): Promise<generated.PromptDto> => {
        const response = await promptsGeneratedApi.promptControllerCreate(projectId, payload);
        return response.data;
    },
    update: async (projectId: string, promptName: string, payload: generated.UpdatePromptDto): Promise<void> => {
        await apiClient.patch<void>(`/api/projects/${projectId}/prompts/${promptName}`, payload);
    },
    remove: async (projectId: string, promptName: string): Promise<void> => {
        await apiClient.delete(`/api/projects/${projectId}/prompts/${promptName}`);
    },
    generatePromptStructure: async (projectId: string, userPrompt: string): Promise<unknown> => {
        const payload = { userPrompt: userPrompt };
        const response = await apiClient.post(`/api/projects/${projectId}/prompts/generate-structure`, payload);
        return response.data;
    },
};

// Servicio para Versiones de Prompt
export const promptVersionService = {
    findAll: async (projectId: string, promptId: string): Promise<generated.CreatePromptVersionDto[]> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindAll(projectId, promptId);
        return response.data as generated.CreatePromptVersionDto[];
    },
    findOne: async (projectId: string, promptId: string, versionTag: string): Promise<generated.CreatePromptVersionDto> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindOneByTag(projectId, promptId, versionTag);
        return response.data as generated.CreatePromptVersionDto;
    },
    create: async (projectId: string, promptId: string, payload: generated.CreatePromptVersionDto): Promise<generated.CreatePromptVersionDto> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerCreate(projectId, promptId, payload);
        return response.data as generated.CreatePromptVersionDto;
    },
    update: async (projectId: string, promptId: string, versionTag: string, payload: generated.UpdatePromptVersionDto): Promise<generated.CreatePromptVersionDto> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerUpdate(projectId, promptId, versionTag, payload);
        return response.data as generated.CreatePromptVersionDto;
    },
    remove: async (projectId: string, promptId: string, versionTag: string): Promise<void> => {
        await promptVersionsGeneratedApi.promptVersionControllerRemove(projectId, promptId, versionTag);
    },
    // Nuevos métodos para Marketplace
    requestPublish: async (projectId: string, promptId: string, versionTag: string): Promise<generated.CreatePromptVersionDto> => {
        const response = await apiClient.post<generated.CreatePromptVersionDto>(
            `/api/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/request-publish`
        );
        return response.data; // Asume que la API devuelve la versión actualizada
    },
    unpublish: async (projectId: string, promptId: string, versionTag: string): Promise<generated.CreatePromptVersionDto> => {
        const response = await apiClient.post<generated.CreatePromptVersionDto>(
            `/api/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/unpublish`
        );
        return response.data; // Asume que la API devuelve la versión actualizada (o al menos el nuevo status)
    },
};

// Servicio para Traducciones de Prompt
export const promptTranslationService = {
    findAll: async (projectId: string, promptId: string, versionTag: string): Promise<generated.CreatePromptTranslationDto[]> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerFindAll(projectId, promptId, versionTag);
        return response.data as generated.CreatePromptTranslationDto[];
    },
    findByLanguage: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<generated.CreatePromptTranslationDto> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerFindOneByLanguage(projectId, promptId, versionTag, languageCode);
        return response.data as generated.CreatePromptTranslationDto;
    },
    create: async (projectId: string, promptId: string, versionTag: string, payload: generated.CreatePromptTranslationDto): Promise<generated.CreatePromptTranslationDto> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerCreate(projectId, promptId, versionTag, payload);
        return response.data as generated.CreatePromptTranslationDto;
    },
    update: async (projectId: string, promptId: string, versionTag: string, languageCode: string, payload: generated.UpdatePromptTranslationDto): Promise<generated.CreatePromptTranslationDto> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerUpdate(projectId, promptId, versionTag, languageCode, payload);
        return response.data as generated.CreatePromptTranslationDto;
    },
    remove: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<void> => {
        await promptTranslationsGeneratedApi.promptTranslationControllerRemove(projectId, promptId, versionTag, languageCode);
    },
};

// Servicio de Prompt Assets (Corregido para usar generated.PromptAssetsApi)
export const promptAssetService = {
    findAll: async (projectId: string): Promise<PromptAssetData[]> => {
        try {
            const response = await promptAssetsGeneratedApi.promptAssetControllerFindAll(projectId);
            // Verificamos si la respuesta existe
            const assets = response && response.data ? response.data : [];
            return (assets as generated.CreatePromptAssetDto[]).map(item => ({
                ...item,
                name: item.name || item.key,
                category: item.category || 'default',
                enabled: true
            }));
        } catch (error) {
            console.error('Error fetching prompt assets:', error);
            showErrorToast('Failed to fetch prompt assets.');
            return [];
        }
    },
    findOne: async (projectId: string, assetKey: string): Promise<PromptAssetData> => {
        try {
            const response = await promptAssetsGeneratedApi.promptAssetControllerFindOne(assetKey, projectId);
            // Verificamos si la respuesta existe
            if (!response || !response.data) {
                throw new Error(`Asset with key ${assetKey} not found`);
            }
            const asset = response.data as generated.CreatePromptAssetDto;
            return {
                ...asset,
                name: asset.name || assetKey,
                category: asset.category || 'default',
                enabled: true
            };
        } catch (error) {
            console.error(`Error fetching prompt asset ${assetKey}:`, error);
            showErrorToast(`Failed to fetch prompt asset ${assetKey}.`);
            throw error;
        }
    },
    create: async (projectId: string, payload: generated.CreatePromptAssetDto): Promise<void> => {
        await promptAssetsGeneratedApi.promptAssetControllerCreate(projectId, payload);
    },
    update: async (projectId: string, assetKey: string, payload: generated.UpdatePromptAssetDto): Promise<void> => {
        await promptAssetsGeneratedApi.promptAssetControllerUpdate(assetKey, projectId, payload);
    },
    remove: async (projectId: string, assetKey: string): Promise<void> => {
        await promptAssetsGeneratedApi.promptAssetControllerRemove(assetKey, projectId);
    },
    findVersions: async (projectId: string, assetKey: string): Promise<generated.CreatePromptAssetVersionDto[]> => {
        const response = await promptAssetVersionsGeneratedApi.promptAssetVersionControllerFindAll(projectId, assetKey);
        return response.data;
    },
    findOneVersion: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await promptAssetVersionsGeneratedApi.promptAssetVersionControllerFindOneByTag(projectId, assetKey, versionTag);
        return response.data;
    },
    createVersion: async (projectId: string, assetKey: string, payload: generated.CreatePromptAssetVersionDto): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await promptAssetVersionsGeneratedApi.promptAssetVersionControllerCreate(projectId, assetKey, payload);
        return response.data;
    },
    updateVersion: async (projectId: string, assetKey: string, versionTag: string, payload: generated.UpdatePromptAssetVersionDto): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await promptAssetVersionsGeneratedApi.promptAssetVersionControllerUpdate(projectId, assetKey, versionTag, payload);
        return response.data;
    },
    removeVersion: async (projectId: string, assetKey: string, versionTag: string): Promise<void> => {
        await promptAssetVersionsGeneratedApi.promptAssetVersionControllerRemove(projectId, assetKey, versionTag);
    },
    // Nuevos métodos para Marketplace de Asset Version
    requestPublishVersion: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await apiClient.post<generated.CreatePromptAssetVersionDto>(
            `/api/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}/request-publish`
        );
        return response.data; // Asume que la API devuelve la versión actualizada
    },
    unpublishVersion: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await apiClient.post<generated.CreatePromptAssetVersionDto>(
            `/api/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}/unpublish`
        );
        return response.data; // Asume que la API devuelve la versión actualizada
    },
    findAssetTranslations: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.CreateAssetTranslationDto[]> => {
        const response = await apiClient.get<generated.CreateAssetTranslationDto[]>(`/api/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}/translations`);
        return response.data;
    },
    createAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, payload: generated.CreateAssetTranslationDto): Promise<generated.CreateAssetTranslationDto> => {
        const response = await apiClient.post<generated.CreateAssetTranslationDto>(`/api/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}/translations`, payload);
        return response.data;
    },
    updateAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, languageCode: string, payload: generated.UpdateAssetTranslationDto): Promise<generated.CreateAssetTranslationDto> => {
        const response = await apiClient.patch<generated.CreateAssetTranslationDto>(`/api/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`, payload);
        return response.data;
    },
    removeAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<void> => {
        await apiClient.delete(`/api/projects/${projectId}/prompt-assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
    }
};

// Servicio de Health Check (Mantener manual o reemplazar con generated.HealthApi)
export const healthService = {
    check: async (): Promise<generated.HealthControllerCheck200Response> => {
        const response = await apiClient.get<generated.HealthControllerCheck200Response>('/api/health');
        return response.data;
    },
};

// --- Comentando servicios que parecen incorrectos según la API generada ---
/*
// Servicio de Serve (Mantener manual o reemplazar con generated.ServePromptApi)
export const serveService = {
    // ... todo el contenido comentado ...
};
*/

// Servicio de Cultural Data (Mantener manual o reemplazar con generated.CulturalDataApi)
export const culturalDataService = {
    findAll: async (projectId: string): Promise<generated.CulturalDataResponse[]> => {
        const response = await apiClient.get<generated.CulturalDataResponse[]>(`/api/projects/${projectId}/cultural-data`);
        return response.data;
    },
    findOne: async (projectId: string, culturalDataKey: string): Promise<generated.CulturalDataResponse> => {
        const response = await apiClient.get<generated.CulturalDataResponse>(`/api/projects/${projectId}/cultural-data/${culturalDataKey}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreateCulturalDataDto): Promise<generated.CulturalDataResponse> => {
        const response = await apiClient.post<generated.CulturalDataResponse>(`/api/projects/${projectId}/cultural-data`, payload);
        return response.data;
    },
    update: async (projectId: string, culturalDataKey: string, payload: generated.UpdateCulturalDataDto): Promise<generated.CulturalDataResponse> => {
        const response = await apiClient.patch<generated.CulturalDataResponse>(`/api/projects/${projectId}/cultural-data/${culturalDataKey}`, payload);
        return response.data;
    },
    remove: async (projectId: string, culturalDataKey: string): Promise<void> => {
        await apiClient.delete(`/api/projects/${projectId}/cultural-data/${culturalDataKey}`);
    },
};

// --- Servicios Actualizados / Nuevos usando Generador ---

// Servicio de LLM Execution (Actualizado para usar generado)
export const llmExecutionService = {
    execute: async (payload: generated.ExecuteLlmDto): Promise<unknown> => {
        const response = await llmExecutionGeneratedApi.llmExecutionControllerExecuteLlm(payload);
        return response.data;
    },
};

// Servicio de System Prompts
export const systemPromptService = {
    findAll: async (): Promise<generated.CreateSystemPromptDto[]> => {
        try {
            const response = await systemPromptsGeneratedApi.systemPromptControllerFindAll();
            // Verificamos si la respuesta existe y tiene data
            if (response && response.data) {
                return response.data as generated.CreateSystemPromptDto[];
            }
            console.warn('systemPromptControllerFindAll did not return data as expected.');
            return [];
        } catch (error) {
            console.error("Error fetching system prompts:", error);
            showErrorToast('Failed to fetch system prompts.');
            return [];
        }
    },
    findOne: async (name: string): Promise<generated.CreateSystemPromptDto | null> => {
        try {
            const response = await systemPromptsGeneratedApi.systemPromptControllerFindOne(name);
            // Verificamos si la respuesta existe y tiene data
            if (response && response.data) {
                return response.data as generated.CreateSystemPromptDto;
            }
            console.warn(`systemPromptControllerFindOne(${name}) did not return data.`);
            return null;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 404) {
                    return null;
                }
            }
            console.error(`Error fetching system prompt ${name}:`, error);
            showErrorToast(`Failed to fetch system prompt ${name}.`);
            return null;
        }
    },
    create: async (payload: generated.CreateSystemPromptDto): Promise<void> => {
        await systemPromptsGeneratedApi.systemPromptControllerCreate(payload);
    },
    update: async (name: string, payload: generated.UpdateSystemPromptDto): Promise<void> => {
        await systemPromptsGeneratedApi.systemPromptControllerUpdate(name, payload);
    },
    remove: async (name: string): Promise<void> => {
        await systemPromptsGeneratedApi.systemPromptControllerRemove(name);
    }
};

// Añadir función para execute-raw (podría ir en llmExecutionService o uno nuevo)
export const rawExecutionService = {
    executeRaw: async (payload: generated.ExecuteRawDto & { variables?: Record<string, string> }): Promise<unknown> => {
        const response = await rawExecutionGeneratedApi.rawExecutionControllerExecuteRawText(payload);
        return response.data;
    }
};

// Exportación predeterminada del cliente Axios configurado
export default apiClient;

// Re-exportar puede causar conflictos si hay nombres duplicados o no deseados.
// Considera importar explícitamente lo necesario o usar alias.
export * from './generated';


