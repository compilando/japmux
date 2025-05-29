import { apiClient } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';

export interface DashboardStats {
    activeProjects: number;
    executedPrompts: number;
    activeModels: number;
    activeUsers: number;
}

export interface RecentActivity {
    id: string;
    timestamp: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'APPROVE' | 'REJECT';
    entityType: 'PROMPT' | 'PROMPT_VERSION' | 'PROMPT_TRANSLATION' | 'PROMPT_ASSET' | 'PROMPT_ASSET_VERSION' | 'ASSET_TRANSLATION' | 'PROJECT' | 'ENVIRONMENT' | 'AI_MODEL' | 'TAG' | 'REGION' | 'CULTURAL_DATA' | 'RAG_DOCUMENT';
    entityId: string;
    userId: string;
    userName: string;
    projectId: string;
    projectName: string;
    details: {
        method: string;
        path: string;
        params: Record<string, string>;
    };
    changes: {
        new: Record<string, any>;
        old?: Record<string, any>;
    };
}

class DashboardService {
    async getStats(projectId?: string): Promise<DashboardStats> {
        const url = projectId
            ? `/api/dashboard/stats?projectId=${projectId}`
            : '/api/dashboard/stats';
        const response = await apiClient.get<DashboardStats>(url);
        return response.data;
    }

    async getRecentActivity(projectId?: string): Promise<RecentActivity[]> {
        const params = {
            limit: 10,
            offset: 0,
            projectId: projectId || '',
            entityType: '', // TODO: Filtrar por tipo de entidad si es necesario
            action: '' // TODO: Filtrar por acción si es necesario
        };
        const response = await apiClient.get<RecentActivity[]>('/api/dashboard/recent-activity', { params });
        return response.data;
    }

    async getActivity(): Promise<RecentActivity[]> {
        const response = await apiClient.get<RecentActivity[]>('/api/dashboard/activity');
        return response.data;
    }
}

export const dashboardService = new DashboardService(); 