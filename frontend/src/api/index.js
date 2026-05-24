import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

/**
 * 🔐 Récupère le CSRF token depuis Sanctum
 * Utilise la même instance axios pour partager les cookies
 */
export const getCsrfToken = async () => {
  try {
    // Utilise axios directement (sans basePath) car on passe l'URL complète
    await axios.get("/sanctum/csrf-cookie", {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
  } catch (error) {
    // Le CSRF endpoint peut échouer, mais le token peut quand même être présent
    // dans les headers de réponse (Set-Cookie)
    console.warn("CSRF token fetch warning:", error.message);
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPath = window.location.pathname.includes("/login");
      const isMeRequest = error.config.url.includes("/auth/me");

      if (!isLoginPath && !isMeRequest) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
