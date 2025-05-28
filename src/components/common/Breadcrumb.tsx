import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@/icons';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={item.href} className="inline-flex items-center">
                        {index > 0 && (
                            <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
                        )}
                        {index === items.length - 1 ? (
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-sm font-medium text-gray-700 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb; 