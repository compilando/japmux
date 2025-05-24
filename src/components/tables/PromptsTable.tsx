import React, { useState, useEffect } from 'react';
import { PromptDto } from '@/services/generated/api';
import Link from 'next/link';
import { usePrompts } from '@/context/PromptContext';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon, BoxCubeIcon } from "@/icons";
import { BoltIcon, ClockIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
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
}

const PromptsTable: React.FC<PromptsTableProps> = ({ prompts, onEdit, onDelete, projectId, loading }) => {
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

        if (projectId && prompts.length > 0) {
            fetchCountsAndLanguages();
        } else {
            setVersionsCount({});
            setAssetsCount({});
            setPromptsWithLanguage(prompts);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promptsWithLanguage.map((item: PromptWithLanguage) => (
                <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={item.name}>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getPromptType(item).color}`}>
                                        {getPromptType(item).label}
                                    </span>
                                    {item.id} <CopyButton textToCopy={item.id} />
                                </h3>
                                <div className="flex items-center mt-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono" title={item.name}>
                                        {item.name}
                                    </span>
                                    {renderLanguageFlag(item.languageCode)}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={`/serveprompt?promptId=${item.id}`}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                                    title="Test/Serve Prompt"
                                >
                                    <BoltIcon className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                    aria-label="Edit Prompt"
                                >
                                    <PencilIcon />
                                </button>
                                <button
                                    onClick={() => {
                                        console.log("[PromptsTable] Delete button clicked for prompt:", {
                                            id: item.id,
                                            name: item.name,
                                            projectId: item.projectId
                                        });
                                        onDelete(item.id, item.name);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                                    aria-label="Delete Prompt"
                                >
                                    <TrashBinIcon />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2" title={item.description}>
                            {item.description || 'No description provided'}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {(item as any).tags && Array.isArray((item as any).tags) && (item as any).tags.length > 0 ? (
                                ((item as any).tags as any[]).map((tag: any, index: number) => (
                                    <span
                                        key={index}
                                        className="px-2.5 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-200 transition-colors duration-200"
                                    >
                                        {tag.name || 'N/A'}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-500 dark:text-gray-400">No tags</span>
                            )}
                        </div>

                        {projectId && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={`/projects/${projectId}/prompts/${item.id}/versions`}
                                    onClick={() => selectPrompt(item.id)}
                                    className="flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                                    title="Manage Versions"
                                >
                                    <ClockIcon className="w-4 h-4 mr-1.5" />
                                    <span>Versions</span>
                                    {versionsCount[item.id] !== undefined && (
                                        <span className="ml-1.5 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                                            {versionsCount[item.id]}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href={`/projects/${projectId}/prompts/${item.id}/assets`}
                                    className="flex items-center text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                                    title="Manage Assets"
                                >
                                    <BoxCubeIcon className="mr-1.5" />
                                    <span>Assets</span>
                                    {assetsCount[item.id] !== undefined && (
                                        <span className="ml-1.5 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900 dark:text-purple-200">
                                            {assetsCount[item.id]}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {prompts.length === 0 && !loading && (
                <div className="col-span-full">
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <DocumentDuplicateIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No prompts found</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptsTable; 