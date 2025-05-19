import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
    CodeBracketIcon,
    ListBulletIcon,
    DocumentTextIcon,
    VariableIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    LinkIcon,
    PhotoIcon,
    TableCellsIcon,
    ClipboardIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';
import { Tooltip } from 'react-tooltip';

/**
 * Props para el componente PromptEditor
 * @interface PromptEditorProps
 * @property {string} value - El valor actual del editor
 * @property {(value: string) => void} onChange - Función llamada cuando el valor cambia
 * @property {string} [placeholder] - Texto de placeholder para el editor
 * @property {number} [rows] - Número de filas visibles del editor
 * @property {PromptAssetData[]} [assets] - Lista de assets disponibles para insertar
 * @property {boolean} [readOnly] - Si el editor es de solo lectura
 * @property {boolean} [showHistory] - Si se muestra el historial de cambios
 * @property {string} [id] - ID único para el editor
 * @property {string} [aria-label] - Etiqueta ARIA para accesibilidad
 * @property {string} [aria-describedby] - ID del elemento que describe el editor
 */
interface PromptEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    assets?: PromptAssetData[];
    readOnly?: boolean;
    showHistory?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

interface HistoryEntry {
    text: string;
    timestamp: number;
}

// Componentes memoizados para los botones de la barra de herramientas
const ToolbarButton = React.memo(({
    onClick,
    icon: Icon,
    label,
    disabled = false,
    tooltip,
    className = "",
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby
}: {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    disabled?: boolean;
    tooltip?: string;
    className?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 ${className}`}
        data-tooltip-id={`tooltip-${label}`}
        data-tooltip-content={tooltip}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedby}
        role="button"
    >
        <Icon className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
        <span>{label}</span>
    </button>
));

const PromptEditor: React.FC<PromptEditorProps> = React.memo(({
    value,
    onChange,
    placeholder = "Enter text here...",
    rows = 18,
    assets = [],
    readOnly = false,
    showHistory = true,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby
}) => {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [showAssetMenu, setShowAssetMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
    const [isUndoRedo, setIsUndoRedo] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [focusedButton, setFocusedButton] = useState<string | null>(null);

    // Memoizar los assets para evitar re-renders innecesarios
    const memoizedAssets = useMemo(() => assets, [assets]);

    // Función memoizada para manejar cambios de texto
    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isUndoRedo) {
            onChange(e.target.value);

            // Implementar autoguardado
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            setIsAutoSaving(true);
            autoSaveTimeoutRef.current = setTimeout(() => {
                setIsAutoSaving(false);
            }, 1000);
        }
    }, [onChange, isUndoRedo]);

    // Función memoizada para manejar el menú contextual
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setShowAssetMenu(true);
    }, []);

    // Función memoizada para seleccionar assets
    const handleAssetSelect = useCallback((asset: PromptAssetData) => {
        if (editorRef.current) {
            const textarea = editorRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const variable = `{{${asset.key}}}`;

            const newText = text.substring(0, start) + variable + text.substring(end);
            onChange(newText);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length, start + variable.length);
            }, 0);
        }
        setShowAssetMenu(false);
    }, [onChange]);

    // Función memoizada para insertar plantillas
    const insertTemplate = useCallback((template: string) => {
        if (editorRef.current) {
            const textarea = editorRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, start) + template + text.substring(end);
            onChange(newText);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + template.length, start + template.length);
            }, 0);
        }
    }, [onChange]);

    // Funciones memoizadas para las acciones de la barra de herramientas
    const handleFormatText = useCallback(() => {
        if (editorRef.current) {
            const textarea = editorRef.current;
            const text = textarea.value;
            const formattedText = text
                .replace(/\n{3,}/g, '\n\n')
                .replace(/\s+/g, ' ')
                .trim();
            onChange(formattedText);
        }
    }, [onChange]);

    const handleClearText = useCallback(() => {
        if (window.confirm('¿Estás seguro de que quieres borrar el texto?')) {
            onChange('');
        }
    }, [onChange]);

    const handleCopyText = useCallback(() => {
        if (editorRef.current) {
            navigator.clipboard.writeText(editorRef.current.value);
        }
    }, []);

    const handlePasteFormatted = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (editorRef.current) {
                const textarea = editorRef.current;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const currentText = textarea.value;
                const newText = currentText.substring(0, start) + text + currentText.substring(end);
                onChange(newText);
            }
        } catch (err) {
            console.error('Error al pegar texto:', err);
        }
    }, [onChange]);

    // Funciones memoizadas para el historial
    const handleUndo = useCallback(() => {
        if (currentHistoryIndex > 0) {
            setIsUndoRedo(true);
            const newIndex = currentHistoryIndex - 1;
            setCurrentHistoryIndex(newIndex);
            onChange(history[newIndex].text);
            setIsUndoRedo(false);
        }
    }, [currentHistoryIndex, history, onChange]);

    const handleRedo = useCallback(() => {
        if (currentHistoryIndex < history.length - 1) {
            setIsUndoRedo(true);
            const newIndex = currentHistoryIndex + 1;
            setCurrentHistoryIndex(newIndex);
            onChange(history[newIndex].text);
            setIsUndoRedo(false);
        }
    }, [currentHistoryIndex, history, onChange]);

    // Atajos de teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'z':
                        if (e.shiftKey) {
                            e.preventDefault();
                            handleRedo();
                        } else {
                            e.preventDefault();
                            handleUndo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        handleRedo();
                        break;
                    case 'b':
                        e.preventDefault();
                        insertTemplate('**texto en negrita**');
                        break;
                    case 'i':
                        e.preventDefault();
                        insertTemplate('*texto en cursiva*');
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo, insertTemplate]);

    // Actualizar historial
    useEffect(() => {
        if (value && !isUndoRedo) {
            setHistory(prev => [...prev, { text: value, timestamp: Date.now() }]);
            setCurrentHistoryIndex(prev => prev + 1);
        }
    }, [value, isUndoRedo]);

    // Limpiar timeout de autoguardado
    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="space-y-2"
            role="region"
            aria-label={ariaLabel || "Editor de prompt"}
            aria-describedby={ariaDescribedby}
        >
            {/* Barra de herramientas mejorada */}
            <div
                className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-sm"
                role="toolbar"
                aria-label="Herramientas del editor"
            >
                {/* Grupo de Plantillas Básicas */}
                <div className="flex gap-2" role="group" aria-label="Plantillas básicas">
                    <ToolbarButton
                        onClick={() => insertTemplate('You are a helpful AI assistant.')}
                        icon={DocumentTextIcon}
                        label="Plantilla Básica"
                        disabled={readOnly}
                        tooltip="Insertar plantilla básica de asistente"
                        aria-label="Insertar plantilla básica de asistente"
                        aria-describedby="template-basic-desc"
                    />
                    <ToolbarButton
                        onClick={() => insertTemplate('```\n\n```')}
                        icon={CodeBracketIcon}
                        label="Bloque de Código"
                        disabled={readOnly}
                        tooltip="Insertar bloque de código"
                        aria-label="Insertar bloque de código"
                        aria-describedby="template-code-desc"
                    />
                    <ToolbarButton
                        onClick={() => insertTemplate('- \n- \n- ')}
                        icon={ListBulletIcon}
                        label="Lista"
                        disabled={readOnly}
                        tooltip="Insertar lista"
                        aria-label="Insertar lista"
                        aria-describedby="template-list-desc"
                    />
                </div>

                {/* Grupo de Elementos Markdown */}
                <div className="flex gap-2" role="group" aria-label="Elementos markdown">
                    <ToolbarButton
                        onClick={() => insertTemplate('| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |')}
                        icon={TableCellsIcon}
                        label="Tabla"
                        disabled={readOnly}
                        tooltip="Insertar tabla markdown"
                        aria-label="Insertar tabla markdown"
                        aria-describedby="template-table-desc"
                    />
                    <ToolbarButton
                        onClick={() => insertTemplate('[texto del enlace](https://ejemplo.com)')}
                        icon={LinkIcon}
                        label="Enlace"
                        disabled={readOnly}
                        tooltip="Insertar enlace markdown"
                        aria-label="Insertar enlace markdown"
                        aria-describedby="template-link-desc"
                    />
                    <ToolbarButton
                        onClick={() => insertTemplate('![texto alternativo](https://ejemplo.com/imagen.jpg)')}
                        icon={PhotoIcon}
                        label="Imagen"
                        disabled={readOnly}
                        tooltip="Insertar imagen markdown"
                        aria-label="Insertar imagen markdown"
                        aria-describedby="template-image-desc"
                    />
                </div>

                {/* Grupo de Utilidades */}
                <div className="flex gap-2" role="group" aria-label="Utilidades">
                    <ToolbarButton
                        onClick={handleFormatText}
                        icon={ArrowPathIcon}
                        label="Formatear"
                        disabled={readOnly}
                        tooltip="Formatear texto"
                        aria-label="Formatear texto"
                        aria-describedby="format-desc"
                    />
                    <ToolbarButton
                        onClick={handleCopyText}
                        icon={ClipboardIcon}
                        label="Copiar Todo"
                        tooltip="Copiar todo el texto"
                        aria-label="Copiar todo el texto"
                        aria-describedby="copy-desc"
                    />
                    <ToolbarButton
                        onClick={handlePasteFormatted}
                        icon={ClipboardDocumentIcon}
                        label="Pegar"
                        disabled={readOnly}
                        tooltip="Pegar texto formateado"
                        aria-label="Pegar texto formateado"
                        aria-describedby="paste-desc"
                    />
                    <ToolbarButton
                        onClick={handleClearText}
                        icon={ClipboardDocumentIcon}
                        label="Limpiar"
                        disabled={readOnly}
                        tooltip="Limpiar todo el texto"
                        aria-label="Limpiar todo el texto"
                        aria-describedby="clear-desc"
                        className="text-red-600 dark:text-red-400"
                    />
                </div>

                {/* Controles de Historial */}
                {showHistory && (
                    <div className="flex gap-2" role="group" aria-label="Controles de historial">
                        <ToolbarButton
                            onClick={handleUndo}
                            icon={ArrowUturnLeftIcon}
                            label="Deshacer"
                            disabled={readOnly || currentHistoryIndex <= 0}
                            tooltip="Deshacer último cambio (Ctrl+Z)"
                            aria-label="Deshacer último cambio"
                            aria-describedby="undo-desc"
                        />
                        <ToolbarButton
                            onClick={handleRedo}
                            icon={ArrowUturnRightIcon}
                            label="Rehacer"
                            disabled={readOnly || currentHistoryIndex >= history.length - 1}
                            tooltip="Rehacer último cambio (Ctrl+Y)"
                            aria-label="Rehacer último cambio"
                            aria-describedby="redo-desc"
                        />
                    </div>
                )}

                <div className="flex-grow"></div>

                {/* Botón de Variables */}
                <ToolbarButton
                    onClick={() => setShowAssetMenu(true)}
                    icon={VariableIcon}
                    label="Insertar Variable"
                    disabled={readOnly}
                    tooltip="Insertar variable (clic derecho en el editor)"
                    aria-label="Insertar variable"
                    aria-describedby="variable-desc"
                    className="text-indigo-600 dark:text-indigo-400"
                />

                {/* Botón de ayuda mejorado */}
                <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                    data-tooltip-id="editor-help"
                    data-tooltip-content="Atajos de teclado y ayuda"
                    aria-label="Mostrar ayuda y atajos de teclado"
                    aria-describedby="help-desc"
                >
                    <InformationCircleIcon className="w-4 h-4" aria-hidden="true" />
                    <span>Ayuda</span>
                </button>
            </div>

            {/* Editor de texto mejorado */}
            <div className="relative">
                <textarea
                    ref={editorRef}
                    id={id}
                    value={value}
                    onChange={handleTextChange}
                    onContextMenu={handleContextMenu}
                    rows={rows}
                    readOnly={readOnly}
                    className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm shadow-sm transition-shadow duration-200 hover:shadow-md"
                    placeholder={placeholder}
                    aria-label={ariaLabel || "Editor de prompt"}
                    aria-describedby={ariaDescribedby}
                    aria-multiline="true"
                    aria-readonly={readOnly}
                    role="textbox"
                />
                {isAutoSaving && (
                    <div
                        className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm"
                        role="status"
                        aria-live="polite"
                    >
                        Guardando...
                    </div>
                )}
            </div>

            {/* Panel de ayuda mejorado */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Atajos de teclado</h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Z</kbd> - Deshacer</li>
                    <li>• <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Y</kbd> - Rehacer</li>
                    <li>• <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">B</kbd> - Negrita</li>
                    <li>• <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">I</kbd> - Cursiva</li>
                </ul>
            </div>

            {/* Menú de assets */}
            {showAssetMenu && (
                <div
                    className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700"
                    style={{
                        left: menuPosition.x,
                        top: menuPosition.y,
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                    role="menu"
                    aria-label="Menú de variables"
                >
                    <div className="py-1">
                        {memoizedAssets.map((asset) => (
                            <button
                                key={asset.key}
                                onClick={() => handleAssetSelect(asset)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                                aria-label={`Insertar variable ${asset.name}`}
                            >
                                {asset.name} ({asset.key})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tooltips */}
            <Tooltip id="editor-help" />
            {memoizedAssets.map(asset => (
                <Tooltip key={asset.key} id={`tooltip-${asset.key}`} />
            ))}

            {/* Descripciones ocultas para lectores de pantalla */}
            <div className="sr-only">
                <p id="template-basic-desc">Inserta una plantilla básica de asistente de IA</p>
                <p id="template-code-desc">Inserta un bloque de código con formato markdown</p>
                <p id="template-list-desc">Inserta una lista con viñetas</p>
                <p id="template-table-desc">Inserta una tabla en formato markdown</p>
                <p id="template-link-desc">Inserta un enlace en formato markdown</p>
                <p id="template-image-desc">Inserta una imagen en formato markdown</p>
                <p id="format-desc">Formatea el texto eliminando espacios extra y saltos de línea innecesarios</p>
                <p id="copy-desc">Copia todo el texto al portapapeles</p>
                <p id="paste-desc">Pega texto formateado desde el portapapeles</p>
                <p id="clear-desc">Borra todo el texto del editor</p>
                <p id="undo-desc">Deshace el último cambio realizado (Ctrl+Z)</p>
                <p id="redo-desc">Rehace el último cambio deshecho (Ctrl+Y)</p>
                <p id="variable-desc">Inserta una variable del proyecto en el texto</p>
                <p id="help-desc">Muestra los atajos de teclado disponibles</p>
            </div>
        </div>
    );
});

PromptEditor.displayName = 'PromptEditor';

export default PromptEditor; 