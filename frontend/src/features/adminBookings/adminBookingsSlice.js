import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminBookingsThunk,
  fetchAdminBookingsStatsThunk,
  fetchAdminBookingThunk,
  createAdminBookingThunk,
  updateAdminBookingThunk,
  deleteAdminBookingThunk,
} from "./adminBookingsThunks";

const DEFAULT_STATS = {
  total_bookings: 0,
  total_pending: 0,
  total_confirmed: 0,
  total_canceled: 0,
  total_completed: 0,
  total_revenue: 0,
};

const initialFilters = {
  search: "",
  status: "",
  car_id: "",
  user_id: "",
  agency_id: "",
  start_date: "",
  end_date: "",
  per_page: 10,
  page: "",
};

const initialState = {
  bookings: [],
  selectedBooking: null,
  stats: DEFAULT_STATS,
  filters: initialFilters,
  pagination: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  saveError: null,
  successMessage: null,
};

const adminBookingsSlice = createSlice({
  name: "adminBookings",
  initialState,
  reducers: {
    setBookingFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetBookingFilters: (state) => {
      state.filters = initialFilters;
    },

    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },

    clearAdminBookingsError: (state) => {
      state.error = null;
      state.saveError = null;
    },

    clearAdminBookingsSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Erreur lors du chargement des réservations.";
      })

      .addCase(fetchAdminBookingsStatsThunk.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })

      .addCase(fetchAdminBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchAdminBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Réservation introuvable.";
      })

      .addCase(createAdminBookingThunk.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(createAdminBookingThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.bookings.unshift(action.payload);
        state.successMessage = "Réservation créée avec succès.";
      })
      .addCase(createAdminBookingThunk.rejected, (state, action) => {
        state.saving = false;
        state.saveError =
          action.payload?.message ||
          "Erreur lors de la création de la réservation.";
      })

      .addCase(updateAdminBookingThunk.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateAdminBookingThunk.fulfilled, (state, action) => {
        state.saving = false;

        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );

        if (index !== -1) {
          state.bookings[index] = action.payload;
        }

        state.selectedBooking = action.payload;
        state.successMessage = "Réservation mise à jour avec succès.";
      })
      .addCase(updateAdminBookingThunk.rejected, (state, action) => {
        state.saving = false;
        state.saveError =
          action.payload?.message ||
          "Erreur lors de la mise à jour de la réservation.";
      })

      .addCase(deleteAdminBookingThunk.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAdminBookingThunk.fulfilled, (state, action) => {
        state.deleting = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
        state.successMessage = "Réservation supprimée avec succès.";
      })
      .addCase(deleteAdminBookingThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload?.message ||
          "Erreur lors de la suppression de la réservation.";
      });
  },
});

export const {
  setBookingFilters,
  resetBookingFilters,
  clearSelectedBooking,
  clearAdminBookingsError,
  clearAdminBookingsSuccessMessage,
} = adminBookingsSlice.actions;



export default adminBookingsSlice.reducer;