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

            if (result && typeof result === 'object' && 'response' in result) {
                const resultWithResponse = result as { response: any };
                try {
                    let parsedResponse;
                    if (typeof resultWithResponse.response === 'string') {
                        const cleanResponse = resultWithResponse.response
                            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                            .replace(/\n\s+/g, '\n')
                            .trim();

                        if (cleanResponse) {
                            parsedResponse = JSON.parse(cleanResponse);
                        } else {
                            throw new Error('Cleaned response is empty, cannot parse JSON.');
                        }

                    } else {
                        parsedResponse = resultWithResponse.response;
                    }

                    console.log('Respuesta parseada:', parsedResponse);

                    if (parsedResponse && typeof parsedResponse === 'object' && 'translatedText' in parsedResponse && typeof parsedResponse.translatedText === 'string') {
                        const cleanText = parsedResponse.translatedText
                            .split('\n')
                            .map((line: string) => line.trim())
                            .filter((line: string) => line.length > 0)
                            .join('\n');

                        setPromptText(cleanText);
                    } else {
                        throw new Error('No se encontró el texto traducido en la respuesta o el formato es incorrecto.');
                    }
                } catch (parseError) {
                    console.error('Error al parsear la respuesta:', parseError);
                    console.error('Respuesta recibida (antes de parsear):', resultWithResponse.response);
                    throw new Error('Error al procesar la respuesta del servicio de traducción');
                }
            } else {
                throw new Error('No se recibió una respuesta válida o con el formato esperado del servicio de traducción');
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Original Text
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
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            onClick={handleTranslate}
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
                    Transalted Text
                </label>
                <textarea
                    id="promptText"
                    rows={8}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Escribe o pega aquí el texto traducido. Puedes usar el botón &apos;Traducir&apos; para obtener una traducción automática.
                </p>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isTranslating}
                >
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default PromptTranslationForm; 