import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAgencyCars, createCar, updateCar, deleteCar, fetchCar } from "../../api/carAPI";
export const fetchAgencyCarsThunk = createAsyncThunk(
    "agency/fetchCars",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await fetchAgencyCars();
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message },
            );
        }   
    }
);  

export const createCarThunk = createAsyncThunk(
    "agency/createCar",
    async (formData, { rejectWithValue }) => {
        try {
            // formData hna khass i-koun fih l-images o l-data
            const { data } = await createCar(formData);
            return data.data; // Kan-raj3o l-car jdid bach n-zidouh f l-state
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

// 2. Update Car Thunk
export const updateCarThunk = createAsyncThunk(
    "agency/updateCar",
    async ({ id, formData }, { rejectWithValue }) => {
        try {

            if (!(formData instanceof FormData)) {
                 // logic pour transformer json en formdata si besoin
            }
            
            const { data } = await updateCar(id, formData);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

export const deleteCarThunk = createAsyncThunk(
    "agency/deleteCar",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCar(id);
            return id; // Kan-raj3o l-ID bach n-7iyedouh men l-state (Filter)
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

export const fetchSingleCarThunk = createAsyncThunk(
    "agency/fetchSingleCar",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await fetchCar(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);