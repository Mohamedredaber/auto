export const selectAgencyData = (state) => state.agencyProfile.data;
export const selectAgencyLoading = (state) => state.agencyProfile.loading;
export const selectAgencyError = (state) => state.agencyProfile.error;
export const selectUpdateSuccess = (state) => state.agencyProfile.updateSuccess;

// Sélecteur mémoïsé pour les réseaux sociaux (évite les re-renders inutiles)
export const selectSocialAccounts = (state) => state.agencyProfile.data?.accounts_social || {};