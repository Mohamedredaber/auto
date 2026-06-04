// src/api/adminUserApi.js

import api, { getCsrfToken } from "./index";

export const fetchAdminUsers = async (params = {}) => {
  await getCsrfToken();

  return api.get("/super-admin/users", {
    params,
  });
};

export const fetchAdminUser = async (userId) => {
  await getCsrfToken();

  return api.get(`/super-admin/users/${userId}`);
};

export const createAdminUser = async (userData) => {
  await getCsrfToken();

  return api.post("/super-admin/users", userData);
};

export const updateAdminUser = async (userId, userData) => {
  await getCsrfToken();

  return api.put(`/super-admin/users/${userId}`, userData);
};

export const deleteAdminUser = async (userId) => {
  await getCsrfToken();

  return api.delete(`/super-admin/users/${userId}`);
};

export const fetchAdminUsersStats = async () => {
  await getCsrfToken();
    return api.get("/super-admin/users/stats");
};