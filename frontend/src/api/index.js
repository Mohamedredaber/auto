import axios from "axios";

// Instance principale pour toutes les requêtes API
const api = axios.create({
  baseURL: "/api", // ✅ via proxy React
  withCredentials: true, // 🔥 obligatoire pour Sanctum (cookies)
  headers: {
    Accept: "application/json",
  },
});

/**
 * 🔐 Récupérer le cookie CSRF (Sanctum)
 */
export const getCsrfToken = () =>
  axios.get("/sanctum/csrf-cookie", {
    withCredentials: true,
  });

/**
 * 🌐 Intercepteur global (gestion erreurs + session expirée)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data || error.message;
    console.error("API Error:", errorData);

    // 🔥 Si session expirée → redirection login
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;