import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminAgenciesThunk,
  fetchAdminAgenciesStatsThunk,
  fetchAdminAgenciesCitiesThunk,
  deleteAdminAgencyThunk,
  createAdminAgencyThunk,
  updateAdminAgencyThunk,
} from "./adminAgenciesThunks";

const DEFAULT_STATS = {
  total_agencies: 0,
  total_agencies_verified: 0,
  total_agencies_inverified: 0,
  total_agencies_wait: 0,
};

const initialFilters = {
  name: "",
  city: "",
  is_verified: "",
  per_page: 10,
  page: "",
};

const adminAgenciesSlice = createSlice({
  name: "adminAgencies",
  initialState: {
    agencies: [],
    pagination: null,
    stats: DEFAULT_STATS,
    cities: [],
    listLoading: false,
    listError: null,
    deleting: false,
    saving: false,
    saveError: null,
    filters: initialFilters,
    names: [],
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = { ...initialFilters };
    },
    clearListError: (state) => {
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAgenciesThunk.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAdminAgenciesThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.pagination = action.payload;
        state.agencies = action.payload?.data || [];
      })
      .addCase(fetchAdminAgenciesThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload?.message || "Erreur lors du chargement";
        state.agencies = [];
        state.pagination = null;
      })
      .addCase(fetchAdminAgenciesStatsThunk.fulfilled, (state, action) => {
        state.stats = action.payload || DEFAULT_STATS;
      })
      .addCase(fetchAdminAgenciesStatsThunk.rejected, (state) => {
        state.stats = DEFAULT_STATS;
      })
      .addCase(fetchAdminAgenciesCitiesThunk.fulfilled, (state, action) => {
        state.cities = action.payload || [];
      })
      .addCase(fetchAdminAgenciesCitiesThunk.rejected, (state) => {
        state.cities = [];
      })
      .addCase(deleteAdminAgencyThunk.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteAdminAgencyThunk.fulfilled, (state, action) => {
        state.deleting = false;
        state.agencies = state.agencies.filter((agency) => agency.id !== action.payload);
      })
      .addCase(deleteAdminAgencyThunk.rejected, (state, action) => {
        state.deleting = false;
        state.listError = action.payload?.message || "Erreur lors de la suppression";
      })
      .addCase(createAdminAgencyThunk.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(createAdminAgencyThunk.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createAdminAgencyThunk.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload?.message || "Erreur lors de l'enregistrement";
      })
      .addCase(updateAdminAgencyThunk.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateAdminAgencyThunk.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateAdminAgencyThunk.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload?.message || "Erreur lors de l'enregistrement";
      })
   
  },
});

export const { setFilters, resetFilters, clearListError } = adminAgenciesSlice.actions;
export default adminAgenciesSlice.reducer;
