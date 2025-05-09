"use client";

import React from "react";
import Link from "next/link";
import { useProjects } from "@/context/ProjectContext";

export default function Ecommerce() {
  const { selectedProjectId } = useProjects();

  const promptManagementLink = selectedProjectId
    ? `/projects/${selectedProjectId}/prompts`
    : "/projects";

  const promptManagementTitle = selectedProjectId
    ? "Create, edit, and organize your prompts."
    : "Select a project first to manage prompts";

  return (
    <>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
          Welcome to japm.app
        </h2>
        <p className="text-base font-medium dark:text-white">
          Select a section below to manage your prompts, projects, and system settings.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Link href="/management" className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-indigo-500 border-t-4 border-t-indigo-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 transition-colors duration-300 group-hover:bg-indigo-500 dark:bg-indigo-800 dark:group-hover:bg-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 fill-indigo-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Management
            </h3>
            <p className="text-sm font-medium">General project administration.</p>
          </div>
        </Link>

        <Link
          href={promptManagementLink}
          title={promptManagementTitle}
          onClick={(e) => { if (!selectedProjectId) e.preventDefault(); }}
          className={`col-span-12 md:col-span-6 lg:col-span-3 ${!selectedProjectId ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-teal-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-teal-500 border-t-4 border-t-teal-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 transition-colors duration-300 group-hover:bg-teal-500 dark:bg-teal-800 dark:group-hover:bg-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 fill-teal-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Prompt Management
            </h3>
            <p className="text-sm font-medium">
              {promptManagementTitle}
            </p>
          </div>
        </Link>

        <Link href="/current-project" className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-sky-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-sky-500 border-t-4 border-t-sky-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 transition-colors duration-300 group-hover:bg-sky-500 dark:bg-sky-800 dark:group-hover:bg-sky-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 fill-sky-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-13.5h16.5M3.75 6a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25m-16.5 0h16.5" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Current Project
            </h3>
            <p className="text-sm font-medium">View and manage the active project context.</p>
          </div>
        </Link>

        <Link href="/serveprompt" className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-indigo-500 border-t-4 border-t-indigo-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 transition-colors duration-300 group-hover:bg-indigo-500 dark:bg-indigo-800 dark:group-hover:bg-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 fill-indigo-500 transition-colors duration-300 group-hover:fill-white dark:fill-white dark:group-hover:fill-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Prompt Execution
            </h3>
            <p className="text-sm font-medium">Run prompts and view results.</p>
          </div>
        </Link>
      </div>
    </>
  );
}
