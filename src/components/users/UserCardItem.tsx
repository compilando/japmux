import React from 'react';
import { UserResponseDto } from '@/services/api';
import { PencilIcon, TrashIcon, UserCircleIcon, ShieldCheckIcon, CogIcon } from '@heroicons/react/24/outline';

interface UserCardItemProps {
    user: UserResponseDto;
    onEdit: (user: UserResponseDto) => void;
    onDelete: (id: string) => void;
    currentUserId?: string; // ID del usuario actual logueado
}

// Función para obtener iniciales del nombre
const getInitials = (name: string | undefined | null): string => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1]) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    if (nameParts[0] && nameParts[0][0]) return nameParts[0][0].toUpperCase();
    return '?';
};

// Función para obtener color del rol
const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
        case 'admin':
            return 'from-red-500 to-pink-500';
        case 'tenant_admin':
            return 'from-blue-500 to-indigo-500';
        case 'user':
        default:
            return 'from-green-500 to-emerald-500';
    }
};

// Función para obtener icono del rol
const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
        case 'admin':
            return <ShieldCheckIcon className="w-4 h-4" />;
        case 'tenant_admin':
            return <CogIcon className="w-4 h-4" />;
        case 'user':
        default:
            return <UserCircleIcon className="w-4 h-4" />;
    }
};

const UserCardItem: React.FC<UserCardItemProps> = ({ user, onEdit, onDelete, currentUserId }) => {
    const initials = getInitials(user.name);
    const roleColor = getRoleColor(user.role);
    const roleIcon = getRoleIcon(user.role);
    const isCurrentUser = currentUserId === user.id;

    return (
        <div className="group relative">
            {/* Background blur and gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-purple-50/30 dark:from-brand-950/20 dark:via-transparent dark:to-purple-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Glassmorphism card */}
            <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-[1.02]">

                {/* Header with gradient */}
                <div className="relative p-6 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4 min-w-0 pr-16">
                            {/* Avatar with glassmorphism */}
                            <div className="relative flex-shrink-0">
                                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${roleColor} text-white font-bold text-lg shadow-lg`}>
                                    {initials}
                                    <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm">
                                    {roleIcon}
                                </div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300" title={user.name}>
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={user.email}>
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons with glassmorphism */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                                className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Edit User"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <div className="absolute inset-0 bg-brand-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            {!isCurrentUser && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
                                    className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-red-500 hover:text-red-700 dark:hover:text-red-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                    title="Delete User"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    <div className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content section */}
                <div className="relative p-6 space-y-4">
                    {/* Role section */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Role
                        </h4>
                        <div className="flex items-center space-x-2">
                            <div className={`p-2 bg-gradient-to-br ${roleColor} rounded-lg shadow-sm`}>
                                <div className="text-white">
                                    {roleIcon}
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r ${roleColor.replace('to-', 'to-').replace('from-', 'from-')} bg-opacity-10 text-gray-800 dark:text-gray-200 border border-white/30 dark:border-gray-700/40`}>
                                {user.role.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-gray-700/30">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                        <div className="flex items-center space-x-2">
                            {isCurrentUser ? (
                                <>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">You</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200"></div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"></div>
        </div>
    );
};

export default UserCardItem; 