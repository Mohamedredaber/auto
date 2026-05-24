// Sélecteur de base pour accéder à la slice
export const selectClientState = (state) => state.client;

// --- Sélecteurs pour la liste des réservations ---

/**
 * Récupère toutes les réservations de l'utilisateur
 * Retourne toujours un tableau
 */
export const selectAllBookings = (state) => {
  const bookings = state.client.bookings;
  return Array.isArray(bookings) ? bookings : [];
};

/**
 * Récupère le nombre total de réservations
 */
export const selectTotalBookings = (state) => state.client.totalBookings;

export const selectBookingsSortedByDate = (state) => {
  const bookings = selectAllBookings(state);
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA;
  });
};

/**
 * Récupère les réservations actives (status = confirmed/active)
 */
export const selectActiveBookings = (state) => {
  return selectAllBookings(state).filter((booking) =>
    ["confirmed", "active", "in-progress"].includes(
      booking.status?.toLowerCase(),
    ),
  );
};

/**
 * Récupère les réservations passées (status = completed)
 */
export const selectPastBookings = (state) => {
  return selectAllBookings(state).filter((booking) =>
    ["completed", "done"].includes(booking.status?.toLowerCase()),
  );
};

/**
 * Récupère les réservations annulées
 */
export const selectCancelledBookings = (state) => {
  return selectAllBookings(state).filter(
    (booking) => booking.status?.toLowerCase() === "canceled",
  );
};

// --- Sélecteurs pour une réservation unique (Détails) ---

/**
 * Récupère la réservation actuellement sélectionnée
 */
export const selectSelectedBooking = (state) => state.client.selectedBooking;

/**
 * Récupère les détails de la voiture de la réservation sélectionnée
 */
export const selectSelectedBookingCarDetails = (state) => {
  const booking = selectSelectedBooking(state);
  return booking?.car_details || null;
};

/**
 * Récupère les détails de l'agence de la réservation sélectionnée
 */
export const selectSelectedBookingAgencyDetails = (state) => {
  const booking = selectSelectedBooking(state);
  return booking?.agency_details || null;
};

// --- Sélecteurs d'état (UI) ---

export const selectClientLoading = (state) => state.client.loading;
export const selectClientError = (state) => state.client.error;

// --- Sélecteurs calculés (Optionnel) ---

/**
 * Vérifie s'il y a des réservations à afficher
 */
export const selectHasBookings = (state) => selectAllBookings(state).length > 0;

/**
 * Vérifie s'il y a des réservations actives
 */
export const selectHasActiveBookings = (state) =>
  selectActiveBookings(state).length > 0;

/**
 * Récupère une réservation par ID
 */
export const selectBookingById = (state, bookingId) => {
  return selectAllBookings(state).find((booking) => booking.id === bookingId);
};

/**
 * Récupère le prix total de toutes les réservations
 */
export const selectTotalSpent = (state) => {
  return selectAllBookings(state).reduce(
    (total, booking) => total + (booking.total_price || 0),
    0,
  );
};

/**
 * Vérifie si le chargement est en cours
 */
export const selectIsLoading = (state) => selectClientLoading(state);

/**
 * Vérifie s'il y a une erreur
 */
export const selectHasError = (state) => !!selectClientError(state);
