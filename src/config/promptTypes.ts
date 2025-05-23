export interface PromptType {
    value: string;
    label: string;
    description: string;
    color: string;
}

// Constantes para tipos de prompt
export const PromptTypeConstants = {
    SYSTEM: 'SYSTEM',
    TASK: 'TASK',
    USER: 'USER',
    ASSISTANT: 'ASSISTANT',
    GUARD: 'GUARD',
    COMPOSITE: 'COMPOSITE',
    CONTEXT: 'CONTEXT',
    FUNCTION: 'FUNCTION',
    EXAMPLE: 'EXAMPLE',
    TEMPLATE: 'TEMPLATE',
    GENERAL: 'GENERAL',
    EXPERT: 'EXPERT',
    CREATIVE: 'CREATIVE',
    ANALYSIS: 'ANALYSIS',
    TECHNICAL: 'TECHNICAL'
} as const;

// Array unificado con todos los tipos
export const promptTypes: PromptType[] = [
    {
        value: PromptTypeConstants.SYSTEM,
        label: 'System',
        description: 'System prompt, base instructions or configuration',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    },
    {
        value: PromptTypeConstants.TASK,
        label: 'Task',
        description: 'For specific tasks or workflows',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    {
        value: PromptTypeConstants.USER,
        label: 'User',
        description: 'User prompt or interactive input',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    },
    {
        value: PromptTypeConstants.ASSISTANT,
        label: 'Assistant',
        description: 'Assistant or helper for support tasks',
        color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
    },
    {
        value: PromptTypeConstants.GUARD,
        label: 'Guard',
        description: 'Validation, filters or security control',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    },
    {
        value: PromptTypeConstants.COMPOSITE,
        label: 'Composite',
        description: 'Combination of multiple prompts or functionalities',
        color: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300'
    },
    {
        value: PromptTypeConstants.CONTEXT,
        label: 'Context',
        description: 'Contextual information or reference data',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    },
    {
        value: PromptTypeConstants.FUNCTION,
        label: 'Function',
        description: 'Specific functionality or function call',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    },
    {
        value: PromptTypeConstants.EXAMPLE,
        label: 'Example',
        description: 'Examples or reference cases',
        color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
    },
    {
        value: PromptTypeConstants.TEMPLATE,
        label: 'Template',
        description: 'Basic template or standard format',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    {
        value: PromptTypeConstants.GENERAL,
        label: 'General',
        description: 'General purpose, not specific',
        color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    },
    {
        value: PromptTypeConstants.EXPERT,
        label: 'Expert',
        description: 'Specialist or consultant in a specific area',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    },
    {
        value: PromptTypeConstants.CREATIVE,
        label: 'Creative',
        description: 'Creative or artistic content generation',
        color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    },
    {
        value: PromptTypeConstants.ANALYSIS,
        label: 'Analysis',
        description: 'Data analysis, reports or research',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    },
    {
        value: PromptTypeConstants.TECHNICAL,
        label: 'Technical',
        description: 'Development, programming or technical solutions',
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    }
];

// Helper functions
export const getPromptTypeByValue = (value: string): PromptType | undefined => {
    return promptTypes.find(type => type.value === value);
};

export const getPromptTypeLabel = (value: string): string => {
    const type = getPromptTypeByValue(value);
    return type ? type.label : value;
};

export const getPromptTypeColor = (value: string): string => {
    const type = getPromptTypeByValue(value);
    return type ? type.color : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

// Para compatibilidad con el patrón anterior, también exportamos las constantes individualmente
export const {
    SYSTEM,
    TASK,
    USER,
    ASSISTANT,
    GUARD,
    COMPOSITE,
    CONTEXT,
    FUNCTION,
    EXAMPLE,
    TEMPLATE,
    GENERAL,
    EXPERT,
    CREATIVE,
    ANALYSIS,
    TECHNICAL
} = PromptTypeConstants; 