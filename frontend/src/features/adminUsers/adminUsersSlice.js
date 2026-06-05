import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminUsersThunk,
  fetchAdminUserThunk,
  createAdminUserThunk,
  updateAdminUserThunk,
  deleteAdminUserThunk,
} from "./adminUsersThunks";

const initialState = {
  users: [],
  selectedUser: null,
  pagination: null,
  loading: false,
  error: null,
  successMessage: null,

  filters: {
    search: "",
    role: "",
    agency_id: "",
    agency_name: "",
    per_page: 10,
    page: "",
  },
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUsersError: (state) => {
      state.error = null;
    },
    clearAdminUsersSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedAdminUser: (state) => {
      state.selectedUser = null;
    },
    setFilters: (state, action) => {
        state.filters = {
            ...state.filters,
            ...action.payload,
        };
        },

        resetFilters: (state) => {
        state.filters = {
            search: "",
            role: "",
            agency_id: "",
            agency_name: "",
            per_page: 10,
            page: "",
        };
        },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Erreur lors du chargement.";
      })

      .addCase(fetchAdminUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchAdminUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Utilisateur introuvable.";
      })

      .addCase(createAdminUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.successMessage = "Utilisateur créé avec succès.";
      })
      .addCase(createAdminUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Erreur lors de la création.";
      })

      .addCase(updateAdminUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminUserThunk.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        state.selectedUser = action.payload;
        state.successMessage = "Utilisateur mis à jour avec succès.";
      })
      .addCase(updateAdminUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Erreur lors de la mise à jour.";
      })

      .addCase(deleteAdminUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.successMessage = "Utilisateur supprimé avec succès.";
      })
      .addCase(deleteAdminUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Erreur lors de la suppression.";
      });
  },
});

export const {
  clearAdminUsersError,
  clearAdminUsersSuccessMessage,
  clearSelectedAdminUser,
    setFilters,
  resetFilters,
} = adminUsersSlice.actions;



export default adminUsersSlice.reducer;