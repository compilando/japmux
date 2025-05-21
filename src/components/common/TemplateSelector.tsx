import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { promptTemplates, PromptTemplate } from '@/config/promptTemplates';

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: PromptTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose, onSelect }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: 'assistant', name: 'Asistentes' },
        { id: 'task', name: 'Tareas' },
        { id: 'creative', name: 'Creativo' },
        { id: 'analysis', name: 'Análisis' },
        { id: 'specialized', name: 'Especializado' }
    ];

    const filteredTemplates = selectedCategory
        ? promptTemplates.filter(t => t.category === selectedCategory)
        : promptTemplates;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                            Seleccionar Template
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-4">
                        {/* Categorías */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    !selectedCategory
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                Todos
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedCategory === category.id
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Lista de templates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                            {filteredTemplates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        onSelect(template);
                                        onClose();
                                    }}
                                    className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {template.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default TemplateSelector; 