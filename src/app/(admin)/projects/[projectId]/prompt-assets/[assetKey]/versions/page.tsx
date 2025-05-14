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
import axios from 'axios'; // Importar axios

// Helper para extraer mensajes de error de forma segura (duplicado de translations/page.tsx, considerar mover a utils)
const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

// Tipo local para representar una versión de Asset con campos adicionales necesarios para la UI
// Exportar para que la tabla también pueda usarlo.
export interface AssetVersionUIData extends CreatePromptAssetVersionDto {
    id: string; // Asumir que siempre viene un ID para una versión existente
    versionTag: string; // Hacerlo no opcional para la UI de una versión existente
    createdAt?: string; // Asumir que puede venir de la API
    // value y changeMessage ya están en CreatePromptAssetVersionDto (opcionales)
}

// Nueva interfaz para detalles del marketplace
export interface PromptAssetVersionMarketplaceDetails extends AssetVersionUIData {
    marketplaceStatus?: 'NOT_PUBLISHED' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | string;
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
    const [itemsList, setItemsList] = useState<PromptAssetVersionMarketplaceDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<AssetVersionUIData | null>(null);
    const [latestVersionTagForForm, setLatestVersionTagForForm] = useState<string | null>(null);
    const [marketplaceActionLoading, setMarketplaceActionLoading] = useState<Record<string, boolean>>({});

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
            const defaultMsg = "Failed to load project or asset details for breadcrumbs.";
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            showErrorToast(apiErrorMessage); // Mantener toast aquí ya que no es un error de API directo de la página principal
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
                // Asumimos que la API ahora puede devolver marketplaceStatus o lo manejamos como undefined
                const versionsData = data.map(v => ({
                    ...v,
                    // Si CreatePromptAssetVersionDto no tiene 'id', no podemos hacer v.id
                    // AssetVersionUIData requiere 'id', así que debemos proporcionarlo.
                    // Usar versionTag si está disponible y es un string.
                    id: typeof v.versionTag === 'string' ? v.versionTag : String(Date.now() + Math.random()), // Corregido para no acceder a v.id
                    versionTag: typeof v.versionTag === 'string' ? v.versionTag : 'N/A',
                })) as PromptAssetVersionMarketplaceDetails[];
                setItemsList(versionsData);
                const latestTag = getLatestAssetVersionTag(versionsData);
                setLatestVersionTagForForm(latestTag);
            } else {
                console.error("API response for asset versions is not an array:", data);
                setError('Received invalid data format.');
                setItemsList([]);
                setLatestVersionTagForForm(null);
            }
        } catch (err: unknown) { // Tipar err
            console.error("Error fetching asset versions:", err);
            const defaultMsg = 'Failed to fetch asset versions.';
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            setError(apiErrorMessage);
            // Interceptor de Axios debería mostrar el toast.
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

    // Handlers para acciones de Marketplace
    const handleRequestPublish = async (versionTag: string) => {
        if (!projectId || !assetKey || !versionTag) return;
        setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: true }));
        try {
            const updatedVersion = await promptAssetService.requestPublishVersion(projectId, assetKey, versionTag);
            // Actualizar el item en la lista
            setItemsList(prevList =>
                prevList.map(item =>
                    item.versionTag === versionTag ? { ...item, ...updatedVersion, marketplaceStatus: (updatedVersion as PromptAssetVersionMarketplaceDetails).marketplaceStatus || 'PENDING_APPROVAL' } : item
                )
            );
            showSuccessToast(`Solicitud de publicación para la versión ${versionTag} enviada.`);
        } catch (err) {
            console.error(`Error requesting publish for version ${versionTag}:`, err);
            showErrorToast(getApiErrorMessage(err, `Error al solicitar publicación para ${versionTag}.`));
        } finally {
            setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: false }));
        }
    };

    const handleUnpublish = async (versionTag: string) => {
        if (!projectId || !assetKey || !versionTag) return;
        setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: true }));
        try {
            const updatedVersion = await promptAssetService.unpublishVersion(projectId, assetKey, versionTag);
            // Actualizar el item en la lista
            setItemsList(prevList =>
                prevList.map(item =>
                    item.versionTag === versionTag ? { ...item, ...updatedVersion, marketplaceStatus: (updatedVersion as PromptAssetVersionMarketplaceDetails).marketplaceStatus || 'NOT_PUBLISHED' } : item
                )
            );
            showSuccessToast(`Versión ${versionTag} retirada del marketplace.`);
        } catch (err) {
            console.error(`Error unpublishing version ${versionTag}:`, err);
            showErrorToast(getApiErrorMessage(err, `Error al retirar ${versionTag} del marketplace.`));
        } finally {
            setMarketplaceActionLoading(prev => ({ ...prev, [versionTag]: false }));
        }
    };

    // Handlers CRUD para versiones
    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AssetVersionUIData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (versionTagToDelete: string) => {
        if (!projectId || !assetKey) return;
        if (window.confirm(`Are you sure you want to delete version "${versionTagToDelete}" for asset "${assetKey}"?`)) {
            setLoading(true);
            try {
                await promptAssetService.removeVersion(projectId, assetKey, versionTagToDelete);
                showSuccessToast(`Version ${versionTagToDelete} deleted successfully!`);
                fetchData();
            } catch (err: unknown) { // Tipar err
                console.error("Error deleting version:", err);
                const defaultMsg = 'Failed to delete version.';
                const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
                setError(apiErrorMessage);
                // Interceptor de Axios debería mostrar el toast.
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
            if (editingItem && editingItem.versionTag) {
                await promptAssetService.updateVersion(projectId, assetKey, editingItem.versionTag, payload as UpdatePromptAssetVersionDto);
                message = `Version ${editingItem.versionTag} updated successfully!`;
            } else {
                const createPayload = payload as CreatePromptAssetVersionDto;
                await promptAssetService.createVersion(projectId, assetKey, createPayload);
                message = "New version created successfully!";
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData();
        } catch (err: unknown) { // Tipar err
            console.error("Error saving version:", err);
            const defaultMsg = 'Failed to save version.';
            const apiErrorMessage = getApiErrorMessage(err, defaultMsg);
            setError(apiErrorMessage);
            // Interceptor de Axios debería mostrar el toast.
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
                        // Nuevos handlers para marketplace
                        onRequestPublish={handleRequestPublish}
                        onUnpublish={handleUnpublish}
                        marketplaceActionLoading={marketplaceActionLoading}
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