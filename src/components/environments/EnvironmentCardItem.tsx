import React from 'react';
import { PencilIcon, TrashIcon, BoxCubeIcon } from '@/icons'; // Cambiado ServerIcon a BoxCubeIcon

// Asumimos que el Environment que llega a la UI tiene al menos estos campos
export interface EnvironmentData {
    id: string;
    name: string;
    description?: string | null;
    // apiIdentifier no parece estar en CreateEnvironmentDto, lo omitimos por ahora
}

interface EnvironmentCardItemProps {
    environment: EnvironmentData;
    onEdit: (environment: EnvironmentData) => void;
    onDelete: (id: string) => void;
}

const EnvironmentCardItem: React.FC<EnvironmentCardItemProps> = ({ environment, onEdit, onDelete }) => {
    const cardClasses = `
        group bg-white dark:bg-gray-800 rounded-xl shadow-lg 
        border border-gray-200 dark:border-gray-700 
        transition-all duration-300 
        hover:shadow-xl hover:border-brand-500 dark:hover:border-brand-500
    `;

    return (
        <div className={cardClasses}>
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0 pr-10 relative">
                        <BoxCubeIcon className="w-6 h-6 text-brand-500 dark:text-brand-400 flex-shrink-0" />
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate" title={environment.name}>
                            {environment.name}
                        </h3>
                        <div className="absolute top-[-4px] right-[-30px] flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => onEdit(environment)}
                                className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                title="Edit Environment"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onDelete(environment.id)}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                title="Delete Environment"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                {environment.description && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3" title={environment.description}>
                        {environment.description}
                    </p>
                )}
                {!environment.description && (
                    <p className="mt-3 text-sm text-gray-400 dark:text-gray-500 italic">
                        No description provided.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EnvironmentCardItem; 