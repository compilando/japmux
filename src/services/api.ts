import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import { showErrorToast } from '@/utils/toastUtils'; // Importar la utilidad
// Importar todo lo exportado por el cliente generado
import * as generated from '../../generated/japmux-api';
// Eliminar esta importación, apiClient se define abajo
// import { apiClient } from '../axiosClient';

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

// Servicio de Entornos (Mantener manual o reemplazar con generated.EnvironmentsApi)
export const environmentService = {
    findAll: async (projectId: string): Promise<generated.CreateEnvironmentDto[]> => { // Usar CreateEnvironmentDto
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.CreateEnvironmentDto[]>(`/api/projects/${projectId}/environments`);
        return response.data;
    },
    findOne: async (projectId: string, environmentId: string): Promise<generated.CreateEnvironmentDto> => { // Usar CreateEnvironmentDto
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerFindOne(environmentId, projectId); return response.data;
        const response = await apiClient.get<generated.CreateEnvironmentDto>(`/api/projects/${projectId}/environments/${environmentId}`);
        return response.data;
    },
    findByName: async (projectId: string, name: string): Promise<generated.CreateEnvironmentDto | null> => { // Usar CreateEnvironmentDto
        // Reemplazar con: try { const response = await environmentsGeneratedApi.environmentControllerFindByName(name, projectId); return response.data; } catch (e) { if (e.response?.status === 404) return null; throw e; }
        try {
            const response = await apiClient.get<generated.CreateEnvironmentDto>(`/api/projects/${projectId}/environments/by-name/${name}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null; // No encontrado es un caso esperado aquí
            }
            throw error; // Relanzar otros errores
        }
    },
    create: async (projectId: string, payload: generated.CreateEnvironmentDto): Promise<generated.CreateEnvironmentDto> => { // Usar CreateEnvironmentDto
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.CreateEnvironmentDto>(`/api/projects/${projectId}/environments`, payload);
        return response.data;
    },
    update: async (projectId: string, environmentId: string, payload: generated.UpdateEnvironmentDto): Promise<generated.CreateEnvironmentDto> => { // Usar CreateEnvironmentDto como retorno
        // Reemplazar con: const response = await environmentsGeneratedApi.environmentControllerUpdate(environmentId, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.CreateEnvironmentDto>(`/api/projects/${projectId}/environments/${environmentId}`, payload);
        return response.data;
    },
    remove: async (projectId: string, environmentId: string): Promise<void> => {
        // Reemplazar con: await environmentsGeneratedApi.environmentControllerRemove(environmentId, projectId);
        await apiClient.delete(`/api/projects/${projectId}/environments/${environmentId}`);
    },
};

// Servicio de Tags (Mantener manual o reemplazar con generated.TagsApi)
export const tagService = {
    findAll: async (projectId: string): Promise<generated.CreateTagDto[]> => { // Usar CreateTagDto
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.CreateTagDto[]>(`/api/projects/${projectId}/tags`);
        return response.data;
    },
    findOne: async (projectId: string, tagId: string): Promise<generated.CreateTagDto> => { // Usar CreateTagDto
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerFindOne(tagId, projectId); return response.data;
        const response = await apiClient.get<generated.CreateTagDto>(`/api/projects/${projectId}/tags/${tagId}`);
        return response.data;
    },
    findByName: async (projectId: string, name: string): Promise<generated.CreateTagDto | null> => { // Usar CreateTagDto
        // Reemplazar con: try { const response = await tagsGeneratedApi.tagControllerFindByName(name, projectId); return response.data; } catch (e) { if (e.response?.status === 404) return null; throw e; }
        try {
            const response = await apiClient.get<generated.CreateTagDto>(`/api/projects/${projectId}/tags/by-name/${name}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
    create: async (projectId: string, payload: generated.CreateTagDto): Promise<generated.CreateTagDto> => { // Usar CreateTagDto
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerCreate(projectId, payload); return response.data;
        const response = await apiClient.post<generated.CreateTagDto>(`/api/projects/${projectId}/tags`, payload);
        return response.data;
    },
    update: async (projectId: string, tagId: string, payload: generated.UpdateTagDto): Promise<generated.CreateTagDto> => { // Usar CreateTagDto como retorno
        // Reemplazar con: const response = await tagsGeneratedApi.tagControllerUpdate(tagId, projectId, payload); return response.data;
        const response = await apiClient.patch<generated.CreateTagDto>(`/api/projects/${projectId}/tags/${tagId}`, payload);
        return response.data;
    },
    remove: async (projectId: string, tagId: string): Promise<void> => {
        // Reemplazar con: await tagsGeneratedApi.tagControllerRemove(tagId, projectId);
        await apiClient.delete(`/api/projects/${projectId}/tags/${tagId}`);
    },
};

// Servicio de Prompts (Actualizado para usar generado donde aplique)
export const promptService = {
    findAll: async (projectId: string): Promise<generated.CreatePromptDto[]> => { // Usar CreatePromptDto
        // Reemplazar con: const response = await promptsGeneratedApi.promptControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.CreatePromptDto[]>(`/api/projects/${projectId}/prompts`);
        return response.data;
    },
    findOne: async (projectId: string, promptName: string): Promise<generated.CreatePromptDto> => { // Usar CreatePromptDto
        // Reemplazar con: const response = await promptsGeneratedApi.promptControllerFindOne(promptName, projectId); return response.data;
        const response = await apiClient.get<generated.CreatePromptDto>(`/api/projects/${projectId}/prompts/${promptName}`);
        return response.data;
    },
    create: async (projectId: string, payload: generated.CreatePromptDto): Promise<generated.CreatePromptDto> => { // Usar CreatePromptDto
        // const response = await promptsGeneratedApi.promptControllerCreate(projectId, payload);
        const response = await apiClient.post<generated.CreatePromptDto>(`/api/projects/${projectId}/prompts`, payload);
        return response.data;
    },
    // La API generada para update (promptControllerUpdate) devuelve void, así que ajustamos el tipo de retorno
    update: async (projectId: string, promptName: string, payload: generated.UpdatePromptDto): Promise<void> => {
        // const response = await promptsGeneratedApi.promptControllerUpdate(promptName, projectId, payload);
        await apiClient.patch<void>(`/api/projects/${projectId}/prompts/${promptName}`, payload);
        // return response.data; // No hay data que devolver
    },
    // La API generada para remove (promptControllerRemove) devuelve void
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
    findAll: async (projectId: string, promptId: string): Promise<generated.CreatePromptVersionDto[]> => { // Usar CreatePromptVersionDto
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindAll(projectId, promptId);
        // Ajustar tipo si el generado devuelve CreatePromptVersionDto[]
        return response.data as generated.CreatePromptVersionDto[]; // El tipo devuelto ya es correcto
    },
    findOne: async (projectId: string, promptId: string, versionTag: string): Promise<generated.CreatePromptVersionDto> => { // Usar CreatePromptVersionDto
        const response = await promptVersionsGeneratedApi.promptVersionControllerFindOneByTag(projectId, promptId, versionTag);
        // Ajustar tipo si el generado devuelve CreatePromptVersionDto
        return response.data as generated.CreatePromptVersionDto; // El tipo devuelto ya es correcto
    },
    create: async (projectId: string, promptId: string, payload: generated.CreatePromptVersionDto): Promise<generated.CreatePromptVersionDto> => { // Usar CreatePromptVersionDto
        const response = await promptVersionsGeneratedApi.promptVersionControllerCreate(projectId, promptId, payload);
        // Ajustar tipo si el generado devuelve CreatePromptVersionDto
        return response.data as generated.CreatePromptVersionDto; // El tipo devuelto ya es correcto
    },
    update: async (projectId: string, promptId: string, versionTag: string, payload: generated.UpdatePromptVersionDto): Promise<generated.CreatePromptVersionDto> => { // Usar CreatePromptVersionDto como retorno
        const response = await promptVersionsGeneratedApi.promptVersionControllerUpdate(projectId, promptId, versionTag, payload);
        // Ajustar tipo si el generado devuelve CreatePromptVersionDto
        return response.data as generated.CreatePromptVersionDto; // El tipo devuelto ya es correcto
    },
    remove: async (projectId: string, promptId: string, versionTag: string): Promise<void> => {
        await promptVersionsGeneratedApi.promptVersionControllerRemove(projectId, promptId, versionTag);
    },
    // activate: async (...) => { ... } // Añadir si existe método generado para activar
};

// Servicio para Traducciones de Prompt
export const promptTranslationService = {
    findAll: async (projectId: string, promptId: string, versionTag: string): Promise<generated.CreatePromptTranslationDto[]> => { // Usar CreatePromptTranslationDto
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerFindAll(projectId, promptId, versionTag);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto[]
        return response.data as generated.CreatePromptTranslationDto[]; // El tipo devuelto ya es correcto
    },
    findByLanguage: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<generated.CreatePromptTranslationDto> => { // Usar CreatePromptTranslationDto
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerFindOneByLanguage(projectId, promptId, versionTag, languageCode);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto
        return response.data as generated.CreatePromptTranslationDto; // El tipo devuelto ya es correcto
    },
    create: async (projectId: string, promptId: string, versionTag: string, payload: generated.CreatePromptTranslationDto): Promise<generated.CreatePromptTranslationDto> => { // Usar CreatePromptTranslationDto
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerCreate(projectId, promptId, versionTag, payload);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto
        return response.data as generated.CreatePromptTranslationDto; // El tipo devuelto ya es correcto
    },
    update: async (projectId: string, promptId: string, versionTag: string, languageCode: string, payload: generated.UpdatePromptTranslationDto): Promise<generated.CreatePromptTranslationDto> => { // Usar CreatePromptTranslationDto como retorno
        const response = await promptTranslationsGeneratedApi.promptTranslationControllerUpdate(projectId, promptId, versionTag, languageCode, payload);
        // Ajustar tipo si el generado devuelve CreatePromptTranslationDto
        return response.data as generated.CreatePromptTranslationDto; // El tipo devuelto ya es correcto
    },
    remove: async (projectId: string, promptId: string, versionTag: string, languageCode: string): Promise<void> => {
        await promptTranslationsGeneratedApi.promptTranslationControllerRemove(projectId, promptId, versionTag, languageCode);
    },
    // addOrUpdate: async (...) => { ... } // Añadir si existe método generado
};

// Servicio de Prompt Assets (Mantener manual o reemplazar con generated.PromptAssetsApi)
export const promptAssetService = {
    findAll: async (projectId: string): Promise<generated.CreatePromptAssetDto[]> => { // Usar CreatePromptAssetDto
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerFindAll(projectId); return response.data;
        const response = await apiClient.get<generated.CreatePromptAssetDto[]>(`/api/projects/${projectId}/assets`);
        return response.data;
    },
    findOne: async (projectId: string, assetKey: string): Promise<generated.CreatePromptAssetDto> => { // Usar CreatePromptAssetDto
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerFindOne(assetKey, projectId); return response.data;
        const response = await apiClient.get<generated.CreatePromptAssetDto>(`/api/projects/${projectId}/assets/${assetKey}`);
        return response.data;
    },
    // La API generada promptAssetControllerCreate devuelve void
    create: async (projectId: string, payload: generated.CreatePromptAssetDto): Promise<void> => {
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerCreate(projectId, payload); return response.data;
        // Nota: El generado devuelve void.
        await apiClient.post<void>(`/api/projects/${projectId}/assets`, payload);
        // return response.data; // No hay data
    },
    // La API generada promptAssetControllerUpdate devuelve void
    update: async (projectId: string, assetKey: string, payload: generated.UpdatePromptAssetDto): Promise<void> => {
        // Reemplazar con: const response = await promptAssetsGeneratedApi.promptAssetControllerUpdate(assetKey, projectId, payload); return response.data;
        // Nota: El generado devuelve void.
        await apiClient.patch<void>(`/api/projects/${projectId}/assets/${assetKey}`, payload);
        // return response.data; // No hay data
    },
    // La API generada promptAssetControllerRemove devuelve void
    remove: async (projectId: string, assetKey: string): Promise<void> => {
        // Reemplazar con: await promptAssetsGeneratedApi.promptAssetControllerRemove(assetKey, projectId);
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}`);
    },
    // Versiones de Asset (Mantener manual o reemplazar con generated.PromptAssetVersionsWithinProjectAssetApi)
    findVersions: async (projectId: string, assetKey: string): Promise<generated.CreatePromptAssetVersionDto[]> => { // Usar CreatePromptAssetVersionDto
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerFindAll(projectId, assetKey); return response.data;
        const response = await apiClient.get<generated.CreatePromptAssetVersionDto[]>(`/api/projects/${projectId}/assets/${assetKey}/versions`);
        return response.data;
    },
    findVersionByTag: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.CreatePromptAssetVersionDto> => { // Usar CreatePromptAssetVersionDto
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerFindOneByTag(projectId, assetKey, versionTag); return response.data;
        const response = await apiClient.get<generated.CreatePromptAssetVersionDto>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`);
        return response.data;
    },
    createVersion: async (projectId: string, assetKey: string, payload: generated.CreatePromptAssetVersionDto): Promise<generated.CreatePromptAssetVersionDto> => { // Usar CreatePromptAssetVersionDto
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerCreate(projectId, assetKey, payload); return response.data;
        const response = await apiClient.post<generated.CreatePromptAssetVersionDto>(`/api/projects/${projectId}/assets/${assetKey}/versions`, payload);
        return response.data;
    },
    updateVersion: async (projectId: string, assetKey: string, versionTag: string, payload: generated.UpdatePromptAssetVersionDto): Promise<generated.CreatePromptAssetVersionDto> => { // Usar CreatePromptAssetVersionDto como retorno
        // Reemplazar con: const response = await assetVersionsGeneratedApi.promptAssetVersionControllerUpdate(projectId, assetKey, versionTag, payload); return response.data;
        const response = await apiClient.patch<generated.CreatePromptAssetVersionDto>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`, payload);
        return response.data;
    },
    // La API generada promptAssetVersionControllerRemove devuelve void
    removeVersion: async (projectId: string, assetKey: string, versionTag: string): Promise<void> => {
        // Reemplazar con: await assetVersionsGeneratedApi.promptAssetVersionControllerRemove(projectId, assetKey, versionTag);
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}`);
    },
    // Traducciones de Asset (Mantener manual o reemplazar con generated.AssetTranslationsWithinProjectAssetVersionApi)
    findAssetTranslations: async (projectId: string, assetKey: string, versionTag: string): Promise<generated.CreateAssetTranslationDto[]> => { // Usar CreateAssetTranslationDto
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerFindAll(projectId, assetKey, versionTag); return response.data;
        const response = await apiClient.get<generated.CreateAssetTranslationDto[]>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations`);
        return response.data;
    },
    findAssetTranslationByLanguage: async (projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<generated.CreateAssetTranslationDto> => { // Usar CreateAssetTranslationDto
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerFindOneByLanguage(projectId, assetKey, versionTag, languageCode); return response.data;
        const response = await apiClient.get<generated.CreateAssetTranslationDto>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
        return response.data;
    },
    createAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, payload: generated.CreateAssetTranslationDto): Promise<generated.CreateAssetTranslationDto> => { // Usar CreateAssetTranslationDto
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerCreate(projectId, assetKey, versionTag, payload); return response.data;
        const response = await apiClient.post<generated.CreateAssetTranslationDto>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations`, payload);
        return response.data;
    },
    updateAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, languageCode: string, payload: generated.UpdateAssetTranslationDto): Promise<generated.CreateAssetTranslationDto> => { // Usar CreateAssetTranslationDto como retorno
        // Reemplazar con: const response = await assetTranslationsGeneratedApi.assetTranslationControllerUpdate(projectId, assetKey, versionTag, languageCode, payload); return response.data;
        const response = await apiClient.patch<generated.CreateAssetTranslationDto>(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`, payload);
        return response.data;
    },
    // La API generada assetTranslationControllerRemove devuelve void
    removeAssetTranslation: async (projectId: string, assetKey: string, versionTag: string, languageCode: string): Promise<void> => {
        // Reemplazar con: await assetTranslationsGeneratedApi.assetTranslationControllerRemove(projectId, assetKey, versionTag, languageCode);
        await apiClient.delete(`/api/projects/${projectId}/assets/${assetKey}/versions/${versionTag}/translations/${languageCode}`);
    },
    // Links de Asset (Mantener manual o reemplazar con generated.PromptAssetLinksWithinProjectVersionApi)
    findAssetLinks: async (projectId: string, promptVersionId: string): Promise<generated.CreatePromptAssetLinkDto[]> => { // Usar CreatePromptAssetLinkDto
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerFindAll(projectId, promptVersionId); return response.data;
        const response = await apiClient.get<generated.CreatePromptAssetLinkDto[]>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/links`);
        return response.data;
    },
    findAssetLink: async (projectId: string, promptVersionId: string, linkId: string): Promise<generated.CreatePromptAssetLinkDto> => { // Usar CreatePromptAssetLinkDto
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerFindOne(projectId, promptVersionId, linkId); return response.data;
        const response = await apiClient.get<generated.CreatePromptAssetLinkDto>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/links/${linkId}`);
        return response.data;
    },
    createAssetLink: async (projectId: string, promptVersionId: string, payload: generated.CreatePromptAssetLinkDto): Promise<generated.CreatePromptAssetLinkDto> => { // Usar CreatePromptAssetLinkDto
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerCreate(projectId, promptVersionId, payload); return response.data;
        // API manual usa endpoint diferente '/asset-links' vs generado '/links'
        const response = await apiClient.post<generated.CreatePromptAssetLinkDto>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links`, payload);
        return response.data;
    },
    updateAssetLink: async (projectId: string, promptVersionId: string, linkId: string, payload: generated.UpdatePromptAssetLinkDto): Promise<generated.CreatePromptAssetLinkDto> => { // Usar CreatePromptAssetLinkDto como retorno
        // Reemplazar con: const response = await assetLinksGeneratedApi.promptAssetLinkControllerUpdate(projectId, promptVersionId, linkId, payload); return response.data;
        // API manual usa endpoint diferente '/asset-links/' vs generado '/links/'
        const response = await apiClient.patch<generated.CreatePromptAssetLinkDto>(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links/${linkId}`, payload);
        return response.data;
    },
    // La API generada promptAssetLinkControllerRemove devuelve void
    removeAssetLink: async (projectId: string, promptVersionId: string, linkId: string): Promise<void> => {
        // Reemplazar con: await assetLinksGeneratedApi.promptAssetLinkControllerRemove(projectId, promptVersionId, linkId);
        // API manual usa endpoint diferente '/asset-links/' vs generado '/links/'
        await apiClient.delete(`/api/projects/${projectId}/prompt-versions/${promptVersionId}/asset-links/${linkId}`);
    },
};

// Servicio de Health Check (Mantener manual o reemplazar con generated.HealthApi)
export const healthService = {
    // Usar el tipo de respuesta generado HealthControllerCheck200Response
    check: async (): Promise<generated.HealthControllerCheck200Response> => {
        // Reemplazar con: const response = await healthGeneratedApi.healthControllerCheck(); return response.data;
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

// Re-exportar puede causar conflictos si hay nombres duplicados o no deseados.
// Considera importar explícitamente lo necesario o usar alias.
// export * from '../../generated/japmux-api'; // Comentado temporalmente

// YA NO SON NECESARIAS LAS INTERFACES MANUALES PARA LLM EXECUTION
// ... existing code ...

/*
// Servicio de "Serve Prompt" (Mantener manual o reemplazar con generated.ServePromptApi)
export const servePromptService = {
    // ... todo el contenido comentado ...
};
*/
