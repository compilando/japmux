import React from 'react';

interface GeneratePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerateComplete: (generatedText: string) => void;
    projectId: string;
    initialUserText?: string;
}

// Componente temporal para evitar errores de compilación
// TODO: Implementar funcionalidad completa cuando los servicios estén disponibles
const GeneratePromptModal: React.FC<GeneratePromptModalProps> = ({
    isOpen,
    onClose,
    onGenerateComplete,
    projectId,
    initialUserText = ''
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-lg mx-4">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Generate Prompt (Coming Soon)
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Esta funcionalidad estará disponible cuando se implementen los servicios necesarios.
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneratePromptModal; 