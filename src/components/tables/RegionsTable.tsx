import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { CreateRegionDto } from '@/services/generated/api';
import { TrashBinIcon, PencilIcon, InfoIcon } from "@/icons";
import CopyButton from '../common/CopyButton';

interface RegionsTableProps {
    regions: CreateRegionDto[];
    onEdit: (region: CreateRegionDto) => void;
    onDelete: (languageCode: string) => void;
}

const RegionsTable: React.FC<RegionsTableProps> = ({ regions, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-lg">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[700px]"> {/* Ajustar min-width */}
                    <Table>
                        <TableHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Language Code</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-left text-xs uppercase tracking-wider">Notes</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center text-xs uppercase tracking-wider">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {regions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="px-5 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                                            <h3 className="text-lg font-semibold mb-1">No Regions Found</h3>
                                            <p className="text-sm">There are currently no regions configured for this project.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {regions.map((region) => {
                                const langParts = region.languageCode.split('-');
                                const countryCode = langParts.length > 1 ? langParts[1].toLowerCase() : region.languageCode.toLowerCase();
                                // Intenta usar una bandera genérica si solo hay código de idioma (ej. 'en' en lugar de 'en-US')
                                // o si el countryCode tiene más de 2 caracteres (no es un código de país ISO válido)
                                const flagUrl = countryCode.length === 2 ? `https://flagcdn.com/24x18/${countryCode}.png` : `https://flagcdn.com/24x18/xx.png`;

                                return (
                                    <TableRow key={region.languageCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                        <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-200 text-sm">
                                            <div className="flex items-center space-x-2" title={region.languageCode}>
                                                <img
                                                    src={flagUrl}
                                                    alt={`${region.languageCode} flag`}
                                                    className="w-6 h-4 object-cover rounded-sm border border-gray-300 dark:border-gray-600"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://flagcdn.com/24x18/xx.png'; // Fallback a bandera genérica
                                                        target.onerror = null; // Evitar bucles si el fallback también falla
                                                    }}
                                                />
                                                <span>{region.languageCode}</span>
                                                <CopyButton textToCopy={region.languageCode} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-900 dark:text-white font-medium text-sm">
                                            {region.name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs" title={region.notes || undefined}>
                                            {region.notes || 'N/A'}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(region)}
                                                    className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                                    aria-label="Edit Region" title="Edit"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(region.languageCode)}
                                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                                    aria-label="Delete Region" title="Delete"
                                                >
                                                    <TrashBinIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default RegionsTable; 