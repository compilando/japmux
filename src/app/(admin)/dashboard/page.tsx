"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectContext';
import { useTenantAdmin } from '@/hooks/useTenantAdmin';
import {
    BoltIcon,
    BuildingOfficeIcon,
    FolderIcon,
    UserCircleIcon,
    SparklesIcon,
    PaperAirplaneIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
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
                console.error('Detailed dashboard error:', err);
                setError('Error loading dashboard data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated, router, selectedProjectId]);

    const quickActions = [
        {
            name: 'My Prompts',
            description: 'Manage your saved prompts',
            icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />,
            href: selectedProjectId ? `/projects/${selectedProjectId}/prompts` : '#',
            color: 'bg-green-500',
        },
        {
            name: 'Magic Assistant',
            description: 'Intelligent assistant for your prompts',
            icon: <SparklesIcon className="h-6 w-6" />,
            href: '/prompt-wizard',
            color: 'bg-purple-500',
        },
        {
            name: 'Run Prompt',
            description: 'Execute a prompt in the current project',
            icon: <PaperAirplaneIcon className="h-6 w-6" />,
            href: '/serveprompt',
            color: 'bg-blue-500',
        },
        {
            name: 'Projects',
            description: 'Manage your projects',
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
                    { label: 'Home', href: '/' },
                    { label: 'Dashboard', href: '/dashboard' },
                ]}
            />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome to japm.app
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Your control center for prompt and project management
                </p>
            </div>

            {!isTenantAdmin && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats && [
                            {
                                name: 'Active Projects',
                                value: stats.activeProjects.toString(),
                                icon: <FolderIcon className="h-6 w-6" />,
                            },
                            {
                                name: 'Executed Prompts',
                                value: stats.executedPrompts.toString(),
                                icon: <PaperAirplaneIcon className="h-6 w-6" />,
                            },
                            {
                                name: 'Project AI Models',
                                value: stats.activeModels.toString(),
                                icon: <BoltIcon className="h-6 w-6" />,
                            },
                            {
                                name: 'Tenant Active Users',
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
                            Quick Actions
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
                </>
            )}

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                        Recent Activity
                    </span>
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    {recentActivity.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center">
                                <ClockIcon className="h-12 w-12 mb-4 text-gray-400" />
                                <p className="text-lg font-medium">No recent activity</p>
                                <p className="text-sm mt-1">Your actions will appear here</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
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
                                                            {activity.entityType === 'PROMPT' && <PaperAirplaneIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'AI_MODEL' && <BoltIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'PROJECT' && <FolderIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'PROMPT_ASSET' && <DocumentDuplicateIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'PROMPT_TRANSLATION' && <LanguageIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
                                                            {activity.entityType === 'ENVIRONMENT' && <BuildingOfficeIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
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
                                                        {activity.action.toLowerCase() === 'create' && 'Created'}
                                                        {activity.action.toLowerCase() === 'update' && 'Updated'}
                                                        {activity.action.toLowerCase() === 'delete' && 'Deleted'}
                                                        {activity.action.toLowerCase() === 'publish' && 'Published'}
                                                        {activity.action.toLowerCase() === 'unpublish' && 'Unpublished'}
                                                        {activity.action.toLowerCase() === 'approve' && 'Approved'}
                                                        {activity.action.toLowerCase() === 'reject' && 'Rejected'}
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
                                                            {Object.entries(activity.changes.new)
                                                                .filter(([key]) => !['tenantId', 'name', 'initialChangeMessage'].includes(key))
                                                                .map(([key, value]) => (
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