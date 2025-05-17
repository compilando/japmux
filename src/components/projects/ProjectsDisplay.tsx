import React from 'react';
import { CreateProjectDto, UserProfileResponse } from '@/services/generated/api'; // Añadir UserProfileResponse
import ProjectCardItem from './ProjectCardItem';
import { InfoIcon } from '@/icons';

// Interfaz local para los datos del proyecto, extendiendo CreateProjectDto
interface ProjectData extends CreateProjectDto {
    id: string;
    createdAt?: string;
    ownerUserId?: string; // Asegurar que esté aquí también para consistencia
}

interface ProjectsDisplayProps {
    projectsList: ProjectData[];
    usersList: UserProfileResponse[]; // Añadir usersList aquí
    onEdit: (project: ProjectData) => void;
    onDelete: (id: string) => void;
    onSelectProject?: (project: ProjectData) => void; // Para seleccionar un proyecto
    selectedProjectId?: string | null; // Para saber cuál está seleccionado
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ projectsList, usersList, onEdit, onDelete, onSelectProject, selectedProjectId }) => {
    if (!projectsList || projectsList.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-semibold mb-1">No Projects Found</h3>
                    <p className="text-sm">There are currently no projects configured.</p>
                    <p className="text-sm mt-1">Click "Add New Project" to create one.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projectsList.map((project) => (
                <ProjectCardItem
                    key={project.id}
                    project={project}
                    usersList={usersList} // Pasar usersList al item
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onSelect={onSelectProject} // Pasar la función de selección
                    isSelected={project.id === selectedProjectId} // Determinar si esta tarjeta está seleccionada
                />
            ))}
        </div>
    );
};

export default ProjectsDisplay; 