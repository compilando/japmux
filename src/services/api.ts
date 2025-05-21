import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showErrorToast } from '@/utils/toastUtils'; // Importar la utilidad
// Importar todo lo exportado por el cliente generado
import * as generated from './generated';
// Eliminar esta importación, apiClient se define abajo
// import { apiClient } from '../axiosClient';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
// Eliminar la importación anterior si existe:
// import { PromptVersionData } from '@/app/(admin)/projects/[projectId]/prompts/[promptId]/versions/page.tsx';

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
const promptAssetsGeneratedApi = new generated.PromptAssetsForASpecificPromptApi(generatedApiConfig, undefined, apiClient);
// Instanciar PromptAssetVersionsApi aquí para que esté disponible para el servicio, CON EL NOMBRE CORRECTO
const promptAssetVersionsGeneratedApi = new generated.PromptAssetVersionsWithinProjectAssetApi(generatedApiConfig, undefined, apiClient);
// Instanciar PromptAssetTranslationsApi aquí para que esté disponible para el servicio
// Esta constante no se utiliza actualmente, podría ser necesaria en el futuro
// const promptAssetTranslationsGeneratedApi = new generated.AssetTranslationsWithinProjectAssetVersionApi(generatedApiConfig, undefined, apiClient);
// const authGeneratedApi = new generated.AuthenticationApi(generatedApiConfig, undefined, apiClient); // Si decides reemplazar authService

// Variable para la instancia de PromptAssetVersionsApi con el nombre corregido (inicialización perezosa)
let _promptAssetVersionsGeneratedApi: generated.PromptAssetVersionsWithinProjectAssetApi | null = null;

// Función getter para PromptAssetVersionsApi con el nombre corregido
function getPromptAssetVersionsGeneratedApi(): generated.PromptAssetVersionsWithinProjectAssetApi {
    if (!_promptAssetVersionsGeneratedApi) {
        // Usar el nombre de clase correcto aquí:
        _promptAssetVersionsGeneratedApi = new generated.PromptAssetVersionsWithinProjectAssetApi(generatedApiConfig, undefined, apiClient);
    }
    return _promptAssetVersionsGeneratedApi;
}

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
    create: async (projectId: string, payload: Omit<generated.CreatePromptDto, 'tenantId'>): Promise<generated.PromptDto> => {
        try {
            const response = await promptsGeneratedApi.promptControllerCreate(projectId, payload as generated.CreatePromptDto);
            return response.data;
        } catch (error) {
            console.error('Error creating prompt:', error);
            throw error;
        }
    },
    findAll: async (projectId: string): Promise<generated.PromptDto[]> => {
        const response = await promptsGeneratedApi.promptControllerFindAllByProject(projectId);
        return response.data;
    },
    findOne: async (projectId: string, promptId: string): Promise<generated.PromptDto> => {
        const response = await promptsGeneratedApi.promptControllerFindOne(projectId, promptId);
        return response.data;
    },
    update: async (projectId: string, promptInternalId: string, payload: generated.UpdatePromptDto): Promise<generated.PromptDto> => {
        const response = await promptsGeneratedApi.promptControllerUpdate(projectId, promptInternalId, payload);
        return response.data;
    },
    remove: async (projectId: string, promptIdSlug: string): Promise<void> => {
        await apiClient.delete(`/api/projects/${projectId}/prompts/${promptIdSlug}`);
    },
    generatePromptStructure: async (projectId: string, userPromptText: string): Promise<generated.LoadPromptStructureDto> => {
        const payload: generated.GeneratePromptStructureDto = { userPrompt: userPromptText };
        const response = await apiClient.post<generated.LoadPromptStructureDto>(`/api/projects/${projectId}/prompts/generate-structure`, payload);
        return response.data;
    },
    loadPromptStructure: async (projectId: string, structure: generated.LoadPromptStructureDto): Promise<generated.LoadPromptStructureDto> => {
        const response = await apiClient.post<generated.LoadPromptStructureDto>(`/api/projects/${projectId}/prompts/load-structure`, structure);
        return response.data;
    }
};

// Interfaz local para el servicio, debería coincidir o ser compatible con PromptVersionData de la página
interface PromptVersionDetail extends generated.CreatePromptVersionDto {
    id: string;
    versionTag: string;
    isActive: boolean;
    languageCode?: string;
    // Añadir otros campos que se esperan de findOne y que están en PromptVersionData
}

// Servicio para Versiones de Prompt
export const promptVersionService = {
    findAll: async (projectId: string, promptId: string): Promise<generated.CreatePromptVersionDto[]> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindAll(projectId, promptId);
        return response.data;
    },
    findOne: async (projectId: string, promptId: string, versionTag: string, processed?: boolean): Promise<generated.CreatePromptVersionDto> => {
        let url = `/api/projects/${projectId}/prompts/${promptId}/versions/${versionTag}`;
        if (processed) url += '?processed=true';
        const response = await apiClient.get<generated.CreatePromptVersionDto>(url);
        return response.data;
    },
    create: async (projectId: string, promptId: string, payload: generated.CreatePromptVersionDto): Promise<generated.CreatePromptVersionDto> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerCreate(projectId, promptId, payload);
        return response.data;
    },
    update: async (projectId: string, promptId: string, versionTag: string, payload: generated.UpdatePromptVersionDto): Promise<generated.CreatePromptVersionDto> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerUpdate(projectId, promptId, versionTag, payload);
        return response.data;
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
        return response.data;
    },
    findByLanguage: async (projectId: string, promptId: string, versionTag: string, languageCode: string, processed?: boolean): Promise<generated.CreatePromptTranslationDto> => {
        let url = `/api/projects/${projectId}/prompts/${promptId}/versions/${versionTag}/translations/${languageCode}`;
        if (processed) url += '?processed=true';
        const response = await apiClient.get<generated.CreatePromptTranslationDto>(url);
        return response.data;
    },
    create: async (projectId: string, promptId: string, versionTag: string, payload: generated.CreatePromptTranslationDto): Promise<generated.CreatePromptTranslationDto> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerCreate(projectId, promptId, versionTag, payload);
        return response.data;
    },
    update: async (projectId: string, promptId: string, versionTag: string, languageCode: string, payload: generated.UpdatePromptTranslationDto): Promise<generated.CreatePromptTranslationDto> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerUpdate(projectId, promptId, versionTag, languageCode, payload);
        return response.data;
    },
    remove: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<void> => {
        await promptTranslationsGeneratedApi.promptTranslationControllerRemove(projectId, promptId, versionTag, languageCode);
    },
};

// Servicio de Prompt Assets (Corregido para usar generated.PromptAssetsApi)
export const promptAssetService = {
    findAll: async (projectId: string, promptId: string): Promise<PromptAssetData[]> => {
        console.log("DEBUG: promptAssetService.findAll - received projectId:", projectId);
        console.log("DEBUG: promptAssetService.findAll - received promptId:", promptId);
        const response = await promptAssetsGeneratedApi.promptAssetControllerFindAll(promptId, projectId);
        const responseData = response.data;
        if (Array.isArray(responseData)) {
            const assets = responseData as generated.CreatePromptAssetDto[];
            return assets.map(item => ({
                ...item,
                key: item.key || '',
                projectId: projectId,
                promptId: promptId,
            }));
        }
        console.warn("[promptAssetService.findAll] response.data no es un array o es void. Devolviendo array vacío.");
        return [];
    },
    findOne: async (projectId: string, promptId: string, assetKey: string): Promise<PromptAssetData> => {
        const response = await promptAssetsGeneratedApi.promptAssetControllerFindOne(promptId, projectId, assetKey);
        const asset = response.data as any;
        return {
            ...asset,
            key: asset.key || assetKey,
            projectId: projectId,
            promptId: promptId,
        } as PromptAssetData;
    },
    create: async (projectId: string, promptId: string, payload: generated.CreatePromptAssetDto): Promise<void> => {
        await promptAssetsGeneratedApi.promptAssetControllerCreate(promptId, projectId, payload);
    },
    update: async (projectId: string, promptId: string, assetKey: string, payload: generated.UpdatePromptAssetDto): Promise<void> => {
        await promptAssetsGeneratedApi.promptAssetControllerUpdate(promptId, projectId, assetKey, payload);
    },
    remove: async (projectId: string, promptId: string, assetKey: string): Promise<void> => {
        await promptAssetsGeneratedApi.promptAssetControllerRemove(promptId, projectId, assetKey);
    },
    findVersions: async (projectId: string, promptId: string, assetKey: string): Promise<generated.CreatePromptAssetVersionDto[]> => {
        // Construcción manual de la URL para asegurar que promptId está incluido y se usa /assets/
        const response = await apiClient.get<generated.CreatePromptAssetVersionDto[]>(`/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions`);
        return response.data;
    },
    findOneVersion: async (
        projectId: string,
        promptId: string, // Necesario para construir la URL correcta
        assetKey: string,
        versionTag: string
    ): Promise<generated.CreatePromptAssetVersionDto> => {
        console.log('[promptAssetService.findOneVersion] Usando apiClient.get directamente.');
        console.log('[promptAssetService.findOneVersion] Project ID:', projectId);
        console.log('[promptAssetService.findOneVersion] Prompt ID:', promptId);
        console.log('[promptAssetService.findOneVersion] Asset Key:', assetKey);
        console.log('[promptAssetService.findOneVersion] Version Tag:', versionTag);

        const url = `/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}`;

        try {
            const response = await apiClient.get<generated.CreatePromptAssetVersionDto>(url);
            console.log('[promptAssetService.findOneVersion] Datos recibidos:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener la versión del asset (${url}):`, error);
            throw error;
        }
    },
    createVersion: async (projectId: string, promptId: string, assetKey: string, payload: generated.CreatePromptAssetVersionDto): Promise<generated.CreatePromptAssetVersionDto> => {
        // El método generado promptAssetVersionControllerCreate probablemente omite promptId en la URL,
        // construyendo algo como /api/projects/{projectId}/assets/{assetKey}/versions.
        // Necesitamos POST a /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions.
        const url = `/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions`;
        console.log('[promptAssetService.createVersion] Usando apiClient.post. URL:', url, 'Payload:', payload);
        try {
            const response = await apiClient.post<generated.CreatePromptAssetVersionDto>(url, payload);
            return response.data;
        } catch (error) {
            // Mostrar un error más específico o relanzar
            showErrorToast(`Failed to create asset version: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error(`Error creating asset version (${url}):`, error);
            throw error; // Relanzar para que la página pueda manejar el estado de carga/error si es necesario
        }
    },
    updateVersion: async (
        projectId: string,
        promptId: string,
        assetKey: string,
        versionTag: string,
        payload: generated.UpdatePromptAssetVersionDto
    ): Promise<generated.CreatePromptAssetVersionDto> => {
        console.log('[promptAssetService.updateVersion] Usando apiClient.patch directamente.');
        console.log('[promptAssetService.updateVersion] Project ID:', projectId);
        console.log('[promptAssetService.updateVersion] Prompt ID:', promptId);
        console.log('[promptAssetService.updateVersion] Asset Key:', assetKey);
        console.log('[promptAssetService.updateVersion] Version Tag:', versionTag);
        console.log('[promptAssetService.updateVersion] Payload enviado:', JSON.stringify(payload));

        const url = `/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}`;

        try {
            const response = await apiClient.patch<generated.CreatePromptAssetVersionDto>(url, payload);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar la versión del asset (${url}):`, error);
            throw error;
        }
    },
    removeVersion: async (projectId: string, promptId: string, assetKey: string, versionTag: string): Promise<void> => {
        // El método generado promptAssetVersionControllerRemove probablemente omite promptId en la URL.
        // Construir manualmente la URL para asegurar que promptId está incluido.
        const url = `/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}`;
        console.log('[promptAssetService.removeVersion] Usando apiClient.delete directamente. URL:', url);
        try {
            await apiClient.delete(url);
        } catch (error) {
            // Mostrar un error más específico o relanzar
            showErrorToast(`Failed to delete asset version ${versionTag}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error(`Error deleting asset version ${versionTag} (${url}):`, error);
            throw error; // Relanzar para que la página pueda manejar el estado de carga/error si es necesario
        }
    },
    requestPublishVersion: async (projectId: string, promptId: string, assetKey: string, versionTag: string): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await apiClient.post<generated.CreatePromptAssetVersionDto>(
            `/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}/request-publish`
        );
        return response.data;
    },
    unpublishVersion: async (projectId: string, promptId: string, assetKey: string, versionTag: string): Promise<generated.CreatePromptAssetVersionDto> => {
        const response = await apiClient.post<generated.CreatePromptAssetVersionDto>(
            `/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}/unpublish`
        );
        return response.data;
    },
    findTranslations: async (projectId: string, promptId: string, assetKey: string, versionTag: string): Promise<generated.CreateAssetTranslationDto[]> => {
        const response = await apiClient.get<generated.CreateAssetTranslationDto[]>(`/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}/translations`);
        return response.data;
    },
    createTranslation: async (projectId: string, promptId: string, assetKey: string, versionTag: string, payload: generated.CreateAssetTranslationDto): Promise<generated.CreateAssetTranslationDto> => {
        const response = await apiClient.post<generated.CreateAssetTranslationDto>(`/api/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${versionTag}/translations`, payload);
        return response.data;
    },
};

// Servicio de Health Check
export const healthService = {
    check: async (): Promise<boolean> => {
        try {
            const response = await apiClient.get('/api/health');
            return response.status === 200;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
};