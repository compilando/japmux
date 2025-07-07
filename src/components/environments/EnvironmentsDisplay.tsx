import React from 'react';
import { EnvironmentData } from './EnvironmentCardItem'; // Usar la interfaz local
import EnvironmentCardItem from './EnvironmentCardItem';
import InfoIcon from '@/icons/info.svg';

interface EnvironmentsDisplayProps {
    environmentsList: EnvironmentData[];
    onEditEnvironment: (environment: EnvironmentData) => void;
    onDeleteEnvironment: (id: string) => void;
}

const EnvironmentsDisplay: React.FC<EnvironmentsDisplayProps> = ({
    environmentsList,
    onEditEnvironment,
    onDeleteEnvironment
}) => {
    if (!environmentsList || environmentsList.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-semibold mb-1">No Environments Found</h3>
                    <p className="text-sm">There are currently no environments configured for this project.</p>
                    <p className="text-sm mt-1">Use the form above to add a new one.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {environmentsList.map((environment) => (
                <EnvironmentCardItem
                    key={environment.id} // Asumiendo que EnvironmentData tiene id
                    environment={environment}
                    onEdit={onEditEnvironment}
                    onDelete={onDeleteEnvironment}
                />
            ))}
        </div>
    );
};

export default EnvironmentsDisplay; 