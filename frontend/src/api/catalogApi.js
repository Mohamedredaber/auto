import api from "./index";
export const getCars = (params) => {
    return api.get('/cars', { params });
}

export const getCarById =   (id) => {
    return api.get(`/cars/${id}`);
}
