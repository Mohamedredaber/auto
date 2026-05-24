import api, { getCsrfToken } from "../index";

export const DashboardData = async () => {
    await getCsrfToken();
    return api.get("/agency/dashboard");
};