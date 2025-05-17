import React, { useState } from 'react';
import { PromptVersionData, PromptVersionMarketplaceDetails } from '@/app/(admin)/projects/[projectId]/prompts/[promptId]/versions/page';
import CopyButton from '../common/CopyButton';
import Link from 'next/link';
import { TrashBinIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon, GitBranchIcon } from "@/icons";
import { DocumentDuplicateIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface PromptVersionsTableProps {
    promptVersions: PromptVersionMarketplaceDetails[];
    projectId: string;
    promptIdForTable: string;
    onEdit: (item: PromptVersionData) => void;
    onDelete: (item: PromptVersionData) => void;
    onRequestPublish: (versionTag: string) => void;
    onUnpublish: (versionTag: string) => void;
    marketplaceActionLoading: Record<string, boolean>;
    selectedVersionsForDiff: string[];
    onSelectVersionForDiff: (versionTag: string) => void;
}

const PromptVersionsTable: React.FC<PromptVersionsTableProps> = ({
    promptVersions,
    projectId,
    promptIdForTable,
    onEdit,
    onDelete,
    onRequestPublish,
    onUnpublish,
    marketplaceActionLoading,
    selectedVersionsForDiff,
    onSelectVersionForDiff
}) => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const toggleExpand = (itemId: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    return (
        <div className="relative">
            {/* Línea vertical central con gradiente */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-brand-400 to-brand-300 dark:from-brand-600 dark:via-brand-500 dark:to-brand-400"></div>

            <div className="space-y-6">
                {promptVersions.map((item, index) => {
                    const status = item.marketplaceStatus;
                    const isLoadingAction = marketplaceActionLoading[item.versionTag] || false;
                    const canRequestPublish = !status || status === 'NOT_PUBLISHED' || status === 'REJECTED';
                    const canUnpublish = status === 'PENDING_APPROVAL' || status === 'PUBLISHED';
                    const currentPromptId = item.promptId || promptIdForTable;
                    const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();
                    const isExpanded = expandedItems[item.id] || false;
                    const isHovered = hoveredItem === item.id;

                    return (
                        <div
                            key={item.id}
                            className="relative flex items-start group"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {/* Checkbox para seleccionar para Diff */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                                    checked={selectedVersionsForDiff.includes(item.versionTag)}
                                    onChange={() => onSelectVersionForDiff(item.versionTag)}
                                    disabled={selectedVersionsForDiff.length >= 2 && !selectedVersionsForDiff.includes(item.versionTag)}
                                    title={selectedVersionsForDiff.length >= 2 && !selectedVersionsForDiff.includes(item.versionTag) ? "Deselecciona una versión para elegir otra" : "Seleccionar para comparar"}
                                    aria-label={`Seleccionar versión ${item.versionTag} para comparar`}
                                />
                            </div>

                            {/* Círculo en la línea temporal con efecto hover */}
                            <div className={`absolute left-6 w-4 h-4 rounded-full bg-brand-500 dark:bg-brand-400 border-2 border-white dark:border-gray-800 -translate-x-1/2 transition-all duration-300 ${isHovered ? 'scale-125 ring-4 ring-brand-100 dark:ring-brand-900' : ''}`}></div>

                            {/* Contenido principal con efecto hover */}
                            <div className={`ml-12 flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ${isHovered ? 'shadow-md border-brand-200 dark:border-brand-700' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="flex items-center space-x-1">
                                                <GitBranchIcon className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.versionTag}</span>
                                            </div>
                                            <CopyButton textToCopy={item.versionTag} />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDistanceToNow(createdAt, { addSuffix: true })}
                                            </span>

                                            {/* Mostrar bandera y languageCode si existe */}
                                            {item.languageCode && (() => {
                                                const langParts = item.languageCode.split('-');
                                                const countryOrLangCode = langParts.length > 1 ? langParts[1].toLowerCase() : langParts[0].toLowerCase();
                                                const flagUrl = countryOrLangCode.length === 2 ? `https://flagcdn.com/16x12/${countryOrLangCode}.png` : `https://flagcdn.com/16x12/xx.png`;
                                                // Para languageCode que son solo idioma (ej. 'en'), usamos 'xx' o podríamos mapear a un país común (ej. 'en' -> 'us')
                                                // Por ahora, si no es un código de país de 2 letras, usa 'xx'

                                                return (
                                                    <div className="flex items-center space-x-1 ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700" title={`Language: ${item.languageCode}`}>
                                                        <img
                                                            src={flagUrl}
                                                            alt={`${item.languageCode} flag`}
                                                            className="w-4 h-3 object-cover rounded-sm border border-gray-300 dark:border-gray-500"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://flagcdn.com/16x12/xx.png'; // Fallback
                                                                target.onerror = null;
                                                            }}
                                                        />
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">{item.languageCode.toUpperCase()}</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Mensaje de cambio con efecto hover */}
                                        {item.changeMessage && (
                                            <div className="mb-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 transition-colors duration-200 group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                                                    {item.changeMessage}
                                                </span>
                                            </div>
                                        )}

                                        {/* Estado del marketplace con efecto hover */}
                                        <div className="mb-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 group-hover:bg-green-200 dark:group-hover:bg-green-600' :
                                                status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-500' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                                                }`}>
                                                {status || 'NOT_PUBLISHED'}
                                            </span>
                                        </div>

                                        {/* Vista previa del contenido - Restaurada a expandible/colapsable */}
                                        <div className="relative mt-2">
                                            <button
                                                onClick={() => toggleExpand(item.id)}
                                                className="w-full text-left group/prompt"
                                                aria-expanded={isExpanded}
                                                aria-controls={`prompt-text-${item.id}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p
                                                        id={`prompt-text-${item.id}`}
                                                        className={`text-sm text-gray-700 dark:text-gray-300 ${!isExpanded ? 'line-clamp-3' : ''} whitespace-pre-line transition-all duration-300 group-hover/prompt:text-gray-900 dark:group-hover/prompt:text-gray-100`}
                                                    >
                                                        {item.promptText}
                                                    </p>
                                                    <span className="ml-2 text-gray-400 group-hover/prompt:text-brand-500 dark:group-hover/prompt:text-brand-400 transition-colors duration-200 flex-shrink-0">
                                                        {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Acciones con efectos hover mejorados */}
                                    <div className="flex items-center space-x-2 ml-4">
                                        <Link
                                            href={`/projects/${projectId}/prompts/${currentPromptId}/versions/${item.versionTag}/translations?versionId=${item.id}`}
                                            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                                            title="Manage Translations"
                                        >
                                            <LanguageIcon className="w-4 h-4 mr-1.5" />
                                            <span>Translations</span>
                                        </Link>
                                        {canRequestPublish && (
                                            <button
                                                onClick={() => onRequestPublish(item.versionTag)}
                                                disabled={isLoadingAction}
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 transition-colors duration-200"
                                                title="Request Publish to Marketplace">
                                                {isLoadingAction ? '...' : 'Publish'}
                                            </button>
                                        )}
                                        {canUnpublish && (
                                            <button
                                                onClick={() => onUnpublish(item.versionTag)}
                                                disabled={isLoadingAction}
                                                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 disabled:opacity-50 transition-colors duration-200"
                                                title="Unpublish from Marketplace">
                                                {isLoadingAction ? '...' : 'Unpublish'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-600 p-1 transition-colors duration-200"
                                            aria-label="Edit Version"
                                        >
                                            <PencilIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 p-1 transition-colors duration-200"
                                            aria-label="Delete Version"
                                        >
                                            <TrashBinIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {promptVersions.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No prompt versions found for this prompt.</p>
            )}
        </div>
    );
};

export default PromptVersionsTable; 