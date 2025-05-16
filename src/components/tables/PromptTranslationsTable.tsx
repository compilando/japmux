import { useEffect, useState } from 'react';
import { CreatePromptTranslationDto } from '@/services/api';
import CopyButton from '../common/CopyButton';
import { TrashBinIcon, PencilIcon } from "@/icons";
import { regionService } from '@/services/api';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface PromptTranslationsTableProps {
    promptTranslations: CreatePromptTranslationDto[];
    onEdit: (item: CreatePromptTranslationDto) => void;
    onDelete: (item: CreatePromptTranslationDto) => void;
    projectId: string;
}

const PromptTranslationsTable: React.FC<PromptTranslationsTableProps> = ({ promptTranslations, onEdit, onDelete, projectId }) => {
    console.log('[PromptTranslationsTable] Rendering with translations:', promptTranslations);

    useEffect(() => {
        console.log('[PromptTranslationsTable] Component mounted with translations:', promptTranslations);
    }, [promptTranslations]);

    const getCountryCode = (languageCode: string) => {
        const code = languageCode.split('-')[1].toLowerCase();
        console.log('[PromptTranslationsTable] Language code:', languageCode, 'Country code:', code);
        return code;
    };

    if (!promptTranslations || promptTranslations.length === 0) {
        console.log('[PromptTranslationsTable] No translations to display');
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No translations found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[600px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="w-2/12 px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Language Code</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {promptTranslations.map((item) => {
                                const countryCode = getCountryCode(item.languageCode);
                                const flagUrl = `https://flagcdn.com/24x18/${countryCode}.png`;
                                console.log('[PromptTranslationsTable] Rendering row for:', item.languageCode, 'Flag URL:', flagUrl);
                                
                                return (
                                    <TableRow key={item.languageCode}>
                                        <TableCell className="px-4 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                            <div className="flex items-center space-x-2">
                                                <img 
                                                    src={flagUrl}
                                                    alt={`${item.languageCode} flag`}
                                                    className="w-6 h-4 object-cover rounded-sm"
                                                    onError={(e) => {
                                                        console.error('[PromptTranslationsTable] Error loading flag for:', item.languageCode);
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://flagcdn.com/24x18/xx.png';
                                                    }}
                                                />
                                                <span title={item.languageCode}>{item.languageCode}</span>
                                                <CopyButton textToCopy={item.languageCode} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">
                                            {item.languageCode === 'es-ES' ? 'España' : 
                                             item.languageCode === 'en-US' ? 'United States' : 
                                             item.languageCode}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label="Edit Translation"
                                                >
                                                    <PencilIcon />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label="Delete Translation"
                                                >
                                                    <TrashBinIcon />
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

export default PromptTranslationsTable; 