import api, { getCsrfToken } from "./index";

export const fetchCarDetailsForBooking = async (id) => {
  await getCsrfToken();
  return api.get(`/cars/${id}/booking-details`);
};

export const createBooking = async (data) => {
  await getCsrfToken();
  return api.post("/createbookings", data);
};
