"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    CreateProjectDto,
    PromptDto,
    CreatePromptAssetDto,
    CreatePromptAssetVersionDto,
    CreateAssetTranslationDto,
    UpdateAssetTranslationDto,
    CreateRegionDto,
} from '@/services/generated/api';
import {
    promptAssetService,
    projectService,
    promptService,
    regionService,
} from '@/services/api';
import Breadcrumb, { Crumb } from '@/components/common/PageBreadCrumb';
import PromptAssetTranslationsTable from '@/components/tables/PromptAssetTranslationsTable';
import PromptAssetTranslationForm from '@/components/form/PromptAssetTranslationForm';
import { showSuccessToast, showErrorToast } from '@/utils/toastUtils';
import axios from 'axios';
import { PromptAssetData } from '@/components/tables/PromptAssetsTable';

// Helper para extraer mensajes de error de forma segura
const getApiErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

interface AssetTranslationUIData extends CreateAssetTranslationDto {
    id?: string; // languageCode se usará como id en la UI
}

const PromptAssetTranslationsPage: React.FC = () => {
    const [itemsList, setItemsList] = useState<AssetTranslationUIData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<AssetTranslationUIData | null>(null);

    const [project, setProject] = useState<CreateProjectDto | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<PromptDto | null>(null);
    const [asset, setAsset] = useState<PromptAssetData | null>(null);
    const [version, setVersion] = useState<CreatePromptAssetVersionDto | null>(null); // version.value es el texto original
    const [breadcrumbLoading, setBreadcrumbLoading] = useState<boolean>(true);

    // Nuevos estados para gestionar las regiones/idiomas disponibles y si todas están traducidas
    const [projectRegions, setProjectRegions] = useState<CreateRegionDto[]>([]); // Para todas las regiones del proyecto
    const [availableLanguagesForNewTranslation, setAvailableLanguagesForNewTranslation] = useState<{ code: string; name: string }[]>([]);
    const [allLanguagesTranslated, setAllLanguagesTranslated] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;
    const promptId = params.promptId as string;
    const assetKey = params.assetKey as string;
    const versionTag = params.versionTag as string;

    useEffect(() => {
        if (!projectId) return; // Solo necesitamos projectId para las regiones
        setBreadcrumbLoading(true); // Mantener para la carga general de breadcrumbs

        const fetchProjectDetailsAndRegions = async () => {
            try {
                const [projectData, promptData, assetData, versionData, regionsData] = await Promise.all([
                    projectService.findOne(projectId),
                    promptService.findOne(projectId, promptId),
                    promptAssetService.findOne(projectId, promptId, assetKey),
                    promptAssetService.findOneVersion(projectId, promptId, assetKey, versionTag),
                    regionService.findAll(projectId) // Obtener las regiones del proyecto
                ]);

                setProject(projectData as CreateProjectDto);
                setCurrentPrompt(promptData as PromptDto);
                setAsset(assetData as PromptAssetData);
                setVersion(versionData as CreatePromptAssetVersionDto);
                setProjectRegions(regionsData); // Guardar las regiones del proyecto

            } catch (err: unknown) {
                console.error("Error fetching breadcrumb data or project regions:", err);
                const defaultMsg = 'Failed to load project details or regions.';
                showErrorToast(getApiErrorMessage(err, defaultMsg));
                setError(getApiErrorMessage(err, defaultMsg));
                setProjectRegions([]); // Limpiar en caso de error
            } finally {
                setBreadcrumbLoading(false);
            }
        };
        
        if (projectId && promptId && assetKey && versionTag) {
            fetchProjectDetailsAndRegions();
        } else {
            // Si faltan IDs esenciales para los detalles principales, al menos intentar cargar regiones si projectId existe
            // o manejar el error de IDs faltantes de forma más explícita.
            // Por ahora, la lógica de fetchData ya maneja los IDs faltantes para las traducciones.
            // Y el return de la página maneja la falta de `version`.
            // Si solo falta `projectId` para las regiones, se podría poner un error específico.
            if (!projectId) {
                 setError("Project ID is missing, cannot load regions.");
                 setBreadcrumbLoading(false);
            } else {
                // Si otros IDs faltan, la carga principal no se hará.
                // Podríamos optar por no cargar nada y mostrar error, o cargar solo regiones.
                // Por consistencia, esperaremos a que todos los IDs estén para la carga inicial combinada.
                // breadcrumbLoading se pondrá a false si faltan IDs y no se entra al fetch.
                if (!promptId || !assetKey || !versionTag) {
                     setBreadcrumbLoading(false); // Asegurar que no se quede cargando si faltan otros IDs
                }
            }
        }

    }, [projectId, promptId, assetKey, versionTag]);

    const fetchData = useCallback(async () => {
        if (!projectId || !promptId || !assetKey || !versionTag) {
            setError("Missing Project ID, Prompt ID, Asset Key, or Version Tag in URL.");
            setLoading(false);
            setItemsList([]);
            setAvailableLanguagesForNewTranslation([]); // Usar array vacío en lugar de ALL_AVAILABLE_LANGUAGES
            setAllLanguagesTranslated(false);
            return;
        }
        if (!version && !breadcrumbLoading) { 
            setError(`Asset version "${versionTag}" may not exist or failed to load.`);
            setLoading(false);
            setItemsList([]);
            setAvailableLanguagesForNewTranslation([]);
            setAllLanguagesTranslated(false);
            return;
        }
        if (!version) { 
            setLoading(false); 
            return;
        }
        // Asegurarse de que projectRegions se haya cargado antes de calcular los idiomas disponibles
        if (projectRegions.length === 0 && !breadcrumbLoading) { // Si no hay regiones y no está cargando breadcrumbs
            // Esto podría indicar que las regiones no se cargaron o no hay ninguna. 
            // Si es un error, ya debería estar en `error`. Si no hay regiones, es un estado válido.
            // console.log("[fetchData] Project regions not loaded yet or empty.");
        }

        setLoading(true);
        setError(null);
        try {
            const data = await promptAssetService.findTranslations(projectId, promptId, assetKey, versionTag);
            let fetchedTranslations: AssetTranslationUIData[] = [];
            if (Array.isArray(data)) {
                fetchedTranslations = data.filter(t => t.languageCode).map(t => ({ ...t, id: t.languageCode })) as AssetTranslationUIData[];
                setItemsList(fetchedTranslations);
            } else {
                console.error("API response for asset translations is not an array:", data);
                setError('Received invalid data format for translations.');
                setItemsList([]);
            }

            const translatedLanguageCodes = new Set(fetchedTranslations.map(t => t.languageCode));
            // Usar projectRegions como fuente de todos los idiomas posibles
            // Mapear projectRegions a la estructura { code: string, name: string } si es necesario
            // CreateRegionDto ya tiene languageCode y name.
            const allPossibleLanguagesFromProject = projectRegions.map(region => ({ 
                code: region.languageCode, 
                name: region.name 
            }));

            const remainingLanguages = allPossibleLanguagesFromProject.filter(lang => !translatedLanguageCodes.has(lang.code));
            setAvailableLanguagesForNewTranslation(remainingLanguages);
            setAllLanguagesTranslated(remainingLanguages.length === 0 && allPossibleLanguagesFromProject.length > 0);

        } catch (err: unknown) {
            console.error("Error fetching asset translations:", err);
            setError(getApiErrorMessage(err, 'Failed to fetch asset translations.'));
            setItemsList([]);
            setAvailableLanguagesForNewTranslation([]);
            setAllLanguagesTranslated(false);
        } finally {
            setLoading(false);
        }
    }, [projectId, promptId, assetKey, versionTag, version, breadcrumbLoading, projectRegions]); // projectRegions como dependencia

    useEffect(() => {
        if (projectId && promptId && assetKey && versionTag && !breadcrumbLoading && projectRegions.length > 0) { // También esperar a projectRegions
            fetchData();
        } else if (projectId && !breadcrumbLoading && projectRegions.length === 0 && !error) {
            // Si las regiones del proyecto están vacías (y no es por un error de carga previo),
            // podemos considerar que no hay idiomas para traducir.
            setAvailableLanguagesForNewTranslation([]);
            setAllLanguagesTranslated(true); // O false si se quiere mostrar "No regions configured for this project"
            setLoading(false); // Detener la carga si no hay regiones para procesar
        }
    }, [projectId, promptId, assetKey, versionTag, fetchData, breadcrumbLoading, projectRegions, version, error]); 


    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AssetTranslationUIData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (languageCode: string) => {
        if (!projectId || !promptId || !assetKey || !versionTag || !languageCode) {
            showErrorToast("Missing required IDs to delete translation.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the translation for ${languageCode}?`)) {
            setLoading(true); // Podríamos usar un loading específico para la acción de borrado
            try {
                await promptAssetService.removeTranslation(projectId, promptId, assetKey, versionTag, languageCode);
                showSuccessToast("Translation deleted successfully!");
                fetchData(); // Recargar la lista y recalcular idiomas disponibles
            } catch (err: unknown) {
                showErrorToast(getApiErrorMessage(err, 'Failed to delete translation.'));
                // No seteamos setError aquí para no impactar el error general de carga de la página
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (payloadFromForm: CreateAssetTranslationDto | UpdateAssetTranslationDto) => {
        if (!projectId || !promptId || !assetKey || !versionTag) return;

        if (!editingItem && (!version || !(version as any).id)) {
            showErrorToast("Asset Version ID is missing. Cannot create translation.");
            setLoading(false);
            return;
        }

        setLoading(true); // Podríamos usar un loading específico para la acción de guardado
        try {
            let message = "";
            const langCode = editingItem?.languageCode || (payloadFromForm as CreateAssetTranslationDto).languageCode;
            if (!langCode) {
                showErrorToast("Language code is missing.");
                setLoading(false);
                return;
            }

            if (editingItem && editingItem.languageCode) {
                const updatePayload: UpdateAssetTranslationDto = { value: (payloadFromForm as UpdateAssetTranslationDto).value };
                await promptAssetService.updateTranslation(projectId, promptId, assetKey, versionTag, editingItem.languageCode, updatePayload);
                message = `Translation for ${editingItem.languageCode} updated successfully!`;
            } else {
                let createPayloadFromForm = payloadFromForm as CreateAssetTranslationDto;
                if (!createPayloadFromForm.languageCode || !createPayloadFromForm.value) {
                    showErrorToast("Language code and value are required for a new translation.");
                    setLoading(false);
                    return;
                }
                const finalCreatePayload: CreateAssetTranslationDto = {
                    ...createPayloadFromForm,
                    versionId: (version as any).id, 
                };
                await promptAssetService.createTranslation(projectId, promptId, assetKey, versionTag, finalCreatePayload);
                message = `Translation for ${finalCreatePayload.languageCode} created successfully!`;
            }
            setIsModalOpen(false);
            showSuccessToast(message);
            fetchData(); 
        } catch (err: unknown) {
            showErrorToast(getApiErrorMessage(err, 'Failed to save translation.'));
            console.error("Error saving translation:", err);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: Crumb[] = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
    ];
    if (projectId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? projectId : (project?.name || projectId),
            href: `/projects/${projectId}/prompts`
        });
    }
    if (promptId) {
        breadcrumbs.push({
            label: breadcrumbLoading ? promptId : (currentPrompt?.name || promptId),
            href: `/projects/${projectId}/prompts/${promptId}/assets`
        });
    }
    if (assetKey) {
        breadcrumbs.push({
            label: breadcrumbLoading ? assetKey : (asset?.name || asset?.key || assetKey),
            href: `/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/edit` // Asumiendo que esta es la página de edición del asset
        });
    }
    if (versionTag) {
        breadcrumbs.push({
            label: breadcrumbLoading ? `Version ${versionTag}` : (version?.versionTag ? `Version ${version.versionTag}` : `Version ${versionTag}`),
            // TODO: Verificar la ruta correcta para la lista de versiones de un asset si existe
            href: `/projects/${projectId}/prompts/${promptId}/assets/${assetKey}/versions` 
        });
        breadcrumbs.push({ label: "Translations" });
    }


    if (breadcrumbLoading) return <p>Loading page details...</p>;
    
    // Si después de cargar breadcrumbs, falta información esencial (como 'version')
    if (!version && !breadcrumbLoading && !error) {
      // Podría ser que 'version' no exista o la carga inicial de 'version' falló (el error se manejaría en fetchData o aquí)
      // Si 'error' ya tiene un mensaje de la carga de breadcrumbs, ese se mostrará.
      // Si no, podemos poner un mensaje específico o dejar que la lógica de 'fetchData' maneje el error si 'version' es crucial.
      return <p>Asset version details could not be loaded. Please check the URL or try again.</p>;
    }
    
    // Muestra 'loading' si está cargando y no hay items aún (primera carga)
    if (loading && itemsList.length === 0 && !error) return <p>Loading translations for {asset?.name || assetKey} - {version?.versionTag || versionTag}...</p>;


    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="my-6">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                    Translations for <span className="text-indigo-600 dark:text-indigo-400">{asset?.name || assetKey}</span> (Version: <span className="text-indigo-600 dark:text-indigo-400">{version?.versionTag || versionTag}</span>)
                </h2>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Manage translations for this specific asset version.
                    <br />The original text for this version is: "<strong>{version?.value || 'Not available'}</strong>"
                </p>
            </div>

            {!loading && !error && (
                 allLanguagesTranslated ? (
                    <div className="mb-4 p-3 text-center bg-green-100 dark:bg-green-700 border border-green-300 dark:border-green-600 rounded-md">
                        <p className="text-green-700 dark:text-green-200 font-medium">
                            All available languages translated! ✅
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            disabled={loading || availableLanguagesForNewTranslation.length === 0 || !version} // Deshabilitar si no hay idiomas, o cargando, o version no cargada
                        >
                            Add New Translation
                        </button>
                    </div>
                )
            )}

            {error && <p className="text-red-500 py-2 mb-2">Error loading translations: {error}</p>}

            {isModalOpen && version && ( // Solo renderizar el form si 'version' está disponible (necesario para versionText)
                <PromptAssetTranslationForm
                    initialData={editingItem}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)} // Cambiado de onClose a onCancel
                    versionText={version.value || ''} // version.value es el texto original de la versión del asset
                    // Nuevas props para el formulario
                    availableLanguages={availableLanguagesForNewTranslation}
                    isEditing={!!editingItem}
                />
            )}

            {!loading && !error && itemsList.length > 0 && (
                 <PromptAssetTranslationsTable
                    translations={itemsList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading} 
                />
            )}

            {!loading && !error && itemsList.length === 0 && !allLanguagesTranslated && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No translations found for this asset version yet. Add one using the button above.
                </p>
            )}
        </>
    );
};

export default PromptAssetTranslationsPage;

