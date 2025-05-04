import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import { showErrorToast } from '@/utils/toastUtils'; // Importar la utilidad
// Importar todo lo exportado por el cliente generado
import * as generated from './generated';

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
// const authGeneratedApi = new generated.AuthenticationApi(generatedApiConfig, undefined, apiClient); // Si decides reemplazar authService

// --- Servicios Manuales (Wrapper sobre los generados o lógica personalizada) ---

// Servicio de Autenticación (Mantener manual por ahora, o reemplazar con generated.AuthenticationApi)
export const authService = {
    register: async (payload: generated.RegisterDto): Promise<generated.UserProfileResponse> => {
        // Podrías reemplazar esto con:
        // const response = await authGeneratedApi.authControllerRegister(payload);
        // return response.data;
        const response = await apiClient.post<generated.UserProfileResponse>('/api/auth/register', payload);
        return response.data;
    },
    login: async (payload: generated.LoginDto): Promise<generated.LoginResponse> => {
        // Podrías reemplazar esto con:
        // const response = await authGeneratedApi.authControllerLogin(payload);
        const response = await apiClient.post<generated.LoginResponse>('/api/auth/login', payload);
        // Guardar token después del login exitoso
        if (response.data.access_token && typeof window !== 'undefined') {
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
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

// Servicio de Usuarios (Mantener manual o reemplazar con generated.UsersApi)
export const userService = {
    findAll: async (): Promise<generated.User[]> => { // Asumiendo que el DTO generado es User
        // Reemplazar con: const response = await usersGeneratedApi.userControllerFindAll(); return response.data;
        const response = await apiClient.get<generated.User[]>('/api/users');
        return response.data;
    },
    findOne: async (id: string): Promise<generated.User> => {
        // Reemplazar con: const response = await usersGeneratedApi.userControllerFindOne(id); return response.data;
        const response = await apiClient.get<generated.User>(`/api/users/${id}`);
        return response.data;
    },
    create: async (payload: generated.CreateUserDto): Promise<generated.User> => {
        // Reemplazar con: const response = await usersGeneratedApi.userControllerCreate(payload); return response.data;
        const response = await apiClient.post<generated.User>('/api/users', payload);
        return response.data;
    },
    update: async (id: string, payload: generated.UpdateUserDto): Promise<generated.User> => {
        // Reemplazar con: const response = await usersGeneratedApi.userControllerUpdate(id, payload); return response.data;
        // Nota: el método generado 'userControllerUpdate' puede esperar 'body: object' en lugar de UpdateUserDto
        const response = await apiClient.patch<generated.User>(`/api/users/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        // Reemplazar con: await usersGeneratedApi.userControllerRemove(id);
        await apiClient.delete(`/api/users/${id}`);
    },
};

// Servicio de Proyectos (Mantener manual o reemplazar con generated.ProjectsApi)
export const projectService = {
    findAll: async (): Promise<generated.Project[]> => { // Asumiendo DTO Project
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerFindAll(); return response.data;
        const response = await apiClient.get<generated.Project[]>('/api/projects');
        return response.data;
    },
    findMine: async (): Promise<generated.Project[]> => {
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerFindMine(); return response.data;
        const response = await apiClient.get<generated.Project[]>('/api/projects/mine');
        return response.data;
    },
    findOne: async (id: string): Promise<generated.Project> => {
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerFindOne(id); return response.data;
        const response = await apiClient.get<generated.Project>(`/api/projects/${id}`);
        return response.data;
    },
    create: async (payload: generated.CreateProjectDto): Promise<generated.Project> => {
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerCreate(payload); return response.data;
        const response = await apiClient.post<generated.Project>('/api/projects', payload);
        return response.data;
    },
    update: async (id: string, payload: generated.UpdateProjectDto): Promise<generated.Project> => {
        // Reemplazar con: const response = await projectsGeneratedApi.projectControllerUpdate(id, payload); return response.data;
        const response = await apiClient.patch<generated.Project>(`/api/projects/${id}`, payload);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        // Reemplazar con: await projectsGeneratedApi.projectControllerRemove(id);
        await apiClient.delete(`/api/projects/${id}`);
    },
};

// Servicio de Regiones (Mantener manual o reemplazar con generated.RegionsApi)
export const regionService = {
    findAll: async (projectId: string): Promise<generated.Region[]> => { // Asumiendo DTO Region
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.Region[]>(`/api/projects/${projectId}/regions`);
        return response.data;
    },
    findOne: async (projectId: string, languageCode: string): Promise<generated.Region> => {
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerFindOne(languageCode, projectId); return response.data;
        const response = await apiClient.get<generated.Region>(`/api/projects/${projectId}/regions/${languageCode}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreateRegionDto): Promise<generated.Region> => {
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.Region>(`/api/projects/${projectId}/regions`, payload);
        return response.data;
    },
    update: async (projectId: string, languageCode: string, payload: generated.UpdateRegionDto): Promise<generated.Region> => {
        // Reemplazar con: const response = await regionsGeneratedApi.regionControllerUpdate(languageCode, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.Region>(`/api/projects/${projectId}/regions/${languageCode}`, payload);
        return response.data;
    },
    remove: async (projectId: string, languageCode: string): Promise<void> => {
        // Reemplazar con: await regionsGeneratedApi.regionControllerRemove(languageCode, projectId);
        await apiClient.delete(`/api/projects/${projectId}/regions/${languageCode}`);
    },
};

// Servicio de Entornos (Mantener manual o reemplazar con generated.EnvironmentsApi)
export const environmentService = {
    findAll: async (projectId: string): Promise<generated.Environment[]> => { // Asumiendo DTO Environment
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.Environment[]>(`/api/projects/${projectId}/environments`);
        return response.data;
    },
    findOne: async (projectId: string, environmentId: string): Promise<generated.Environment> => {
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerFindOne(environmentId, projectId); return response.data;
        const response = await apiClient.get<generated.Environment>(`/api/projects/${projectId}/environments/${environmentId}`);
        return response.data;
    },
    findByName: async (projectId: string, name: string): Promise<generated.Environment | null> => {
        // Reemplazar con: try { const response = await environmentsGeneratedApi.environmentControllerFindByName(name, projectId); return response.data; } catch (e) { if (e.response?.status === 404) return null; throw e; }
        try {
            const response = await apiClient.get<generated.Environment>(`/api/projects/${projectId}/environments/by-name/${name}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null; // No encontrado es un caso esperado aquí
            }
            throw error; // Relanzar otros errores
        }
    },
    create: async (projectId: string, payload: generated.CreateEnvironmentDto): Promise<generated.Environment> => {
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.Environment>(`/api/projects/${projectId}/environments`, payload);
        return response.data;
    },
    update: async (projectId: string, environmentId: string, payload: generated.UpdateEnvironmentDto): Promise<generated.Environment> => {
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerUpdate(environmentId, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.Environment>(`/api/projects/${projectId}/environments/${environmentId}`, payload);
        return response.data;
    },
    remove: async (projectId: string, environmentId: string): Promise<void> => {
        // Reemplazar con: await environmentsGeneratedApi.environmentControllerRemove(environmentId, projectId);
        await apiClient.delete(`/api/projects/${projectId}/environments/${environmentId}`);
    },
};

// Servicio de Tácticas (Mantener manual o reemplazar con generated.TacticsApi)
export const tacticService = {
    findAll: async (projectId: string): Promise<generated.TacticResponse[]> => { // Asumiendo DTO TacticResponse
        // Reemplazar con: const response = await tacticsGeneratedApi.tacticControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.TacticResponse[]>(`/api/projects/${projectId}/tactics`);
        return response.data;
    },
    findOne: async (projectId: string, tacticName: string): Promise<generated.TacticResponse> => {
        // Reemplazar con: const response = await tacticsGeneratedApi.tacticControllerFindOne(tacticName, projectId); return response.data;
        const response = await apiClient.get<generated.TacticResponse>(`/api/projects/${projectId}/tactics/${tacticName}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreateTacticDto): Promise<generated.TacticResponse> => {
        // Reemplazar con: const response = await tacticsGeneratedApi.tacticControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.TacticResponse>(`/api/projects/${projectId}/tactics`, payload);
        return response.data;
    },
    update: async (projectId: string, tacticName: string, payload: generated.UpdateTacticDto): Promise<generated.TacticResponse> => {
        // Reemplazar con: const response = await tacticsGeneratedApi.tacticControllerUpdate(tacticName, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.TacticResponse>(`/api/projects/${projectId}/tactics/${tacticName}`, payload);
        return response.data;
    },
    remove: async (projectId: string, tacticName: string): Promise<void> => {
        // Reemplazar con: await tacticsGeneratedApi.tacticControllerRemove(tacticName, projectId);
        await apiClient.delete(`/api/projects/${projectId}/tactics/${tacticName}`);
    },
};

// Servicio de Tags (Mantener manual o reemplazar con generated.TagsApi)
export const tagService = {
    findAll: async (projectId: string): Promise<generated.Tag[]> => { // Asumiendo DTO Tag
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.Tag[]>(`/api/projects/${projectId}/tags`);
        return response.data;
    },
    findOne: async (projectId: string, tagId: string): Promise<generated.Tag> => {
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerFindOne(tagId, projectId); return response.data;
        const response = await apiClient.get<generated.Tag>(`/api/projects/${projectId}/tags/${tagId}`);
        return response.data;
    },
    findByName: async (projectId: string, name: string): Promise<generated.Tag | null> => {
        // Reemplazar con: try { const response = await tagsGeneratedApi.tagControllerFindByName(name, projectId); return response.data; } catch (e) { if (e.response?.status === 404) return null; throw e; }
        try {
            const response = await apiClient.get<generated.Tag>(`/api/projects/${projectId}/tags/by-name/${name}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
    create: async (projectId: string, payload: generated.CreateTagDto): Promise<generated.Tag> => {
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.Tag>(`/api/projects/${projectId}/tags`, payload);
        return response.data;
    },
    update: async (projectId: string, tagId: string, payload: generated.UpdateTagDto): Promise<generated.Tag> => {
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerUpdate(tagId, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.Tag>(`/api/projects/${projectId}/tags/${tagId}`, payload);
        return response.data;
    },
    remove: async (projectId: string, tagId: string): Promise<void> => {
        // Reemplazar con: await tagsGeneratedApi.tagControllerRemove(tagId, projectId);
        await apiClient.delete(`/api/projects/${projectId}/tags/${tagId}`);
    },
};

// Servicio de Prompts (Actualizado para usar generado donde aplique)
export const promptService = {
    findAll: async (projectId: string): Promise<generated.Prompt[]> => {
        // Reemplazar con: const response = await promptsGeneratedApi.promptControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.Prompt[]>(`/api/projects/${projectId}/prompts`);
        return response.data;
    },
    findOne: async (projectId: string, promptName: string): Promise<generated.Prompt> => {
        // Reemplazar con: const response = await promptsGeneratedApi.promptControllerFindOne(promptName, projectId); return response.data;
        const response = await apiClient.get<generated.Prompt>(`/api/projects/${projectId}/prompts/${promptName}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreatePromptDto): Promise<generated.Prompt> => {
        // const response = await promptsGeneratedApi.promptControllerCreate(projectId, payload);
        const response = await apiClient.post<generated.Prompt>(`/api/projects/${projectId}/prompts`, payload);
        return response.data;
    },
    update: async (projectId: string, promptName: string, payload: generated.UpdatePromptDto): Promise<generated.Prompt> => {
        // const response = await promptsGeneratedApi.promptControllerUpdate(promptName, projectId, payload);
        const response = await apiClient.patch<generated.Prompt>(`/api/projects/${projectId}/prompts/${promptName}`, payload);
        return response.data;
    },
    remove: async (projectId: string, promptName: string): Promise<void> => {
        // await promptsGeneratedApi.promptControllerRemove(promptName, projectId);
        await apiClient.delete(`/api/projects/${projectId}/prompts/${promptName}`);
    },
    // <<< ESTOS MÉTODOS AHORA ESTARÁN EN SUS PROPIOS SERVICIOS >>>
    /*
    findVersions: async (projectId: string, promptName: string): Promise<generated.PromptVersion[]> => { ... },
    findVersionByTag: async (projectId: string, promptName: string, versionTag: string): Promise<generated.PromptVersion> => { ... },
    createVersion: async (projectId: string, promptName: string, payload: generated.CreatePromptVersionDto): Promise<generated.PromptVersion> => { ... },
    updateVersion: async (projectId: string, promptName: string, versionTag: string, payload: generated.UpdatePromptVersionDto): Promise<generated.PromptVersion> => { ... },
    removeVersion: async (projectId: string, promptName: string, versionTag: string): Promise<void> => { ... },
    activateVersion: async (projectId: string, promptName: string, versionTag: string, payload: generated.ActivatePromptVersionDto): Promise<void> => { ... },
    findTranslations: async (projectId: string, promptName: string, versionTag: string): Promise<generated.PromptTranslation[]> => { ... },
    findTranslationByLanguage: async (projectId: string, promptName: string, versionTag: string, languageCode: string): Promise<generated.PromptTranslation> => { ... },
    createTranslation: async (projectId: string, promptName: string, versionTag: string, payload: generated.CreatePromptTranslationDto): Promise<generated.PromptTranslation> => { ... },
    updateTranslation: async (projectId: string, promptName: string, versionTag: string, languageCode: string, payload: generated.UpdatePromptTranslationDto): Promise<generated.PromptTranslation> => { ... },
    removeTranslation: async (projectId: string, promptName: string, versionTag: string, languageCode: string): Promise<void> => { ... },
    addOrUpdateTranslation: async (projectId: string, promptName: string, versionId: string, payload: generated.CreateOrUpdatePromptTranslationDto): Promise<void> => { ... },
    */
};

// Servicio para Versiones de Prompt
export const promptVersionService = {
    findAll: async (projectId: string, promptId: string): Promise<generated.PromptVersion[]> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindAll(projectId, promptId);
        // Ajustar tipo si el generado devuelve CreatePromptVersionDto[]
        return response.data as generated.PromptVersion[]; 
    },
    findOne: async (projectId: string, promptId: string, versionTag: string): Promise<generated.PromptVersion> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindOneByTag(projectId, promptId, versionTag);
         // Ajustar tipo si el generado devuelve CreatePromptVersionDto
        return response.data as generated.PromptVersion;
    },
    create: async (projectId: string, promptId: string, payload: generated.CreatePromptVersionDto): Promise<generated.PromptVersion> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerCreate(projectId, promptId, payload);
         // Ajustar tipo si el generado devuelve CreatePromptVersionDto
        return response.data as generated.PromptVersion;
    },
    update: async (projectId: string, promptId: string, versionTag: string, payload: generated.UpdatePromptVersionDto): Promise<generated.PromptVersion> => {
        const response = await promptVersionsGeneratedApi.promptVersionControllerUpdate(projectId, promptId, versionTag, payload);
         // Ajustar tipo si el generado devuelve CreatePromptVersionDto
        return response.data as generated.PromptVersion;
    },
    remove: async (projectId: string, promptId: string, versionTag: string): Promise<void> => {
        await promptVersionsGeneratedApi.promptVersionControllerRemove(projectId, promptId, versionTag);
    },
    // activate: async (...) => { ... } // Añadir si existe método generado para activar
};

// Servicio para Traducciones de Prompt
export const promptTranslationService = {
    findAll: async (projectId: string, promptId: string, versionTag: string): Promise<generated.PromptTranslation[]> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerFindAll(projectId, promptId, versionTag);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto[]
        return response.data as generated.PromptTranslation[];
    },
    findByLanguage: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<generated.PromptTranslation> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerFindOneByLanguage(projectId, promptId, versionTag, languageCode);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto
        return response.data as generated.PromptTranslation;
    },
    create: async (projectId: string, promptId: string, versionTag: string, payload: generated.CreatePromptTranslationDto): Promise<generated.PromptTranslation> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerCreate(projectId, promptId, versionTag, payload);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto
        return response.data as generated.PromptTranslation;
    },
    update: async (projectId: string, promptId: string, versionTag: string, languageCode: string, payload: generated.UpdatePromptTranslationDto): Promise<generated.PromptTranslation> => {
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerUpdate(projectId, promptId, versionTag, languageCode, payload);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto
        return response.data as generated.PromptTranslation;
    },
    remove: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<void> => {
        await promptTranslationsGeneratedApi.promptTranslationControllerRemove(projectId, promptId, versionTag, languageCode);
    },
    // addOrUpdate: async (...) => { ... } // Añadir si existe método generado
};

// Servicio de Prompt Assets (Mantener manual o reemplazar con generated.PromptAssetsApi)
export const promptAssetService = {
    findAll: async (projectId: string): Promise<generated.PromptAsset[]> => { // Asumiendo DTO PromptAsset
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.PromptAsset[]>(`/api/projects/${projectId}/assets`);
        return response.data;
    },
    findOne: async (projectId: string, assetKey: string): Promise<generated.PromptAsset> => {
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerFindOne(assetKey, projectId); return response.data;
        const response = await apiClient.get<generated.PromptAsset>(`/api/projects/${projectId}/assets/${assetKey}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreatePromptAssetDto): Promise<generated.PromptAsset> => {
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerCreate(projectId, payload); return response.data;
        // Nota: El generado devuelve void. Mantener la llamada manual que asume PromptAsset.
        const response = await apiClient.post<generated.PromptAsset>(`/api/projects/${projectId}/assets`, payload);
        return response.data;
    },
    update: async (projectId: string, assetKey: string, payload: generated.UpdatePromptAssetDto): Promise<generated.PromptAsset> => {
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerUpdate(assetKey, projectId, payload); return response.data;
        // Nota: El generado devuelve void. Mantener la llamada manual que asume PromptAsset.
        const response = await apiClient.patch<generated.PromptAsset>(`/api/projects/${projectId}/assets/${assetKey}`, payload);
        return response.data;
    },
    remove: async (projectId: string, assetKey: string): Promise<void> => {
        // Reemplazar con: await promptAssetsGeneratedApi.promptAssetControllerRemove(assetKey, projectId);
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}`);
    },
    // Versiones de Asset (Mantener manual o reemplazar con generated.PromptAssetVersionsWithinProjectAssetApi)
    findVersions: async (projectId: string, assetKey: string): Promise<generated.PromptAssetVersion[]> => { // Asumiendo DTO PromptAssetVersion
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerFindAll(projectId, assetKey); return response.data;
        const response = await apiClient.get<generated.PromptAssetVersion[]>(`/api/projects/${projectId}/assets/${assetKey}/versions`);
        return response.data;
    },
    findVersionByTag: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.PromptAssetVersion> => {
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerFindOneByTag(projectId, assetKey, versionTag); return response.data;
        const response = await apiClient.get<generated.PromptAssetVersion>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`);
        return response.data;
    },
    createVersion: async (projectId: string, assetKey: string, payload: generated.CreatePromptAssetVersionDto): Promise<generated.PromptAssetVersion> => {
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerCreate(projectId, assetKey, payload); return response.data;
        const response = await apiClient.post<generated.PromptAssetVersion>(`/api/projects/${projectId}/assets/${assetKey}/versions`, payload);
        return response.data;
    },
    updateVersion: async (projectId: string, assetKey: string, versionTag: string, payload: generated.UpdatePromptAssetVersionDto): Promise<generated.PromptAssetVersion> => {
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerUpdate(projectId, assetKey, versionTag, payload); return response.data;
        const response = await apiClient.patch<generated.PromptAssetVersion>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`, payload);
        return response.data;
    },
    removeVersion: async (projectId: string, assetKey: string, versionTag: string): Promise<void> => {
        // Reemplazar con: await assetVersionsGeneratedApi.promptAssetVersionControllerRemove(projectId, assetKey, versionTag);
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`);
    },
    // Traducciones de Asset (Mantener manual o reemplazar con generated.AssetTranslationsWithinProjectAssetVersionApi)
    findAssetTranslations: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.PromptAssetTranslation[]> => { // Asumiendo DTO PromptAssetTranslation
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerFindAll(projectId, assetKey, versionTag); return response.data;
        const response = await apiClient.get<generated.PromptAssetTranslation[]>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations`);
        return response.data;
    },
    findAssetTranslationByLanguage: async (projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<generated.PromptAssetTranslation> => {
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerFindOneByLanguage(projectId, assetKey, versionTag, languageCode); return response.data;
        const response = await apiClient.get<generated.PromptAssetTranslation>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
        return response.data;
    },
    createAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, payload: generated.CreateAssetTranslationDto): Promise<generated.PromptAssetTranslation> => {
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerCreate(projectId, assetKey, versionTag, payload); return response.data;
        const response = await apiClient.post<generated.PromptAssetTranslation>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations`, payload);
        return response.data;
    },
    updateAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, languageCode: string, payload: generated.UpdateAssetTranslationDto): Promise<generated.PromptAssetTranslation> => {
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerUpdate(projectId, assetKey, versionTag, languageCode, payload); return response.data;
        const response = await apiClient.patch<generated.PromptAssetTranslation>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`, payload);
        return response.data;
    },
    removeAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<void> => {
        // Reemplazar con: await assetTranslationsGeneratedApi.assetTranslationControllerRemove(projectId, assetKey, versionTag, languageCode);
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
    },
    // Links de Asset (Mantener manual o reemplazar con generated.PromptAssetLinksWithinProjectVersionApi)
    findAssetLinks: async (projectId: string, promptVersionId: string): Promise<generated.PromptAssetLink[]> => { // Asumiendo DTO PromptAssetLink
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerFindAll(projectId, promptVersionId); return response.data;
        const response = await apiClient.get<generated.PromptAssetLink[]>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links`);
        return response.data;
    },
    findAssetLink: async (projectId: string, promptVersionId: string, linkId: string): Promise<generated.PromptAssetLink> => {
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerFindOne(projectId, promptVersionId, linkId); return response.data;
        const response = await apiClient.get<generated.PromptAssetLink>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links/${linkId}`);
        return response.data;
    },
    createAssetLink: async (projectId: string, promptVersionId: string, payload: generated.CreatePromptAssetLinkDto): Promise<generated.PromptAssetLink> => {
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerCreate(projectId, promptVersionId, payload); return response.data;
        const response = await apiClient.post<generated.PromptAssetLink>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links`, payload);
        return response.data;
    },
    updateAssetLink: async (projectId: string, promptVersionId: string, linkId: string, payload: generated.UpdatePromptAssetLinkDto): Promise<generated.PromptAssetLink> => {
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerUpdate(projectId, promptVersionId, linkId, payload); return response.data;
        const response = await apiClient.patch<generated.PromptAssetLink>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links/${linkId}`, payload);
        return response.data;
    },
    removeAssetLink: async (projectId: string, promptVersionId: string, linkId: string): Promise<void> => {
        // Reemplazar con: await assetLinksGeneratedApi.promptAssetLinkControllerRemove(projectId, promptVersionId, linkId);
        await apiClient.delete(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links/${linkId}`);
    },
};

// Servicio de Health Check (Mantener manual o reemplazar con generated.HealthApi)
export const healthService = {
    check: async (): Promise<generated.HealthCheckResult> => { // Asumiendo DTO HealthCheckResult
        // Reemplazar con: const response = await healthGeneratedApi.healthControllerCheck(); return response.data;
        const response = await apiClient.get<generated.HealthCheckResult>('/api/health');
        return response.data;
    },
};

// Servicio de Serve (Mantener manual o reemplazar con generated.ServePromptApi)
export const serveService = {
    /** Sirve un prompt específico por su ID */
    servePromptById: async (projectId: string, promptId: string, payload: generated.ServePromptDto): Promise<generated.ServePromptResponse> => { // Asumiendo DTOs ServePromptDto, ServePromptResponse
        // Reemplazar con: const response = await servePromptGeneratedApi.servePromptControllerServePromptById(projectId, promptId, payload); return response.data;
        const response = await apiClient.post<generated.ServePromptResponse>(`/api/projects/${projectId}/serve/prompt/${promptId}`, payload);
        return response.data;
    },
    /** Sirve un prompt por el nombre único del prompt */
    servePromptByName: async (projectId: string, promptName: string, payload: generated.ServePromptDto): Promise<generated.ServePromptResponse> => {
        // Reemplazar con: const response = await servePromptGeneratedApi.servePromptControllerServePromptByName(projectId, promptName, payload); return response.data;
        const response = await apiClient.post<generated.ServePromptResponse>(`/api/projects/${projectId}/serve/prompt-by-name/${promptName}`, payload);
        return response.data;
    },
    /** Sirve un prompt basado en una Tactic ID */
    servePromptByTactic: async (projectId: string, tacticId: string, payload: generated.ServePromptByTacticDto): Promise<generated.ServePromptByTacticResponse> => { // Asumiendo DTOs ServePromptByTacticDto, ServePromptByTacticResponse
        // Reemplazar con: const response = await servePromptGeneratedApi.servePromptControllerServeByTacticId(projectId, tacticId, payload); return response.data;
        const response = await apiClient.post<generated.ServePromptByTacticResponse>(`/api/projects/${projectId}/serve/tactic/${tacticId}`, payload);
        return response.data;
    },
    /** Sirve un prompt basado en el nombre único de la Tactic */
    servePromptByTacticName: async (projectId: string, tacticName: string, payload: generated.ServePromptByTacticDto): Promise<generated.ServePromptByTacticResponse> => {
        // Reemplazar con: const response = await servePromptGeneratedApi.servePromptControllerServeByTacticName(projectId, tacticName, payload); return response.data;
        const response = await apiClient.post<generated.ServePromptByTacticResponse>(`/api/projects/${projectId}/serve/tactic-by-name/${tacticName}`, payload);
        return response.data;
    },
    // Nota: El endpoint POST /serve-prompt/execute/{projectId}/{promptName}/{versionTag} no parece estar cubierto directamente por ServePromptApi
    // Se mapea a llmExecutionControllerExecutePrompt en ServePromptApi, pero requiere un DTO `ExecutePromptBodyDto`.
    // Lo dejaremos en llmExecutionService por ahora, que usa un endpoint diferente /llm-execution/execute.
};

// Servicio de Cultural Data (Mantener manual o reemplazar con generated.CulturalDataApi)
export const culturalDataService = {
    findAll: async (projectId: string): Promise<generated.CulturalDataResponse[]> => { // Asumiendo DTO CulturalDataResponse
        // Reemplazar con: const response = await culturalDataGeneratedApi.culturalDataControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.CulturalDataResponse[]>(`/api/projects/${projectId}/cultural-data`);
        return response.data;
    },
    findOne: async (projectId: string, culturalDataId: string): Promise<generated.CulturalDataResponse> => {
        // Reemplazar con: const response = await culturalDataGeneratedApi.culturalDataControllerFindOne(culturalDataId, projectId); return response.data;
        const response = await apiClient.get<generated.CulturalDataResponse>(`/api/projects/${projectId}/cultural-data/${culturalDataId}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreateCulturalDataDto): Promise<generated.CulturalDataResponse> => {
        // Reemplazar con: const response = await culturalDataGeneratedApi.culturalDataControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.CulturalDataResponse>(`/api/projects/${projectId}/cultural-data`, payload);
        return response.data;
    },
    update: async (projectId: string, culturalDataId: string, payload: generated.UpdateCulturalDataDto): Promise<generated.CulturalDataResponse> => {
        // Reemplazar con: const response = await culturalDataGeneratedApi.culturalDataControllerUpdate(culturalDataId, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.CulturalDataResponse>(`/api/projects/${projectId}/cultural-data/${culturalDataId}`, payload);
        return response.data;
    },
    remove: async (projectId: string, culturalDataId: string): Promise<void> => {
        // Reemplazar con: await culturalDataGeneratedApi.culturalDataControllerRemove(culturalDataId, projectId);
        await apiClient.delete(`/api/projects/${projectId}/cultural-data/${culturalDataId}`);
    },
};


// --- Servicios Actualizados / Nuevos usando Generador ---

// Servicio de AI Models (Actualizado para usar generado)
export const aiModelService = {
    findAll: async (projectId: string): Promise<generated.CreateAiModelDto[]> => {
        const response = await aiModelsGeneratedApi.aiModelControllerFindAll(projectId);
        // El tipo de retorno real del método generado es Array<CreateAiModelDto>, no AiModel[]
        // Se ajusta el tipo de retorno del wrapper
        return response.data;
    },
    findOne: async (projectId: string, id: string): Promise<generated.CreateAiModelDto> => {
        const response = await aiModelsGeneratedApi.aiModelControllerFindOne(projectId, id);
        // El tipo de retorno real es CreateAiModelDto
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreateAiModelDto): Promise<generated.CreateAiModelDto> => {
        const response = await aiModelsGeneratedApi.aiModelControllerCreate(projectId, payload);
        // El tipo de retorno real es CreateAiModelDto
        return response.data;
    },
    update: async (projectId: string, id: string, payload: generated.UpdateAiModelDto): Promise<generated.CreateAiModelDto> => {
        const response = await aiModelsGeneratedApi.aiModelControllerUpdate(projectId, id, payload);
        // El tipo de retorno real es CreateAiModelDto
        return response.data;
    },
    remove: async (projectId: string, id: string): Promise<void> => {
        // El método generado remove devuelve CreateAiModelDto, pero lo ignoramos aquí ya que solo necesitamos el efecto secundario
        await aiModelsGeneratedApi.aiModelControllerRemove(projectId, id);
    },
};

// Servicio de LLM Execution (Nuevo, usando generado)
export const llmExecutionService = {
    // El tipo de retorno del método generado es 'any'. Se puede especificar un tipo más concreto si se conoce la estructura de la respuesta.
    execute: async (payload: generated.ExecuteLlmDto): Promise<any> => {
        const response = await llmExecutionGeneratedApi.llmExecutionControllerExecuteLlm(payload);
        return response.data;
    },
};

// Exportación predeterminada del cliente Axios configurado
export default apiClient;

// YA NO SON NECESARIAS LAS INTERFACES MANUALES PARA LLM EXECUTION
// export interface LlmExecutionPayload { ... }
// export interface LlmExecutionResponse { ... }
