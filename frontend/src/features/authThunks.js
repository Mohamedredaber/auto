import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI , registerAPI , logoutAPI , meAPI } from "./authAPI";
export const login = createAsyncThunk(
    'auth/login',
    async (credentials) => {
        const data = await loginAPI(credentials);
        return data;
    }
);
export const me = createAsyncThunk(
    'auth/me',
    async () => {   
        const data = await meAPI();
        return data;
    }
);


export const register = createAsyncThunk(
    'auth/register',
    async (userInfo) => {
        const data = await registerAPI(userInfo);   
        return data;
    }
);
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await logoutAPI()
    }
);