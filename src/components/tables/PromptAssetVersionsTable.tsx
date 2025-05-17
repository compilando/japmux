import React, { useState } from 'react';
import Link from 'next/link';
import { AssetVersionUIData } from '@/app/(admin)/projects/[projectId]/prompts/[promptId]/assets/[assetKey]/versions/page';
import CopyButton from '../common/CopyButton';
import { format } from 'date-fns';
import { PencilIcon, TrashBinIcon, ChevronDownIcon, ChevronUpIcon } from "@/icons";
import { DocumentDuplicateIcon, LanguageIcon } from '@heroicons/react/24/outline';

interface PromptAssetVersionsTableProps {
    promptAssetVersions: AssetVersionUIData[];
    projectId: string;
    promptId: string;
    assetKey: string;
    onEdit: (item: AssetVersionUIData) => void;
    onDelete: (versionTag: string) => void;
    loading?: boolean;
}

const PromptAssetVersionsTable: React.FC<PromptAssetVersionsTableProps> = ({
    promptAssetVersions,
    projectId,
    promptId,
    assetKey,
    onEdit,
    onDelete,
    loading,
}) => {
    const [expandedAssetValues, setExpandedAssetValues] = useState<Record<string, boolean>>({});

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    const toggleExpandAssetValue = (versionId: string) => {
        setExpandedAssetValues(prev => ({
            ...prev,
            [versionId]: !prev[versionId]
        }));
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'PPpp');
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    return (
        <div className="relative">
            {/* Línea de tiempo vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 to-purple-500"></div>

            <div className="space-y-6 pl-16">
                {Array.isArray(promptAssetVersions) && promptAssetVersions.map((item, index) => {
                    const isExpanded = expandedAssetValues[item.id] || false;
                    return (
                        <div key={item.id} className="relative">
                            {/* Círculo en la línea de tiempo */}
                            <div className="absolute -left-16 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-brand-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                            </div>

                            {/* Contenido de la versión */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="p-4">
                                    {/* Encabezado de la versión */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.versionTag}
                                            </span>
                                            <CopyButton textToCopy={item.versionTag} />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions/${item.versionTag}/translations`}
                                                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                                                title="Manage Translations"
                                            >
                                                <LanguageIcon className="w-4 h-4 mr-1.5" />
                                                <span>Translations</span>
                                            </Link>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                                title="Edit Version"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.versionTag)}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                                title="Delete Version"
                                            >
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mensaje de cambio */}
                                    {item.changeMessage && (
                                        <div className="mb-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                {item.changeMessage}
                                            </span>
                                        </div>
                                    )}

                                    {/* Valor del asset - Modificado para usar <p> y clases consistentes */}
                                    <div className="relative mt-2">
                                        <button
                                            onClick={() => toggleExpandAssetValue(item.id)}
                                            className="w-full text-left group/asset-value"
                                            aria-expanded={isExpanded}
                                            aria-controls={`asset-value-${item.id}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                {/* Cambiado <pre> a <p> y ajustadas las clases */}
                                                <p
                                                    id={`asset-value-${item.id}`}
                                                    className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line ${!isExpanded ? 'line-clamp-3' : ''} group-hover/asset-value:text-gray-900 dark:group-hover/asset-value:text-gray-100 transition-all duration-300 pr-2 break-words`}
                                                >
                                                    {item.value}
                                                </p>
                                                <span className="ml-2 text-gray-400 group-hover/asset-value:text-brand-500 dark:group-hover/asset-value:text-brand-400 transition-colors duration-200 flex-shrink-0 pt-0.5">
                                                    {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {(!Array.isArray(promptAssetVersions) || promptAssetVersions.length === 0) && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <DocumentDuplicateIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No versions found for this asset</p>
                </div>
            )}
        </div>
    );
};

export default PromptAssetVersionsTable; 