import api, { getCsrfToken } from "./index";

export const fetchAdminBookings = async (params) => {
  await getCsrfToken();
  return api.get("/super-admin/bookings", { params });
};

export const fetchAdminBooking = async (id) => {
  await getCsrfToken();
  return api.get(`/super-admin/bookings/${id}`);
};

export const createAdminBooking = async (bookingData) => {
  await getCsrfToken();
  return api.post("/super-admin/bookings", bookingData);
};

export const updateAdminBooking = async (id, bookingData) => {
  await getCsrfToken();
  return api.put(`/super-admin/bookings/${id}`, bookingData);
};

export const deleteAdminBooking = async (id) => {
  await getCsrfToken();
  return api.delete(`/super-admin/bookings/${id}`);
};

export const fetchAdminBookingsStats = async () => {
  await getCsrfToken();
  return api.get("/super-admin/bookings/stats");
};