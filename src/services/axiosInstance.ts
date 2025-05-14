// src/services/axiosInstance.ts
import axios from 'axios';

// Usa la variable de entorno correcta: NEXT_PUBLIC_API_URL
// Y asegúrate que el fallback sea solo la URL base del backend, sin /api si el backend no lo necesita en su raíz.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Asumiendo backend en 3001 sin /api en su base

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Solicitud (Ejemplo: Añadir Token de Autenticación) ---
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('[Interceptor Request axiosInstance] Running for URL:', config.url); // Log distintivo
    let token: string | null = null;
    const AUTH_TOKEN_KEY = 'authToken'; // Definir la clave para consistencia

    if (typeof window !== 'undefined') {
      token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        console.log('[Interceptor Request axiosInstance] Token found in localStorage.');
      } else {
        token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          console.log('[Interceptor Request axiosInstance] Token found in sessionStorage.');
        } else {
          console.log('[Interceptor Request axiosInstance] Token not found in localStorage or sessionStorage.');
        }
      }
    } else {
      console.log('[Interceptor Request axiosInstance] Cannot access storage (not window).');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Interceptor Request axiosInstance] Authorization header SET with token.');
    } else {
      console.log('[Interceptor Request axiosInstance] Authorization header NOT set (no token found).');
    }
    // Si la baseURL no incluye /api, y las rutas de API sí lo necesitan, 
    // podrías prefijar config.url aquí si no se hace en cada llamada de servicio.
    // Ejemplo: if (config.url && !config.url.startsWith('/api')) {
    //   config.url = '/api' + config.url;
    // }
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
