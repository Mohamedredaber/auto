import api from "./index";

export const getCars = (params) => {
  return api.get("/catalog", { params });
};

export const getCarById = (id) => {
  return api.get(`/catalog/${id}`);
};
