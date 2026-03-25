import { createSlice } from "@reduxjs/toolkit";

import {
  registerThunk,
  loginThunk,
  logoutThunk,
  fetchMeThunk,
  registerAgencyThunk,
} from "./authThunks";

/* ══════════════════════════════════════════
   INITIAL STATE
══════════════════════════════════════════ */
const initialState = {
  user: null,
  isAuth: false,
  isLoading: false,
  isInitialized: false,
  errors: {},
  globalError: null,
  needsCompletion: false,
  agencyDraft: null,
};

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const pendingState = (state) => {
  state.isLoading = true;
  state.errors = {};
  state.globalError = null;
};

const rejectedState = (state, action) => {
  state.isLoading = false;
  state.errors = action.payload?.errors ?? {};
  state.globalError = action.payload?.message ?? "Une erreur est survenue";
};

const authSuccess = (state, action) => {
  state.isLoading = false;
  state.isAuth = true;
  state.user = action.payload.user;
  state.needsCompletion = action.payload.needs_profile_completion ?? false;
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearErrors: (state) => {
      state.errors = {};
      state.globalError = null;
    },
    saveAgencyDraft: (state, action) => {
      state.agencyDraft = action.payload;
    },
    clearAgencyDraft: (state) => {
      state.agencyDraft = null;
    },

    resetAuth: () => initialState,

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    /* ── REGISTER ── */
    builder
      .addCase(registerThunk.pending, pendingState)
      .addCase(registerThunk.fulfilled, authSuccess)
      .addCase(registerThunk.rejected, rejectedState);

    /* ── LOGIN ── */
    builder
      .addCase(loginThunk.pending, pendingState)
      .addCase(loginThunk.fulfilled, authSuccess)
      .addCase(loginThunk.rejected, rejectedState);

    /* ── LOGOUT ── */
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => {
        // حتى إلا فشل — نمسحو locally
        return initialState;
      });

    /* ── FETCH ME ── */
    builder
      .addCase(fetchMeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        state.isInitialized = true;
      });

    /* ── COMPLETE PROFILE ── */
    builder
      .addCase(registerAgencyThunk.pending, pendingState)
      .addCase(registerAgencyThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.needsCompletion = false;
      })
      .addCase(registerAgencyThunk.rejected, rejectedState);
  },
});

export const { clearErrors, resetAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
