import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAdminCarsThunk,
  fetchAdminCarsStatsThunk,
  fetchAdminCarThunk,
  insertAdminCarThunk,
  updateAdminCarThunk,
  deleteAdminCarThunk,
  fetchAdminAgenciesNamesThunk,
} from "./adminCarsThunks";

const DEFAULT_STATS = {
  total_cars: 0,
  total_available: 0,
  total_reserved: 0,
  total_maintenance: 0,
};

const initialFilters = {
  search: "",
  status: "",
  brand: "",
  model: "",
  version: "",
  category: "",
  year: "",
  transmission: "",
  fuel: "",
  agency_name: "",
  per_page: 10,
  page: "",
};

const adminCarsSlice = createSlice({
  name: "adminCars",

  initialState: {
    cars: [],
    pagination: null,
    stats: DEFAULT_STATS,

    listLoading: false,
    listError: null,
    loading: false,
    error: null,

    filters: initialFilters,

    isFormOpen: false,
    formMode: "create", // create | edit
    selectedCar: null,

     agencies: [],
    agenciesLoading: false,
    agenciesError: null,
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

    openAdminCarCreateModal: (state) => {
      state.isFormOpen = true;
      state.formMode = "create";
      state.selectedCar = null;
      state.listError = null;
    },

    openAdminCarEditModal: (state, action) => {
      state.isFormOpen = true;
      state.formMode = "edit";
      state.selectedCar = action.payload;
      state.listError = null;
    },

    closeAdminCarModal: (state) => {
      state.isFormOpen = false;
      state.formMode = "create";
      state.selectedCar = null;
      state.listError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCarsThunk.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })

      .addCase(fetchAdminCarsThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.pagination = action.payload.pagination;
        state.cars = action.payload?.data || [];
      })

      .addCase(fetchAdminCarsThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload?.message || "Erreur lors du chargement";
        state.cars = [];
        state.pagination = null;
      })

      .addCase(fetchAdminCarsStatsThunk.fulfilled, (state, action) => {
        state.stats = action.payload || DEFAULT_STATS;
      })

      .addCase(fetchAdminCarsStatsThunk.rejected, (state) => {
        state.stats = DEFAULT_STATS;
      })

      .addCase(fetchAdminCarThunk.fulfilled, (state, action) => {
        const index = state.cars.findIndex(
          (car) => car.id === action.payload.id
        );

        if (index !== -1) {
          state.cars[index] = action.payload;
        } else {
          state.cars.unshift(action.payload);
        }

        state.selectedCar = action.payload;
      })

      .addCase(fetchAdminCarThunk.rejected, (state, action) => {
        state.listError =
          action.payload?.message || "Erreur lors du chargement de la voiture";
      })

      .addCase(insertAdminCarThunk.fulfilled, (state, action) => {
        state.cars.unshift(action.payload);
        state.isFormOpen = false;
      })

      .addCase(insertAdminCarThunk.rejected, (state, action) => {
        state.listError =
          action.payload?.message || "Erreur lors de l'ajout de la voiture";
      })

      .addCase(updateAdminCarThunk.fulfilled, (state, action) => {
        const index = state.cars.findIndex(
          (car) => car.id === action.payload.id
        );

        if (index !== -1) {
          state.cars[index] = action.payload;
        }

        state.selectedCar = action.payload;
        state.isFormOpen = false;
      })

      .addCase(updateAdminCarThunk.rejected, (state, action) => {
        state.listError =
          action.payload?.message ||
          "Erreur lors de la mise à jour de la voiture";
      })

      .addCase(deleteAdminCarThunk.fulfilled, (state, action) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
      })

      .addCase(deleteAdminCarThunk.rejected, (state, action) => {
        state.listError =
          action.payload?.message ||
          "Erreur lors de la suppression de la voiture";
      })

.addCase(fetchAdminAgenciesNamesThunk.pending, (state) => {
  state.agenciesLoading = true;
  state.agenciesError = null;
})

.addCase(fetchAdminAgenciesNamesThunk.fulfilled, (state, action) => {
  state.agenciesLoading = false;
 
  state.agencies = action.payload || [];
})

.addCase(fetchAdminAgenciesNamesThunk.rejected, (state, action) => {
  state.agenciesLoading = false;
  state.agenciesError =
    action.payload?.message || "Erreur lors du chargement des agences";
})
  },
});

export const {
  setFilters,
  resetFilters,
  clearListError,
  openAdminCarCreateModal,
  openAdminCarEditModal,
  closeAdminCarModal,
} = adminCarsSlice.actions;

export default adminCarsSlice.reducer;



