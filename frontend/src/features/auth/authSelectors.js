/**
 * Auth Selectors
 * Séparation des selectors pour une meilleure maintenabilité
 */

// Sélecteur root du state d'auth
export const selectAuthState = (state) => state.auth;

// Sélecteur de l'utilisateur
export const selectUser = (state) => state.auth.user;

// Sélecteur pour check si authentifé
export const selectIsAuth = (state) => state.auth.isAuthenticated;

// Sélecteur pour le state de chargement
export const selectIsLoading = (state) => state.auth.loading;

// Sélecteur pour vérifier si l'app est initialisée (check initial de l'user)
export const selectIsInitialized = (state) => state.auth.initialized;

// Sélecteur des erreurs de formulaire (field errors)
export const selectErrors = (state) => state.auth.errors;

// Sélecteur de l'erreur globale
export const selectGlobalError = (state) => state.auth.globalError;

// Sélecteur du rôle de l'utilisateur
export const selectRole = (state) => state.auth.user?.role;

// Sélecteur pour vérifier si l'utilisateur doit compléter son profil
export const selectNeedsCompletion = (state) =>
  state.auth.user?.needsCompletion || false;

// Sélecteur composite pour infos utilisateur complètes
export const selectUserInfo = (state) => ({
  user: state.auth.user,
  role: state.auth.user?.role,
  isAuth: state.auth.isAuthenticated,
  needsCompletion: state.auth.user?.needsCompletion || false,
});
