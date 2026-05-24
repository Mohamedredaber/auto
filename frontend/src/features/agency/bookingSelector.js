const selectBookingState = (state) => state.agencyBooking;

export const selectAllBookings = (state) => selectBookingState(state).bookings;
export const selectBookingPagination = (state) => selectBookingState(state).pagination;
export const selectBookingStats = (state) => selectBookingState(state).stats;
export const selectSingleBooking = (state) => selectBookingState(state).singleBooking;

// États de l'UI
export const selectBookingLoading = (state) => selectBookingState(state).isLoading;
export const selectBookingErrors = (state) => selectBookingState(state).errors;
export const selectSelectedStatus = (state) => selectBookingState(state).selectedStatus;
export const selectIsModalOpen = (state) => selectBookingState(state).isModalOpen;

// Sélecteurs par statut (Filtrage local si besoin, mais le backend est privilégié)
export const selectPendingBookings = (state) => 
    selectAllBookings(state).filter(b => b.status === "pending");

export const selectConfirmedBookings = (state) => 
    selectAllBookings(state).filter(b => b.status === "confirmed");

// Sélecteurs de revenus (Stats)
export const selectTotalRevenue = (state) => selectBookingStats(state)?.total_revenue || 0;
export const selectPendingRevenue = (state) => selectBookingStats(state)?.pending_revenue || 0;

// Sélecteur pour l'affichage de la pagination (ex: "5 sur 1284")
export const selectBookingResultsCount = (state) => ({
    showing: selectAllBookings(state).length,
    total: selectBookingPagination(state).total
});
