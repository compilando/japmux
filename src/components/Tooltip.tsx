import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    className,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={cn(
                        'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap',
                        positionClasses[position],
                        className
                    )}
                    role="tooltip"
                    aria-hidden={!isVisible}
                >
                    {content}
                    <div
                        className={cn(
                            'absolute w-2 h-2 bg-gray-900 transform rotate-45',
                            position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                            position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                            position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
                            position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
                        )}
                    />
                </div>
            )}
        </div>
    );
}; 