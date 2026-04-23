import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAgencyBookings,
  fetchBookingDetails,
  updateBooking,
  cancelBooking,
  fetchBookingsByStatus,
  fetchBookingStats,
  fetchRecentBookings,
} from "../../api/bookingagencyApi";

// Fetch all agency bookings
export const fetchAgencyBookingsThunk = createAsyncThunk(
  "agencyBooking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchAgencyBookings();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

// Fetch single booking details
export const fetchBookingDetailsThunk = createAsyncThunk(
  "agencyBooking/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await fetchBookingDetails(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

// Update booking status
export const updateBookingThunk = createAsyncThunk(
  "agencyBooking/update",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await updateBooking(id, { status });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

// Cancel a booking
export const cancelBookingThunk = createAsyncThunk(
  "agencyBooking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await cancelBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

// Filter bookings by status
export const filterBookingsByStatusThunk = createAsyncThunk(
  "agencyBooking/filterByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const { data } = await fetchBookingsByStatus(status);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

// Fetch booking statistics
export const fetchBookingStatsThunk = createAsyncThunk(
  "agencyBooking/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchBookingStats();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

// Fetch recent bookings
export const fetchRecentBookingsThunk = createAsyncThunk(
  "agencyBooking/fetchRecent",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await fetchRecentBookings(days);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);
