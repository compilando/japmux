"use client";

import React, { useState } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import { promptService } from '@/services/api';
import { loadPromptStructure } from '@/services/promptApi';
import { LoadPromptStructureDto } from '@/types/prompt-structure';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useProjects } from '@/context/ProjectContext'; // Importar contexto de proyectos

// Definir interfaces para los datos generados
interface PromptInfo {
    name: string;
    description: string;
}

interface Translation {
    languageCode: string;
    promptText?: string;
    value?: string;
}

interface VersionInfo {
    promptText: string;
    changeMessage?: string;
    assets?: string[];
    translations?: Translation[];
}

interface AssetInfo {
    key: string;
    value: string;
    changeMessage?: string;
    translations?: Translation[];
}

interface StructureData {
    prompt?: PromptInfo;
    version?: VersionInfo;
    assets?: AssetInfo[];
}

const PromptWizardPage: React.FC = () => {
    const { selectedProjectId } = useProjects(); // Obtener projectId del contexto
    const [promptContent, setPromptContent] = useState<string>('');
    const [generatedJson, setGeneratedJson] = useState<StructureData | null>(null);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
    const [errorGenerate, setErrorGenerate] = useState<string | null>(null);

    // jsonToLoadInput será el estado para el textarea unificado
    const [jsonToLoadInput, setJsonToLoadInput] = useState<string>('');
    const [isLoadingLoad, setIsLoadingLoad] = useState<boolean>(false);
    const [loadStatusMessage, setLoadStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Prompt Wizard" }
    ];

    const handleGenerateStructure = async () => {
        if (!selectedProjectId) {
            showErrorToast('Please select a project first.');
            return;
        }
        if (!promptContent.trim()) {
            showErrorToast('Please write the prompt in the text area.');
            return;
        }

        setIsLoadingGenerate(true);
        setErrorGenerate(null);
        setGeneratedJson(null);
        try {
            const result = await promptService.generatePromptStructure(selectedProjectId, promptContent);
            setGeneratedJson(result as StructureData);
            setJsonToLoadInput(JSON.stringify(result, null, 2));
            showSuccessToast('Structure generated successfully from the prompt.');
        } catch (err: unknown) {
            console.error("Error generating structure:", err);
            let apiErrorMessage = 'Error generating prompt structure.';
            if (err && typeof err === 'object' && 'response' in err &&
                err.response && typeof err.response === 'object' &&
                'data' in err.response && err.response.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data) {
                apiErrorMessage = String(err.response.data.message);
            }
            setErrorGenerate(apiErrorMessage);
            showErrorToast(apiErrorMessage);
        } finally {
            setIsLoadingGenerate(false);
        }
    };

    // Función eliminada: handleFinalGeneration

    // Componente para visualización bonita del JSON
    const GeneratedStructureDisplay = ({ data }: { data: StructureData }) => {
        if (!data) return null;

        const renderBlock = (title: string, content: React.ReactNode, bgColorClass: string) => (
            <div className={`mb-4 p-4 border border-gray-300 dark:border-gray-500 rounded-lg shadow ${bgColorClass}`}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
                {content}
            </div>
        );

        const renderKeyValue = (key: string, value: unknown) => (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">{key}: </span>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </p>
        );

        const renderList = <T,>(items: T[], renderItem: (item: T, index: number) => React.ReactNode) => (
            <ul className="list-disc list-inside pl-4 space-y-1">
                {items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                        {renderItem(item, index)}
                    </li>
                ))}
            </ul>
        );

        return (
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Structure Visualization:</h2>

                {data.prompt && renderBlock("Prompt Details", <>
                    {renderKeyValue("Name", data.prompt.name)}
                    {renderKeyValue("Description", data.prompt.description)}
                </>, "bg-sky-50 dark:bg-sky-800/30")}

                {data.version && renderBlock("Version Details", <>
                    {renderKeyValue("Prompt Text", data.version.promptText)}
                    {renderKeyValue("Change Message", data.version.changeMessage)}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2 mb-1">Referenced Assets:</p>
                    {data.version.assets && data.version.assets.length > 0 ? renderList(data.version.assets, (assetName: string) => <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">{assetName}</span>) : <p className="text-xs text-gray-500 dark:text-gray-400">None</p>}

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2 mb-1">Version Translations:</p>
                    {data.version.translations && data.version.translations.length > 0 ? renderList(data.version.translations, (trans: Translation) => (
                        <><strong>{trans.languageCode}:</strong> {trans.promptText}</>
                    )) : <p className="text-xs text-gray-500 dark:text-gray-400">None</p>}
                </>, "bg-teal-50 dark:bg-teal-800/30")}

                {data.assets && data.assets.length > 0 && renderBlock("Defined Assets",
                    <div className="space-y-3">
                        {data.assets.map((asset: AssetInfo, index: number) => (
                            <div key={index} className="p-3 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800">
                                {renderKeyValue("Key", asset.key)}
                                {renderKeyValue("Default Value", asset.value)}
                                {renderKeyValue("Change Message", asset.changeMessage)}
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-1 mb-0.5">Asset Translations:</p>
                                {asset.translations && asset.translations.length > 0 ? renderList(asset.translations, (trans: Translation) => (
                                    <><strong>{trans.languageCode}:</strong> {trans.value}</>
                                )) : <p className="text-xs text-gray-500 dark:text-gray-400">None</p>}
                            </div>
                        ))}
                    </div>
                    , "bg-indigo-50 dark:bg-indigo-800/30")}
            </div>
        );
    };

    // Nueva función para manejar la carga de la estructura JSON
    const handleLoadStructure = async () => {
        if (!selectedProjectId) {
            showErrorToast('Please select a project first to load the structure.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Project not selected.' });
            return;
        }
        if (!jsonToLoadInput.trim()) {
            showErrorToast('The JSON to load cannot be empty.');
            setLoadStatusMessage({ type: 'error', message: 'Error: JSON field is empty.' });
            return;
        }

        let parsedJson: LoadPromptStructureDto;
        try {
            parsedJson = JSON.parse(jsonToLoadInput);
        } catch {
            showErrorToast('The entered text is not valid JSON.');
            setLoadStatusMessage({ type: 'error', message: 'Error: Invalid JSON format.' });
            return;
        }

        setIsLoadingLoad(true);
        setLoadStatusMessage(null);

        try {
            const result = await loadPromptStructure(selectedProjectId, parsedJson);
            if (result.success) {
                const successMessage = result.message || 'JSON structure loaded successfully.';
                showSuccessToast(successMessage);
                setLoadStatusMessage({ type: 'success', message: successMessage });
                setGeneratedJson(parsedJson as StructureData);
            } else {
                let detailedErrorMessage = result.message || 'Error loading JSON structure.';
                if (result.errorDetails) {
                    const detailsString = typeof result.errorDetails === 'string'
                        ? result.errorDetails
                        : JSON.stringify(result.errorDetails, null, 2);
                    detailedErrorMessage += `\nDetails: ${detailsString}`;
                }
                showErrorToast(detailedErrorMessage);
                setLoadStatusMessage({ type: 'error', message: `KO. ${detailedErrorMessage}` });
            }
        } catch (err: unknown) {
            // Este catch es para errores inesperados en la propia función loadPromptStructure o de red, no errores de API manejados
            console.error("Unexpected error calling loadPromptStructure:", err);
            const unexpectedError = (err instanceof Error) ? err.message : 'Unexpected error during the load operation.';
            showErrorToast(unexpectedError);
            setLoadStatusMessage({ type: 'error', message: `KO. ${unexpectedError}` });
        } finally {
            setIsLoadingLoad(false);
        }
    };

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">Prompt Wizard</h1>
                    <span className="px-3 py-1 text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-500/20 dark:text-brand-400 rounded-full">Beta</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    A step-by-step guide to create, configure, and optimize your prompts with AI assistance.
                </p>

                <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold">1</div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Write your prompt</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Describe what you want to achieve, and our AI will suggest the best structure for your prompt.
                    </p>
                    <div className="mb-4">
                        <textarea
                            id="prompt-editor"
                            rows={5}
                            className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200"
                            value={promptContent}
                            onChange={(e) => setPromptContent(e.target.value)}
                            placeholder="E.g.: Create a welcome message for new users in English and Spanish..."
                            disabled={isLoadingGenerate}
                        />
                    </div>
                    <button
                        onClick={handleGenerateStructure}
                        disabled={isLoadingGenerate || !promptContent.trim()}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingGenerate ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            'Generate Structure'
                        )}
                    </button>
                </div>

                {errorGenerate && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{errorGenerate}</p>
                    </div>
                )}

                {generatedJson && (
                    <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">2</div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Review Generated Structure</h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Review and modify the generated structure before saving it.
                        </p>
                        <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
                            <code className="text-sm text-gray-800 dark:text-gray-200">
                                {JSON.stringify(generatedJson, null, 2)}
                            </code>
                        </pre>
                    </div>
                )}

                <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">3</div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Load Existing Structure</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Or load an existing structure to modify it.
                    </p>
                    <div className="mb-4">
                        <textarea
                            id="json-to-load"
                            rows={5}
                            className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200"
                            value={jsonToLoadInput}
                            onChange={(e) => setJsonToLoadInput(e.target.value)}
                            placeholder="Paste your JSON structure here..."
                            disabled={isLoadingLoad}
                        />
                    </div>
                    <button
                        onClick={handleLoadStructure}
                        disabled={isLoadingLoad || !jsonToLoadInput.trim()}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingLoad ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            'Load Structure'
                        )}
                    </button>
                </div>

                {loadStatusMessage && (
                    <div className={`mb-8 p-4 rounded-lg ${
                        loadStatusMessage.type === 'success' 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                        <p className={`text-sm ${
                            loadStatusMessage.type === 'success' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                        }`}>
                            {loadStatusMessage.message}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default PromptWizardPage; 