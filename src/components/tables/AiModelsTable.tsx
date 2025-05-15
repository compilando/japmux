import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { AiModelResponseDto as AiModel } from '@/services/generated/api';
import { TrashBinIcon, PencilIcon } from "@/icons";
import CopyButton from '../common/CopyButton';

interface AiModelsTableProps {
    aiModels: AiModel[];
    onEdit: (model: AiModel) => void;
    onDelete: (id: string) => void;
}

const AiModelsTable: React.FC<AiModelsTableProps> = ({ aiModels, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Provider</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">API Identifier</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {aiModels.map((model) => (
                                <TableRow key={model.id}>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                        <div className="flex items-center">
                                            <span className="mr-2" title={model.id}>{model.id}...</span>
                                            {model.id && <CopyButton textToCopy={model.id} />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">{model.name}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">{model.provider ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">{model.apiIdentifier ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">{model.description ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => onEdit(model)}
                                                className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Edit AI Model"
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button
                                                onClick={() => onDelete(model.id)}
                                                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Delete AI Model"
                                            >
                                                <TrashBinIcon />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {aiModels.length === 0 && (
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No AI models found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AiModelsTable; 