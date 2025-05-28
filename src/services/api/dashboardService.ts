import { projectService, userService } from '@/services/api';
import * as generated from '@/services/generated';

export interface DashboardStats {
    activeProjects: number;
    executedPrompts: number;
    activeModels: number;
    activeUsers: number;
}

export interface RecentActivity {
    id: string;
    type: 'project' | 'user' | 'prompt' | 'model';
    description: string;
    timestamp: string;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        try {
            const projects = await projectService.findAll();
            const users = await userService.findAll();

            return {
                activeProjects: projects.length,
                executedPrompts: 0,
                activeModels: 0,
                activeUsers: users.length,
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            return {
                activeProjects: 0,
                executedPrompts: 0,
                activeModels: 0,
                activeUsers: 0,
            };
        }
    },

    getRecentActivity: async (): Promise<RecentActivity[]> => {
        try {
            const projects: generated.ProjectDto[] = await projectService.findAll();
            const recentProjects = projects
                .filter(p => (p as any).createdAt)
                .sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime())
                .slice(0, 5)
                .map((project: generated.ProjectDto) => ({
                    id: project.id || `project-${Math.random().toString(16).slice(2)}`,
                    type: 'project' as 'project',
                    description: `Nuevo proyecto creado: ${project.name}`,
                    timestamp: (project as any).createdAt ? new Date((project as any).createdAt).toISOString() : new Date().toISOString(),
                }));
            return recentProjects;
        } catch (error) {
            console.error("Error fetching recent activity:", error);
            return [];
        }
    }
}; 