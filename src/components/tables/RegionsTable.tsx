import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { Region } from '@/services/api';
import { TrashBinIcon, PencilIcon } from "@/icons";
import CopyButton from '../common/CopyButton';

interface RegionsTableProps {
    regions: Region[];
    onEdit: (region: Region) => void;
    onDelete: (id: string) => void;
}

const RegionsTable: React.FC<RegionsTableProps> = ({ regions, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[600px]"> {/* Adjust min-w as needed */}
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="w-2/12 px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Language Code</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {regions.map((region) => (
                                <TableRow key={region.languageCode}>
                                    <TableCell className="px-4 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                        <div className="flex items-center space-x-2">
                                            <img 
                                                src={`https://flagcdn.com/24x18/${region.languageCode.split('-')[1].toLowerCase()}.png`}
                                                alt={`${region.languageCode} flag`}
                                                className="w-6 h-4 object-cover rounded-sm"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://flagcdn.com/24x18/xx.png';
                                                }}
                                            />
                                            <span title={region.languageCode}>{region.languageCode}</span>
                                            <CopyButton textToCopy={region.languageCode} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                        {region.name}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => onEdit(region)}
                                                className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Edit Region"
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button
                                                onClick={() => onDelete(region.languageCode)}
                                                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Delete Region"
                                            >
                                                <TrashBinIcon />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {regions.length === 0 && (
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No regions found.
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

export default RegionsTable; 