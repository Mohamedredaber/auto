import apiClient from "../services/apiClient";
export const loginAPI = async (credentials) => {
    try {   
        const response = await apiClient.post('/auth/login', credentials);
        return response.data; 
    } catch (error) {       
        console.error('Login failed:', error);
        throw error;
    }
};

export const logoutAPI = async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};
export const meAPI = async () => {
    try {
        const response = await apiClient.get('/auth/me');               
        return response.data;
    } catch (error) {
        console.error('Fetching user info failed:', error);
        throw error;
    }   
};
export const registerAPI = async (userInfo) => {
    try {
        const response = await apiClient.post('/auth/register', userInfo);  
        return response.data;
    }
    catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }   
};
