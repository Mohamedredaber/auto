import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdminBookings,
  fetchAdminBookingsStats,
    fetchAdminBooking,
    createAdminBooking,
    updateAdminBooking,
    deleteAdminBooking,
} from "../../api/adminBookingsApi";

export const fetchAdminBookingsThunk = createAsyncThunk(
  "adminBookings/fetchBookings",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminBookings(params);
      return data;
    }
    catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
    },
);

export const fetchAdminBookingThunk = createAsyncThunk(
    "adminBookings/fetchBooking",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await fetchAdminBooking(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message },
            );
        }
    },
);

export const createAdminBookingThunk = createAsyncThunk(
    "adminBookings/createBooking",
    async (bookingData, { rejectWithValue }) => {
        try {            const { data } = await createAdminBooking(bookingData);
            return data.data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message },
            );
        }
    },
);

export const updateAdminBookingThunk = createAsyncThunk(
    "adminBookings/updateBooking",
    async ({ id, bookingData }, { rejectWithValue }) => {
        try {            const { data } = await updateAdminBooking(id, bookingData);
            return data.data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message },
            );
        }
        
    },
);

export const deleteAdminBookingThunk = createAsyncThunk(
    "adminBookings/deleteBooking",
    async (id, { rejectWithValue }) => {
        try {            await deleteAdminBooking(id);
            return id;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message },
            );
        }
    },
);

export const fetchAdminBookingsStatsThunk = createAsyncThunk(
  "adminBookings/fetchStats",
  async (_, { rejectWithValue }) => {
    try {      const { data } = await fetchAdminBookingsStats();
  
      return data;
    }
        catch (error) {      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
    },
);