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
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Projects
                </h2>
                <p className="text-base font-medium dark:text-white">
                    Manage all your projects or create a new one.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddProject}
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || showForm}
                    >
                        Add New Project
                    </button>
                </div>

                {loading && <p className="text-center py-4">Loading projects...</p>}
                {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

                {showForm && (
                    <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </h3>
                        <ProjectForm
                            initialData={editingProject as any}
                            users={usersList}
                            onSave={handleSaveProject}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}

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
        </>
    );
};

export default ProjectsPage; 