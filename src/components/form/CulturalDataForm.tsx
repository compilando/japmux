import React, { useState, useEffect } from 'react';
import {
    // CulturalData, // Se reemplazará por generated.CulturalDataResponse
    CreateCulturalDataDto, // Asumiendo que es re-exportado o igual a generated.CreateCulturalDataDto
    UpdateCulturalDataDto, // Asumiendo que es re-exportado o igual a generated.UpdateCulturalDataDto
    // Region, // Se reemplazará por generated.CreateRegionDto
    regionService
} from '@/services/api';
import * as generated from '../../../generated/japmux-api'; // Importar tipos generados
import { useProjects } from '@/context/ProjectContext';
import { showErrorToast } from '@/utils/toastUtils'; // Importar para consistencia

interface CulturalDataFormProps {
    initialData: generated.CulturalDataResponse | null; // Cambiado a generated.CulturalDataResponse
    onSave: (data: CreateCulturalDataDto | UpdateCulturalDataDto) => void;
    onCancel: () => void;
}

const CulturalDataForm: React.FC<CulturalDataFormProps> = ({ initialData, onSave, onCancel }) => {
    const [itemKey, setItemKey] = useState('');
    const [regionId, setRegionId] = useState('');
    const [formalityLevel, setFormalityLevel] = useState<number | string>('');
    const [style, setStyle] = useState('');
    const [considerations, setConsiderations] = useState('');
    const [notes, setNotes] = useState('');

    const [availableRegions, setAvailableRegions] = useState<generated.CreateRegionDto[]>([]); // Cambiado a generated.CreateRegionDto[]
    const [loadingRegions, setLoadingRegions] = useState<boolean>(false);
    const [regionError, setRegionError] = useState<string | null>(null);
    const { selectedProjectId } = useProjects();

    const isEditing = !!initialData;

    useEffect(() => {
        const fetchAvailableRegions = async () => {
            if (!selectedProjectId) {
                setLoadingRegions(false);
                setRegionError("Select a project first.");
                setAvailableRegions([]);
                return;
            }
            setLoadingRegions(true);
            setRegionError(null);
            try {
                const regionsData = await regionService.findAll(selectedProjectId);
                if (Array.isArray(regionsData)) {
                    setAvailableRegions(regionsData);
                } else {
                    setRegionError("Invalid format for regions data.");
                    setAvailableRegions([]);
                }
            } catch (error) {
                console.error("Failed to fetch regions:", error);
                setRegionError("Failed to load regions for selection.");
                setAvailableRegions([]);
            } finally {
                setLoadingRegions(false);
            }
        };

        fetchAvailableRegions();
    }, [selectedProjectId]);

    useEffect(() => {
        if (initialData) {
            setItemKey(initialData.key);
            setRegionId(initialData.regionId);
            setStyle(initialData.style ?? '');
            setNotes(initialData.notes ?? '');
        } else {
            setItemKey('');
            setRegionId('');
            setFormalityLevel('');
            setStyle('');
            setConsiderations('');
            setNotes('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!isEditing && !itemKey.trim()) {
            // alert('ID (Slug) is required.'); // Reemplazado con toast
            showErrorToast('Key (Slug) is required.');
            return;
        }

        if (!isEditing && !regionId) {
            // alert('Please select a Region ID.'); // Reemplazado con toast
            showErrorToast('Please select a Region ID.');
            return;
        }

        const formalityLevelValue = formalityLevel === '' ? undefined : Number(formalityLevel);

        let payload: CreateCulturalDataDto | UpdateCulturalDataDto;

        if (isEditing) {
            payload = {
                style: style.trim() || undefined,
                notes: notes.trim() || undefined,
            } as UpdateCulturalDataDto;
        } else {
            payload = {
                key: itemKey.trim(),
                regionId: regionId,
                style: style.trim() || undefined,
                notes: notes.trim() || undefined,
            } as CreateCulturalDataDto;
        }

        console.log('[CulturalDataForm handleSubmit] Payload to be saved:', payload);
        if ('key' in payload && payload.key !== undefined) {
            console.log('[CulturalDataForm handleSubmit] Type of key:', typeof payload.key, 'Value:', payload.key);
        }
        if ('regionId' in payload && payload.regionId !== undefined) {
            console.log('[CulturalDataForm handleSubmit] Type of regionId:', typeof payload.regionId, 'Value:', payload.regionId);
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="culturalDataKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key (Slug)
                </label>
                <input
                    type="text"
                    id="culturalDataKey"
                    value={itemKey}
                    onChange={(e) => setItemKey(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    required={!isEditing}
                    disabled={isEditing}
                />
                {!isEditing && <p className="text-xs text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens.</p>}
                {isEditing && <p className="text-xs text-gray-500 mt-1">Key cannot be changed after creation.</p>}
            </div>

            <div>
                <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Region ID
                </label>
                {!selectedProjectId && <p className="text-sm text-yellow-600 dark:text-yellow-400">Please select a project to load regions.</p>}
                {selectedProjectId && loadingRegions && <p>Loading regions...</p>}
                {selectedProjectId && regionError && <p className="text-red-500 text-sm">{regionError}</p>}
                <select
                    id="regionId"
                    value={regionId}
                    onChange={(e) => setRegionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    required={!isEditing}
                    disabled={!selectedProjectId || isEditing || loadingRegions || !!regionError}
                >
                    <option value="" disabled>-- Select a Region --</option>
                    {availableRegions.map((region) => (
                        <option key={region.languageCode} value={region.languageCode}>
                            {region.name} ({region.languageCode})
                        </option>
                    ))}
                </select>
                {isEditing && <p className="text-xs text-gray-500 mt-1">Region ID cannot be changed after creation.</p>}
            </div>

            <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Style (Optional)
                </label>
                <input
                    type="text"
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditing ? 'Update Cultural Data' : 'Create Cultural Data'}
                </button>
            </div>
        </form>
    );
};

export default CulturalDataForm; 