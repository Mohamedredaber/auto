import api, { getCsrfToken } from "./index";

/**
 * 📝 Register client
 */
export const register = async (data) => {
  await getCsrfToken();
  return api.post("/auth/register", data);
};

/**
 * 🏢 Register agency (multipart)
 */
export const registerAgency = async (data) => {
  await getCsrfToken();
  return api.post("/auth/register/agency", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 🔐 Login
 */
export const login = async (data) => {
  await getCsrfToken(); // 🔥 obligatoire
  return api.post("/auth/login", data);
};

/**
 * 🚪 Logout
 */
export const logout = async () => {
  await getCsrfToken(); 
  return api.post("/auth/logout");
};


export const me = async () => {
  return api.get("/auth/me");
};