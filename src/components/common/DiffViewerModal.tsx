import React from 'react';
// import * as Diff from 'diff'; <-- Comentado
import { type Change } from 'diff'; // Importar solo el tipo Change
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VersionInfo {
    tag: string;
    text?: string | null;
    // Podríamos añadir más campos si fuera necesario, como la fecha de creación.
}

interface DiffViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    // diffResult: Diff.Change[] | null; <-- Usar el tipo importado
    diffResult: Change[] | null;
    versionInfo1: VersionInfo | null;
    versionInfo2: VersionInfo | null;
}

const DiffViewerModal: React.FC<DiffViewerModalProps> = ({ isOpen, onClose, diffResult, versionInfo1, versionInfo2 }) => {
    if (!isOpen || !diffResult || !versionInfo1 || !versionInfo2) {
        return null;
    }

    // const getLineColor = (part: Diff.Change) => { <-- Usar el tipo importado
    const getLineColor = (part: Change) => {
        if (part.added) return 'bg-green-500/20 dark:bg-green-500/30';
        if (part.removed) return 'bg-red-500/20 dark:bg-red-500/30';
        return 'bg-transparent';
    };

    // const getLinePrefix = (part: Diff.Change) => { <-- Usar el tipo importado
    const getLinePrefix = (part: Change) => {
        if (part.added) return '+ ';
        if (part.removed) return '- ';
        return '  '; // Dos espacios para alinear
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-300 dark:border-gray-600"
                onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del modal lo cierre
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Comparando Versiones: <span className="font-mono text-indigo-600 dark:text-indigo-400">{versionInfo1.tag}</span> vs <span className="font-mono text-indigo-600 dark:text-indigo-400">{versionInfo2.tag}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800/50">
                    <div className="grid grid-cols-2 gap-x-4 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div>Versión: <span className="font-mono text-brand-600 dark:text-brand-400">{versionInfo1.tag}</span> (Rojo: Eliminado de esta)</div>
                        <div>Versión: <span className="font-mono text-brand-600 dark:text-brand-400">{versionInfo2.tag}</span> (Verde: Añadido en esta)</div>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap font-mono bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                        {diffResult.map((part, index) => (
                            <span key={index} className={`block ${getLineColor(part)}`}>
                                <span className={`inline-block w-6 text-right pr-2 opacity-70 ${part.added ? 'text-green-700 dark:text-green-300' : part.removed ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {getLinePrefix(part)}
                                </span>
                                {part.value.endsWith('\n') ? part.value.slice(0, -1) : part.value}
                            </span>
                        ))}
                    </pre>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiffViewerModal; 