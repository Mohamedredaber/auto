import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, me, registerAgency } from "../../api/auth";

/**
 * 🔧 Normalise un UserResource (retourné par /me ou /register)
 * La réponse de `me()` renvoie directement l'objet user (UserResource)
 */
const normalizeUser = (user) => ({
  user: user ?? null,
  role: user?.role ?? null,
});

/* ── LOGIN ───────────────────────────────────────── */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // 1. Login — crée la session côté serveur
      await login(credentials);

      // 2. Récupérer l'utilisateur authentifié via /me
      const { data } = await me();

      // data.data = UserResource  { id, first_name, ..., role }
      return normalizeUser(data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

/* ── REGISTER CLIENT ─────────────────────────────── */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userInfo, { rejectWithValue }) => {
    try {
      // 1. Créer le compte — crée aussi la session (auth()->login($user))
      await register(userInfo);

      // 2. Récupérer l'utilisateur via /me (session déjà active)
      const { data } = await me();

      return normalizeUser(data.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

/* ── FETCH ME (bootstrap au démarrage) ──────────── */
export const fetchMeThunk = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await me();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

/* ── LOGOUT ─────────────────────────────────────── */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return;
    } catch (error) {
      // Même en cas d'erreur réseau, on considère le logout réussi côté client
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

/* ── REGISTER AGENCY ────────────────────────────── */
export const registerAgencyThunk = createAsyncThunk(
  "auth/registerAgency",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await registerAgency(formData);

      // L'endpoint retourne { success, data: { user: UserResource, agency: AgencyResource } }
      const payload = data.data;
      return normalizeUser(payload.user ?? payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);
