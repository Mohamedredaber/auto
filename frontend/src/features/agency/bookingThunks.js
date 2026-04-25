import { createAsyncThunk } from "@reduxjs/toolkit";
import * as agencyApi from "../../api/agency/bookingagencyApi";

export const getAgencyBookings = createAsyncThunk(
    "agencyBooking/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const response = await agencyApi.fetchAgencyBookings(params);
            return response.data; // Retourne { data: [...], meta: {...} }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getBookingStats = createAsyncThunk(
    "agencyBooking/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await agencyApi.fetchBookingStats();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    "agencyBooking/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await agencyApi.updateBooking(id, { status });
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const cancelAgencyBooking = createAsyncThunk(
    "agencyBooking/cancel",
    async (id, { rejectWithValue }) => {
        try {
            const response = await agencyApi.cancelBooking(id);
            return { id, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);