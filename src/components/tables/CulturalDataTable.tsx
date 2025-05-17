import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { CulturalDataResponse } from '@/services/generated/api';
import { TrashBinIcon, PencilIcon, InfoIcon } from "@/icons";
import CopyButton from '../common/CopyButton';

interface CulturalDataTableProps {
    culturalDataList: CulturalDataResponse[];
    onEdit: (culturalData: CulturalDataResponse) => void;
    onDelete: (key: string) => void;
}

const CulturalDataTable: React.FC<CulturalDataTableProps> = ({ culturalDataList, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-lg">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1000px]"> {/* Ajustar min-width según sea necesario */}
                    <Table>
                        <TableHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Key</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Region</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Formality</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Style</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Considerations</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Notes</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center text-xs uppercase tracking-wider">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {culturalDataList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-5 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                                            <h3 className="text-lg font-semibold mb-1">No Cultural Data Found</h3>
                                            <p className="text-sm">There is currently no cultural data configured for this project.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {culturalDataList.map((item) => (
                                <TableRow key={item.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-200 text-sm">
                                        <div className="flex items-center space-x-1.5">
                                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md text-xs" title={item.key}>{item.key}</span>
                                            <CopyButton textToCopy={item.key} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-200 text-sm">
                                        {item.region ? (
                                            <div title={`ID: ${item.regionId}`}>
                                                {item.region.name} ({item.region.languageCode})
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500" title={item.regionId}>{item.regionId || 'N/A'}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm">
                                        {item.formalityLevel !== null && item.formalityLevel !== undefined ? item.formalityLevel : 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs" title={item.style}>
                                        {item.style || 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs" title={item.considerations}>
                                        {item.considerations || 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs" title={item.notes}>
                                        {item.notes || 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                                aria-label="Edit Cultural Data" title="Edit"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(item.key)}
                                                className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                                aria-label="Delete Cultural Data" title="Delete"
                                            >
                                                <TrashBinIcon className="w-5 h-5" />
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

export default CulturalDataTable; 