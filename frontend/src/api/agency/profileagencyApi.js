import api, { getCsrfToken } from "../index";

export const fetchAgencyProfile = async () => {
    await getCsrfToken();
    return api.get("/agency/profile");
}
export const updateAgencyProfile = async (profileData) => {
    await getCsrfToken();
    return api.post("/agency/profile/update", profileData);
}
export const updateAgencyLogo = async (formData) => {
    await getCsrfToken();
    return api.post("/agency/profile/logo", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}