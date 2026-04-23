import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserBookings, getBookingDetails , deleteBooking ,cancelBooking} from "../../api/clientapi";

export const fetchUserBookings = createAsyncThunk(
  "client/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserBookings();
      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const fetchBookingDetails = createAsyncThunk(
  "client/fetchBookingDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getBookingDetails(id);
      return response.data.data;
    } catch (error) {
      console.error(
        `❌ fetchBookingDetails: Erreur pour id=${id}:`,
        error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const cancelBookingThunk = createAsyncThunk(
    "client/cancelBooking",
    async (id, { rejectWithValue }) => {
        try {
            const response = await cancelBooking(id);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteBookingThunk = createAsyncThunk(
    "client/deleteBooking",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteBooking(id);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);