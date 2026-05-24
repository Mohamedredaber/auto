import api, { getCsrfToken } from "../index";

export const getstatisticsagency = async () => {    
    await getCsrfToken();
    return api.get("/agency/statistics");
};
