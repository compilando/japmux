import React from 'react';
import { AiModelResponseDto } from '@/services/generated/api';
import AiModelCardItem from './AiModelCardItem';
import { InfoIcon } from '@/icons';

interface AiModelsDisplayProps {
    aiModelsList: AiModelResponseDto[];
    onEdit: (model: AiModelResponseDto) => void;
    onDelete: (id: string) => void;
}

const AiModelsDisplay: React.FC<AiModelsDisplayProps> = ({ aiModelsList, onEdit, onDelete }) => {
    if (!aiModelsList || aiModelsList.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-semibold mb-1">No AI Models Found</h3>
                    <p className="text-sm">There are currently no AI models configured for this project.</p>
                    <p className="text-sm mt-1">Click "Add AI Model" to create one.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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