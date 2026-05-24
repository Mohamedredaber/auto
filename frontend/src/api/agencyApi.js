import api, { getCsrfToken } from "./index";


export const fetchAgencyPublicProfile = async (agencyId) => {
     await getCsrfToken();
    const response = await api.get(`/public/agency/${agencyId}`);
    return response.data; 
};