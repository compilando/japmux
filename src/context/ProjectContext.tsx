'use client'; // Necesario para hooks como useState, useEffect, useContext

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // <-- Importar useRouter
import { projectService, Project } from '@/services/api'; // Ajusta la ruta si es necesario
// Importa tu contexto de autenticación si lo tienes, para reaccionar a cambios de login/logout
// import { useAuth } from './AuthContext'; 

interface ProjectContextType {
    projects: Project[];
    selectedProjectId: string | null;
    setSelectedProjectId: (projectId: string | null) => void;
    isLoading: boolean;
    error: string | null;
    refreshProjects: () => void; // Función para recargar proyectos manualmente si es necesario
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
    const router = useRouter(); // <-- Obtener instancia del router
    // const { isAuthenticated } = useAuth(); // Descomenta si tienes un contexto de autenticación

    // Cargar el ID seleccionado desde localStorage al inicio
    useEffect(() => {
        const storedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
        if (storedProjectId) {
            setSelectedProjectIdState(storedProjectId);
        }
    }, []);

    const fetchProjects = useCallback(async () => {
        // Asegúrate de que el usuario esté autenticado antes de llamar
        // if (!isAuthenticated) { // Descomenta si usas contexto de autenticación
        //     setProjects([]);
        //     setSelectedProjectIdState(null);
        //     setIsLoading(false);
        //     return;
        // }

        // Verificar si hay token directamente (alternativa si no hay AuthContext)
        if (typeof window !== 'undefined' && !localStorage.getItem('authToken')) {
            console.log("No auth token found, skipping project fetch.");
            setProjects([]);
            setSelectedProjectIdState(null);
            setIsLoading(false);
            return;
        }


        setIsLoading(true);
        setError(null);
        try {
            const userProjects = await projectService.getMine();
            setProjects(userProjects);

            // Si había un ID guardado, verificar que aún exista en la lista nueva
            const currentSelectedId = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
            const selectedProjectExists = currentSelectedId && userProjects.some(p => p.id === currentSelectedId);

            if (selectedProjectExists) {
                setSelectedProjectIdState(currentSelectedId);
            } else if (userProjects.length > 0) {
                // Si no había ID guardado o el guardado ya no existe, seleccionar el primero
                const defaultProjectId = userProjects[0].id;
                setSelectedProjectIdState(defaultProjectId);
                localStorage.setItem(SELECTED_PROJECT_ID_KEY, defaultProjectId);
            } else {
                // No hay proyectos
                setSelectedProjectIdState(null);
                localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
            }
        } catch (err: any) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects.");
            setProjects([]);
            setSelectedProjectIdState(null);
            // No limpiar localStorage aquí, podría ser un error temporal
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependencia del estado de autenticación si se usa

    // Cargar proyectos al montar el componente (y cuando cambie el estado auth si se usa)
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Añadir isAuthenticated si se usa

    const handleSetSelectedProjectId = (projectId: string | null) => {
        setSelectedProjectIdState(projectId);
        if (projectId) {
            localStorage.setItem(SELECTED_PROJECT_ID_KEY, projectId);
        } else {
            localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
        }
        // Opcional: podrías querer recargar datos específicos del proyecto aquí
        router.refresh(); // <-- Añadir refresco de ruta
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            selectedProjectId,
            setSelectedProjectId: handleSetSelectedProjectId,
            isLoading,
            error,
            refreshProjects: fetchProjects // Exponer la función de recarga
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useProjects = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}; 