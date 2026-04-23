import api, { getCsrfToken } from "./index";


export const fetchAgencyBookings = async () => {
    await getCsrfToken();
    return api.get("/agency/reservations");
};

export const fetchBookingDetails = async (id) => {
    return api.get(`/agency/reservations/${id}`);
};


export const updateBooking = async (id, data) => {
    await getCsrfToken();
    return api.patch(`/agency/reservations/${id}`, data);
};


export const cancelBooking = async (id) => {
    await getCsrfToken();
    return api.post(`/agency/reservations/${id}/cancel`);
};


export const fetchBookingsByStatus = async (status) => {
    return api.get(`/agency/reservations/filter/${status}`);
};


export const fetchBookingStats = async () => {
    return api.get("/agency/reservations/stats/overview");
};

/**
 * Récupère les réservations récentes (par défaut 7 jours si non précisé)
 */
export const fetchRecentBookings = async (days = 7) => {
    return api.get(`/agency/reservations/recent/${days}`);
};