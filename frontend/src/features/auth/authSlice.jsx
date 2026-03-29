import { createSlice } from "@reduxjs/toolkit";
import {
  registerThunk,
  loginThunk,
  logoutThunk,
  fetchMeThunk,
  registerAgencyThunk,
} from "./authThunks";

/* ══════════════════════════════════════════════════════════════════
   TYPES (documentation interne)

   AuthState {
     user              : object | null   — utilisateur connecté
     isAuth            : boolean         — session active
     isLoading         : boolean         — requête en cours
     isInitialized     : boolean         — bootstrap terminé (fetchMe appelé)
     errors            : object          — erreurs de champ { field: [message] }
     globalError       : string | null   — message d'erreur global
     needsCompletion   : boolean         — profil agence à compléter (step 2)
     agencyDraft       : object | null   — données step 1 agence (prenom, nom, email...)
   }
══════════════════════════════════════════════════════════════════ */

const initialState = {
  user:            null,
  isAuth:          false,
  isLoading:       false,
  isInitialized:   false,
  errors:          {},
  globalError:     null,
}

/* ── Helpers de mutation ──────────────────────────────────────────── */

/** Appelé sur le pending de toute requête standard (login, register, agency) */
const setPending = (state) => {
  state.isLoading  = true
  state.errors     = {}
  state.globalError = null
}

/** Appelé sur le rejected de toute requête standard */
const setRejected = (state, action) => {
  state.isLoading   = false
  state.errors      = action.payload?.errors ?? {}
  state.globalError = action.payload?.message ?? "Une erreur est survenue"
}

/**
 * Appelé sur le fulfilled de login et register.
 * Attend un payload normalisé : { user, needs_profile_completion }
 * Garanti par normalizeAuthPayload() dans authThunks.js
 */
const setAuthSuccess = (state, action) => {
  state.isLoading        = false
  state.isAuth           = true
  state.user             = action.payload.user
  state.needsCompletion  = action.payload.needs_profile_completion ?? false
}

/* ══════════════════════════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════════════════════════ */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /** Efface les erreurs affichées dans les formulaires */
    clearErrors: (state) => {
      state.errors      = {}
      state.globalError = null
    },

    /**
     * Sauvegarde temporaire des données du formulaire agence step 1.
     * Permet à ViewAgence2 de les récupérer via selectAgencyDraft.
     */
    saveAgencyDraft: (state, action) => {
      state.agencyDraft = action.payload
    },

    /** Supprime le brouillon agence après soumission réussie ou abandon */
    clearAgencyDraft: (state) => {
      state.agencyDraft = null
    },

    /**
     * Mise à jour manuelle de l'utilisateur.
     * Ex : après édition de profil sans thunk dédié.
     */
    setUser: (state, action) => {
      state.user = action.payload
    },

    /** Remet le store auth à son état initial (usage interne ou tests) */
    resetAuth: () => initialState,
  },

  extraReducers: (builder) => {
    /* ── REGISTER ──────────────────────────────────────────────────── */
    builder
      .addCase(registerThunk.pending,   setPending)
      .addCase(registerThunk.fulfilled, setAuthSuccess)
      .addCase(registerThunk.rejected,  setRejected)

    /* ── LOGIN ─────────────────────────────────────────────────────── */
    builder
      .addCase(loginThunk.pending,   setPending)
      .addCase(loginThunk.fulfilled, setAuthSuccess)
      .addCase(loginThunk.rejected,  setRejected)

    /* ── LOGOUT ────────────────────────────────────────────────────── */
    builder
      .addCase(logoutThunk.pending,   setPending)
      // Reset complet du store dans tous les cas (succès ou erreur serveur)
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected,  () => initialState)

    /* ── FETCH ME (bootstrap) ──────────────────────────────────────── */
    builder
      .addCase(fetchMeThunk.pending, (state) => {
        state.isLoading = true
        // Pas de reset des erreurs : le bootstrap n'est pas déclenché par l'user
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.isLoading      = false
        state.isInitialized  = true
        state.isAuth         = true
        state.user           = action.payload
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.isLoading     = false
        state.isInitialized = true
        state.isAuth        = false
        state.user          = null
      })

    /* ── COMPLETE AGENCY PROFILE ───────────────────────────────────── */
    builder
      .addCase(registerAgencyThunk.pending,   setPending)
      .addCase(registerAgencyThunk.fulfilled, (state, action) => {
        state.isLoading       = false
        state.isAuth          = true  // explicite : garantit la cohérence quel que soit le flux
        state.user            = action.payload.user
// nettoyage automatique après succès
      })
      .addCase(registerAgencyThunk.rejected, setRejected)
  },
})

/* ── Exports ─────────────────────────────────────────────────────── */
export const {
  clearErrors,
  saveAgencyDraft,
  clearAgencyDraft,
  setUser,
  resetAuth,
} = authSlice.actions

export default authSlice.reducer