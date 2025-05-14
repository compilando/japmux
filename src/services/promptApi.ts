import { LoadPromptStructureDto } from '../types/prompt-structure';
import axiosInstance from './axiosInstance'; // Importar la instancia de Axios configurada
import { AxiosError } from 'axios';

interface LoadStructureResponse {
  success: boolean;
  message?: string;
  errorDetails?: any;
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
    return { success: true, message: response.data.message || 'Estructura cargada exitosamente.', errorDetails: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>; 
    console.error('Error al llamar a la API loadPromptStructure:', axiosError.response?.data || axiosError.message);
    
    let errorMessage = 'Error de red o conexión.';
    let errorDetails: any = null;

    if (axiosError.response) {
      errorDetails = axiosError.response.data;
      errorMessage = errorDetails?.message || axiosError.response.statusText || 'Error desconocido del servidor.';
    } else if (axiosError.request) {
      errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
    } else {
      errorMessage = axiosError.message;
    }

    return { 
        success: false, 
        message: errorMessage, 
        errorDetails: errorDetails || { message: (error as Error).message } 
    };
  }
} 