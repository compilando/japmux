import React, { useState, useEffect } from 'react';
import { PromptDto } from '@/services/generated/api';
import Link from 'next/link';
import { usePrompts } from '@/context/PromptContext';
import CopyButton from '../common/CopyButton';
import { BoltIcon, ClockIcon, DocumentDuplicateIcon, TrashIcon, PencilIcon, CubeIcon } from '@heroicons/react/24/outline';
import { promptVersionService, promptAssetService } from '@/services/api';
import { getPromptTypeLabel, getPromptTypeColor } from '@/config/promptTypes';

// Extender PromptDto para incluir languageCode
interface PromptWithLanguage extends PromptDto {
    languageCode?: string;
}

interface PromptsTableProps {
    prompts: PromptDto[];
    onEdit: (item: PromptDto) => void;
    onDelete: (id: string, name?: string) => void;
    projectId?: string;
    loading?: boolean;
    deletingPrompts?: Set<string>;
}

const PromptsTable: React.FC<PromptsTableProps> = ({ prompts, onEdit, onDelete, projectId, loading, deletingPrompts = new Set() }) => {
    const { selectPrompt } = usePrompts();
    const [versionsCount, setVersionsCount] = useState<Record<string, number>>({});
    const [assetsCount, setAssetsCount] = useState<Record<string, number>>({});
    const [promptsWithLanguage, setPromptsWithLanguage] = useState<PromptWithLanguage[]>([]);

    useEffect(() => {
        const fetchCountsAndLanguages = async () => {
            if (!projectId || prompts.length === 0) {
                setVersionsCount({});
                setAssetsCount({});
                setPromptsWithLanguage(prompts);
                return;
            }

            const newVersionCounts: Record<string, number> = {};
            const newAssetCounts: Record<string, number> = {};
            const promptsWithLang: PromptWithLanguage[] = [];

            // Helper para manejar rate limiting
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (const prompt of prompts) {
                try {
                    const versions = await promptVersionService.findAll(projectId, prompt.id);
                    newVersionCounts[prompt.id] = versions.length;

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

                    promptsWithLang.push({
                        ...prompt,
                        languageCode
                    });
                } catch (error: any) {
                    console.error(`Error fetching versions for prompt ${prompt.id}:`, error);
                    newVersionCounts[prompt.id] = 0;
                    promptsWithLang.push(prompt);

                    // Si es rate limiting, añadir delay
                    if (error.response?.status === 429) {
                        await delay(1000); // Esperar 1 segundo antes de continuar
                    }
                }

                try {
                    const assets = await promptAssetService.findAll(projectId, prompt.id);
                    newAssetCounts[prompt.id] = assets.length;
                } catch (error: any) {
                    console.error(`Error fetching assets for prompt ${prompt.id}:`, error);
                    newAssetCounts[prompt.id] = 0;

                    // Si es rate limiting, añadir delay
                    if (error.response?.status === 429) {
                        await delay(1000); // Esperar 1 segundo antes de continuar
                    }
                }

                // Pequeño delay entre prompts para evitar saturar el servidor
                await delay(100);
            }
            setVersionsCount(newVersionCounts);
            setAssetsCount(newAssetCounts);
            setPromptsWithLanguage(promptsWithLang);
        };

        // Actualizar inmediatamente el estado local con los prompts recibidos
        setPromptsWithLanguage(prompts);

        if (projectId && prompts.length > 0) {
            fetchCountsAndLanguages();
        } else {
            setVersionsCount({});
            setAssetsCount({});
        }
    }, [prompts, projectId]);

    // Función refactorizada para obtener el tipo del prompt
    const getPromptType = (prompt: PromptDto): { label: string; color: string } => {
        // Primero, intentar obtener el tipo del campo type si existe
        const typeValue = (prompt as any).type?.value || (prompt as any).type;

        if (typeValue && typeof typeValue === 'string') {
            return {
                label: getPromptTypeLabel(typeValue),
                color: getPromptTypeColor(typeValue)
            };
        }

        // Fallback: usar el sistema anterior de determinación automática
        const name = prompt.name?.toLowerCase() || '';
        const description = prompt.description?.toLowerCase() || '';
        const combined = `${name} ${description}`;

        if (combined.includes('expert') || combined.includes('specialist') || combined.includes('consultant')) {
            return { label: 'EXPERT', color: getPromptTypeColor('EXPERT') };
        }
        if (combined.includes('assistant') || combined.includes('helper') || combined.includes('support')) {
            return { label: 'ASSISTANT', color: getPromptTypeColor('ASSISTANT') };
        }
        if (combined.includes('task') || combined.includes('workflow') || combined.includes('process')) {
            return { label: 'TASK', color: getPromptTypeColor('TASK') };
        }
        if (combined.includes('creative') || combined.includes('writing') || combined.includes('content') || combined.includes('story')) {
            return { label: 'CREATIVE', color: getPromptTypeColor('CREATIVE') };
        }
        if (combined.includes('analysis') || combined.includes('report') || combined.includes('analyze') || combined.includes('data')) {
            return { label: 'ANALYSIS', color: getPromptTypeColor('ANALYSIS') };
        }
        if (combined.includes('technical') || combined.includes('code') || combined.includes('programming') || combined.includes('developer')) {
            return { label: 'TECHNICAL', color: getPromptTypeColor('TECHNICAL') };
        }
        if (combined.includes('template') || combined.includes('basic') || combined.includes('simple')) {
            return { label: 'TEMPLATE', color: getPromptTypeColor('TEMPLATE') };
        }

        return { label: 'GENERAL', color: getPromptTypeColor('GENERAL') };
    };

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

    if (loading && prompts.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promptsWithLanguage.map((item: PromptWithLanguage) => (
                <div key={item.id} className="group relative">
                    {/* Background blur and gradient effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50/20 via-transparent to-purple-50/20 dark:from-brand-950/10 dark:via-transparent dark:to-purple-950/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Glassmorphism card */}
                    <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-[1.02]">

                        {/* Header with gradient and prompt type badge */}
                        <div className="relative p-6 pb-0 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0 pr-16">
                                    {/* Prompt type badge */}
                                    <div className="mb-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold shadow-sm ${getPromptType(item).color}`}>
                                            {getPromptType(item).label}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300 line-clamp-2" title={item.name}>
                                        {item.name}
                                    </h3>

                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg backdrop-blur-sm" title={item.name}>
                                            {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                                        </span>
                                        <CopyButton textToCopy={item.name} />
                                    </div>

                                    {/* Language indicator on separate line */}
                                    <div className="flex items-center">
                                        {renderLanguageFlag(item.languageCode)}
                                    </div>
                                </div>

                                {/* Action buttons with glassmorphism */}
                                <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-all duration-300">
                                    <Link
                                        href={`/serveprompt?promptId=${item.id}`}
                                        className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                        title="Test/Serve Prompt"
                                    >
                                        <BoltIcon className="w-4 h-4" />
                                        <div className="absolute inset-0 bg-indigo-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-110"
                                        aria-label="Edit Prompt"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!deletingPrompts.has(item.id)) {
                                                onDelete(item.id, item.name);
                                            }
                                        }}
                                        disabled={deletingPrompts.has(item.id)}
                                        className={`relative p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/40 hover:shadow-lg transition-all duration-300 hover:scale-110 ${deletingPrompts.has(item.id)
                                            ? "text-gray-400 cursor-not-allowed opacity-50"
                                            : "text-red-500 hover:text-red-700 dark:hover:text-red-300"
                                            }`}
                                        aria-label={deletingPrompts.has(item.id) ? "Eliminando..." : "Eliminar Prompt"}
                                        title={deletingPrompts.has(item.id) ? "Eliminando prompt..." : "Eliminar prompt"}
                                    >
                                        {deletingPrompts.has(item.id) ? (
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <TrashIcon className="w-4 h-4" />
                                        )}
                                        {!deletingPrompts.has(item.id) && (
                                            <div className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content section */}
                        <div className="relative p-6 pt-0 space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3" title={item.description}>
                                {item.description || 'No description provided'}
                            </p>

                            {/* Tags section */}
                            <div className="flex flex-wrap gap-2">
                                {(item as any).tags && Array.isArray((item as any).tags) && (item as any).tags.length > 0 ? (
                                    ((item as any).tags as any[]).slice(0, 3).map((tag: any, index: number) => (
                                        <span
                                            key={index}
                                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-100/80 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-lg backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50 transition-colors duration-200"
                                        >
                                            {tag.name || 'N/A'}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">No tags</span>
                                )}
                                {(item as any).tags && (item as any).tags.length > 3 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        +{(item as any).tags.length - 3} more
                                    </span>
                                )}
                            </div>

                            {/* Stats and actions section */}
                            {projectId && (
                                <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-gray-700/30">
                                    <Link
                                        href={`/projects/${projectId}/prompts/${item.id}/versions`}
                                        onClick={() => selectPrompt(item.id)}
                                        className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 group/link"
                                        title="Manage Versions"
                                    >
                                        <ClockIcon className="w-4 h-4 group-hover/link:scale-110 transition-transform duration-200" />
                                        <span className="font-medium">Versions</span>
                                        {versionsCount[item.id] !== undefined && (
                                            <span className="px-2 py-0.5 text-xs font-semibold bg-green-100/80 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm">
                                                {versionsCount[item.id]}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        href={`/projects/${projectId}/prompts/${item.id}/assets`}
                                        className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200 group/link"
                                        title="Manage Assets"
                                    >
                                        <CubeIcon className="w-4 h-4 group-hover/link:scale-110 transition-transform duration-200" />
                                        <span className="font-medium">Assets</span>
                                        {assetsCount[item.id] !== undefined && (
                                            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100/80 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                                                {assetsCount[item.id]}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200"></div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"></div>
                </div>
            ))}
            {prompts.length === 0 && !loading && (
                <div className="col-span-full">
                    <div className="text-center py-16">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>
                            <div className="relative p-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                                <DocumentDuplicateIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Prompts Found</h3>
                                <p className="text-gray-500 dark:text-gray-400">No prompts have been created for this project yet.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptsTable; 