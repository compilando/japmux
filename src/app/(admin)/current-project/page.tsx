import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  TableIcon,
  ListIcon,
  EyeIcon,
  ChatIcon,
  PaperPlaneIcon
} from "@/icons/index"; // Assuming icons are exported from here

export const metadata: Metadata = {
  title: "Current Project - japm.app",
  description: "Manage the context for the currently selected project.",
};

export default function CurrentProjectPage() {
  // TODO: Add logic to check if a project is selected, maybe redirect or show a message if not.
  // const { selectedProjectId } = useProjects(); // Example context usage

  return (
    <>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
          Current Project Context
        </h2>
        <p className="text-base font-medium dark:text-white">
          Manage settings and data specific to the active project.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* AI Models Card - Professional Palette (Indigo) */}
        <Link href="/ai-models" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-indigo-500 border-t-4 border-t-indigo-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 transition-colors duration-300 group-hover:bg-indigo-500 dark:bg-indigo-800 dark:group-hover:bg-indigo-600">
              <PaperPlaneIcon className="h-7 w-7 fill-indigo-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              AI Models
            </h3>
            <p className="text-sm font-medium">Manage and configure AI models.</p>
          </div>
        </Link>

        {/* Environments Card - Teal */}
        <Link href="/environments" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-teal-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-teal-500 border-t-4 border-t-teal-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 transition-colors duration-300 group-hover:bg-teal-500 dark:bg-teal-800 dark:group-hover:bg-teal-600">
              <TableIcon className="h-7 w-7 fill-teal-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Environments
            </h3>
            <p className="text-sm font-medium">Define deployment environments.</p>
          </div>
        </Link>

        {/* Regions Card - Sky */}
        <Link href="/regions" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-sky-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-sky-500 border-t-4 border-t-sky-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 transition-colors duration-300 group-hover:bg-sky-500 dark:bg-sky-800 dark:group-hover:bg-sky-600">
              <ListIcon className="h-7 w-7 fill-sky-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Regions
            </h3>
            <p className="text-sm font-medium">Manage geographical or logical regions.</p>
          </div>
        </Link>

        {/* Cultural Data Card - Indigo (consistent with AI Models for now) */}
        <Link href="/cultural-data" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-indigo-500 border-t-4 border-t-indigo-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 transition-colors duration-300 group-hover:bg-indigo-500 dark:bg-indigo-800 dark:group-hover:bg-indigo-600">
              <EyeIcon className="h-7 w-7 fill-indigo-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Cultural Data
            </h3>
            <p className="text-sm font-medium">Handle cultural nuances and data.</p>
          </div>
        </Link>

        {/* Tags Card - Teal */}
        <Link href="/tags" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-teal-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-teal-500 border-t-4 border-t-teal-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 transition-colors duration-300 group-hover:bg-teal-500 dark:bg-teal-800 dark:group-hover:bg-teal-600">
              <ChatIcon className="h-7 w-7 fill-teal-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Tags
            </h3>
            <p className="text-sm font-medium">Organize and categorize prompts.</p>
          </div>
        </Link>


      </div>
    </>
  );
} 