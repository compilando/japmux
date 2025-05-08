import React, { useState, useEffect } from 'react';
import { PromptTranslation, CreatePromptTranslationDto, UpdatePromptTranslationDto } from '@/services/api';

interface PromptTranslationFormProps {
    initialData: PromptTranslation | null;
    versionId?: string;
    onSave: (payload: CreatePromptTranslationDto | UpdatePromptTranslationDto) => void;
    onCancel: () => void;
}

const PromptTranslationForm: React.FC<PromptTranslationFormProps> = ({ initialData, versionId, onSave, onCancel }) => {
    const [languageCode, setLanguageCode] = useState('');
    const [promptText, setPromptText] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setLanguageCode(initialData.languageCode || '');
            setPromptText(initialData.promptText || '');
        } else {
            setLanguageCode('');
            setPromptText('');
        }
    }, [initialData]);

    const handleLanguageCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Permitir solo letras y un guion, eliminar otros caracteres no deseados
        value = value.replace(/[^a-zA-Z-]/g, '');

        // Separar por guion si existe
        const parts = value.split('-');
        let langPart = parts[0] || '';
        let regionPart = parts[1] || '';

        // Formatear parte de idioma (dos primeras letras en minúscula)
        langPart = langPart.slice(0, 2).toLowerCase();

        // Formatear parte de región (dos primeras letras en mayúscula después del guion)
        regionPart = regionPart.slice(0, 2).toUpperCase();

        let formattedValue = langPart;
        // Verificar si se debe añadir un guion
        // Se añade si el usuario tecleó un guion, o si ya existe una parte de región,
        // o si la parte de idioma tiene 2 caracteres y el usuario está añadiendo nuevo contenido (no borrando).
        if (value.includes('-') || regionPart.length > 0 ||
            (langPart.length === 2 && e.nativeEvent && typeof (e.nativeEvent as any).inputType === 'string' &&
                !(e.nativeEvent as any).inputType.includes('delete'))) {
            if (langPart.length > 0) { // Solo añadir guion si hay parte de idioma
                formattedValue += '-';
            }
        }

        if (regionPart.length > 0) {
            formattedValue += regionPart;
        }

        // Limitar la longitud total a 5 caracteres (xx-XX)
        if (formattedValue.length > 5 && formattedValue.indexOf('-') === 2) {
            formattedValue = formattedValue.slice(0, 5);
        }
        // Si es como "esUS" (longitud 4 sin guion), la lógica anterior ya habrá insertado el guion: "es-US"

        // Si el valor resultante es solo un guion (ej. el usuario borró todo menos el guion), limpiarlo.
        if (formattedValue === '-') {
            formattedValue = '';
        }

        setLanguageCode(formattedValue);
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
                languageCode,
                promptText,
                versionId: versionId || '',
            } as CreatePromptTranslationDto;

            if (!versionId) {
                alert("Error: Missing version ID for creating translation.");
                return;
            }

            if (!languageCode || !promptText) {
                alert("Language Code and Prompt Text are required!");
                return;
            }

            const langCodePattern = /^[a-z]{2}-[A-Z]{2}$/;
            if (!langCodePattern.test(languageCode)) {
                alert("Language Code format must be xx-XX (e.g., en-US).");
                return;
            }
        }

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language Code (e.g., es-ES)</label>
                <input
                    type="text"
                    id="languageCode"
                    value={languageCode}
                    onChange={handleLanguageCodeInputChange}
                    required
                    minLength={5}
                    maxLength={5}
                    disabled={isEditing}
                    pattern="^[a-z]{2}-[A-Z]{2}$"
                    title="Format xx-XX (e.g., en-US)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Translated Prompt Text</label>
                <textarea
                    id="promptText"
                    rows={6}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{isEditing ? 'Save Changes' : 'Create Translation'}</button>
            </div>
        </form>
    );
};

export default PromptTranslationForm; 