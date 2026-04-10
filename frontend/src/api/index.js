import axios from "axios";

// Instance principale pour toutes les requêtes API
const api = axios.create({
  baseURL: "/api", // ✅ via proxy React
  withCredentials: true, // 🔥 obligatoire pour Sanctum (cookies)
  headers: {
    Accept: "application/json",
  },
});

export const getCsrfToken = () =>
  axios.get("/sanctum/csrf-cookie", {
    withCredentials: true,
  });


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPath = window.location.pathname.includes("/login");
      const isMeRequest = error.config.url.includes("/auth/me"); // Évite la boucle sur /me

      if (!isLoginPath && !isMeRequest) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;