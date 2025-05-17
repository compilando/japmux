import React from 'react';
import { AiModelResponseDto } from '@/services/generated/api';
import { PencilIcon, TrashBinIcon, BoltIcon } from '@/icons'; // Usando BoltIcon como genérico por ahora

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

const AiModelCardItem: React.FC<AiModelCardItemProps> = ({ model, onEdit, onDelete }) => {
    return (
        <div
            key={model.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-brand-500 dark:hover:border-brand-500"
        >
            {/* Header con el nombre del modelo y botones de acción */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate" title={model.name}>
                        {model.name}
                    </h3>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => onEdit(model)}
                            className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                            title="Edit Model"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onDelete(model.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                            title="Delete Model"
                        >
                            <TrashBinIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="p-4 space-y-3">
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Provider
                    </h4>
                    <ProviderIcon provider={model.provider} />
                </div>
                {/* apiIdentifier y description no se muestran aquí */}
                {/* No hay campo modelType en AiModelResponseDto */}
            </div>
        </div>
    );
};

export default AiModelCardItem; 