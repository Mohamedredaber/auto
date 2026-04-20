export const selectBookingList = (state) => state.booking.list;
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectCarSelected = (state) => state.booking.carselected; // 🔥 Pour ton formulaire
export const selectBookingLoading = (state) => state.booking.isLoading;
export const selectBookingError = (state) => state.booking.error;
export const selectBookingSuccess = (state) => state.booking.success;