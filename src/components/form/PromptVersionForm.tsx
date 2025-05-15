import React, { useState, useEffect, useRef } from 'react';
import { CreatePromptVersionDto, UpdatePromptVersionDto, promptAssetService } from '@/services/api';
import { useProjects } from '@/context/ProjectContext';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';

// Interface local para los datos del formulario, incluyendo versionTag
export interface PromptVersionFormData extends CreatePromptVersionDto {
    versionTag?: string; // Hacerlo opcional para que coincida con la creación, pero presente en edición
    // promptText y changeMessage ya están en CreatePromptVersionDto
}

interface PromptVersionFormProps {
    initialData: PromptVersionFormData | null; // Usar la interfaz local
    onSave: (payload: CreatePromptVersionDto | UpdatePromptVersionDto) => void;
    onCancel: () => void;
    latestVersionTag?: string;
    projectId: string; // Añadir projectId como prop requerida
    promptId: string; // Añadir promptId como prop requerida
}

// Helper para calcular la siguiente versión (simplificado)
const calculateNextVersionTag = (latestTag: string | null | undefined): string => {
    // Primero, intenta manejar prefijos y sufijos comunes como -beta, etc.
    // Esta es una lógica muy básica y podría necesitar ajustes para casos más complejos.
    let baseTag = latestTag;
    let suffix = '';
    if (latestTag) {
        const suffixMatch = latestTag.match(/(-[a-zA-Z0-9-.]+)?(\+[a-zA-Z0-9-.]+)?$/);
        if (suffixMatch && suffixMatch[0]) {
            suffix = suffixMatch[0];
            baseTag = latestTag.substring(0, latestTag.length - suffix.length);
        }
    }

    if (!baseTag || !baseTag.startsWith('v')) {
        return 'v1.0.0'; // Default si no hay tag anterior o formato inesperado
    }

    const parts = baseTag.substring(1).split('.');
    if (parts.length === 3) {
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10);
        const patch = parseInt(parts[2], 10);
        if (!isNaN(major) && !isNaN(minor) && !isNaN(patch)) {
            // Solo incrementa patch, no maneja sufijos complejos
            return `v${major}.${minor}.${patch + 1}`;
        }
    }
    // Fallback si el parseo falla
    return 'v1.0.0';
};

const PromptVersionForm: React.FC<PromptVersionFormProps> = ({ initialData, onSave, onCancel, latestVersionTag, projectId, promptId }) => {
    const [promptText, setPromptText] = useState('');
    const [versionTag, setVersionTag] = useState('v1.0.0');
    const [changeMessage, setChangeMessage] = useState('');
    const [assets, setAssets] = useState<PromptAssetData[]>([]);
    const [showAssetMenu, setShowAssetMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const editorRef = useRef<HTMLTextAreaElement>(null);

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setPromptText(initialData.promptText || '');
            setVersionTag(initialData.versionTag || 'v1.0.0');
            setChangeMessage(initialData.changeMessage || '');
        } else {
            setPromptText('');
            const suggestedTag = calculateNextVersionTag(latestVersionTag);
            setVersionTag(suggestedTag);
            setChangeMessage('');
        }
    }, [initialData, latestVersionTag]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.value = promptText;
        }
    }, [promptText]);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!projectId || !promptId) return;
            try {
                const assetsData = await promptAssetService.findAll(projectId, promptId);
                setAssets(assetsData);
            } catch (error) {
                console.error('Error al cargar los assets:', error);
            }
        };

        fetchAssets();
    }, [projectId, promptId]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setShowAssetMenu(true);
    };

    const handleAssetSelect = (asset: PromptAssetData) => {
        if (editorRef.current) {
            const textarea = editorRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const variable = `{{${asset.key}}}`;

            const newText = text.substring(0, start) + variable + text.substring(end);
            setPromptText(newText);

            // Restaurar el cursor después de la variable insertada
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length, start + variable.length);
            }, 0);
        }
        setShowAssetMenu(false);
    };

    const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPromptText(e.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let payload: CreatePromptVersionDto | UpdatePromptVersionDto;

        if (isEditing) {
            payload = {
                promptText: promptText ? promptText : undefined,
                changeMessage: changeMessage ? changeMessage : undefined,
            } as UpdatePromptVersionDto;
            payload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined)) as UpdatePromptVersionDto;

        } else {
            payload = {
                promptText,
                versionTag: versionTag,
                changeMessage: changeMessage || undefined,
            } as any;

            if (!promptText) {
                alert("Prompt Text is required!");
                return;
            }
        }
        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="versionTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Version Tag</label>
                <input
                    type="text"
                    id="versionTag"
                    value={versionTag}
                    onChange={(e) => setVersionTag(e.target.value)}
                    required
                    disabled={isEditing} // Not editable
                    pattern="^v\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*)?(\\+[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*)?$"
                    title="Semantic Versioning format (e.g., v1.0.0, v1.2.3-beta)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-500"
                />
            </div>
            <div>
                <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt Text</label>
                <textarea
                    ref={editorRef}
                    value={promptText}
                    onChange={handleEditorChange}
                    onContextMenu={handleContextMenu}
                    className="mt-1 block w-full min-h-[200px] px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                    style={{ resize: 'vertical' }}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Haz clic derecho en el editor para abrir el menú de assets (variables).
                    Selecciona una variable para insertarla en el texto.
                </p>
            </div>
            <div>
                <label htmlFor="changeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Change Message (Optional)</label>
                <input
                    type="text"
                    id="changeMessage"
                    value={changeMessage}
                    onChange={(e) => setChangeMessage(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            {showAssetMenu && (
                <div
                    className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700"
                    style={{
                        left: menuPosition.x,
                        top: menuPosition.y,
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                >
                    <div className="py-1">
                        {assets.map((asset) => (
                            <button
                                key={asset.key}
                                onClick={() => handleAssetSelect(asset)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {asset.name} ({asset.key})
                            </button>
                        ))}
                    </div>
                </div>
            )}

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
                >
                    {isEditing ? 'Save Changes' : 'Create Version'}
                </button>
            </div>
        </form>
    );
};

export default PromptVersionForm; 