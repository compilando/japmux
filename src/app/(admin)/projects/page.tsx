"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    projectService,
    userService,
    CreateProjectDto,
    UpdateProjectDto,
    UserProfileResponse,
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import ProjectForm from '@/components/form/ProjectForm';
import ProjectsDisplay from '@/components/projects/ProjectsDisplay';
import { useProjects } from '@/context/ProjectContext';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import { PlusIcon } from '@heroicons/react/24/outline';

// Interfaz para los datos del proyecto que se usarán en la UI
interface ProjectData extends CreateProjectDto {
    id: string;
    createdAt?: string;
    ownerUserId?: string; // Asegurar que esté aquí para que coincida con el mapeo
}

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [usersList, setUsersList] = useState<UserProfileResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

    const { selectedProjectId, setSelectedProjectId, refreshProjects: refreshProjectsFromContext } = useProjects();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [projectsData, usersData] = await Promise.all([
                projectService.findAll(),
                userService.findAll()
            ]);

            // Castear cada proyecto `p` a `any` para acceder a `id`, `createdAt`, `ownerUserId`
            // que esperamos que el backend devuelva, aunque el tipo inferido de `projectService.findAll()` sea `CreateProjectDto[]`
            const mappedProjects = projectsData.map((p: any) => ({
                name: p.name,
                description: p.description,
                ownerUserId: p.ownerUserId,
                id: p.id,
                createdAt: p.createdAt,
            })) as ProjectData[];

            setProjects(mappedProjects);
            setUsersList(usersData as UserProfileResponse[]);

        } catch (err: any) {
            console.error("Failed to fetch projects or users:", err);
            setError(err.message || 'Failed to fetch data.');
            setProjects([]);
            setUsersList([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddProject = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEditProject = (project: ProjectData) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleSelectProject = (project: ProjectData) => {
        setSelectedProjectId(project.id);
        if (showForm && editingProject && editingProject.id !== project.id) {
            setShowForm(false);
            setEditingProject(null);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            try {
                await projectService.remove(id);
                showSuccessToast('Project deleted successfully');
                fetchData();
                refreshProjectsFromContext();
                if (selectedProjectId === id) {
                    setSelectedProjectId(null);
                }
                if (editingProject && editingProject.id === id) {
                    setShowForm(false);
                    setEditingProject(null);
                }
            } catch (error: any) {
                console.error("Error deleting project:", error);
                showErrorToast(error.message || 'Error deleting project. Check console for details.');
            }
        }
    };

    const handleSaveProject = async (projectData: CreateProjectDto | UpdateProjectDto) => {
        try {
            if (editingProject) {
                await projectService.update(editingProject.id, projectData as UpdateProjectDto);
                showSuccessToast('Project updated successfully');
            } else {
                await projectService.create(projectData as CreateProjectDto);
                showSuccessToast('Project created successfully');
            }
            setShowForm(false);
            setEditingProject(null);
            fetchData();
            refreshProjectsFromContext();
        } catch (error: any) {
            console.error("Error saving project:", error);
            showErrorToast(error.message || 'Error saving project. Check console for details.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Projects" }];

    return (
        <div className="relative min-h-screen">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-200/10 dark:bg-brand-800/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative">
                <Breadcrumb crumbs={breadcrumbs} />

                {/* Header section with glassmorphism */}
                <div className="my-8">
                    <div className="relative">
                        <div className="relative p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Manage all your projects or create a new one.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content with glassmorphism */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-3xl"></div>

                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl">
                        {/* Action button */}
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={handleAddProject}
                                className="relative px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={loading || showForm}
                            >
                                <PlusIcon className="h-5 w-5 inline-block mr-2" />
                                Add New Project
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg">
                                        <div className="w-8 h-8 mx-auto mb-4 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading projects...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-red-50/40 to-red-50/60 dark:from-red-900/60 dark:via-red-900/40 dark:to-red-900/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-red-50/30 dark:bg-red-900/30 backdrop-blur-sm rounded-2xl border border-red-200/30 dark:border-red-700/40 shadow-lg">
                                        <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form section */}
                        {showForm && (
                            <div className="mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-brand-50/40 to-brand-50/60 dark:from-brand-950/60 dark:via-brand-950/40 dark:to-brand-950/60 backdrop-blur-xl rounded-2xl"></div>
                                    <div className="relative p-8 bg-brand-50/30 dark:bg-brand-950/30 backdrop-blur-sm rounded-2xl border border-brand-200/30 dark:border-brand-700/40 shadow-lg">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                            {editingProject ? 'Edit Project' : 'Add New Project'}
                                        </h3>
                                        <ProjectForm
                                            initialData={editingProject as any}
                                            users={usersList}
                                            onSave={handleSaveProject}
                                            onCancel={handleCancelForm}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Projects display */}
                        {!loading && !error && (
                            <ProjectsDisplay
                                projectsList={projects}
                                usersList={usersList}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                                onSelectProject={handleSelectProject}
                                selectedProjectId={selectedProjectId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage; 