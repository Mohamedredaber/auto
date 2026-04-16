// Sélecteur de base pour accéder à la slice
export const selectCatalogState = (state) => state.catalog;

// --- Sélecteurs pour la liste des voitures ---

/**
 * Récupère la liste des voitures. 
 * Gère les deux structures : response.data ou response.data.data (pagination)
 */
export const selectAllCars = (state) => {
    const data = state.catalog.cars;
    // Si data est un objet contenant un champ 'data', c'est la structure paginée de Laravel
    return Array.isArray(data) ? data : (data?.data || []);
};

/**
 * Récupère les métadonnées de pagination (current_page, last_page, etc.)
 */
export const selectCatalogPagination = (state) => {
    const data = state.catalog.cars;
    // Si c'est paginé, on renvoie les infos de pagination, sinon null
    return data?.meta || data?.pagination || null;
};

// --- Sélecteurs pour une voiture seule (Détails) ---

export const selectSelectedCar = (state) => state.catalog.selectedCar;

// --- Sélecteurs d'état (UI) ---

export const selectCatalogLoading = (state) => state.catalog.loading;
export const selectCatalogError = (state) => state.catalog.error;

// --- Sélecteurs calculés (Optionnel) ---

/**
 * Vérifie s'il y a des résultats à afficher
 */
export const selectHasCars = (state) => selectAllCars(state).length > 0;