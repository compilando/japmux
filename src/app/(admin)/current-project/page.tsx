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
  title: "Current Project - JAPM",
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
        <p className="text-base font-medium">
          Manage settings and data specific to the active project.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Environments Card */}
        <Link href="/environments" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="h-full rounded-sm border border-stroke bg-white p-6 shadow-default transition-shadow duration-200 ease-in-out hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <TableIcon className="h-6 w-6 fill-primary dark:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              Environments
            </h3>
            <p className="text-sm font-medium">Define deployment environments.</p>
          </div>
        </Link>

        {/* Regions Card */}
        <Link href="/regions" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="h-full rounded-sm border border-stroke bg-white p-6 shadow-default transition-shadow duration-200 ease-in-out hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <ListIcon className="h-6 w-6 fill-primary dark:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              Regions
            </h3>
            <p className="text-sm font-medium">Manage geographical or logical regions.</p>
          </div>
        </Link>

        {/* Cultural Data Card */}
        <Link href="/cultural-data" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="h-full rounded-sm border border-stroke bg-white p-6 shadow-default transition-shadow duration-200 ease-in-out hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <EyeIcon className="h-6 w-6 fill-primary dark:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              Cultural Data
            </h3>
            <p className="text-sm font-medium">Handle cultural nuances and data.</p>
          </div>
        </Link>

        {/* Tags Card */}
        <Link href="/tags" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="h-full rounded-sm border border-stroke bg-white p-6 shadow-default transition-shadow duration-200 ease-in-out hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <ChatIcon className="h-6 w-6 fill-primary dark:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              Tags
            </h3>
            <p className="text-sm font-medium">Organize and categorize prompts.</p>
          </div>
        </Link>

      </div>
    </>
  );
} 