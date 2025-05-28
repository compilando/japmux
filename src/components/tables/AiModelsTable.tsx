import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { AiModelResponseDto as AiModel } from '@/services/generated/api';
import { TrashIcon, PencilIcon, InfoIcon } from "@/icons";
import CopyButton from '../common/CopyButton';

interface AiModelsTableProps {
    aiModels: AiModel[];
    onEdit: (model: AiModel) => void;
    onDelete: (id: string) => void;
}

const ProviderBadge: React.FC<{ provider: string }> = ({ provider }) => {
    let bgColor = 'bg-gray-100 dark:bg-gray-700';
    let textColor = 'text-gray-600 dark:text-gray-300';

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
            {provider}
        </span>
    );
};

const AiModelsTable: React.FC<AiModelsTableProps> = ({ aiModels, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-lg">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                    <Table>
                        <TableHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">ID</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Provider</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">API Identifier</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Description</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center text-xs uppercase tracking-wider">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {aiModels.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-5 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                                            <h3 className="text-lg font-semibold mb-1">No AI Models Found</h3>
                                            <p className="text-sm">There are currently no AI models configured for this project.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {aiModels.map((model) => (
                                <TableRow key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-200 text-sm">
                                        <div className="flex items-center" title={model.id}>
                                            <span className="truncate max-w-[100px] mr-2">{model.id}</span>
                                            {model.id && <CopyButton textToCopy={model.id} />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-900 dark:text-white font-medium text-sm">{model.name}</TableCell>
                                    <TableCell className="px-5 py-4 text-left text-sm">
                                        {model.provider ? <ProviderBadge provider={model.provider} /> : <span className="text-gray-400 dark:text-gray-500">N/A</span>}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm font-mono">{model.apiIdentifier ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs" title={model.description ?? undefined}>{model.description ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(model)}
                                                className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                                aria-label="Edit AI Model"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(model.id)}
                                                className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                                aria-label="Delete AI Model"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AiModelsTable; 