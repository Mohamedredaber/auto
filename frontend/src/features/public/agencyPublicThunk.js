import { createAsyncThunk } from '@reduxjs/toolkit';
import {fetchAgencyPublicProfile }from '../../api/agencyApi';

// الـ Thunk باش نجيبو البروفايل
export const getAgencyProfile = createAsyncThunk(
    'agencyPublic/getProfile',
    async (agencyId, { rejectWithValue }) => {
        try {
            const response = await fetchAgencyPublicProfile(agencyId);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
        }
    }
);