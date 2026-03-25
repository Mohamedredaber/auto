/**
 * Auth Selectors
 * Les noms de champs correspondent exactement à l'initialState de authSlice.js
 *
 * initialState = {
 *   user, isAuth, isLoading, isInitialized,
 *   errors, globalError, needsCompletion, agencyDraft
 * }
 */

// ── State racine ──────────────────────────────────────────────────────────
export const selectAuthState = (state) => state.auth

// ── User ──────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user
export const selectRole = (state) => state.auth.user?.role ?? null

// ── Session ───────────────────────────────────────────────────────────────
// ✅ FIX : isAuthenticated → isAuth        (nom dans authSlice)
export const selectIsAuth = (state) => state.auth.isAuth

// ✅ FIX : loading → isLoading             (nom dans authSlice)
export const selectIsLoading = (state) => state.auth.isLoading

// ✅ FIX : initialized → isInitialized     (nom dans authSlice)
export const selectIsInitialized = (state) => state.auth.isInitialized

// ── Erreurs ───────────────────────────────────────────────────────────────
export const selectErrors      = (state) => state.auth.errors
export const selectGlobalError = (state) => state.auth.globalError

// ── Profil agence ─────────────────────────────────────────────────────────
// ✅ FIX : needsCompletion est dans le root du state, PAS dans user
export const selectNeedsCompletion = (state) => state.auth.needsCompletion

// ✅ Ajouté — utilisé par ViewAgence2 pour lire le brouillon du step 1
export const selectAgencyDraft = (state) => state.auth.agencyDraft

// ── Sélecteur composite ───────────────────────────────────────────────────
export const selectUserInfo = (state) => ({
  user:            state.auth.user,
  role:            state.auth.user?.role ?? null,
  isAuth:          state.auth.isAuth,          // ✅ FIX
  needsCompletion: state.auth.needsCompletion, // ✅ FIX — root, pas user
})