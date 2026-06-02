import api, { getCsrfToken } from "./index";

export const fetchAdminCars = async (params) => {
  await getCsrfToken();
  return api.get("/super-admin/cars", { params });
};

export const fetchAdminCarsStats = async () => {
  await getCsrfToken();
  return api.get("/super-admin/cars/stats");
};

export const insertAdminCar = async (carData) => {
  await getCsrfToken();
  return api.post("/super-admin/cars", carData);
};

export const updateAdminCar = async (carId, carData) => {
  await getCsrfToken();
  return api.put(`/super-admin/cars/${carId}`, carData);
};

export const deleteAdminCar = async (carId) => {
  await getCsrfToken();
  return api.delete(`/super-admin/cars/${carId}`);
};

export const fetchAdminCar = async (carId) => {
  await getCsrfToken();
  return api.get(`/super-admin/cars/${carId}`);
};