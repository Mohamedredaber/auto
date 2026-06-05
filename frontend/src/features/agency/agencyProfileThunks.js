import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/index'; // Ton instance axios configurée

// Récupérer le profil
export const fetchAgencyProfile = createAsyncThunk(
    'agencyProfile/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/agency/profile'); // ✅ utilise l'instance avec cookies/CSRF
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Mettre à jour les infos textuelles
export const updateAgencyProfile = createAsyncThunk(
    'agencyProfile/update',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await api.post('/agency/profile/update', profileData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Mettre à jour le logo
export const updateAgencyLogo = createAsyncThunk(
    'agencyProfile/updateLogo',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/agency/profile/logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.logo_url;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);