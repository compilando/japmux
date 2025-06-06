import React from 'react';
import { AiModelResponseDto } from '@/services/generated/api';
import AiModelCardItem from './AiModelCardItem';
import { BoltIcon } from '@heroicons/react/24/outline';

interface AiModelsDisplayProps {
    aiModelsList: AiModelResponseDto[];
    onEdit: (model: AiModelResponseDto) => void;
    onDelete: (id: string) => void;
}

const AiModelsDisplay: React.FC<AiModelsDisplayProps> = ({ aiModelsList, onEdit, onDelete }) => {
    if (!aiModelsList || aiModelsList.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="relative">
                    {/* Glassmorphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                    <div className="relative flex flex-col items-center justify-center p-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                        {/* Icon with glassmorphism effect */}
                        <div className="relative mb-6">
                            <div className="p-6 bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-600/40 shadow-lg">
                                <BoltIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-2xl blur-xl"></div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            No AI Models Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2 max-w-md">
                            There are currently no AI models configured for this project.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Click <span className="font-semibold text-brand-600 dark:text-brand-400">"Add AI Model"</span> to create one.
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-br from-brand-200/30 to-purple-200/30 dark:from-brand-800/20 dark:to-purple-800/20 rounded-full blur-lg"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {aiModelsList.map((model) => (
                <AiModelCardItem
                    key={model.id}
                    model={model}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default AiModelsDisplay; 