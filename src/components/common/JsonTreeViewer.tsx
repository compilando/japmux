import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface JsonTreeNodeProps {
    keyName: string;
    value: any;
    isRoot?: boolean;
    level?: number;
}

interface JsonTreeViewerProps {
    data: any;
    title?: string;
    className?: string;
}

const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({ keyName, value, isRoot = false, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(isRoot || level < 2);

    const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isPrimitive = !isObject && !isArray;
    const hasChildren = isObject || isArray;

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const getValueDisplay = () => {
        if (isPrimitive) {
            if (typeof value === 'string') {
                return `"${value}"`;
            }
            if (value === null) {
                return 'null';
            }
            if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            }
            return String(value);
        }

        if (isArray) {
            return isExpanded ? '[' : `[${value.length} items...]`;
        }

        if (isObject) {
            const keys = Object.keys(value);
            return isExpanded ? '{' : `{${keys.length} properties...}`;
        }

        return '';
    };

    const getTypeColor = () => {
        if (typeof value === 'string') return 'text-green-600 dark:text-green-400';
        if (typeof value === 'number') return 'text-blue-600 dark:text-blue-400';
        if (typeof value === 'boolean') return 'text-purple-600 dark:text-purple-400';
        if (value === null) return 'text-gray-500 dark:text-gray-400';
        return 'text-gray-700 dark:text-gray-300';
    };

    const renderChildren = () => {
        if (!hasChildren || !isExpanded) return null;

        let children: React.ReactNode[] = [];

        if (isArray) {
            children = value.map((item: any, index: number) => (
                <JsonTreeNode
                    key={index}
                    keyName={`[${index}]`}
                    value={item}
                    level={level + 1}
                />
            ));
        } else if (isObject) {
            children = Object.entries(value).map(([key, val]) => (
                <JsonTreeNode
                    key={key}
                    keyName={key}
                    value={val}
                    level={level + 1}
                />
            ));
        }

        return (
            <div className="ml-6 border-l border-white/20 dark:border-gray-600/30 pl-4 relative">
                <div className="absolute -left-px top-0 bottom-6 w-px bg-gradient-to-b from-brand-300/50 to-transparent dark:from-brand-600/50"></div>
                {children}
                {isObject && <div className="text-gray-500 dark:text-gray-400 text-sm font-mono">{'}'}</div>}
                {isArray && <div className="text-gray-500 dark:text-gray-400 text-sm font-mono">]</div>}
            </div>
        );
    };

    return (
        <div className={`${isRoot ? '' : 'mb-1'}`}>
            <div className="flex items-start group">
                {/* Expand/Collapse button */}
                {hasChildren && (
                    <button
                        onClick={toggleExpanded}
                        className="flex-shrink-0 mr-2 mt-0.5 p-1 rounded hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-wrap">
                        {/* Key name */}
                        {!isRoot && (
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2 font-mono text-sm">
                                {keyName}:
                            </span>
                        )}

                        {/* Value */}
                        <span className={`font-mono text-sm break-all ${getTypeColor()}`}>
                            {getValueDisplay()}
                        </span>

                        {/* Primitive value type indicator */}
                        {isPrimitive && (
                            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-sans">
                                {typeof value}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Children */}
            {renderChildren()}
        </div>
    );
};

const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({ data, title, className = '' }) => {
    if (!data) {
        return (
            <div className={`p-4 text-center text-gray-500 dark:text-gray-400 ${className}`}>
                No data to display
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-2xl"></div>

            <div className="relative p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-xl">
                {title && (
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20 dark:border-gray-600/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {title}
                        </h3>
                        <div className="px-3 py-1 bg-gradient-to-r from-brand-100/80 to-purple-100/80 dark:from-brand-900/40 dark:to-purple-900/40 rounded-full">
                            <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                                JSON Tree
                            </span>
                        </div>
                    </div>
                )}

                <div className="relative">
                    <JsonTreeNode keyName="root" value={data} isRoot={true} />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-brand-200/30 to-purple-200/30 dark:from-brand-800/20 dark:to-purple-800/20 rounded-full blur-lg opacity-60"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-xl opacity-40"></div>
            </div>
        </div>
    );
};

export default JsonTreeViewer; 