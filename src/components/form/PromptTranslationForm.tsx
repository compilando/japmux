import React, { useState, useEffect } from 'react';
import { CreatePromptTranslationDto, UpdatePromptTranslationDto, regionService, rawExecutionService, aiModelService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { CreateRegionDto } from '@/services/generated/api';

interface PromptTranslationFormProps {
    initialData: CreatePromptTranslationDto | null;
    versionId?: string;
    onSave: (payload: CreatePromptTranslationDto | UpdatePromptTranslationDto) => void;
    onCancel: () => void;
    versionText: string;
}

const PromptTranslationForm: React.FC<PromptTranslationFormProps> = ({ initialData, versionId, onSave, onCancel, versionText }) => {
    const [languageCode, setLanguageCode] = useState('');
    const [promptText, setPromptText] = useState('');
    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [defaultAiModelId, setDefaultAiModelId] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    const isEditing = !!initialData;

    useEffect(() => {
        const fetchRegions = async () => {
            if (!selectedProjectId) return;

            setLoadingRegions(true);
            try {
                const data = await regionService.findAll(selectedProjectId);
                if (Array.isArray(data)) {
                    setRegionList(data);
                }
            } catch (error) {
                console.error("Error fetching regions:", error);
            } finally {
                setLoadingRegions(false);
            }
        };

        const fetchDefaultAiModel = async () => {
            if (!selectedProjectId) return;
            try {
                const models = await aiModelService.findAll(selectedProjectId);
                const gpt4Model = models.find(model => model.name.toLowerCase().includes('gpt-4'));
                if (gpt4Model) {
                    setDefaultAiModelId(gpt4Model.id);
                } else {
                    console.error('No se encontró un modelo GPT-4 en el proyecto');
                }
            } catch (error) {
                console.error('Error al cargar el modelo de IA:', error);
            }
        };

        fetchRegions();
        fetchDefaultAiModel();
    }, [selectedProjectId]);

    useEffect(() => {
        if (initialData) {
            setLanguageCode(initialData.languageCode || '');
            setPromptText(initialData.promptText || '');
        } else {
            setLanguageCode('');
            setPromptText('');
        }
    }, [initialData]);

    const handleLanguageCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguageCode(e.target.value);
    };

    const handleTranslate = async () => {
        if (!languageCode || !versionText || !defaultAiModelId) {
            console.error('Faltan datos necesarios para la traducción:', {
                languageCode,
                versionText,
                defaultAiModelId
            });
            return;
        }

        const selectedRegion = regionList.find(region => region.languageCode === languageCode);
        if (!selectedRegion) return;

        try {
            setIsTranslating(true);
            console.log('Ejecutando traducción con:', {
                languageCode,
                versionText,
                defaultAiModelId
            });

            const executionDto = {
                userText: versionText,
                systemPromptName: 'prompt-translator',
                aiModelId: defaultAiModelId,
                variables: {
                    text: versionText,
                    targetLanguage: languageCode,
                    regionName: selectedRegion.name
                }
            };

            const result = await rawExecutionService.executeRaw(executionDto);
            console.log('Resultado de la traducción:', result);

            if (result?.response) {
                try {
                    // Intentar obtener el objeto de respuesta
                    let parsedResponse;
                    if (typeof result.response === 'string') {
                        // Limpiar caracteres de control no válidos antes de parsear
                        const cleanResponse = result.response
                            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Eliminar caracteres de control
                            .replace(/\n\s+/g, '\n') // Limpiar espacios múltiples después de saltos de línea
                            .trim();

                        parsedResponse = JSON.parse(cleanResponse);
                    } else {
                        parsedResponse = result.response;
                    }

                    console.log('Respuesta parseada:', parsedResponse);

                    if (parsedResponse.translatedText) {
                        // Procesamos el texto traducido para manejar caracteres especiales y formato
                        const cleanText = parsedResponse.translatedText
                            .split('\n') // Dividir por saltos de línea
                            .map((line: string) => line.trim()) // Limpiar espacios en cada línea
                            .filter((line: string) => line.length > 0) // Eliminar líneas vacías
                            .join('\n'); // Unir con saltos de línea

                        setPromptText(cleanText);
                    } else {
                        throw new Error('No se encontró el texto traducido en la respuesta');
                    }
                } catch (parseError) {
                    console.error('Error al parsear la respuesta:', parseError);
                    console.error('Respuesta recibida:', result.response);
                    throw new Error('Error al procesar la respuesta del servicio de traducción');
                }
            } else {
                throw new Error('No se recibió una respuesta válida del servicio de traducción');
            }
        } catch (error) {
            console.error('Error en la traducción:', error);
            alert('Error al realizar la traducción automática: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreatePromptTranslationDto | UpdatePromptTranslationDto;

        if (isEditing) {
            payload = {
                promptText: promptText
            } as UpdatePromptTranslationDto;
        } else {
            payload = {
                versionId,
                languageCode,
                promptText
            } as CreatePromptTranslationDto;
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texto Original
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{versionText}</p>
                </div>
            </div>

            <div>
                <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Región
                </label>
                <div className="flex gap-2">
                    <select
                        id="languageCode"
                        value={languageCode}
                        onChange={handleLanguageCodeChange}
                        disabled={!!initialData || loadingRegions}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        required
                    >
                        <option value="">Selecciona una región</option>
                        {regionList.map((region) => (
                            <option key={region.languageCode} value={region.languageCode}>
                                {region.name} ({region.languageCode})
                            </option>
                        ))}
                    </select>
                    {!initialData && languageCode && (
                        <button
                            type="button"
                            onClick={() => {
                                console.log('Botón de traducción clickeado');
                                console.log('Estado actual:', {
                                    languageCode,
                                    versionText,
                                    selectedProjectId,
                                    defaultAiModelId
                                });
                                handleTranslate();
                            }}
                            disabled={isTranslating || !defaultAiModelId}
                            className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isTranslating ? 'Traduciendo...' : 'Traducir'}
                        </button>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texto Traducido
                </label>
                <textarea
                    id="promptText"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={8}
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default PromptTranslationForm; 