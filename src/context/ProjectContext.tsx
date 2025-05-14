'use client'; // Necessary for hooks like useState, useEffect, useContext

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
// Import Project type from generated
import { CreateProjectDto } from '@/services/generated/api';
// Import service from api
import { projectService } from '@/services/api';
// Import your authentication context if you have one, to react to login/logout changes
// import { useAuth } from './AuthContext'; 

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

    const [selectedProjectFull, setSelectedProjectFull] = useState<CreateProjectDto | null>(null);
    const [isLoadingSelectedProjectFull, setIsLoadingSelectedProjectFull] = useState<boolean>(false);

    const router = useRouter(); // <-- Get router instance
    // const { isAuthenticated } = useAuth(); // Uncomment if you have an authentication context

    // Load selected ID from localStorage on startup
    useEffect(() => {
        const storedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
        if (storedProjectId) {
            setSelectedProjectIdState(storedProjectId);
        }
    }, []);

    const fetchProjects = useCallback(async () => {
        // Make sure the user is authenticated before calling
        // if (!isAuthenticated) { // Uncomment if using authentication context
        //     setProjects([]);
        //     setSelectedProjectIdState(null);
        //     setIsLoading(false);
        //     return;
        // }

        // Check for token directly (alternative if no AuthContext)
        if (typeof window !== 'undefined') {
            let token = localStorage.getItem('authToken');
            if (!token) {
                token = sessionStorage.getItem('authToken');
            }
            if (!token) {
                console.log("No auth token found, skipping project fetch.");
                setProjects([]);
                setSelectedProjectIdState(null);
                setSelectedProjectFull(null); // Clear full project details
                setIsLoading(false);
                setIsLoadingSelectedProjectFull(false);
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        try {
            const userProjects = await projectService.findMine();
            setProjects(userProjects);

            const currentSelectedId = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
            const selectedProjectExists = currentSelectedId && userProjects.some(p => (p as any).id === currentSelectedId);

            if (selectedProjectExists && currentSelectedId) {
                setSelectedProjectIdState(currentSelectedId);
                // setSelectedProjectFull will be set by the other useEffect
            } else if (userProjects.length > 0) {
                const defaultProjectId = (userProjects[0] as any).id;
                setSelectedProjectIdState(defaultProjectId);
                localStorage.setItem(SELECTED_PROJECT_ID_KEY, defaultProjectId);
                // setSelectedProjectFull will be set by the other useEffect
            } else {
                setSelectedProjectIdState(null);
                setSelectedProjectFull(null); // No projects, so no full project
                localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
            }
        } catch (err: any) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects.");
            setProjects([]);
            setSelectedProjectIdState(null);
            setSelectedProjectFull(null);
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependency on authentication state if used

    // Load projects on component mount (and when auth state changes if used)
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Add isAuthenticated if used

    // Effect to update selectedProjectFull when selectedProjectId or projects list changes
    useEffect(() => {
        if (selectedProjectId && projects.length > 0) {
            setIsLoadingSelectedProjectFull(true);
            const project = projects.find(p => (p as any).id === selectedProjectId);
            if (project) {
                setSelectedProjectFull(project);
            } else {
                // This case implies selectedProjectId is stale or projects list is not up-to-date
                // Or the project was deleted and localStorage wasn't updated.
                // For now, just nullify. A more robust solution might re-fetch or clear selectedProjectId.
                setSelectedProjectFull(null);
                // Consider clearing selectedProjectId from localStorage if it's not found
                // localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
                // setSelectedProjectIdState(null); // This could trigger a re-selection or prompt user
                console.warn(`Project with ID ${selectedProjectId} not found in the loaded projects list.`);
            }
            setIsLoadingSelectedProjectFull(false);
        } else if (!selectedProjectId) {
            setSelectedProjectFull(null);
            setIsLoadingSelectedProjectFull(false);
        }
        // Add dependency on projects list isLoading state to ensure it's loaded first
    }, [selectedProjectId, projects, isLoading]);

    const handleSetSelectedProjectId = (projectId: string | null) => {
        setSelectedProjectIdState(projectId);
        if (projectId) {
            localStorage.setItem(SELECTED_PROJECT_ID_KEY, projectId);
        } else {
            localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
            setSelectedProjectFull(null); // Clear full project when ID is cleared
        }
        router.refresh(); // <-- Add route refresh
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            selectedProjectId,
            setSelectedProjectId: handleSetSelectedProjectId,
            isLoading,
            error,
            refreshProjects: fetchProjects,
            selectedProjectFull, // Provide the full project object
            isLoadingSelectedProjectFull // Provide its loading state
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