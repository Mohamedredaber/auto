import api from "./index";

export const getCars = (params) => {
  console.log("📡 GET /catalog with params:", params);
  return api.get("/catalog", { params });
};

export const getCarById = (id) => {
  console.log(`📡 GET /catalog/${id}`);
  return api.get(`/catalog/${id}`);
};
