import React, { useState, useEffect } from 'react';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import { CreatePromptAssetDto, UpdatePromptAssetDto, regionService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { CreateRegionDto } from '@/services/generated/api';

interface PromptAssetFormProps {
    initialData: PromptAssetData | null;
    onSave: (payload: CreatePromptAssetDto | UpdatePromptAssetDto) => void;
    onCancel: () => void;
    existingKeys?: string[];
}

const PromptAssetForm: React.FC<PromptAssetFormProps> = ({ initialData, onSave, onCancel, existingKeys = [] }) => {
    const [key, setKey] = useState('');
    const [name, setName] = useState('');
    const [initialValue, setInitialValue] = useState('');
    const [category, setCategory] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [keyError, setKeyError] = useState<string | null>(null);
    const [regionList, setRegionList] = useState<CreateRegionDto[]>([]);
    const { selectedProjectId } = useProjects();

    const isEditing = !!initialData;

    useEffect(() => {
        const fetchRegions = async () => {
            if (!selectedProjectId) return;

            try {
                const data = await regionService.findAll(selectedProjectId);
                if (Array.isArray(data)) {
                    setRegionList(data);
                }
            } catch (error) {
                console.error("Error fetching regions:", error);
            }
        };

        fetchRegions();
    }, [selectedProjectId]);

    useEffect(() => {
        if (initialData) {
            setKey(initialData.key || '');
            setName(initialData.name || '');
            setCategory(initialData.category || '');
            setEnabled(initialData.enabled === undefined ? true : initialData.enabled);
            setInitialValue('');
            setKeyError(null);
        } else {
            setKey('');
            setName('');
            setCategory('');
            setEnabled(true);
            setInitialValue('');
            setKeyError(null);
        }
    }, [initialData]);

    const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newKey = e.target.value;
        setKey(newKey);
        if (!isEditing && existingKeys.includes(newKey)) {
            setKeyError('Esta clave ya existe en el proyecto.');
        } else {
            setKeyError(null);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!isEditing && existingKeys.includes(key)) {
            setKeyError('Esta clave ya existe en el proyecto.');
            return;
        }
        setKeyError(null);

        if (isEditing && initialData) {
            const updatePayload: UpdatePromptAssetDto = {
                name: name || undefined,
                category: category || undefined,
                enabled: enabled,
            };
            Object.keys(updatePayload).forEach(k => updatePayload[k as keyof UpdatePromptAssetDto] === undefined && delete updatePayload[k as keyof UpdatePromptAssetDto]);
            onSave(updatePayload);
        } else {
            const createPayload: CreatePromptAssetDto = {
                key,
                name,
                initialValue: initialValue,
                category: category || undefined,
            };
            Object.keys(createPayload).forEach(k => createPayload[k as keyof CreatePromptAssetDto] === undefined && delete createPayload[k as keyof CreatePromptAssetDto]);

            if (!createPayload.key || !createPayload.name || !createPayload.initialValue) {
                alert("Se requieren la clave, el nombre y el valor inicial para crear un nuevo asset.");
                return;
            }
            onSave(createPayload);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Región</label>
                <select
                    id="key"
                    value={key}
                    onChange={handleKeyChange}
                    required
                    disabled={isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${keyError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500 disabled:text-gray-400`}
                >
                    <option value="">Selecciona una región</option>
                    {regionList.map((region) => (
                        <option key={region.languageCode} value={region.languageCode}>
                            {region.languageCode} - {region.name}
                        </option>
                    ))}
                </select>
                {keyError && <p className="text-xs text-red-500 mt-1">{keyError}</p>}
                {!isEditing && !keyError && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No se puede cambiar después de la creación.</p>}
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="ej. Mensaje de Bienvenida"
                />
            </div>
            {!isEditing && (
                <>
                    <div>
                        <label htmlFor="initialValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Inicial (para v1.0.0)</label>
                        <textarea
                            id="initialValue"
                            rows={3}
                            value={initialValue}
                            onChange={(e) => setInitialValue(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Ingresa el contenido de la primera versión..."
                        />
                    </div>
                </>
            )}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría (Opcional)</label>
                <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="ej. marketing, soporte"
                />
            </div>
            {isEditing && (
                <div className="flex items-center pt-2">
                    <input
                        id="enabled"
                        name="enabled"
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Habilitado
                    </label>
                </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Guardar Cambios' : 'Crear Asset'}</button>
            </div>
        </form>
    );
};

export default PromptAssetForm; 