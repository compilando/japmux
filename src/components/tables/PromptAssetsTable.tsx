import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreatePromptAssetDto, promptAssetService } from '@/services/api';
import CopyButton from '../common/CopyButton';
import { ClockIcon, DocumentDuplicateIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

// Nueva interfaz local para incluir campos que podrían no estar en CreatePromptAssetDto
// pero que la API podría devolver y la tabla necesita (ej: enabled)
export interface PromptAssetData extends CreatePromptAssetDto {
    enabled?: boolean; // Asumir que 'enabled' viene de la API aunque no esté en el DTO
    projectId?: string; // Anteriormente projectId
    promptId?: string;
    promptName?: string;
    languageCode?: string; // Añadir languageCode
    // key: string; // key ya está en CreatePromptAssetDto
}

interface PromptAssetsTableProps {
    promptAssets: PromptAssetData[];
    projectId: string;        // Cambiado de projectId a projectId
    promptId: string;
    onEdit: (item: PromptAssetData) => void;
    onDelete: (assetKey: string) => void;
    loading?: boolean;
}

const PromptAssetsTable: React.FC<PromptAssetsTableProps> = ({ promptAssets, projectId, promptId, onEdit, onDelete, loading }) => {
    const [versionsCount, setVersionsCount] = useState<Record<string, number>>({});
    const [assetsWithLanguage, setAssetsWithLanguage] = useState<PromptAssetData[]>([]);

    useEffect(() => {
        const fetchVersionsCountAndLanguages = async () => {
            if (!projectId || !promptId || promptAssets.length === 0) {
                setVersionsCount({});
                setAssetsWithLanguage(promptAssets);
                return;
            }

            const counts: Record<string, number> = {};
            const assetsWithLang: PromptAssetData[] = [];

            for (const asset of promptAssets) {
                try {
                    const versions = await promptAssetService.findVersions(projectId, promptId, asset.key);
                    counts[asset.key] = versions.length;

                    // Obtener el languageCode de la primera versión (la más antigua, que sería la versión base)
                    let languageCode: string | undefined;
                    if (versions.length > 0) {
                        // Ordenar por createdAt o versionTag para obtener la primera versión
                        const sortedVersions = [...versions].sort((a, b) => {
                            // Si tienen createdAt, usarlo para ordenar
                            if ((a as any).createdAt && (b as any).createdAt) {
                                return new Date((a as any).createdAt).getTime() - new Date((b as any).createdAt).getTime();
                            }
                            // Si no, usar versionTag (asumiendo que 1.0.0 viene antes que 1.0.1, etc.)
                            const tagA = a.versionTag || '';
                            const tagB = b.versionTag || '';
                            return tagA.localeCompare(tagB);
                        });
                        languageCode = (sortedVersions[0] as any)?.languageCode;
                    }

                    assetsWithLang.push({
                        ...asset,
                        languageCode
                    });
                } catch (error) {
                    console.error(`Error fetching versions for asset ${asset.key}:`, error);
                    counts[asset.key] = 0;
                    assetsWithLang.push(asset);
                }
            }
            setVersionsCount(counts);
            setAssetsWithLanguage(assetsWithLang);
        };

        fetchVersionsCountAndLanguages();
    }, [promptAssets, projectId, promptId]);

    // Función para generar bandera de idioma
    const renderLanguageFlag = (languageCode: string | undefined) => {
        if (!languageCode) {
            return null;
        }

        const langParts = languageCode.split('-');
        const countryOrLangCode = langParts.length > 1 ? langParts[1].toLowerCase() : langParts[0].toLowerCase();
        const flagUrl = countryOrLangCode.length === 2 ? `https://flagcdn.com/16x12/${countryOrLangCode}.png` : `https://flagcdn.com/16x12/xx.png`;

        return (
            <div className="flex items-center space-x-1 ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700" title={`Base Language: ${languageCode}`}>
                <img
                    src={flagUrl}
                    alt={`${languageCode} flag`}
                    className="w-4 h-3 object-cover rounded-sm border border-gray-300 dark:border-gray-500"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://flagcdn.com/16x12/xx.png'; // Fallback
                        target.onerror = null;
                    }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300">{languageCode.toUpperCase()}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 dark:from-gray-800/40 dark:via-gray-700/20 dark:to-gray-800/40 backdrop-blur-sm rounded-3xl"></div>
                    <div className="relative p-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading assets...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-white/20 dark:border-gray-700/40 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm shadow-lg">
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(assetsWithLanguage) && assetsWithLanguage.map((item) => (
                    <div
                        key={item.key}
                        className="group relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-gray-800/50 flex flex-col overflow-hidden"
                    >
                        {/* Header with improved glassmorphism */}
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/20 dark:border-gray-600/40">
                            <div className="flex flex-col flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent" title={item.key}>
                                    {item.key ?? 'N/A'}
                                </h3>
                                {item.languageCode && (
                                    <div className="flex items-center mt-2">
                                        {renderLanguageFlag(item.languageCode)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                {item.key && <CopyButton textToCopy={item.key} />}
                            </div>
                        </div>

                        {/* Content with enhanced styling */}
                        <div className="space-y-4 mb-6 flex-grow">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Category</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 px-3 py-1 bg-white/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-600/30">
                                    {item.category || 'Uncategorized'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Status</span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold backdrop-blur-sm border transition-all duration-300 ${item.enabled
                                    ? 'bg-green-100/60 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200/50 dark:border-green-700/50 shadow-green-200/20 dark:shadow-green-900/20'
                                    : 'bg-red-100/60 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200/50 dark:border-red-700/50 shadow-red-200/20 dark:shadow-red-900/20'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${item.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    {item.enabled ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Actions with glassmorphism */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-gray-600/40 mt-auto">
                            <Link
                                href={`/projects/${projectId}/prompts/${promptId}/assets/${item.key}/versions`}
                                className="group/btn flex items-center text-sm font-semibold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-all duration-300 px-4 py-2 bg-green-50/60 dark:bg-green-900/30 rounded-xl hover:bg-green-100/80 dark:hover:bg-green-900/50 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-200/20 dark:hover:shadow-green-900/20 hover:scale-105"
                                title="Manage Versions"
                            >
                                <ClockIcon className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                                <span>Versions</span>
                                {versionsCount[item.key] !== undefined && (
                                    <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-200/70 dark:bg-green-800/60 text-green-900 dark:text-green-200 rounded-full backdrop-blur-sm border border-green-300/50 dark:border-green-600/50">
                                        {versionsCount[item.key]}
                                    </span>
                                )}
                            </Link>

                            <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="group/edit p-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 bg-blue-50/60 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100/80 dark:hover:bg-blue-900/50 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg hover:shadow-blue-200/20 dark:hover:shadow-blue-900/20 hover:scale-110"
                                    title="Edit Asset"
                                >
                                    <PencilIcon className="w-4 h-4 group-hover/edit:rotate-12 transition-transform duration-300" />
                                </button>
                                <button
                                    onClick={() => onDelete(item.key)}
                                    className="group/delete p-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 bg-red-50/60 dark:bg-red-900/30 rounded-xl hover:bg-red-100/80 dark:hover:bg-red-900/50 backdrop-blur-sm border border-red-200/50 dark:border-red-700/50 hover:shadow-lg hover:shadow-red-200/20 dark:hover:shadow-red-900/20 hover:scale-110"
                                    title="Delete Asset"
                                >
                                    <TrashIcon className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Decorative floating elements */}
                        <div className="absolute top-3 right-3 w-4 h-4 bg-gradient-to-br from-brand-200/30 to-purple-200/30 dark:from-brand-800/20 dark:to-purple-800/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                        <div className="absolute bottom-3 left-3 w-6 h-6 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 animate-pulse"></div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-100/10 dark:from-gray-700/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                ))}
            </div>
            {(!Array.isArray(assetsWithLanguage) || assetsWithLanguage.length === 0) && (
                <div className="text-center py-16 px-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 dark:from-gray-800/40 dark:via-gray-700/20 dark:to-gray-800/40 backdrop-blur-sm rounded-3xl"></div>
                        <div className="relative p-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                            <div className="mb-6">
                                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl inline-block">
                                    <DocumentDuplicateIcon className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>
                            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No assets found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Assets will appear here once created</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptAssetsTable; 