import React, { useState, useEffect } from 'react';
import {
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
    regionService,
    promptAssetService,
    rawExecutionService,
    aiModelService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { CreateRegionDto } from '@/services/generated/api';

// Definir el tipo localmente ya que no está exportado desde api
interface PromptAssetTranslation {
    languageCode: string;
    value: string;
}

interface PromptAssetTranslationFormProps {
    initialData: PromptAssetTranslation | null;
    onSave: (payload: CreateAssetTranslationDto | UpdateAssetTranslationDto) => void;
    onCancel: () => void;
    versionId: string;
    versionText: string;
}

const PromptAssetTranslationForm: React.FC<PromptAssetTranslationFormProps> = ({ initialData, onSave, onCancel, versionId, versionText }) => {
    const [languageCode, setLanguageCode] = useState<string>(initialData?.languageCode || '');
    const [value, setValue] = useState<string>(initialData?.value || '');
    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState<boolean>(true);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [defaultAiModelId, setDefaultAiModelId] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    useEffect(() => {
        const fetchRegions = async () => {
            if (!selectedProjectId) return;
            setLoadingRegions(true);
            try {
                const data = await regionService.findAll(selectedProjectId);
                setRegionList(data);
            } catch (error) {
                console.error('Error fetching regions:', error);
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreateAssetTranslationDto | UpdateAssetTranslationDto;

        if (initialData) {
            payload = {
                value,
            } as UpdateAssetTranslationDto;
        } else {
            payload = {
                versionId,
                languageCode,
                value,
            } as CreateAssetTranslationDto;
        }

        onSave(payload);
    };

    const handleTranslate = async () => {
        if (!languageCode || !versionText || !selectedProjectId || !defaultAiModelId) {
            console.error('Faltan datos necesarios:', { languageCode, versionText, selectedProjectId, defaultAiModelId });
            return;
        }

        const selectedRegion = regionList.find(region => region.languageCode === languageCode);
        if (!selectedRegion) return;

        setIsTranslating(true);
        try {
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

            console.log('Executing translation with:', executionDto);
            const result = await rawExecutionService.executeRaw(executionDto);
            console.log('Translation result:', result);

            if (result?.response) {
                try {
                    const parsedResponse = JSON.parse(result.response);
                    if (parsedResponse.translatedText) {
                        setValue(parsedResponse.translatedText);
                    } else {
                        throw new Error('La respuesta no contiene el texto traducido');
                    }
                } catch (parseError) {
                    console.error('Error al parsear la respuesta:', parseError);
                    throw new Error('Formato de respuesta inválido');
                }
            } else {
                throw new Error('No se recibió una respuesta válida del servicio de traducción');
            }
        } catch (error) {
            console.error('Error al traducir:', error);
            alert(`Error al realizar la traducción automática: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsTranslating(false);
        }
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
                        onChange={(e) => setLanguageCode(e.target.value)}
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
                                    selectedProjectId
                                });
                                handleTranslate();
                            }}
                            disabled={isTranslating}
                            className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isTranslating ? 'Traduciendo...' : 'Traducir'}
                        </button>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor
                </label>
                <textarea
                    id="value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500"
                >
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default PromptAssetTranslationForm; 