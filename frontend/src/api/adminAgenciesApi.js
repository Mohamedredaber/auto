import api, { getCsrfToken } from "./index";

export const fetchAdminAgencies = async (params) => {
  await getCsrfToken();
  return api.get("/super-admin/agencies", { params });
};

export const fetchAdminAgency = async (id) => {
  await getCsrfToken();
  return api.get(`/super-admin/agencies/${id}`);
};

export const fetchAdminAgenciesStats = async () => {
  await getCsrfToken();
  return api.get("/super-admin/agencies/stats");
};

export const fetchAdminAgenciesCities = async () => {
  await getCsrfToken();
  return api.get("/super-admin/agencies/cities");
};

export const deleteAdminAgency = async (id) => {
  await getCsrfToken();
  return api.delete(`/super-admin/agencies/${id}`);
};

export const createAdminAgency = async (data) => {
  await getCsrfToken();
  return api.post("/super-admin/agencies", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateAdminAgency = async (id, data) => {
  await getCsrfToken();
  if (data instanceof FormData) {
    data.append("_method", "PUT");
    return api.post(`/super-admin/agencies/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return api.put(`/super-admin/agencies/${id}`, data);
};
