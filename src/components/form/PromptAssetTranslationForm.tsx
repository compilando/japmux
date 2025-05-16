import React, { useState, useEffect } from 'react';
import {
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
    regionService,
    rawExecutionService,
    aiModelService
} from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { CreateRegionDto } from '@/services/generated/api';

// Definir el tipo localmente ya que no está exportado desde api
// No es necesario si CreateAssetTranslationDto y UpdateAssetTranslationDto son suficientes
// interface PromptAssetTranslation {
//     languageCode: string;
//     value: string;
// }

interface PromptAssetTranslationFormProps {
    initialData: (CreateAssetTranslationDto & { id?: string }) | (UpdateAssetTranslationDto & { languageCode: string; id?: string }) | null;
    onSave: (payload: CreateAssetTranslationDto | UpdateAssetTranslationDto) => void;
    onCancel: () => void;
    versionText: string;
    availableLanguages?: { code: string; name: string }[];
    isEditing?: boolean;
}

const PromptAssetTranslationForm: React.FC<PromptAssetTranslationFormProps> = ({
    initialData,
    onSave,
    onCancel,
    versionText,
    availableLanguages,
    isEditing
}) => {
    const initialLanguageCode = initialData?.languageCode || '';
    const initialValue = initialData?.value || '';

    const [languageCode, setLanguageCode] = useState<string>(initialLanguageCode);
    const [value, setValue] = useState<string>(initialValue);
    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState<boolean>(true);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [defaultAiModelId, setDefaultAiModelId] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    useEffect(() => {
        if (initialData) {
            setLanguageCode(initialData.languageCode || '');
            setValue(initialData.value || '');
        } else {
            if (!isEditing && availableLanguages && availableLanguages.length > 0) {
                setLanguageCode('');
            } else {
                setLanguageCode('');
            }
            setValue('');
        }
    }, [initialData, isEditing, availableLanguages]);

    useEffect(() => {
        const fetchRegionsAndModel = async () => {
            if (!selectedProjectId) {
                setLoadingRegions(false);
                return;
            }
            setLoadingRegions(true);
            try {
                // Siempre cargar todas las regiones del proyecto para que handleTranslate funcione
                const data = await regionService.findAll(selectedProjectId);
                setRegionList(data);
                // Ya no necesitamos la condición `if (!availableLanguages)` aquí para cargar regionList

                const models = await aiModelService.findAll(selectedProjectId);
                const gpt4Model = models.find(model => model.name.toLowerCase().includes('gpt-4'));
                if (gpt4Model) {
                    setDefaultAiModelId(gpt4Model.id);
                } else {
                    console.warn('Default GPT-4 model not found in project.');
                }
            } catch (error) {
                console.error('Error fetching regions or AI model:', error);
            } finally {
                setLoadingRegions(false);
            }
        };

        fetchRegionsAndModel();
    }, [selectedProjectId]); // Se elimina availableLanguages de las dependencias de este useEffect,
                             // ya que la carga de regionList y el modelo AI no depende de los idiomas *disponibles para nueva traducción*,
                             // sino del proyecto seleccionado.

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreateAssetTranslationDto | UpdateAssetTranslationDto;

        if (initialData) {
            payload = {
                value,
            } as UpdateAssetTranslationDto;
        } else {
            payload = {
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

            if (result && typeof result === 'object' && 'response' in result) {
                const resultWithResponse = result as { response: any };
                try {
                    if (typeof resultWithResponse.response === 'string') {
                        // Limpiar la respuesta usando una expresión regular
                        const cleanResponse = resultWithResponse.response
                            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Eliminar caracteres de control
                            .replace(/\n/g, ' ') // Reemplazar saltos de línea con espacios
                            .replace(/\s+/g, ' ') // Normalizar espacios
                            .trim();

                        console.log('Respuesta limpia:', cleanResponse);
                        const parsedResponse = JSON.parse(cleanResponse);
                        
                        if (parsedResponse && typeof parsedResponse === 'object' && 'translatedText' in parsedResponse) {
                            // Restaurar los saltos de línea en el texto traducido
                            const translatedText = parsedResponse.translatedText
                                .split(' ')
                                .filter(Boolean)
                                .join('\n');
                            setValue(translatedText);
                        } else {
                            throw new Error('La respuesta no contiene el texto traducido o el formato es incorrecto.');
                        }
                    } else {
                        console.warn("Translation response was not a string, attempting to use as is or parse if needed.", resultWithResponse.response);
                        throw new Error('El formato de la respuesta de traducción no es una cadena JSON como se esperaba.');
                    }
                } catch (parseError) {
                    console.error('Error al parsear la respuesta:', parseError);
                    console.error('Respuesta recibida (antes de parsear):', resultWithResponse.response);
                    throw new Error('Error al procesar la respuesta del servicio de traducción. Formato inválido.');
                }
            } else {
                throw new Error('No se recibió una respuesta válida o con el formato esperado del servicio de traducción');
            }
        } catch (error) {
            console.error('Error al traducir:', error);
            alert(`Error al realizar la traducción automática: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsTranslating(false);
        }
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
                    Region
                </label>
                <div className="flex gap-2">
                    <select
                        id="languageCode"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        disabled={isEditing || loadingRegions || (!isEditing && availableLanguages && availableLanguages.length === 0)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required={!isEditing}
                    >
                        <option value="">
                            {isEditing 
                                ? (initialData?.languageCode || "Language")
                                : (availableLanguages && availableLanguages.length === 0 ? "No languages available" : "Select a language")}
                        </option>
                        {!isEditing && availableLanguages && availableLanguages.length > 0 && (
                            availableLanguages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name} ({lang.code})
                                </option>
                            ))
                        )}
                        {!isEditing && !availableLanguages && regionList.length > 0 && (
                            regionList.map((region) => (
                                <option key={region.languageCode} value={region.languageCode}>
                                    {region.name} ({region.languageCode})
                                </option>
                            ))
                        )}
                    </select>
                    {!isEditing && (
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
                    Value
                </label>
                <textarea
                    id="value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={10}
                    className="mt-1 block w-full px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isTranslating}
                >
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default PromptAssetTranslationForm; 