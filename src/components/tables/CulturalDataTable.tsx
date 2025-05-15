import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { CulturalDataResponse } from '@/services/generated/api'; // Importación directa de CulturalDataResponse
import { TrashBinIcon, PencilIcon } from "@/icons";
import CopyButton from '../common/CopyButton'; // Importar CopyButton

interface CulturalDataTableProps {
    culturalDataList: CulturalDataResponse[]; // Usar el tipo importado directamente
    onEdit: (culturalData: CulturalDataResponse) => void; // Usar el tipo importado directamente
    onDelete: (key: string) => void;
}

const CulturalDataTable: React.FC<CulturalDataTableProps> = ({ culturalDataList, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Key (Slug)</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Region ID</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Formality</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Style</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Considerations</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Notes</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {culturalDataList.map((item) => (
                                <TableRow key={item.key}>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                        <div className="flex items-center">
                                            <span className="mr-2" title={item.key}>{item.key}</span>
                                            {item.key && <CopyButton textToCopy={item.key} />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                        {item.regionId}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">
                                        {item.formalityLevel ?? 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">
                                        {item.style ?? 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">
                                        {item.considerations ?? 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">
                                        {item.notes ?? 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Edit Cultural Data"
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(item.key)}
                                                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Delete Cultural Data"
                                            >
                                                <TrashBinIcon />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {culturalDataList.length === 0 && (
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No cultural data found.
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

export default CulturalDataTable; 