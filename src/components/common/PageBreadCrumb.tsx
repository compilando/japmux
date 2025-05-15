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
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    href={crumb.href}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <svg
                    className="stroke-current flex-shrink-0"
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
