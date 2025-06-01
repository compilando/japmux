import React from 'react';
import { CreateProjectDto, UserProfileResponse } from '@/services/api';
import { PencilIcon, TrashIcon, FolderIcon, UserCircleIcon } from '@heroicons/react/24/outline';
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
            className="group relative cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Background blur and gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl"></div>
            <div className={`absolute inset-0 bg-gradient-to-br ${isSelected ? 'from-brand-50/50 via-brand-50/30 to-purple-50/50 dark:from-brand-950/40 dark:via-brand-950/20 dark:to-purple-950/40' : 'from-brand-50/20 via-transparent to-purple-50/20 dark:from-brand-950/10 dark:via-transparent dark:to-purple-950/10'} rounded-2xl ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`}></div>

            {/* Glassmorphism card */}
            <div className={`relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border ${isSelected ? 'border-brand-500/50 shadow-brand-500/20' : 'border-white/30 dark:border-gray-700/40'} shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-[1.02]`}>

                {/* Header with gradient */}
                <div className={`relative p-6 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r ${isSelected ? 'from-brand-100/60 via-brand-50/40 to-purple-100/60 dark:from-brand-900/60 dark:via-brand-800/40 dark:to-purple-900/60' : 'from-white/50 via-white/30 to-white/50 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50'}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4 min-w-0 pr-16">
                            {/* Project icon with glassmorphism */}
                            <div className="relative flex-shrink-0">
                                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${isSelected ? 'bg-gradient-to-br from-brand-500 to-purple-500' : 'bg-gradient-to-br from-gray-500 to-gray-600'} text-white shadow-lg`}>
                                    <FolderIcon className="w-6 h-6" />
                                    <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                                </div>
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className={`font-bold text-lg truncate transition-colors duration-300 ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400'}`} title={project.name}>
                                    {project.name}
                                </h3>
                                {project.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={project.description}>
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action buttons with glassmorphism */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                                className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Edit Project"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <div className="absolute inset-0 bg-brand-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                                className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-red-500 hover:text-red-700 dark:hover:text-red-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Delete Project"
                            >
                                <TrashIcon className="w-4 h-4" />
                                <div className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content section */}
                <div className="relative p-6 space-y-4">
                    {/* Owner section */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Owner
                        </h4>
                        <div className="flex items-center space-x-3">
                            {owner && ownerName !== 'N/A' ? (
                                <div className="relative flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-sm shadow-md">
                                        {ownerInitials}
                                        <div className="absolute inset-0 bg-white/20 rounded-lg"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                                    <UserCircleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={ownerName}>
                                {ownerName}
                            </span>
                        </div>
                    </div>

                    {/* Creation date if available */}
                    {project.createdAt && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Created
                            </h4>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDateIfAvailable(project.createdAt)}
                            </span>
                        </div>
                    )}

                    {/* Status indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-gray-700/30">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isSelected ? 'bg-brand-400' : 'bg-green-400'}`}></div>
                            <span className={`text-xs font-medium ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-green-600 dark:text-green-400'}`}>
                                {isSelected ? 'Selected' : 'Active'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                    <div className="absolute inset-0 border-2 border-brand-500 rounded-2xl pointer-events-none"></div>
                )}

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200"></div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"></div>
        </div>
    );
};

export default ProjectCardItem; 