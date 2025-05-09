import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  UserCircleIcon,
  FolderIcon
} from "@/icons/index"; // Assuming icons are exported from here

export const metadata: Metadata = {
  title: "Management - japm.app",
  description: "Manage users and projects.",
};

export default function ManagementPage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
          Management
        </h2>
        <p className="text-base font-medium">
          Administer users and projects.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Users Card - Sky */}
        <Link href="/users" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-sky-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-sky-500 border-t-4 border-t-sky-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 transition-colors duration-300 group-hover:bg-sky-500 dark:bg-sky-800 dark:group-hover:bg-sky-600">
              <UserCircleIcon className="h-7 w-7 fill-sky-500 transition-colors duration-300 group-hover:fill-white dark:fill-sky-300 dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Users
            </h3>
            <p className="text-sm font-medium">Manage user accounts and permissions.</p>
          </div>
        </Link>

        {/* Projects Card - Teal */}
        <Link href="/projects" className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <div className="group h-full rounded-lg border border-stroke bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:border-teal-500 dark:border-strokedark dark:bg-boxdark dark:hover:border-teal-500 border-t-4 border-t-teal-600">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 transition-colors duration-300 group-hover:bg-teal-500 dark:bg-teal-800 dark:group-hover:bg-teal-600">
              <FolderIcon className="h-7 w-7 fill-teal-500 transition-colors duration-300 group-hover:fill-white dark:fill-teal-300 dark:group-hover:fill-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-gray-700">
              Projects
            </h3>
            <p className="text-sm font-medium">Oversee and manage all projects.</p>
          </div>
        </Link>
      </div>
    </>
  );
} 