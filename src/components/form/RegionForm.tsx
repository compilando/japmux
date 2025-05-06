import React, { useState, useEffect } from 'react';
import { Region } from '@/services/api';

// Define types for payloads based on OpenAPI DTOs
// Create requires languageCode and name
export type RegionCreatePayload = {
    languageCode: string;
    name: string;
    parentRegionId?: string;
    timeZone?: string;
    defaultFormalityLevel?: string;
    notes?: string;
};
// Update does not include languageCode
export type RegionUpdatePayload = Omit<RegionCreatePayload, 'languageCode'>;

interface RegionFormProps {
    initialData: Region | null;
    onSave: (data: RegionCreatePayload | RegionUpdatePayload) => void;
    onCancel: () => void;
}

const RegionForm: React.FC<RegionFormProps> = ({ initialData, onSave, onCancel }) => {
    const [languageCode, setLanguageCode] = useState('');
    const [name, setName] = useState('');
    const [parentRegionId, setParentRegionId] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [defaultFormalityLevel, setDefaultFormalityLevel] = useState('');
    const [notes, setNotes] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setLanguageCode(initialData.languageCode);
            setName(initialData.name ?? '');
            setParentRegionId(initialData.parentRegionId ?? '');
            setTimeZone(initialData.timeZone ?? '');
            setDefaultFormalityLevel(initialData.defaultFormalityLevel ?? '');
            setNotes(initialData.notes ?? '');
        } else {
            setLanguageCode('');
            setName('');
            setParentRegionId('');
            setTimeZone('');
            setDefaultFormalityLevel('');
            setNotes('');
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!isEditing && !languageCode.trim()) {
            alert('Language Code is required.');
            return;
        }
        // Add xx-XX format validation for languageCode?
        // if (!/^[a-z]{2}-[A-Z]{2}$/.test(languageCode)) { ... }

        if (!name.trim()) {
            alert('Region Name is required.');
            return;
        }

        let payload: RegionCreatePayload | RegionUpdatePayload;

        if (isEditing) {
            payload = {
                name: name.trim(),
                parentRegionId: parentRegionId.trim() || undefined,
                timeZone: timeZone.trim() || undefined,
                defaultFormalityLevel: defaultFormalityLevel.trim() || undefined,
                notes: notes.trim() || undefined,
            } as RegionUpdatePayload;
        } else {
            payload = {
                languageCode: languageCode.trim(),
                name: name.trim(),
                parentRegionId: parentRegionId.trim() || undefined,
                timeZone: timeZone.trim() || undefined,
                defaultFormalityLevel: defaultFormalityLevel.trim() || undefined,
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
                    onChange={(e) => setLanguageCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    required={!isEditing}
                    disabled={isEditing}
                    maxLength={5}
                    pattern="^[a-z]{2}-[A-Z]{2}$" // Add basic pattern
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

            {/* Parent Region ID (Optional - text) */}
            <div>
                <label htmlFor="parentRegionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Parent Region ID (Optional, e.g., eu)
                </label>
                <input
                    type="text"
                    id="parentRegionId"
                    value={parentRegionId}
                    onChange={(e) => setParentRegionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    maxLength={5} // Optional: if you know parent IDs have this format
                />
                {/* Alternative: Could be a <select> loading getRegions() */}
            </div>

            {/* Time Zone (Optional) */}
            <div>
                <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time Zone (Optional, e.g., Europe/Madrid)
                </label>
                <input
                    type="text"
                    id="timeZone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {/* Default Formality Level (Optional) */}
            <div>
                <label htmlFor="defaultFormalityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Formality Level (Optional)
                </label>
                <input
                    type="text"
                    id="defaultFormalityLevel"
                    value={defaultFormalityLevel}
                    onChange={(e) => setDefaultFormalityLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
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