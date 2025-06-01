import React from 'react';
import { AiModelResponseDto } from '@/services/generated/api';
import { PencilIcon, TrashIcon, BoltIcon } from '@heroicons/react/24/outline';

interface AiModelCardItemProps {
    model: AiModelResponseDto;
    onEdit: (model: AiModelResponseDto) => void;
    onDelete: (id: string) => void;
}

const ProviderIcon: React.FC<{ provider: string | null | undefined }> = ({ provider }) => {
    let icon = <BoltIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    let providerName = provider || 'Unknown'; // Fallback si provider es null o undefined

    // Convertir a minúsculas para comparación insensible a mayúsculas/minúsculas
    const lowerProvider = provider?.toLowerCase();

    if (lowerProvider?.includes('openai')) {
        providerName = "OpenAI";
        // icon = <OpenAIIcon />;
    } else if (lowerProvider?.includes('anthropic')) {
        providerName = "Anthropic";
        // icon = <AnthropicIcon />;
    } else if (lowerProvider?.includes('google')) {
        providerName = "Google";
        // icon = <GoogleIcon />;
    }
    // Añadir más casos según sea necesario, por ejemplo, buscando 'azure', 'aws', 'cohere', etc.

    return (
        <div className="flex items-center space-x-2">
            {icon} {/* TODO: Mapear a iconos específicos cuando estén disponibles */}
            <span className="text-sm text-gray-700 dark:text-gray-300">{providerName}</span>
        </div>
    );
};

// Función para obtener color del proveedor
const getProviderColor = (provider: string | null | undefined) => {
    const lowerProvider = provider?.toLowerCase();
    if (lowerProvider?.includes('openai')) {
        return 'from-green-500 to-emerald-500';
    } else if (lowerProvider?.includes('anthropic')) {
        return 'from-orange-500 to-red-500';
    } else if (lowerProvider?.includes('google')) {
        return 'from-blue-500 to-indigo-500';
    }
    return 'from-gray-500 to-gray-600';
};

const AiModelCardItem: React.FC<AiModelCardItemProps> = ({ model, onEdit, onDelete }) => {
    const providerColor = getProviderColor(model.provider);

    return (
        <div className="group relative">
            {/* Background blur and gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/20 via-transparent to-purple-50/20 dark:from-brand-950/10 dark:via-transparent dark:to-purple-950/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Glassmorphism card */}
            <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-[1.02]">

                {/* Header with gradient */}
                <div className="relative p-6 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4 min-w-0 pr-16">
                            {/* AI Model icon with glassmorphism */}
                            <div className="relative flex-shrink-0">
                                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${providerColor} text-white shadow-lg`}>
                                    <BoltIcon className="w-6 h-6" />
                                    <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                                </div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300" title={model.name}>
                                    {model.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    AI Model
                                </p>
                            </div>
                        </div>

                        {/* Action buttons with glassmorphism */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(model); }}
                                className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Edit Model"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <div className="absolute inset-0 bg-brand-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(model.id); }}
                                className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-red-500 hover:text-red-700 dark:hover:text-red-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Delete Model"
                            >
                                <TrashIcon className="w-4 h-4" />
                                <div className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content section */}
                <div className="relative p-6 space-y-4">
                    {/* Provider section */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Provider
                        </h4>
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-gradient-to-br ${providerColor} rounded-lg shadow-sm`}>
                                <BoltIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {model.provider || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-gray-700/30">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Available</span>
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

export default AiModelCardItem; 