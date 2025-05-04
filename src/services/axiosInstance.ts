// src/services/axiosInstance.ts
import axios from 'axios';

// Obtén la URL base de la API desde las variables de entorno
// Asegúrate de tener NEXT_PUBLIC_API_BASE_URL definida en tu .env.local o similar
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'; // Fallback a localhost

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Solicitud (Ejemplo: Añadir Token de Autenticación) ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Intenta obtener el token (ej: desde localStorage, sessionStorage, o un estado global)
    // ¡IMPORTANTE! El acceso directo a localStorage no funciona en Server Components
    // Si necesitas autenticación, asegúrate de que el token se maneje de forma segura
    // y accesible tanto en cliente como en servidor si es necesario.
    // Para Client Components puros, localStorage puede funcionar:
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor: Adding auth token to request headers');
    } else {
      console.log('Interceptor: No auth token found');
    }
    return config;
  },
  (error) => {
    console.error('Interceptor Request Error:', error);
    return Promise.reject(error);
  }
);

// --- Interceptor de Respuesta (Ejemplo: Manejo Básico de Errores) ---
axiosInstance.interceptors.response.use(
  (response) => {
    // Cualquier código de estado dentro del rango de 2xx causa que esta función se active
    // No hagas nada, solo devuelve la respuesta
    return response;
  },
  (error) => {
    // Cualquier código de estado fuera del rango de 2xx causa que esta función se active
    console.error('Interceptor Response Error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      // Ejemplo: Redirigir al login si no autorizado
      console.log('Interceptor: Unauthorized (401). Redirecting might be needed.');
      // Podrías añadir lógica para limpiar el token y redirigir:
      // localStorage.removeItem('authToken');
      // window.location.href = '/signin';
    }

    // Importante: Devuelve el error rechazado para que los `catch` individuales puedan manejarlo
    return Promise.reject(error);
  }
);


export default axiosInstance;
