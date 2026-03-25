import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, me, completeAgencyProfile } from "../../api/auth";

// ── LOGIN ──
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      // Toujours retourner un objet sérialisable (JSON simple)
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

// ── REGISTER ──
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userInfo, { rejectWithValue }) => {
    try {
      const response = await register(userInfo);
      return response.data; // { user, access_token, needs_profile_completion }
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

// ── FETCH AUTHENTICATED USER ──
export const fetchMeThunk = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await me();
      return response.data; // retourne le user et agence
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

// ── LOGOUT ──
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return {}; // Pas besoin de données, juste reset du store
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

// ── COMPLETE AGENCY PROFILE (STEP 2) ──
export const registerAgencyThunk = createAsyncThunk(
  "auth/registerAgency",
  async (agencyData, { rejectWithValue }) => {
    try {
      const response = await completeAgencyProfile(agencyData);
      // Retourner uniquement les données sérialisables
      return response.data.data; // { user, agency }
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);