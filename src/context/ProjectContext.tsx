'use client'; // Necessary for hooks like useState, useEffect, useContext

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
// Import Project type from generated
import { Project } from '@/services/generated/api';
// Import service from api
import { projectService } from '@/services/api';
// Import your authentication context if you have one, to react to login/logout changes
// import { useAuth } from './AuthContext'; 

interface ProjectContextType {
    projects: Project[];
    selectedProjectId: string | null;
    setSelectedProjectId: (projectId: string | null) => void;
    isLoading: boolean;
    error: string | null;
    refreshProjects: () => void; // Function to reload projects manually if needed
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
    children: ReactNode;
}

const SELECTED_PROJECT_ID_KEY = 'selectedProjectId';

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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
                setIsLoading(false);
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        try {
            const userProjects = await projectService.findMine();
            setProjects(userProjects);

            // If there was a saved ID, verify it still exists in the new list
            const currentSelectedId = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
            const selectedProjectExists = currentSelectedId && userProjects.some(p => p.id === currentSelectedId);

            if (selectedProjectExists) {
                setSelectedProjectIdState(currentSelectedId);
            } else if (userProjects.length > 0) {
                // If no ID was saved or the saved one no longer exists, select the first one
                const defaultProjectId = userProjects[0].id;
                setSelectedProjectIdState(defaultProjectId);
                localStorage.setItem(SELECTED_PROJECT_ID_KEY, defaultProjectId);
            } else {
                // No projects
                setSelectedProjectIdState(null);
                localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
            }
        } catch (err: any) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects.");
            setProjects([]);
            setSelectedProjectIdState(null);
            // Don't clear localStorage here, it could be a temporary error
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependency on authentication state if used

    // Load projects on component mount (and when auth state changes if used)
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Add isAuthenticated if used

    const handleSetSelectedProjectId = (projectId: string | null) => {
        setSelectedProjectIdState(projectId);
        if (projectId) {
            localStorage.setItem(SELECTED_PROJECT_ID_KEY, projectId);
        } else {
            localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
        }
        // Optional: you might want to reload specific project data here
        router.refresh(); // <-- Add route refresh
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            selectedProjectId,
            setSelectedProjectId: handleSetSelectedProjectId,
            isLoading,
            error,
            refreshProjects: fetchProjects // Expose the reload function
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