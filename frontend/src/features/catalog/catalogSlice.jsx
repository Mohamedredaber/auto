import { createSlice } from "@reduxjs/toolkit";
import { fetchCars, fetchCarById } from "./catalogThunks";

const initialState = {
  cars: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
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
          // Réponse simple : tableau direct
          state.cars = action.payload;
          state.pagination = {
            currentPage: 1,
            lastPage: 1,
            total: action.payload.length || 0,
          };
        } else if (action.payload.data) {
          // Réponse paginée : { data: [...], meta: {...} }
          state.cars = action.payload.data;
          state.pagination = {
            currentPage: action.payload.meta?.current_page || 1,
            lastPage: action.payload.meta?.last_page || 1,
            total: action.payload.meta?.total || 0,
          };
        } else {
          // Fallback
          state.cars = [];
          state.pagination = {
            currentPage: 1,
            lastPage: 1,
            total: 0,
          };
        }
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
