import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserBookings,
  fetchBookingDetails,
  cancelBookingThunk,
  deleteBookingThunk,
} from "./clientThunks";

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  totalBookings: 0,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserBookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          // Réponse simple : tableau direct
          state.bookings = action.payload;
          state.totalBookings = action.payload.length;
        } else if (action.payload.data && Array.isArray(action.payload.data)) {
          // Réponse avec wrapper data
          state.bookings = action.payload.data;
          state.totalBookings = action.payload.data.length;
        } else {
          state.bookings = [];
          state.totalBookings = 0;
        }
      })
      
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookings = [];
        state.totalBookings = 0;
      })

      // fetchBookingDetails
      .addCase(fetchBookingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedBooking = null;
      })
      // cancelBookingThunk
      .addCase(cancelBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        const bookingId = action.meta.arg;
        state.bookings = state.bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "canceled" }
            : booking,
        );
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteBookingThunk
      .addCase(deleteBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        const bookingId = action.meta.arg;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== bookingId,
        );
        state.totalBookings = state.bookings.length;
      })
      .addCase(deleteBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedBooking, clearError } = clientSlice.actions;
export default clientSlice.reducer;
