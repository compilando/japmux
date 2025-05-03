"use client";

import React, { useState, useEffect } from 'react';
import {
    Project,
    projectService,
    CreateProjectDto,
    UpdateProjectDto,
    User,
    userService
} from '@/services/api';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import ProjectsTable from '@/components/tables/ProjectsTable';
import ProjectForm from '@/components/form/ProjectForm';
import axios from 'axios';

const ProjectsPage: React.FC = () => {
    const [projectsList, setProjectsList] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [usersList, setUsersList] = useState<User[]>([]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [projectsData, usersData] = await Promise.all([
                projectService.findAll(),
                userService.findAll()
            ]);

            if (Array.isArray(projectsData)) {
                setProjectsList(projectsData);
            } else {
                console.error("API response for /projects is not an array:", projectsData);
                setError('Received invalid data format for projects.');
                setProjectsList([]);
            }

            if (Array.isArray(usersData)) {
                setUsersList(usersData);
            } else {
                console.error("API response for /users is not an array:", usersData);
                setError(prev => prev ? `${prev} Also failed to load users.` : 'Failed to load users.');
                setUsersList([]);
            }

        } catch (err) {
            console.error("Error fetching data:", err);
            if (axios.isAxiosError(err)) {
                console.error("Axios error details:", err.response?.status, err.response?.data);
            }
            setError('Failed to fetch projects and users.');
            setProjectsList([]);
            setUsersList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.remove(id);
                fetchData();
            } catch (err) {
                setError('Failed to delete project');
                console.error(err);
            }
        }
    };

    const handleSave = async (payload: CreateProjectDto | UpdateProjectDto) => {
        try {
            if (editingProject) {
                await projectService.update(editingProject.id, payload as UpdateProjectDto);
            } else {
                await projectService.create(payload as CreateProjectDto);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError('Failed to save project');
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(`Error saving: ${err.response?.data?.message || err.message}`);
            } else if (err instanceof Error) {
                alert(`Error saving: ${err.message}`);
            }
        }
    };

    // Definir crumbs para esta página
    const breadcrumbs = [
        { label: "Home", href: "/" },
        // { label: "Management", href: "/projects" }, // Opcional
        { label: "Projects" } // Último elemento sin href
    ];

    return (
        <>
            {/* Usar la prop crumbs */}
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    Add Project
                </button>
            </div>
            {loading && <p>Loading projects...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <ProjectsTable
                        projects={projectsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        users={usersList}
                        loading={loading}
                    />
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </h3>
                        <ProjectForm
                            initialData={editingProject}
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            users={usersList}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectsPage; 