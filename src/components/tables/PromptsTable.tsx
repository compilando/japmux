import React, { useState, useEffect } from 'react';
import { PromptDto } from '@/services/generated/api';
import Link from 'next/link';
import { usePrompts } from '@/context/PromptContext';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon, BoxCubeIcon } from "@/icons";
import { BoltIcon, ClockIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { promptVersionService, promptAssetService } from '@/services/api';

interface PromptsTableProps {
    prompts: PromptDto[];
    onEdit: (item: PromptDto) => void;
    onDelete: (id: string) => void;
    projectId?: string;
    loading?: boolean;
}

const PromptsTable: React.FC<PromptsTableProps> = ({ prompts, onEdit, onDelete, projectId, loading }) => {
    const { selectPrompt } = usePrompts();
    const [versionsCount, setVersionsCount] = useState<Record<string, number>>({});
    const [assetsCount, setAssetsCount] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchCounts = async () => {
            if (!projectId || prompts.length === 0) {
                setVersionsCount({});
                setAssetsCount({});
                return;
            }

            const newVersionCounts: Record<string, number> = {};
            const newAssetCounts: Record<string, number> = {};

            for (const prompt of prompts) {
                try {
                    const versions = await promptVersionService.findAll(projectId, prompt.id);
                    newVersionCounts[prompt.id] = versions.length;
                } catch (error) {
                    console.error(`Error fetching versions for prompt ${prompt.id}:`, error);
                    newVersionCounts[prompt.id] = 0;
                }

                try {
                    const assets = await promptAssetService.findAll(projectId, prompt.id);
                    newAssetCounts[prompt.id] = assets.length;
                } catch (error) {
                    console.error(`Error fetching assets for prompt ${prompt.id}:`, error);
                    newAssetCounts[prompt.id] = 0;
                }
            }
            setVersionsCount(newVersionCounts);
            setAssetsCount(newAssetCounts);
        };

        if (projectId && prompts.length > 0) {
            fetchCounts();
        } else {
            setVersionsCount({});
            setAssetsCount({});
        }
    }, [prompts, projectId]);

    // Función para determinar el tipo de prompt basándose en palabras clave
    const determinePromptType = (prompt: PromptDto): string => {
        const name = prompt.name?.toLowerCase() || '';
        const description = prompt.description?.toLowerCase() || '';
        const combined = `${name} ${description}`;

        if (combined.includes('expert') || combined.includes('specialist') || combined.includes('consultant')) {
            return 'EXPERT';
        }
        if (combined.includes('assistant') || combined.includes('helper') || combined.includes('support')) {
            return 'ASSISTANT';
        }
        if (combined.includes('task') || combined.includes('workflow') || combined.includes('process')) {
            return 'TASK';
        }
        if (combined.includes('creative') || combined.includes('writing') || combined.includes('content') || combined.includes('story')) {
            return 'CREATIVE';
        }
        if (combined.includes('analysis') || combined.includes('report') || combined.includes('analyze') || combined.includes('data')) {
            return 'ANALYSIS';
        }
        if (combined.includes('technical') || combined.includes('code') || combined.includes('programming') || combined.includes('developer')) {
            return 'TECHNICAL';
        }
        if (combined.includes('template') || combined.includes('basic') || combined.includes('simple')) {
            return 'TEMPLATE';
        }
        
        return 'GENERAL';
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
            {prompts.map((item: PromptDto) => (
                <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={item.name}>
                                    <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400 mr-2">
                                        [{determinePromptType(item)}]
                                    </span>
                                    {item.id} <CopyButton textToCopy={item.id} />
                                </h3>
                                <div className="flex items-center mt-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono" title={item.name}>
                                        {item.name}
                                    </span>
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
                                    onClick={() => onDelete(item.id)}
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