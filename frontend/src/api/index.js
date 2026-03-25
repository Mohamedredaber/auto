import axios from 'axios';

const api = axios.create({
  baseURL: '/api',          // ✅ Garde le proxy (parfait pour le dev)
  withCredentials: true,    // ✅ Indispensable pour les cookies de session Sanctum
  headers: {
    'Accept': 'application/json',
    // ❌ 'Content-Type': 'application/json' est supprimé ici.
    // Axios détectera automatiquement s'il doit envoyer du JSON 
    // ou du Multipart (pour le logo) et ajoutera la "boundary" nécessaire.
  }
});

/**
 * Récupère le cookie CSRF initial de Laravel
 * À appeler avant la première requête de login ou register
 */
export const getCsrfToken = () =>
  axios.get('/sanctum/csrf-cookie', {
    withCredentials: true
  });

/**
 * Intercepteur pour gérer les erreurs globales
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log plus précis pour le debugging en console
    const errorData = error.response?.data || error.message;
    console.error('API Error Details:', errorData);

    // Redirection automatique si la session expire (401 Unauthorized)
    if (error.response?.status === 401) {
      // On évite la redirection en boucle si on est déjà sur /login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;