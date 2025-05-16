import React, { useState, useEffect, useMemo } from 'react';
import {
    systemPromptService,
    CreateSystemPromptDto,
    aiModelService,
    AiModelResponseDto,
    rawExecutionService,
    ExecuteRawDto
} from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';

interface GeneratePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerateComplete: (generatedText: string) => void;
    projectId: string;
    initialUserText?: string; 
}

interface SystemPromptOption {
    value: string;
    label: string;
}

interface AiModelOption {
    value: string; 
    label: string; 
    id: string;    
}

const GeneratePromptModal: React.FC<GeneratePromptModalProps> = ({
    isOpen,
    onClose,
    onGenerateComplete,
    projectId,
    initialUserText = ''
}) => {
    const [userText, setUserText] = useState(initialUserText);
    const [availableSystemPrompts, setAvailableSystemPrompts] = useState<CreateSystemPromptDto[]>([]);
    const [loadingSystemPrompts, setLoadingSystemPrompts] = useState(true);
    const [selectedSystemPromptName, setSelectedSystemPromptName] = useState<string>('');

    const [availableAiModels, setAvailableAiModels] = useState<AiModelResponseDto[]>([]);
    const [loadingAiModels, setLoadingAiModels] = useState(true);
    const [selectedAiModelValue, setSelectedAiModelValue] = useState<string>(''); // Guardar el 'value' del select (que será model.name)

    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // --- Data Fetching Effects ---

    useEffect(() => {
        console.log(`[GeneratePromptModal Effect SyncInitialText] isOpen: ${isOpen}`);
        if (isOpen) {
            console.log("[GeneratePromptModal Effect SyncInitialText] Modal opened. Setting userText from prop:", initialUserText);
            setUserText(initialUserText);
        } else {
            console.log("[GeneratePromptModal Effect SyncInitialText] Modal closed.");
        }
    }, [isOpen, initialUserText]);

    useEffect(() => {
        console.log(`[GeneratePromptModal Effect FetchSystemPrompts] isOpen: ${isOpen}`);
        if (isOpen) {
            setLoadingSystemPrompts(true);
            console.log("[GeneratePromptModal Effect FetchSystemPrompts] Calling systemPromptService.findAll()...");
            systemPromptService.findAll()
                .then(fetchedSystemPrompts => {
                    console.log("[GeneratePromptModal Effect FetchSystemPrompts] API returned:", fetchedSystemPrompts);
                    setAvailableSystemPrompts(fetchedSystemPrompts);
                    if (fetchedSystemPrompts.length > 0) {
                        const currentSelectionIsValid = fetchedSystemPrompts.some(p => p.name === selectedSystemPromptName);
                        if (!selectedSystemPromptName || !currentSelectionIsValid) {
                            const defaultNameToSelect = fetchedSystemPrompts[0].name;
                            setSelectedSystemPromptName(defaultNameToSelect);
                            console.log("[GeneratePromptModal Effect FetchSystemPrompts] Setting default system prompt:", defaultNameToSelect);
                        } else {
                            console.log("[GeneratePromptModal Effect FetchSystemPrompts] Keeping existing selection:", selectedSystemPromptName);
                        }
                    } else {
                        console.log("[GeneratePromptModal Effect FetchSystemPrompts] No system prompts found, clearing selection.");
                        setSelectedSystemPromptName('');
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch system prompts in modal:", err);
                    showErrorToast("Failed to load system prompts.");
                    setAvailableSystemPrompts([]);
                    setSelectedSystemPromptName('');
                })
                .finally(() => {
                    console.log("[GeneratePromptModal Effect FetchSystemPrompts] Finished loading.");
                    setLoadingSystemPrompts(false)
                });
        } else {
            console.log("[GeneratePromptModal Effect FetchSystemPrompts] Modal closed, skipping fetch.");
        }
    }, [isOpen, selectedSystemPromptName]);

    useEffect(() => {
        console.log(`[GeneratePromptModal Effect FetchAiModels] isOpen: ${isOpen}, projectId: ${projectId}`);
        if (isOpen && projectId) {
            setLoadingAiModels(true);
            console.log(`[GeneratePromptModal Effect FetchAiModels] Calling aiModelService.findAll(${projectId})...`);
            aiModelService.findAll(projectId)
                .then(fetchedAiModels => {
                    console.log("[GeneratePromptModal Effect FetchAiModels] API returned:", fetchedAiModels);
                    setAvailableAiModels(fetchedAiModels);
                    if (fetchedAiModels.length > 0) {
                        const currentSelectionIsValid = fetchedAiModels.some(m => m.name === selectedAiModelValue);
                        if (!selectedAiModelValue || !currentSelectionIsValid) {
                            const defaultModelValueToSelect = fetchedAiModels[0].name;
                            setSelectedAiModelValue(defaultModelValueToSelect);
                            console.log("[GeneratePromptModal Effect FetchAiModels] Setting default AI model value:", defaultModelValueToSelect);
                        } else {
                            console.log("[GeneratePromptModal Effect FetchAiModels] Keeping existing AI Model selection value:", selectedAiModelValue);
                        }
                    } else {
                        console.log("[GeneratePromptModal Effect FetchAiModels] No AI models found, clearing selection.");
                        setSelectedAiModelValue('');
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch AI models in modal:", err);
                    showErrorToast("Failed to load AI models.");
                    setAvailableAiModels([]);
                    setSelectedAiModelValue('');
                })
                .finally(() => {
                    console.log("[GeneratePromptModal Effect FetchAiModels] Finished loading.");
                    setLoadingAiModels(false)
                });
        } else if (!projectId && isOpen) {
            console.log("[GeneratePromptModal Effect FetchAiModels] No projectId, clearing AI models.");
            setAvailableAiModels([]);
            setSelectedAiModelValue('');
            setLoadingAiModels(false);
        } else {
            console.log("[GeneratePromptModal Effect FetchAiModels] Modal closed or no projectId, skipping fetch.");
        }
    }, [isOpen, projectId, selectedAiModelValue]);

    // --- Memoized Options for Selects ---

    const systemPromptOptions: SystemPromptOption[] = useMemo(() => {
        return availableSystemPrompts.map(sp => ({
            value: sp.name,
            label: `${sp.name}${sp.category ? ` (${sp.category})` : ''}`
        }));
    }, [availableSystemPrompts]);

    const aiModelOptions: AiModelOption[] = useMemo(() => {
        return availableAiModels.map(model => ({
            value: model.name,
            label: `${model.name}${model.provider ? ` (${model.provider})` : ''} ${model.apiIdentifier ? `[${model.apiIdentifier}]` : ''}`,
            id: model.id,
        }));
    }, [availableAiModels]);

    // --- Event Handlers ---

    const handleGenerate = async () => {
        if (!selectedSystemPromptName || !selectedAiModelValue) {
            showErrorToast("Please select both a System Prompt and an AI Model.");
            return;
        }

        const selectedModelOption = aiModelOptions.find(m => m.value === selectedAiModelValue);

        if (!selectedModelOption) {
            showErrorToast("Selected AI model details not found. Cannot get CUID.");
            console.error("[GeneratePromptModal handleGenerate] Could not find selected model in aiModelOptions. Selected value:", selectedAiModelValue, "Available options:", aiModelOptions);
            return;
        }

        const modelCuidToUse = selectedModelOption.id;
        console.log(`[GeneratePromptModal handleGenerate] Using AI Model CUID: ${modelCuidToUse} (from selected option value: ${selectedModelOption.value})`);

        setIsGenerating(true);
        setGeneratedText('');
        const payload: ExecuteRawDto = {
            userText: userText,
            systemPromptName: selectedSystemPromptName,
            aiModelId: modelCuidToUse,
        };

        console.log("[GeneratePromptModal handleGenerate] Sending payload:", payload);

        try {
            const result = await rawExecutionService.executeRaw(payload);
            let resultText = '';
            console.log("[GeneratePromptModal handleGenerate] Raw API Result:", result); // Log para ver la estructura

            // Extraer el texto de la respuesta (puede variar según la API)
            if (typeof result === 'string') {
                resultText = result;
            } else if (result && typeof result.response === 'string') { // <--- AÑADIR ESTA CONDICIÓN
                resultText = result.response;
            } else if (result && typeof result.text === 'string') {
                resultText = result.text;
            } else if (result && typeof result.result === 'string') {
                resultText = result.result;
            } else if (result && typeof result.choices?.[0]?.message?.content === 'string') { // OpenAI format
                resultText = result.choices[0].message.content;
            } else {
                console.warn("Unexpected format for executeRaw result:", JSON.stringify(result));
                resultText = JSON.stringify(result); // Mostrar como fallback
                showErrorToast("Received unexpected format. Displaying raw output.");
            }
            setGeneratedText(resultText);
            showSuccessToast("Text generated successfully!");
        } catch (error) {
            console.error("Error executing raw text:", error);
            let apiErrorMessage = 'Failed to generate text.';

            // Verificar si error es un objeto con una estructura específica
            if (error && typeof error === 'object' &&
                'response' in error &&
                error.response &&
                typeof error.response === 'object' &&
                'data' in error.response &&
                error.response.data &&
                typeof error.response.data === 'object' &&
                'message' in error.response.data) {
                apiErrorMessage = String(error.response.data.message);
            }

            showErrorToast(apiErrorMessage);
            setGeneratedText('');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        if (generatedText) {
            onGenerateComplete(generatedText);
            onClose();
        } else {
            showErrorToast("Please generate text first before accepting.");
        }
    };

    // --- Render Logic ---

    console.log("[GeneratePromptModal Render] Rendering. isOpen:", isOpen, "loadingSP:", loadingSystemPrompts, "loadingAI:", loadingAiModels, "selectedSP:", selectedSystemPromptName, "selectedAIValue:", selectedAiModelValue);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-70 flex items-center justify-center p-4">
            <div className="relative p-6 border w-full max-w-xl shadow-lg rounded-md bg-white dark:bg-gray-900 space-y-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Generate Prompt Text
                </h3>

                {/* System Prompt Select */}
                <div>
                    <label htmlFor="modalSystemPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">System Prompt</label>
                    <select
                        id="modalSystemPrompt"
                        value={selectedSystemPromptName}
                        onChange={(e) => setSelectedSystemPromptName(e.target.value)}
                        required
                        disabled={loadingSystemPrompts || isGenerating}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        {loadingSystemPrompts ? (
                            <option>Loading system prompts...</option>
                        ) : (
                            systemPromptOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))
                        )}
                        {!loadingSystemPrompts && systemPromptOptions.length === 0 && (
                            <option disabled value="">No system prompts available</option>
                        )}
                    </select>
                </div>

                {/* AI Model Select */}
                <div>
                    <label htmlFor="modalAiModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">AI Model</label>
                    <select
                        id="modalAiModel"
                        value={selectedAiModelValue}
                        onChange={(e) => setSelectedAiModelValue(e.target.value)}
                        required
                        disabled={loadingAiModels || isGenerating || !projectId}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        {loadingAiModels ? (
                            <option>Loading AI models...</option>
                        ) : projectId ? (
                            aiModelOptions.map(option => (
                                <option key={option.id} value={option.value}>{option.label}</option>
                            ))
                        ) : (
                            <option disabled value="">Select a project first</option>
                        )
                        }
                        {!loadingAiModels && projectId && aiModelOptions.length === 0 && (
                            <option disabled value="">No AI Models found for this project</option>
                        )}
                    </select>
                </div>

                {/* User Input Text Area */}
                <div>
                    <label htmlFor="modalUserText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Input Text</label>
                    <textarea
                        id="modalUserText"
                        rows={4}
                        value={userText}
                        onChange={(e) => setUserText(e.target.value)}
                        placeholder="Enter the text to process with the selected system prompt..."
                        disabled={isGenerating}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>

                {/* Generate Button */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating || loadingSystemPrompts || loadingAiModels || !selectedSystemPromptName || !selectedAiModelValue}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Text'}
                    </button>
                </div>

                {/* Generated Text Area */}
                {(generatedText || isGenerating) && (
                    <div>
                        <label htmlFor="modalGeneratedText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Generated Result</label>
                        <textarea
                            id="modalGeneratedText"
                            rows={6}
                            value={isGenerating ? "Generating..." : generatedText}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                        />
                    </div>
                )}


                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleAccept}
                        disabled={isGenerating || !generatedText}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        Use This Text
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneratePromptModal; 