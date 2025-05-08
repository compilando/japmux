import React, { useState, useEffect } from 'react';
import {
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
    regionService,
    promptAssetService
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
}

const PromptAssetTranslationForm: React.FC<PromptAssetTranslationFormProps> = ({ initialData, onSave, onCancel, versionId }) => {
    const [languageCode, setLanguageCode] = useState<string>(initialData?.languageCode || '');
    const [value, setValue] = useState<string>(initialData?.value || '');
    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const [loadingRegions, setLoadingRegions] = useState<boolean>(true);
    const { selectedProjectId } = useProjects();

    useEffect(() => {
        const fetchRegions = async () => {
            if (selectedProjectId) {
                try {
                    const regions = await regionService.findAll(selectedProjectId);
                    setRegionList(regions);
                } catch (error) {
                    console.error('Error fetching regions:', error);
                } finally {
                    setLoadingRegions(false);
                }
            }
        };

        fetchRegions();
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Región
                </label>
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