import api, { getCsrfToken } from "../index";

export const AgencyClients = async (params = {}) => {
    await getCsrfToken();
    return api.get("/agency/clients", { params });
};
export const AgencyRecentClients = async () => {
    await getCsrfToken();
    return api.get("/agency/clients/recent");
};
export const AgencyClientStats = async () => {
    await getCsrfToken();
    return api.get("/agency/stats");
}
    