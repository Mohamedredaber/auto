export const selectAdminBookings = (state) =>
  state.adminBookings.bookings || [];

export const selectAdminBookingsStats = (state) =>
  state.adminBookings.stats ||  {
  total_bookings: 0,
  total_pending: 0,
  total_confirmed: 0,
  total_canceled: 0,
  total_completed: 0,
  total_revenue: 0,
};
export const selectAdminBooking = (state) => state.adminBookings.selectedBooking;
export const selectAdminBookingsFilters = (state) => state.adminBookings.filters;
export const selectAdminBookingsPagination = (state) =>
  state.adminBookings.pagination;
export const selectAdminBookingsLoading = (state) => state.adminBookings.loading;
export const selectAdminBookingsSaving = (state) => state.adminBookings.saving;
export const selectAdminBookingsDeleting = (state) =>
  state.adminBookings.deleting;
export const selectAdminBookingsError = (state) => state.adminBookings.error;
export const selectAdminBookingsSaveError = (state) =>
  state.adminBookings.saveError;
export const selectAdminBookingsSuccessMessage = (state) =>
  state.adminBookings.successMessage;