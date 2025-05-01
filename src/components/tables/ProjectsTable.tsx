import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { Project } from '@/services/api';
import { TrashBinIcon } from "@/icons";

interface ProjectsTableProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[700px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Owner User ID</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">{project.id}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90 text-theme-sm">{project.name}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">{project.ownerUserId ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">{project.description ?? 'N/A'}</TableCell>
                                    <TableCell className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button onClick={() => onEdit(project)} className="text-blue-500 hover:text-blue-700 p-1" aria-label="Edit Project">Edit</button>
                                            <button onClick={() => onDelete(project.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Delete Project">
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {projects.length === 0 && (
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No projects found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ProjectsTable; 