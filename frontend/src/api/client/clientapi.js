import api from "../index";
import { getCsrfToken } from "../index";

/**
 * Récupère toutes les réservations de l'utilisateur connecté
 */
export const getUserBookings = async () => {
  await getCsrfToken();
  return api.get("/client/bookings");
};

/**
 * Récupère les détails d'une réservation
 */
export const getBookingDetails = async (id) => {
  await getCsrfToken();
  return api.get(`/client/bookings/${id}`);
};

export const cancelBooking = async (id) => {
  await getCsrfToken();
  return api.patch(`/client/bookings/${id}/cancel`, {});
};
export const deleteBooking = async (id) => {
  await getCsrfToken();
  console.log(`🔵 Envoi DELETE /api/client/bookings/${id}/destroy`);
  return api.delete(`/client/bookings/${id}/destroy`);
};
export const fetchProfile = async () => {
  await getCsrfToken();
  return api.get("/client/profile");
};

export const updateProfile = async (data) => {
  await getCsrfToken();
  return api.post("/client/profile", data);
};