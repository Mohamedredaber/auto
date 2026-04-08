import api, { getCsrfToken } from "./index";
export const fetchAgencyCars = async () => {
    await getCsrfToken();
    return api.get("/agency/cars");
}
export const createCar = async (data) => {
    await getCsrfToken();
    return api.post("/agency/cars", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const updateCar = async (id, data) => {
    await getCsrfToken();
    return api.post(`/agency/cars/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
export const deleteCar = async (id) => {
    await getCsrfToken();
    return api.delete(`/agency/cars/${id}`);
}
export const fetchCar = async (id) => {
    return api.get(`/agency/cars/${id}`);
}
