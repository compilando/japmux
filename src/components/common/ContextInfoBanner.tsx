import React from 'react';

interface ContextInfoBannerProps {
    projectName: string | null;
    promptName: string | null;
    versionName?: string | null;
    isLoading?: boolean;
    className?: string;
}

const ContextInfoBanner: React.FC<ContextInfoBannerProps> = ({
    projectName,
    promptName,
    versionName,
    isLoading = false,
    className = '',
}) => {
    if (isLoading || !projectName || !promptName) {
        // No mostrar nada si está cargando o si falta información esencial
        return null;
    }

    return (
        <div
            className={`my-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md ${className}`}
        >
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                In Project: {projectName}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                For Prompt: {promptName}
                {versionName && (
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        {' '}(Version: {versionName})
                    </span>
                )}
            </p>
        </div>
    );
};

export default ContextInfoBanner; 