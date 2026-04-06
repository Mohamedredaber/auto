/**
 * Auth Selectors
 * Les noms de champs correspondent exactement à l'initialState de authSlice.js
 *
 * initialState = {
 *   user, isAuth, isLoading, isInitialized,
 * }
 */
// ── State racine ──────────────────────────────────────────────────────────
export const selectAuthState = (state) => state.auth

export const selectUser = (state) => state.auth.user
export const selectRole = (state) => state.auth.role ?? state.auth.user?.role ?? null

export const selectIsAuth = (state) => state.auth.isAuth

export const selectIsLoading = (state) => state.auth.isLoading

export const selectIsInitialized = (state) => state.auth.isInitialized
export const selectErrors      = (state) => state.auth.errors
export const selectGlobalError = (state) => state.auth.globalError
export const selectUserInfo = (state) => ({
  user:            state.auth.user,
  role:            state.auth.role ?? state.auth.user?.role ?? null,
  isAuth:          state.auth.isAuth,
})