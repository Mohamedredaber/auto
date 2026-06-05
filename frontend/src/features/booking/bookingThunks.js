import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCarDetailsForBooking, createBooking } from "../../api/bookingApi";

export const createBookingThunk = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Erreur de réservation",
        },
      );
    }
  },
);

export const fetchcarselected = createAsyncThunk(
  "booking/fetchCarSelected",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchCarDetailsForBooking(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
