"use client";

import React, { useState, useCallback } from 'react';

const ServePromptForm: React.FC = () => {
    const [promptId, setPromptId] = useState<string>('');
    const [languageCode, setLanguageCode] = useState<string>('');
    const [versionTag, setVersionTag] = useState<string>('');
    const [useLatestActive, setUseLatestActive] = useState<boolean>(true);
    const [resultPrompt, setResultPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchPrompt = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setResultPrompt(null);

        const params = new URLSearchParams();
        if (promptId) params.append('promptId', promptId);
        if (languageCode) params.append('languageCode', languageCode);
        // Only add versionTag if useLatestActive is false
        if (!useLatestActive && versionTag) params.append('versionTag', versionTag);
        // Add useLatestActive unless it's the default (true)
        if (!useLatestActive) params.append('useLatestActive', 'false');

        // Construct the final URL - Assuming an internal API route
        const apiUrl = `/api/serve-prompt?${params.toString()}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error ${response.status}: ${errorData || response.statusText}`);
            }
            const data = await response.text(); // API returns a string directly
            setResultPrompt(data);
        } catch (err: unknown) {
            console.error("Error fetching prompt:", err);
            let message = 'Failed to fetch prompt.';
            if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [promptId, languageCode, versionTag, useLatestActive]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Fields */}
                <div>
                    <label htmlFor="promptId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt ID</label>
                    <input
                        type="text"
                        id="promptId"
                        value={promptId}
                        onChange={(e) => setPromptId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., bienvenida-formal-es"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Ignores other filters if provided.</p>
                </div>
                <div>
                    <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language Code</label>
                    <input
                        type="text"
                        id="languageCode"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., es-ES, en-US"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">For translation. Otherwise, uses base text.</p>
                </div>
                <div>
                    <label htmlFor="versionTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Version Tag (Optional)</label>
                    <input
                        type="text"
                        id="versionTag"
                        value={useLatestActive ? 'latest' : versionTag}
                        onChange={(e) => setVersionTag(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                        placeholder="e.g., v1.2.1"
                        disabled={useLatestActive || !!promptId} // Disable if using latest active or promptId is set
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {useLatestActive ? 'Using latest active version' : 'Ignored if \'Use Latest Active\' is checked.'}
                    </p>
                </div>
                <div className="flex items-center col-span-1 md:col-span-2">
                    <input
                        id="useLatestActive"
                        type="checkbox"
                        checked={useLatestActive}
                        onChange={(e) => setUseLatestActive(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                        disabled={!!promptId} // Disable if promptId is set
                    />
                    <label htmlFor="useLatestActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        Use Latest Active Version (Default: true)
                    </label>
                </div>
            </div>

            {/* Fetch Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleFetchPrompt}
                    disabled={isLoading || (!promptId)} // Require promptId 
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Searching...' : 'Get Prompt'}
                </button>
            </div>

            {/* Result Area */}
            {(resultPrompt !== null || error) && (
                <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Result:</h3>
                    {error && (
                        <div className="text-red-600 dark:text-red-400 p-3 border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 rounded">
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                    {resultPrompt !== null && (
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 p-3 bg-white dark:bg-gray-700 rounded shadow-inner">
                            {resultPrompt}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};

export default ServePromptForm;
