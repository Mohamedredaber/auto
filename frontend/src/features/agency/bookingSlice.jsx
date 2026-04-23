import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAgencyBookingsThunk,
  fetchBookingDetailsThunk,
  updateBookingThunk,
  cancelBookingThunk,
  filterBookingsByStatusThunk,
  fetchBookingStatsThunk,
  fetchRecentBookingsThunk,
} from "./bookingThunks";

const initialState = {
  bookings: [],
  filteredBookings: [],
  singleBooking: null,
  stats: null,
  isLoading: false,
  errors: null,
  selectedStatus: null,
  isModalOpen: false,
};

const bookingSlice = createSlice({
  name: "agencyBooking",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = null;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.singleBooking = null;
      state.errors = null;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL BOOKINGS
      .addCase(fetchAgencyBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(fetchAgencyBookingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data || action.payload;
      })
      .addCase(fetchAgencyBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // FETCH BOOKING DETAILS
      .addCase(fetchBookingDetailsThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(fetchBookingDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleBooking = action.payload;
        state.isModalOpen = true;
      })
      .addCase(fetchBookingDetailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // UPDATE BOOKING
      .addCase(updateBookingThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(updateBookingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Mettre à jour la réservation dans la liste
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.singleBooking = action.payload;
      })
      .addCase(updateBookingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // CANCEL BOOKING
      .addCase(cancelBookingThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Mettre à jour le statut à "canceled"
        const index = state.bookings.findIndex((b) => b.id === action.payload);
        if (index !== -1) {
          state.bookings[index].status = "canceled";
        }
        if (state.singleBooking?.id === action.payload) {
          state.singleBooking.status = "canceled";
        }
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // FILTER BY STATUS
      .addCase(filterBookingsByStatusThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(filterBookingsByStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredBookings = action.payload.data || action.payload;
      })
      .addCase(filterBookingsByStatusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // FETCH STATS
      .addCase(fetchBookingStatsThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(fetchBookingStatsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchBookingStatsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // FETCH RECENT BOOKINGS
      .addCase(fetchRecentBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(fetchRecentBookingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data || action.payload;
      })
      .addCase(fetchRecentBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export const { clearErrors, openModal, closeModal, setSelectedStatus } =
  bookingSlice.actions;
export default bookingSlice.reducer;
