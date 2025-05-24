import React from 'react';
import { CulturalDataResponse, CreateRegionDto } from '@/services/generated/api';
import { TrashBinIcon, PencilIcon, InfoIcon } from "@/icons";
import CopyButton from '../common/CopyButton';

interface CulturalDataTableProps {
    culturalDataList: CulturalDataResponse[];
    regions: CreateRegionDto[];
    onEdit: (data: CulturalDataResponse) => void;
    onDelete: (itemKey: string) => void;
}

const CulturalDataTable: React.FC<CulturalDataTableProps> = ({ culturalDataList, regions, onEdit, onDelete }) => {
    if (culturalDataList.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <InfoIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-semibold mb-1">No Cultural Data Found</h3>
                    <p className="text-sm">There are currently no cultural data entries configured for this project.</p>
                </div>
            </div>
        );
    }

    const getRegionLanguageCode = (regionId: string): string | null => {
        const region = regions.find(r => (r as any).id === regionId);
        return region ? region.languageCode : regionId;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {culturalDataList.map((data) => {
                const actualLanguageCode = getRegionLanguageCode(data.regionId);
                const langParts = actualLanguageCode ? actualLanguageCode.split('-') : [];
                const countryCode = langParts.length > 1 ? langParts[1].toLowerCase() : (langParts.length === 1 ? langParts[0].toLowerCase() : 'xx');
                const flagUrl = countryCode.length === 2 ? `https://flagcdn.com/24x18/${countryCode}.png` : `https://flagcdn.com/24x18/xx.png`;

                return (
                    <div
                        key={data.key}
                        className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-brand-500 dark:hover:border-brand-500"
                    >
                        {/* Header con el key y botones de acción */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate" title={data.key}>
                                        {data.key}
                                    </span>
                                    <CopyButton textToCopy={data.key} />
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => onEdit(data)}
                                        className="text-brand-500 hover:text-brand-700 p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors"
                                        title="Edit"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(data.key)}
                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-700/20 transition-colors"
                                        title="Delete"
                                    >
                                        <TrashBinIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="p-4 space-y-4">
                            {/* Región con bandera */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Region
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={flagUrl}
                                        alt={`${actualLanguageCode} flag`}
                                        className="w-6 h-4 object-cover rounded-sm border border-gray-300 dark:border-gray-600"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://flagcdn.com/24x18/xx.png';
                                            target.onerror = null;
                                        }}
                                    />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {actualLanguageCode ? actualLanguageCode.toUpperCase() : 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Estilo */}
                            {data.style && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Style
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                                        {data.style}
                                    </p>
                                </div>
                            )}

                            {/* Notas */}
                            {data.notes && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Notes
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                                        {data.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CulturalDataTable; 