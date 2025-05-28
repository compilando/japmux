"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/context/ProjectContext';
import { useTenantAdmin } from '@/hooks/useTenantAdmin';
import {
    BoltIcon,
    BuildingIcon,
    FolderIcon,
    UserCircleIcon,
    ShootingStarIcon,
    PaperPlaneIcon,
    TaskIcon,
} from '@/icons';
import Breadcrumb from '@/components/common/Breadcrumb';
import { dashboardService, DashboardStats, RecentActivity } from '@/services/api/dashboardService';
import axios, { AxiosError } from 'axios';

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { selectedProjectId } = useProjects();
    const { isTenantAdmin } = useTenantAdmin();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [statsData, activityData] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getRecentActivity()
                ]);
                setStats(statsData);
                setRecentActivity(activityData);
                setError(null);
            } catch (err: unknown) {
                console.error('Error detallado del dashboard:', err);
                if (err instanceof AxiosError) {
                    console.error('Detalles del error Axios:', {
                        status: err.response?.status,
                        data: err.response?.data,
                        headers: err.response?.headers
                    });
                    setError(`Error al cargar los datos del dashboard: ${err.response?.data?.message || err.message}`);
                } else {
                    setError(`Error al cargar los datos del dashboard: ${err instanceof Error ? err.message : String(err)}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated, router]);

    const quickActions = [
        {
            name: 'Ejecutar Prompt',
            description: 'Ejecuta un prompt en el proyecto actual',
            icon: <PaperPlaneIcon className="h-6 w-6" />,
            href: '/serveprompt',
            color: 'bg-blue-500',
        },
        {
            name: 'Magic Assistant',
            description: 'Asistente inteligente para tus prompts',
            icon: <ShootingStarIcon className="h-6 w-6" />,
            href: '/prompt-wizard',
            color: 'bg-purple-500',
        },
        {
            name: 'Mis Prompts',
            description: 'Gestiona tus prompts guardados',
            icon: <TaskIcon className="h-6 w-6" />,
            href: selectedProjectId ? `/projects/${selectedProjectId}/prompts` : '#',
            color: 'bg-green-500',
        },
        {
            name: 'Proyectos',
            description: 'Gestiona tus proyectos',
            icon: <FolderIcon className="h-6 w-6" />,
            href: '/projects',
            color: 'bg-orange-500',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Dashboard', href: '/dashboard' },
                ]}
            />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Bienvenido a japm.app
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Tu centro de control para la gestión de prompts y proyectos
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats && [
                    {
                        name: 'Proyectos Activos',
                        value: stats.activeProjects.toString(),
                        icon: <FolderIcon className="h-6 w-6" />,
                    },
                    {
                        name: 'Prompts Ejecutados',
                        value: stats.executedPrompts.toString(),
                        icon: <PaperPlaneIcon className="h-6 w-6" />,
                    },
                    {
                        name: 'Modelos AI',
                        value: stats.activeModels.toString(),
                        icon: <BoltIcon className="h-6 w-6" />,
                    },
                    {
                        name: 'Usuarios Activos',
                        value: stats.activeUsers.toString(),
                        icon: <UserCircleIcon className="h-6 w-6" />,
                    },
                ].map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.name}
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="p-3 bg-brand-100 dark:bg-brand-900 rounded-full">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <div className={`${action.color} p-3 rounded-full w-12 h-12 flex items-center justify-center text-white mb-4`}>
                                {action.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {action.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {action.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Actividad Reciente
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                            <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-full mr-4">
                                {activity.type === 'prompt' && <PaperPlaneIcon className="h-5 w-5" />}
                                {activity.type === 'model' && <BoltIcon className="h-5 w-5" />}
                                {activity.type === 'project' && <FolderIcon className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 dark:text-white">
                                    {activity.description}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 