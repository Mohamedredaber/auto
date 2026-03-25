import api, { getCsrfToken } from "./index";

export const register = async (data) => {
  await getCsrfToken();
  return api.post("/auth/register", data);
};
export const completeAgencyProfile = (data) =>
  api.post("/auth/agency/complete-profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const login = async (data) => {
  await getCsrfToken();
  return api.post("/auth/login", data);
};
export const logout = () => api.post("/auth/logout");
export const me = () => api.get("/auth/me");
