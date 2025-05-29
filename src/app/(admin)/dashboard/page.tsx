"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import {
    DocumentDuplicateIcon,
    LanguageIcon,
    TagIcon,
    GlobeAltIcon as GlobeIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import Breadcrumb from '@/components/common/Breadcrumb';
import { dashboardService, DashboardStats, RecentActivity } from '@/services/api/dashboardService';

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
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
                    dashboardService.getStats(selectedProjectId || undefined),
                    dashboardService.getRecentActivity(selectedProjectId || undefined)
                ]);
                setStats(statsData);
                setRecentActivity(activityData);
                setError(null);
            } catch (err) {
                console.error('Error detallado del dashboard:', err);
                setError('Error al cargar los datos del dashboard. Por favor, intente nuevamente más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated, router, selectedProjectId]);

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
                        <Link
                            key={action.name}
                            href={action.href}
                            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            onClick={(e) => {
                                if (action.href === '#') {
                                    e.preventDefault();
                                    return;
                                }
                            }}
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
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                        Actividad Reciente
                    </span>
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    {recentActivity.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center">
                                <ClockIcon className="h-12 w-12 mb-4 text-gray-400" />
                                <p className="text-lg font-medium">No hay actividad reciente</p>
                                <p className="text-sm mt-1">Las acciones que realices aparecerán aquí</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Acción
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Detalles
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Proyecto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentActivity.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="p-1.5 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-800 rounded-full group-hover:scale-110 transition-transform duration-200">
                                                            {activity.entityType === 'PROMPT' && <PaperPlaneIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'AI_MODEL' && <BoltIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'PROJECT' && <FolderIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'PROMPT_ASSET' && <DocumentDuplicateIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'PROMPT_TRANSLATION' && <LanguageIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'ENVIRONMENT' && <BuildingIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'TAG' && <TagIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'REGION' && <GlobeIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'CULTURAL_DATA' && <AcademicCapIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'RAG_DOCUMENT' && <DocumentTextIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                                                            {activity.userName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <span className="font-medium text-brand-600 dark:text-brand-400">
                                                        {activity.action.toLowerCase() === 'create' && 'Creó'}
                                                        {activity.action.toLowerCase() === 'update' && 'Actualizó'}
                                                        {activity.action.toLowerCase() === 'delete' && 'Eliminó'}
                                                        {activity.action.toLowerCase() === 'publish' && 'Publicó'}
                                                        {activity.action.toLowerCase() === 'unpublish' && 'Despublicó'}
                                                        {activity.action.toLowerCase() === 'approve' && 'Aprobó'}
                                                        {activity.action.toLowerCase() === 'reject' && 'Rechazó'}
                                                    </span>
                                                    {' '}
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        {activity.entityType.toLowerCase().replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    {activity.changes?.new && (
                                                        <div className="space-y-1">
                                                            {Object.entries(activity.changes.new).map(([key, value]) => (
                                                                <div key={key} className="flex items-start">
                                                                    <span className="font-medium text-brand-600 dark:text-brand-400 min-w-[80px]">
                                                                        {key}:
                                                                    </span>
                                                                    <span className="text-gray-600 dark:text-gray-400 ml-2 break-all">
                                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                                                        {activity.projectName || activity.projectId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 