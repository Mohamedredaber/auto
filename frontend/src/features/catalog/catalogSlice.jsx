import { createSlice } from "@reduxjs/toolkit";
import { fetchCars, fetchCarById } from "./catalogThunks";

const initialState = {
  cars: [],
  pagination: null, // Stockera directement meta/pagination Laravel
  selectedCar: null,
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    clearSelectedCar: (state) => {
      state.selectedCar = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          // Réponse simple : tableau direct (sans Laravel Resource)
          state.cars = action.payload;
          state.pagination = null;
        } else if (action.payload.data && action.payload.meta) {
          // Réponse paginée : { data: [...], meta: {...} }
          state.cars = action.payload.data;
          state.pagination = action.payload.meta;
        } else if (action.payload.data) {
          // Fallback si seulement data
          state.cars = action.payload.data;
          state.pagination = null;
        } else {
          // Fallback complet
          state.cars = [];
          state.pagination = null;
        }
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cars = [];
        state.pagination = null;
      })

      .addCase(fetchCarById.pending, (state) => {
        state.loading = true;
        state.selectedCar = null;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCar = action.payload;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedCar } = catalogSlice.actions;
export default catalogSlice.reducer;
