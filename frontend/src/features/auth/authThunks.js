import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, me, completeAgencyProfile } from "../../api/auth";

/**
 * Normalise la réponse API en un objet AuthPayload cohérent.
 * Utilisé par login et register pour garantir une structure uniforme
 * et éviter que setAuthSuccess() reçoive des shapes différentes.
 *
 * @param {object} data - data brute de l'API ({ user, needs_profile_completion, ... })
 * @returns {{ user: object, needs_profile_completion: boolean }}
 */
const normalizeAuthPayload = (data) => ({
  user:                     data.user ?? null,
  needs_profile_completion: data.needs_profile_completion ?? false,
})

// ── LOGIN ──────────────────────────────────────────────────────────────────
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await login(credentials)
      return normalizeAuthPayload(data.data) // API : { success, data: { user, ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message })
    }
  }
)

// ── REGISTER ───────────────────────────────────────────────────────────────
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userInfo, { rejectWithValue }) => {
    try {
      const { data } = await register(userInfo)
      return normalizeAuthPayload(data.data) // API : { success, data: { user, ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message })
    }
  }
)

// ── FETCH AUTHENTICATED USER (bootstrap) ──────────────────────────────────
// Retourne directement l'objet user (pas de needs_profile_completion).
// Le slice gère cette différence explicitement dans fetchMeThunk.fulfilled.
export const fetchMeThunk = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await me()
      return data.data // API : { success, data: user }
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message })
    }
  }
)

// ── LOGOUT ─────────────────────────────────────────────────────────────────
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout()
      return {}
    } catch (error) {
      // On propage l'erreur mais le slice reset le state dans tous les cas
      return rejectWithValue(error.response?.data ?? { message: error.message })
    }
  }
)

// ── COMPLETE AGENCY PROFILE (STEP 2) ──────────────────────────────────────
// Appelé après registerThunk — l'user est déjà authentifié via Sanctum.
// Reçoit un FormData (multipart/form-data) avec uniquement les données agence.
export const registerAgencyThunk = createAsyncThunk(
  "auth/registerAgency",
  async (agencyData, { rejectWithValue }) => {
    try {
      const { data } = await completeAgencyProfile(agencyData)
      return data.data // API : { success, data: { user } }
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message })
    }
  }
)