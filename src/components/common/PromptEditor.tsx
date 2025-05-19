import React, { useState, useRef, useEffect } from 'react';
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
    ArrowUturnRightIcon
} from '@heroicons/react/24/outline';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';

interface PromptEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    assets?: PromptAssetData[];
    readOnly?: boolean;
    showHistory?: boolean;
}

interface HistoryEntry {
    text: string;
    timestamp: number;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
    value,
    onChange,
    placeholder = "Enter text here...",
    rows = 18,
    assets = [],
    readOnly = false,
    showHistory = true
}) => {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [showAssetMenu, setShowAssetMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
    const [isUndoRedo, setIsUndoRedo] = useState(false);

    // Inicializar el historial con el valor inicial
    useEffect(() => {
        if (value && !isUndoRedo) {
            setHistory(prev => [...prev, { text: value, timestamp: Date.now() }]);
            setCurrentHistoryIndex(prev => prev + 1);
        }
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isUndoRedo) {
            onChange(e.target.value);
        }
    };

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
            onChange(newText);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length, start + variable.length);
            }, 0);
        }
        setShowAssetMenu(false);
    };

    const insertTemplate = (template: string) => {
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
    };

    const handleFormatText = () => {
        if (editorRef.current) {
            const textarea = editorRef.current;
            const text = textarea.value;
            const formattedText = text
                .replace(/\n{3,}/g, '\n\n')
                .replace(/\s+/g, ' ')
                .trim();
            onChange(formattedText);
        }
    };

    const handleClearText = () => {
        if (window.confirm('Are you sure you want to clear the text?')) {
            onChange('');
        }
    };

    const handleCopyText = () => {
        if (editorRef.current) {
            navigator.clipboard.writeText(editorRef.current.value);
        }
    };

    const handlePasteFormatted = async () => {
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
            console.error('Error pasting text:', err);
        }
    };

    const insertTable = () => {
        const tableTemplate = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;
        insertTemplate(tableTemplate);
    };

    const insertLink = () => {
        const linkTemplate = `[link text](https://example.com)`;
        insertTemplate(linkTemplate);
    };

    const insertImage = () => {
        const imageTemplate = `![alt text](https://example.com/image.jpg)`;
        insertTemplate(imageTemplate);
    };

    const handleInsertVariable = () => {
        if (editorRef.current) {
            const textarea = editorRef.current;
            const rect = textarea.getBoundingClientRect();
            const cursorPosition = textarea.selectionStart;
            const textBeforeCursor = textarea.value.substring(0, cursorPosition);
            const lines = textBeforeCursor.split('\n');
            const currentLine = lines[lines.length - 1];

            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
            const charWidth = 8;
            const cursorX = rect.left + (currentLine.length * charWidth);
            const cursorY = rect.top + (lines.length * lineHeight);

            setMenuPosition({
                x: Math.min(cursorX, window.innerWidth - 200),
                y: Math.min(cursorY, window.innerHeight - 300)
            });
            setShowAssetMenu(true);
        }
    };

    const handleUndo = () => {
        if (currentHistoryIndex > 0) {
            setIsUndoRedo(true);
            const newIndex = currentHistoryIndex - 1;
            setCurrentHistoryIndex(newIndex);
            onChange(history[newIndex].text);
            setIsUndoRedo(false);
        }
    };

    const handleRedo = () => {
        if (currentHistoryIndex < history.length - 1) {
            setIsUndoRedo(true);
            const newIndex = currentHistoryIndex + 1;
            setCurrentHistoryIndex(newIndex);
            onChange(history[newIndex].text);
            setIsUndoRedo(false);
        }
    };

    return (
        <div className="space-y-2">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg">
                {/* Basic Templates Group */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => insertTemplate('You are a helpful AI assistant.')}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Insert basic template"
                        disabled={readOnly}
                    >
                        <DocumentTextIcon className="w-4 h-4 inline-block mr-1" />
                        Basic Template
                    </button>

                    <button
                        type="button"
                        onClick={() => insertTemplate('```\n\n```')}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Insert code block"
                        disabled={readOnly}
                    >
                        <CodeBracketIcon className="w-4 h-4 inline-block mr-1" />
                        Code Block
                    </button>

                    <button
                        type="button"
                        onClick={() => insertTemplate('- \n- \n- ')}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Insert list"
                        disabled={readOnly}
                    >
                        <ListBulletIcon className="w-4 h-4 inline-block mr-1" />
                        List
                    </button>
                </div>

                {/* Markdown Elements Group */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={insertTable}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Insert markdown table"
                        disabled={readOnly}
                    >
                        <TableCellsIcon className="w-4 h-4 inline-block mr-1" />
                        Table
                    </button>

                    <button
                        type="button"
                        onClick={insertLink}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Insert markdown link"
                        disabled={readOnly}
                    >
                        <LinkIcon className="w-4 h-4 inline-block mr-1" />
                        Link
                    </button>

                    <button
                        type="button"
                        onClick={insertImage}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Insert markdown image"
                        disabled={readOnly}
                    >
                        <PhotoIcon className="w-4 h-4 inline-block mr-1" />
                        Image
                    </button>
                </div>

                {/* Utilities Group */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleFormatText}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Format text"
                        disabled={readOnly}
                    >
                        <ArrowPathIcon className="w-4 h-4 inline-block mr-1" />
                        Format
                    </button>

                    <button
                        type="button"
                        onClick={handleCopyText}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Copy all text"
                    >
                        <ClipboardIcon className="w-4 h-4 inline-block mr-1" />
                        Copy All
                    </button>

                    <button
                        type="button"
                        onClick={handlePasteFormatted}
                        className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Paste formatted text"
                        disabled={readOnly}
                    >
                        <ClipboardDocumentIcon className="w-4 h-4 inline-block mr-1" />
                        Paste
                    </button>

                    <button
                        type="button"
                        onClick={handleClearText}
                        className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                        title="Clear text"
                        disabled={readOnly}
                    >
                        <ClipboardDocumentIcon className="w-4 h-4 inline-block mr-1" />
                        Clear
                    </button>
                </div>

                {/* History Controls */}
                {showHistory && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleUndo}
                            className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                            title="Undo"
                            disabled={readOnly || currentHistoryIndex <= 0}
                        >
                            <ArrowUturnLeftIcon className="w-4 h-4 inline-block mr-1" />
                            Undo
                        </button>

                        <button
                            type="button"
                            onClick={handleRedo}
                            className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                            title="Redo"
                            disabled={readOnly || currentHistoryIndex >= history.length - 1}
                        >
                            <ArrowUturnRightIcon className="w-4 h-4 inline-block mr-1" />
                            Redo
                        </button>
                    </div>
                )}

                <div className="flex-grow"></div>

                {/* Variables Button */}
                <button
                    type="button"
                    onClick={handleInsertVariable}
                    className="px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                    title="Insert variable (right-click in editor)"
                    disabled={readOnly}
                >
                    <VariableIcon className="w-4 h-4 inline-block mr-1" />
                    Insert Variable
                </button>
            </div>

            <textarea
                ref={editorRef}
                value={value}
                onChange={handleTextChange}
                onContextMenu={handleContextMenu}
                rows={rows}
                readOnly={readOnly}
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"
                placeholder={placeholder}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Right-click in the editor to open the asset (variables) menu. Select a variable to insert it into the text.
            </p>

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
        </div>
    );
};

export default PromptEditor; 