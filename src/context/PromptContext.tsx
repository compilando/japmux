'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const PROMPT_ID_KEY = 'selectedPromptId';

interface PromptContextType {
    selectedPromptId: string | null;
    selectPrompt: (promptId: string | null) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

    // Load from localStorage on startup
    useEffect(() => {
        const storedId = localStorage.getItem(PROMPT_ID_KEY);
        if (storedId) {
            setSelectedPromptId(storedId);
        }
    }, []);

    const selectPrompt = (promptId: string | null) => {
        setSelectedPromptId(promptId);
        if (promptId) {
            localStorage.setItem(PROMPT_ID_KEY, promptId);
        } else {
            localStorage.removeItem(PROMPT_ID_KEY);
        }
        // Optional: Log for debugging
        console.log(`[PromptContext] Prompt selected: ${promptId}`);
    };

    return (
        <PromptContext.Provider value={{ selectedPromptId, selectPrompt }}>
            {children}
        </PromptContext.Provider>
    );
};

export const usePrompts = (): PromptContextType => {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error('usePrompts must be used within a PromptProvider');
    }
    return context;
}; 