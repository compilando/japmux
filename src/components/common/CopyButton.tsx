'use client';

import React, { useState } from 'react';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CopyButtonProps {
    textToCopy: string;
    tooltipText?: string;
    className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    tooltipText = 'Copy ID',
    className = 'w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer'
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally show an error tooltip/message
        }
    };

    const Icon = isCopied ? CheckIcon : DocumentDuplicateIcon;
    const currentTooltip = isCopied ? 'Copied!' : tooltipText;

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={className}
            title={currentTooltip} // Basic tooltip using title attribute
            aria-label={currentTooltip}
        >
            <Icon />
        </button>
    );
};

export default CopyButton; 