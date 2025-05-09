"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    // Tipos necesarios para Assets y sus Versiones
    CreateProjectDto, // Para breadcrumbs
    CreatePromptAssetDto, // Para breadcrumbs
    CreatePromptAssetVersionDto,
    UpdatePromptAssetVersionDto,
} from '@/services/generated/api';
import {
    promptAssetService, // Usaremos este servicio
    projectService,     // Para breadcrumbs
} from '@/services/api';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetVersionsTable from '@/components/tables/PromptAssetVersionsTable';
import PromptAssetVersionForm from '@/components/form/PromptAssetVersionForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';

// Tipo local para representar una versión de Asset con campos adicionales necesarios para la UI
// Exportar para que la tabla también pueda usarlo.
export interface AssetVersionUIData extends CreatePromptAssetVersionDto {
    id: string; // Asumir que siempre viene un ID para una versión existente
    versionTag: string; // Hacerlo no opcional para la UI de una versión existente
    createdAt?: string; // Asumir que puede venir de la API
    // value y changeMessage ya están en CreatePromptAssetVersionDto (opcionales)
}

// Helper para versionado (simplificado) - similar al de PromptVersionForm
const getLatestAssetVersionTag = (versions: AssetVersionUIData[]): string | null => {
    if (!versions || versions.length === 0) return null;
    const sorted = [...versions].sort((a, b) => {
        const tagA = a.versionTag?.startsWith('v') ? a.versionTag.substring(1) : a.versionTag;
        const tagB = b.versionTag?.startsWith('v') ? b.versionTag.substring(1) : b.versionTag;
        return (tagB || '').localeCompare(tagA || '');
    });
    return sorted[0].versionTag || null;
};

const PromptAssetVersionsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<AssetVersionUIData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<AssetVersionUIData | null>(null);
    const [latestVersionTagForForm, setLatestVersionTagForForm] = useState<string | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [asset, setAsset] = useState<CreatePromptAssetDto | null>(null);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    const params = useParams();
    const projectId = params.projectId as string;
    const assetKey = params.assetKey as string; // Obtener assetKey de la URL

    // Efecto para cargar datos de breadcrumbs (Proyecto y Asset)
    useEffect(() => {
        if (!projectId || !assetKey) return;
        setBreadcrumbLoading(true);
        Promise.all([
            projectService.findOne(projectId),
            promptAssetService.findOne(projectId, assetKey) // Cargar el asset actual
        ]).then(([projectData, assetData]) => {
            setProject(projectData as CreateProjectDto);
            setAsset(assetData as CreatePromptAssetDto);
        }).catch(err => {
            console.error("Error fetching breadcrumb data (project/asset):", err);
            showErrorToast("Failed to load project or asset details for breadcrumbs.");
            setProject(null);
            setAsset(null);
        }).finally(() => {
            setBreadcrumbLoading(false);
        });
    }, [projectId, assetKey]);

    // Función para cargar la lista de versiones del asset
    const fetchData = useCallback(async () => {
        if (!projectId || !assetKey) {
            setError("Project ID or Asset Key is missing.");
            setLoading(false);
            setItemsList([]);
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const data = await promptAssetService.findVersions(projectId, assetKey);
            if (Array.isArray(data)) {
                const versionsData = data as AssetVersionUIData[];
                setItemsList(versionsData);
                const latestTag = getLatestAssetVersionTag(versionsData);
                setLatestVersionTagForForm(latestTag);
            } else {
                console.error("API response for asset versions is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
                setLatestVersionTagForForm(null);
            }
        } catch (err) {
            console.error("Error fetching asset versions:", err);
            setError('Failed to fetch asset versions.');
            showErrorToast('Failed to fetch asset versions.');
            setItemsList([]);
            setLatestVersionTagForForm(null);
        } finally {
            setLoading(false);
        }
    }, [projectId, assetKey]);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers CRUD para versiones
    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AssetVersionUIData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (versionTag: string) => { // La tabla pasa el tag directamente
        if (!projectId || !assetKey) return;
        if (window.confirm(`Are you sure you want to delete version "${versionTag}" for asset "${assetKey}"?`)) {
            setLoading(true);
            try {
                await promptAssetService.removeVersion(projectId, assetKey, versionTag);
                showSuccessToast(`Version ${versionTag} deleted successfully!`);
                fetchData(); // Recargar lista
            } catch (err) {
                setError('Failed to delete version');
                console.error(err);
                const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to delete version.';
                showErrorToast(apiErrorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payload: CreatePromptAssetVersionDto | UpdatePromptAssetVersionDto) => {
        if (!projectId || !assetKey) return;
        setLoading(true);
        try {
            let message = "";
            if (editingItem && editingItem.versionTag) { // Asumiendo que la versión existente tiene versionTag
                await promptAssetService.updateVersion(projectId, assetKey, editingItem.versionTag, payload as UpdatePromptAssetVersionDto);
                message = `Version ${editingItem.versionTag} updated successfully!`;
            } else {
                const createPayload = payload as CreatePromptAssetVersionDto;
                // El versionTag se asigna en el backend o se debe generar aquí?
                // Por ahora, asumimos que el form no lo envía y el backend lo maneja
                await promptAssetService.createVersion(projectId, assetKey, createPayload);
                // No podemos mostrar el nuevo tag si no lo devuelve la API
                message = "New version created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData(); // Recargar lista
        } catch (err) {
            setError('Failed to save version');
            console.error(err);
            const apiErrorMessage = (err as any)?.response?.data?.message || 'Failed to save version.';
            showErrorToast(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Breadcrumbs
    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (projectId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? projectId : (project?.name || projectId),
            href: `/projects/${projectId}/prompts`
        });
        breadcrumbs.push({
            label: "Assets",
            href: `/projects/${projectId}/prompt-assets`
        });
    }
    if (assetKey) {
        breadcrumbs.push({
            // Usar asset.key o asset.name si están disponibles y son más legibles
            label: breadcrumbLoading ? assetKey : (asset?.key || assetKey)
        });
        breadcrumbs.push({ label: "Versions" });
    }

    // Renderizado
    if (breadcrumbLoading || loading) return <p>Loading asset version details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!project || !asset) return <p className="text-red-500">Could not load project or asset details.</p>;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    disabled={loading}
                    title="Add New Asset Version"
                >
                    Add Version
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {itemsList.length === 0 ? (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No versions found for this asset.</p>
                ) : (
                    <PromptAssetVersionsTable
                        promptAssetVersions={itemsList}
                        onEdit={handleEdit}
                        onDelete={handleDelete} // Espera versionTag
                        projectId={projectId} // Pasar props necesarios a la tabla
                        assetKey={assetKey}
                        loading={loading}
                    />
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60 flex items-center justify-center">
                    <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            {editingItem ? `Edit Version (${editingItem.versionTag})` : 'Add New Asset Version'}
                        </h3>
                        <PromptAssetVersionForm
                            initialData={editingItem} // Pasar AssetVersionData
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                            // Pasar el último tag para la sugerencia
                            latestVersionTag={latestVersionTagForForm ?? undefined}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromptAssetVersionsPage; 