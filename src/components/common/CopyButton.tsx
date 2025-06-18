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
    tooltipText = 'Copy to clipboard',
    className = ''
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        // Fallback for non-secure contexts (http) or older browsers
        if (!navigator.clipboard) {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 1500);
                } else {
                    console.error('Fallback: Failed to copy text');
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
            return;
        }

        // Modern way (requires secure context - HTTPS)
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const Icon = isCopied ? CheckIcon : DocumentDuplicateIcon;
    const currentTooltip = isCopied ? 'Copied!' : tooltipText;

    // Default classes combined with any provided className
    const finalClassName = `w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer ${className}`;

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={finalClassName}
            title={currentTooltip}
            aria-label={currentTooltip}
        >
            <Icon />
        </button>
    );
};

export default CopyButton; 