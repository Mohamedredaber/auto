import {createAsyncThunk} from '@reduxjs/toolkit';
import { getCars, getCarById } from '../../api/catalogApi';

export const fetchCars = createAsyncThunk(
    'catalog/fetchCars',
    async (params, { rejectWithValue }) => {
        try {
            const response = await getCars(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCarById = createAsyncThunk(
    'catalog/fetchCarById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getCarById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);

            
        }

    }
);