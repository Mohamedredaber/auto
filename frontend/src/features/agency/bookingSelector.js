// Sélecteur de base pour récupérer la branche 'agencyBooking' du state
const selectBookingState = (state) => state.agencyBooking;

// Sélecteurs de données
export const selectAllBookings = (state) => selectBookingState(state).bookings;

export const selectFilteredBookings = (state) =>
  selectBookingState(state).filteredBookings;

export const selectSingleBooking = (state) =>
  selectBookingState(state).singleBooking;

export const selectBookingStats = (state) => selectBookingState(state).stats;

export const selectBookingLoading = (state) =>
  selectBookingState(state).isLoading;

export const selectBookingErrors = (state) => selectBookingState(state).errors;

export const selectSelectedStatus = (state) =>
  selectBookingState(state).selectedStatus;

// Sélecteurs de l'UI (Affichage conditionnel)
export const selectIsModalOpen = (state) =>
  selectBookingState(state).isModalOpen;

// Sélecteurs dérivés / Mémoïsés
export const selectBookingById = (state, bookingId) =>
  selectAllBookings(state).find((booking) => booking.id === bookingId);

export const selectBookingsByStatus = (state, status) =>
  selectAllBookings(state).filter((booking) => booking.status === status);

export const selectPendingBookings = (state) =>
  selectBookingsByStatus(state, "pending");

export const selectConfirmedBookings = (state) =>
  selectBookingsByStatus(state, "confirmed");

export const selectCanceledBookings = (state) =>
  selectBookingsByStatus(state, "canceled");

export const selectCompletedBookings = (state) =>
  selectBookingsByStatus(state, "completed");

export const selectBookingCount = (state) => selectAllBookings(state).length;

export const selectTotalRevenue = (state) =>
  selectBookingStats(state)?.total_revenue || 0;

export const selectPendingRevenue = (state) =>
  selectBookingStats(state)?.pending_revenue || 0;
