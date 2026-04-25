import api, { getCsrfToken } from "../index";

// AJOUT : On accepte un objet 'params' pour le filtrage (status, search, date, page)
export const fetchAgencyBookings = async (params = {}) => {
    await getCsrfToken();
    // Axios transformera automatiquement l'objet params en ?status=...&search=...
    return api.get("/agency/reservations", { params });
};

export const fetchBookingDetails = async (id) => {
    await getCsrfToken();
    return api.get(`/agency/reservations/${id}`);
};

export const updateBooking = async (id, data) => {
    await getCsrfToken();
    // data contiendra { status: 'confirmed' } par exemple
    return api.patch(`/agency/reservations/${id}`, data);
};

export const cancelBooking = async (id) => {
    await getCsrfToken();
    return api.post(`/agency/reservations/${id}/cancel`);
};

export const fetchBookingStats = async () => {
    await getCsrfToken();
    return api.get("/agency/reservations/stats/overview");
};

export const fetchRecentBookings = async (days = 7) => {
    await getCsrfToken();
    return api.get(`/agency/reservations/recent/${days}`);
};