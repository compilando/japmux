import React, { useState, useEffect } from 'react';
import * as generated from '../../../generated/japmux-api';
import { regionService } from '@/services/api'; // Importar regionService
import { showErrorToast } from '@/utils/toastUtils'; // Para mostrar errores

// Define types for payloads based on OpenAPI DTOs
// Create requires languageCode and name
export type RegionCreatePayload = {
    languageCode: string;
    name: string;
    parentRegionId?: string;
    timeZone?: string;
    notes?: string;
};
// Update does not include languageCode
export type RegionUpdatePayload = Omit<RegionCreatePayload, 'languageCode'>;

interface TimeZoneOption {
    value: string;
    label: string;
}

// Interfaz para las opciones del select de regiones padre
interface ParentRegionOption {
    value: string; // languageCode de la región padre
    label: string; // name de la región padre
}

interface RegionFormProps {
    initialData: generated.CreateRegionDto | null;
    onSave: (data: RegionCreatePayload | RegionUpdatePayload) => void;
    onCancel: () => void;
    projectId: string;
}

const RegionForm: React.FC<RegionFormProps> = ({ initialData, onSave, onCancel, projectId }) => {
    const [languageCode, setLanguageCode] = useState('');
    const [name, setName] = useState('');
    const [parentRegionId, setParentRegionId] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [timeZoneOptions, setTimeZoneOptions] = useState<TimeZoneOption[]>([]);
    const [notes, setNotes] = useState('');

    // Estado para las regiones padre
    const [availableParentRegions, setAvailableParentRegions] = useState<ParentRegionOption[]>([]);
    const [isLoadingParentRegions, setIsLoadingParentRegions] = useState<boolean>(false);

    const isEditing = !!initialData;

    // Efecto para cargar las zonas horarias IANA
    useEffect(() => {
        try {
            const supportedTimeZones = Intl.supportedValuesOf('timeZone');
            const options = supportedTimeZones
                .sort()
                .map(tz => ({ value: tz, label: tz }));
            setTimeZoneOptions(options);
        } catch (error) {
            console.error("Error getting supported time zones:", error);
            showErrorToast("Could not load time zones.");
            setTimeZoneOptions([]);
        }
    }, []);

    // Efecto para cargar las regiones padre
    useEffect(() => {
        if (projectId) {
            setIsLoadingParentRegions(true);
            regionService.findAll(projectId)
                .then(regions => {
                    // Filtrar la región actual si se está editando, para no ser padre de sí misma
                    const filteredRegions = initialData
                        ? regions.filter(r => r.languageCode !== initialData.languageCode)
                        : regions;

                    const options: ParentRegionOption[] = filteredRegions.map(region => ({
                        value: region.languageCode,
                        label: `${region.name} (${region.languageCode})`
                    }));
                    setAvailableParentRegions(options);
                })
                .catch(err => {
                    console.error("Error fetching parent regions:", err);
                    showErrorToast("Could not load parent regions for selection.");
                    setAvailableParentRegions([]);
                })
                .finally(() => {
                    setIsLoadingParentRegions(false);
                });
        } else {
            setAvailableParentRegions([]); // Limpiar si no hay projectId
        }
    }, [projectId, initialData]); // Depender también de initialData para el filtro

    useEffect(() => {
        if (initialData) {
            setLanguageCode(initialData.languageCode);
            setName(initialData.name ?? '');
            setParentRegionId(initialData.parentRegionId ?? '');
            setTimeZone(initialData.timeZone ?? '');
            setNotes(initialData.notes ?? '');
        } else {
            // Resetear campos para nuevo formulario
            setLanguageCode('');
            setName('');
            setParentRegionId(''); // Importante resetear para que el select "-- None --" funcione
            setTimeZone('');
            setNotes('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!isEditing && !languageCode.trim()) {
            showErrorToast('Language Code is required.');
            return;
        }
        if (!name.trim()) {
            showErrorToast('Region Name is required.');
            return;
        }

        let payload: RegionCreatePayload | RegionUpdatePayload;

        if (isEditing) {
            payload = {
                name: name.trim(),
                parentRegionId: parentRegionId || undefined, // Enviar undefined si está vacío
                timeZone: timeZone || undefined,
                notes: notes.trim() || undefined,
            } as RegionUpdatePayload;
        } else {
            payload = {
                languageCode: languageCode.trim(),
                name: name.trim(),
                parentRegionId: parentRegionId || undefined, // Enviar undefined si está vacío
                timeZone: timeZone || undefined,
                notes: notes.trim() || undefined,
            } as RegionCreatePayload;
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language Code */}
            <div>
                <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language Code (e.g., es-ES)
                </label>
                <input
                    type="text"
                    id="languageCode"
                    value={languageCode}
                    onChange={(e) => {
                        let inputValue = e.target.value;
                        // Remover caracteres no alfabéticos excepto el guion en la posición correcta
                        inputValue = inputValue.replace(/[^a-zA-Z]/g, '');

                        let formattedValue = "";

                        if (inputValue.length > 0) {
                            formattedValue += inputValue.substring(0, 2).toLowerCase();
                        }
                        if (inputValue.length > 2) {
                            formattedValue += "-";
                            formattedValue += inputValue.substring(2, 4).toUpperCase();
                        }

                        // Limitar la longitud a 5 caracteres (xx-XX)
                        if (formattedValue.length > 5) {
                            formattedValue = formattedValue.substring(0, 5);
                        }

                        setLanguageCode(formattedValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    required={!isEditing}
                    disabled={isEditing}
                    maxLength={5}
                    pattern="^[a-z]{2}-[A-Z]{2}$"
                    title="Format must be xx-XX (e.g., en-US)"
                />
                {isEditing && <p className="text-xs text-gray-500 mt-1">Language Code cannot be changed after creation.</p>}
            </div>

            {/* Name */}
            <div>
                <label htmlFor="regionName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Region Name
                </label>
                <input
                    type="text"
                    id="regionName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            {/* Parent Region ID (Convertido a Select) */}
            <div>
                <label htmlFor="parentRegionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Parent Region (Optional)
                </label>
                <select
                    id="parentRegionId"
                    value={parentRegionId}
                    onChange={(e) => setParentRegionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={isLoadingParentRegions}
                >
                    <option value="">-- None --</option>
                    {availableParentRegions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {isLoadingParentRegions && <p className="text-xs text-gray-500 mt-1">Loading regions...</p>}
            </div>

            {/* Time Zone (Optional) - Select */}
            <div>
                <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time Zone (Optional)
                </label>
                <select
                    id="timeZone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">-- Select Time Zone --</option>
                    {timeZoneOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Notes (Optional) */}
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

            {/* Buttons */}
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
                    {isEditing ? 'Update Region' : 'Create Region'}
                </button>
            </div>
        </form>
    );
};

export default RegionForm; 