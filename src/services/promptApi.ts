import { LoadPromptStructureDto } from '../types/prompt-structure';
import axiosInstance from './axiosInstance'; // Importar la instancia de Axios configurada
import { AxiosError } from 'axios';

interface ErrorDetails {
  message?: string;
  [key: string]: unknown;
}

interface LoadStructureResponse {
  success: boolean;
  message?: string;
  errorDetails?: ErrorDetails;
}

export async function loadPromptStructure(
  projectId: string,
  structure: LoadPromptStructureDto
): Promise<LoadStructureResponse> {
  // axiosInstance.defaults.baseURL es http://localhost:3001 (o lo que esté en NEXT_PUBLIC_API_URL)
  // Las rutas del backend SÍ necesitan /api, así que lo añadimos aquí.
  const urlWithApiPrefix = `/api/projects/${projectId}/prompts/load-structure`;

  try {
    const response = await axiosInstance.post(urlWithApiPrefix, structure);
    return {
      success: true,
      message: response.data && typeof response.data === 'object' && 'message' in response.data
        ? String(response.data.message)
        : 'Estructura cargada exitosamente.',
      errorDetails: response.data as ErrorDetails
    };
  } catch (error) {
    const axiosError = error as AxiosError<unknown>;
    console.error('Error al llamar a la API loadPromptStructure:', axiosError.response?.data || axiosError.message);

    let errorMessage = 'Error de red o conexión.';
    let errorDetails: ErrorDetails = {};

    if (axiosError.response) {
      errorDetails = axiosError.response.data as ErrorDetails || {};
      if (errorDetails && typeof errorDetails === 'object' && 'message' in errorDetails) {
        errorMessage = String(errorDetails.message);
      } else if (axiosError.response.statusText) {
        errorMessage = axiosError.response.statusText;
      } else {
        errorMessage = 'Error desconocido del servidor.';
      }
    } else if (axiosError.request) {
      errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
    } else {
      errorMessage = axiosError.message;
    }

    return {
      success: false,
      message: errorMessage,
      errorDetails: errorDetails || { message: error instanceof Error ? error.message : 'Error desconocido' }
    };
  }
} 