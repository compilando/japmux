'use client'; // Necessary for hooks like useState, useEffect, useContext

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
// Import Project type from generated
import { CreateProjectDto } from '@/services/generated/api';
// Import service from api
import { projectService } from '@/services/api';
// Import your authentication context if you have one, to react to login/logout changes
// import { useAuth } from './AuthContext'; 

// Interfaz extendida para incluir la propiedad id en los proyectos
interface ProjectWithId extends CreateProjectDto {
    id: string;
}

interface ProjectContextType {
    projects: CreateProjectDto[];
    selectedProjectId: string | null;
    setSelectedProjectId: (projectId: string | null) => void;
    isLoading: boolean; // Loading for the initial list of projects
    error: string | null;
    refreshProjects: () => void; // Function to reload projects manually if needed
    selectedProjectFull: CreateProjectDto | null; // The full object of the selected project
    isLoadingSelectedProjectFull: boolean; // Loading state for the full selected project
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
    children: ReactNode;
}

const SELECTED_PROJECT_ID_KEY = 'selectedProjectId';

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const [projects, setProjects] = useState<CreateProjectDto[]>([]);
    const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // For initial projects list
    const [error, setError] = useState<string | null>(null);
    const [isInitialIdLoaded, setIsInitialIdLoaded] = useState<boolean>(false); // Para la carga inicial del ID

    const [selectedProjectFull, setSelectedProjectFull] = useState<CreateProjectDto | null>(null);
    const [isLoadingSelectedProjectFull, setIsLoadingSelectedProjectFull] = useState<boolean>(false);

    const router = useRouter(); // <-- Get router instance
    // const { isAuthenticated } = useAuth(); // Uncomment if you have an authentication context

    // Load selected ID from localStorage on startup
    useEffect(() => {
        console.log("[ProjectContext] Attempting to load stored project ID from localStorage.");
        const storedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
        if (storedProjectId) {
            console.log("[ProjectContext] Found stored project ID:", storedProjectId);
            setSelectedProjectIdState(storedProjectId); // Establecer el estado con lo que hay en localStorage
        } else {
            console.log("[ProjectContext] No stored project ID found in localStorage.");
            setSelectedProjectIdState(null); // Asegurarse de que es null si no hay nada
        }
        setIsInitialIdLoaded(true);
    }, []);

    const fetchProjects = useCallback(async () => {
        // isInitialIdLoaded ya se verifica en el useEffect que llama a esto.
        // Fetching projects...
        setIsLoading(true);
        setError(null);

        if (typeof window !== 'undefined') {
            let token = localStorage.getItem('authToken');
            if (!token) token = sessionStorage.getItem('authToken');
            if (!token) {
                console.log("[ProjectContext] fetchProjects: No auth token, clearing.");
                setProjects([]);
                setSelectedProjectIdState(null);
                setSelectedProjectFull(null);
                setIsLoading(false);
                return;
            }
        }

        try {
            const userProjects = await projectService.findMine();
            console.log("[ProjectContext] fetchProjects: Fetched user projects count:", userProjects.length);
            setProjects(userProjects);

            let idFromStorage = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
            console.log("[ProjectContext] fetchProjects: ID from localStorage for selection logic:", idFromStorage);

            let finalIdToSelect = null;

            if (userProjects.length > 0) {
                const projectExistsInList = idFromStorage && userProjects.some(p => (p as ProjectWithId).id === idFromStorage);

                if (projectExistsInList) {
                    console.log("[ProjectContext] fetchProjects: Project ID from storage exists in list:", idFromStorage);
                    finalIdToSelect = idFromStorage;
                } else {
                    console.log("[ProjectContext] fetchProjects: Project ID from storage not in list or no ID in storage. Selecting first project.");
                    finalIdToSelect = (userProjects[0] as ProjectWithId).id;
                    localStorage.setItem(SELECTED_PROJECT_ID_KEY, finalIdToSelect);
                }
            } else {
                console.log("[ProjectContext] fetchProjects: No projects. Clearing stored ID.");
                localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
                finalIdToSelect = null;
            }

            if (selectedProjectId !== finalIdToSelect) {
                console.log("[ProjectContext] fetchProjects: Updating selectedProjectIdState from", selectedProjectId, "to", finalIdToSelect);
                setSelectedProjectIdState(finalIdToSelect);
            } else {
                console.log("[ProjectContext] fetchProjects: selectedProjectIdState already matches finalIdToSelect:", finalIdToSelect);
            }

        } catch (err: unknown) {
            console.error("[ProjectContext] fetchProjects: Error fetching projects:", err);
            setError("Failed to load projects.");
            setProjects([]);
            setSelectedProjectIdState(null);
            setSelectedProjectFull(null);
        } finally {
            // Projects fetch completed
            setIsLoading(false);
        }
    }, []); // QUITAR selectedProjectId de las dependencias.

    useEffect(() => {
        if (isInitialIdLoaded) {
            console.log("[ProjectContext] useEffect[isInitialIdLoaded]: Initial ID load complete. Calling fetchProjects.");
            fetchProjects();
        } else {
            console.log("[ProjectContext] useEffect[isInitialIdLoaded]: Waiting for initial ID load from localStorage.");
        }
    }, [isInitialIdLoaded, fetchProjects]);

    // Efecto para cargar el objeto completo del proyecto seleccionado
    useEffect(() => {
        // Este isLoading es el de la lista de proyectos. Esperamos a que termine.
        console.log("[ProjectContext] useEffect (selectedProjectFull): Triggered. selectedProjectId:", selectedProjectId, "isLoading (context):", isLoading);
        if (selectedProjectId && projects.length > 0 && !isLoading) {
            console.log("[ProjectContext] useEffect (selectedProjectFull): Finding full project details for:", selectedProjectId);
            setIsLoadingSelectedProjectFull(true);
            const project = projects.find(p => (p as ProjectWithId).id === selectedProjectId);
            if (project) {
                setSelectedProjectFull(project);
                console.log("[ProjectContext] useEffect (selectedProjectFull): Found and set.", project?.name);
            } else {
                setSelectedProjectFull(null);
                console.warn(`[ProjectContext] useEffect (selectedProjectFull): Project with ID ${selectedProjectId} not found in projects list.`);
            }
            setIsLoadingSelectedProjectFull(false);
        } else if (!selectedProjectId) {
            setSelectedProjectFull(null);
            if (!isLoading) { // Solo loguear si no es por estar cargando la lista de proyectos
                console.log("[ProjectContext] useEffect (selectedProjectFull): No selectedProjectId, clearing selectedProjectFull.");
            }
        } else if (isLoading) {
            console.log("[ProjectContext] useEffect (selectedProjectFull): Waiting for project list to load before setting full project details.");
        }
    }, [selectedProjectId, projects, isLoading]);

    const handleSetSelectedProjectId = (projectId: string | null) => {
        console.log("[ProjectContext] handleSetSelectedProjectId: Requested to set project ID to:", projectId);
        if (projectId) {
            localStorage.setItem(SELECTED_PROJECT_ID_KEY, projectId);
        } else {
            localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
        }
        console.log("[ProjectContext] handleSetSelectedProjectId: Reloading window.");
        window.location.reload();
    };

    // isLoading global del contexto debe considerar la carga inicial del ID Y la carga de la lista de proyectos.
    // Un componente consumidor está "cargando" si el ID inicial aún no se ha procesado O si la lista de proyectos se está cargando.
    const combinedIsLoading = !isInitialIdLoaded || isLoading;

    console.log(
        "[ProjectContext] Rendering Provider. ",
        "isInitialIdLoaded:", isInitialIdLoaded,
        "isLoading (project list):", isLoading,
        "--> combinedIsLoading:", combinedIsLoading,
        "selectedProjectIdState:", selectedProjectId,
        "selectedProjectFull:", selectedProjectFull?.name
    );

    return (
        <ProjectContext.Provider value={{
            projects,
            selectedProjectId,
            setSelectedProjectId: handleSetSelectedProjectId,
            isLoading: combinedIsLoading,
            error,
            refreshProjects: fetchProjects,
            selectedProjectFull,
            isLoadingSelectedProjectFull
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

// Custom hook to easily use the context
export const useProjects = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}; 