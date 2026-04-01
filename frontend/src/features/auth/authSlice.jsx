import { createSlice } from "@reduxjs/toolkit";
import {
  registerThunk,
  loginThunk,
  logoutThunk,
  fetchMeThunk,
  registerAgencyThunk,
} from "./authThunks";

const initialState = {
  user: null,
  role: null, // 🔥 ajouté
  isAuth: false,
  isLoading: false,
  isInitialized: false,
  errors: {},
  globalError: null,
  needsCompletion: false,
  agencyDraft: null,
};

/* ── Helpers ───────────────────────── */
const setPending = (state) => {
  state.isLoading = true;
  state.errors = {};
  state.globalError = null;
};

const setRejected = (state, action) => {
  state.isLoading = false;
  state.errors = action.payload?.errors ?? {};
  state.globalError = action.payload?.message ?? "Une erreur est survenue";
};

const setAuthSuccess = (state, action) => {
  state.isLoading = false;
  state.isAuth = true;
  state.user = action.payload.user;
  state.role = action.payload.role; // 🔥 ajouté
  state.needsCompletion = action.payload.needs_profile_completion ?? false;
};

/* ── Slice ───────────────────────── */
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

    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role ?? null;
    },

    resetAuth: () => initialState,
  },

  extraReducers: (builder) => {
    /* REGISTER */
    builder
      .addCase(registerThunk.pending, setPending)
      .addCase(registerThunk.fulfilled, setAuthSuccess)
      .addCase(registerThunk.rejected, setRejected);

    /* LOGIN */
    builder
      .addCase(loginThunk.pending, setPending)
      .addCase(loginThunk.fulfilled, setAuthSuccess)
      .addCase(loginThunk.rejected, setRejected);

    /* LOGOUT */
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState);

    builder
      .addCase(fetchMeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuth = true;
        state.user = action.payload;
        state.role = action.payload?.role ?? null; // 🔥 ajouté
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuth = false;
        state.user = null;
        state.role = null;
      });

    /* REGISTER AGENCY */
    builder
      .addCase(registerAgencyThunk.pending, setPending)
      .addCase(registerAgencyThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.agencyDraft = null;
      })
      .addCase(registerAgencyThunk.rejected, setRejected);
  },
});

export const {
  clearErrors,
  saveAgencyDraft,
  clearAgencyDraft,
  setUser,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
