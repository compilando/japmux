import Link from "next/link";
import React from "react";

// Exportar la interfaz Crumb
export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const pageTitle = crumbs[crumbs.length - 1]?.label || 'Page';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <h2
        className="text-xl font-semibold bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5 group">
                {crumb.href ? (
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
                    href={crumb.href}
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200">{crumb.label}</span>
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <svg
                    className="stroke-current flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
