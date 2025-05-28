import React from 'react';
import { CreateProjectDto, UserProfileResponse } from '@/services/api';
import { PencilIcon, TrashIcon, FolderIcon, UserCircleIcon } from '@/icons';
import { format } from 'date-fns'; // Importar format de date-fns

// ProjectData extiende CreateProjectDto. CreateProjectDto de @/services/api DEBERÍA tener ownerUserId.
interface ProjectData extends CreateProjectDto {
    id: string;
    createdAt?: string;
    ownerUserId?: string; // Añadido explícitamente para asegurar disponibilidad
}

interface ProjectCardItemProps {
    project: ProjectData;
    usersList: UserProfileResponse[]; // Lista de usuarios para encontrar el nombre del owner
    onEdit: (project: ProjectData) => void;
    onDelete: (id: string) => void;
    onSelect?: (project: ProjectData) => void; // Cambiado para pasar el objeto completo del proyecto
    isSelected?: boolean;
}

// Función interna para formatear la fecha si está disponible
const formatDateIfAvailable = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'PP'); // Formato como 'Sep 20, 2023'
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString; // Devolver el string original si hay error
    }
};

// Función para obtener iniciales del nombre (reutilizada o similar a UsersTable)
const getInitials = (name: string | undefined | null): string => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1]) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    if (nameParts[0] && nameParts[0][0]) return nameParts[0][0].toUpperCase();
    return '?';
};

const ProjectCardItem: React.FC<ProjectCardItemProps> = ({ project, usersList, onEdit, onDelete, onSelect, isSelected }) => {
    const cardClasses = `
        group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
        border border-gray-200 dark:border-gray-700 
        hover:shadow-xl transition-all duration-300 cursor-pointer 
        ${isSelected ? 'border-brand-500 ring-2 ring-brand-500' : 'hover:border-brand-500 dark:hover:border-brand-500'}
    `;

    const handleCardClick = () => {
        if (onSelect) {
            onSelect(project);
        }
    };

    const owner = usersList.find(user => user.id === project.ownerUserId);
    const ownerName = owner?.name || owner?.email || 'N/A';
    const ownerInitials = getInitials(owner?.name || owner?.email);

    return (
        <div
            key={project.id}
            className={cardClasses}
            onClick={handleCardClick}
        >
            <div className={`relative p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${isSelected ? 'from-brand-50 to-brand-100 dark:from-brand-700/50 dark:to-brand-600/50' : 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0 pr-10">
                        <FolderIcon className={`w-7 h-7 ${isSelected ? 'text-brand-600 dark:text-brand-300' : 'text-gray-400 dark:text-gray-500'} flex-shrink-0`} />
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate" title={project.name}>
                            {project.name}
                        </h3>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                            className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                            title="Edit Project"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                            title="Delete Project"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {project.description && (
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Description
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2" title={project.description}>
                            {project.description}
                        </p>
                    </div>
                )}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Owner
                    </h4>
                    <div className="flex items-center space-x-2">
                        {owner && ownerName !== 'N/A' ? (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs">
                                {ownerInitials}
                            </div>
                        ) : (
                            <UserCircleIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate" title={ownerName}>
                            {ownerName}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCardItem; 