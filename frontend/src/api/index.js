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


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si c'est une erreur 401 (Unauthorized)
    if (error.response?.status === 401) {
      const isLoginPath = window.location.pathname.includes("/login");
      const isLogoutRequest = error.config.url.includes("/logout");

      if (!isLoginPath && !isLogoutRequest) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;