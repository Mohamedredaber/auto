 import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchProfile,
    updateProfile,
} from "../../api/client/clientapi";

export const fetchUserProfile = createAsyncThunk(
    "client/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchProfile();

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }

);
export const updateUserProfile = createAsyncThunk(
    "client/updateUserProfile",
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateProfile(data);
            return response.data.data;  // ✅ Retourne juste le profil
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);