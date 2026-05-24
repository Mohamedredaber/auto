// Sélecteur de base pour accéder à la slice
export const selectCatalogState = (state) => state.catalog;

// --- Sélecteurs pour la liste des voitures ---

/**
 * Récupère la liste des voitures.
 * Retourne toujours un tableau (state.catalog.cars)
 */
export const selectAllCars = (state) => {
  const cars = state.catalog.cars;
  return Array.isArray(cars) ? cars : [];
};

/**
 * Récupère les métadonnées de pagination (current_page, last_page, total, etc.)
 * Format Laravel: { current_page, last_page, total, per_page, ... }
 */
export const selectCatalogPagination = (state) => {
  return state.catalog.pagination || null;
};

// --- Sélecteurs pour une voiture seule (Détails) ---

export const selectSelectedCar = (state ) => state.catalog.selectedCar;

// --- Sélecteurs d'état (UI) ---

export const selectCatalogLoading = (state) => state.catalog.loading;
export const selectCatalogError = (state) => state.catalog.error;

// --- Sélecteurs calculés (Optionnel) ---

/**
 * Vérifie s'il y a des résultats à afficher
 */
export const selectHasCars = (state) => selectAllCars(state).length > 0;


export const selectPaginationInfo = (state) => {
  const pagination = selectCatalogPagination(state);
  if (!pagination) return null;

  return {
    currentPage: pagination.current_page || 1,
    lastPage: pagination.last_page || 1,
    total: pagination.total || 0,
  };
};
