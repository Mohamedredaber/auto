import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAgencyCarsThunk,
  createCarThunk,
  updateCarThunk,
  deleteCarThunk,
  fetchSingleCarThunk,
} from "./carThunks";
const initialState = {
  cars: [],
  singleCar: null,
  isLoading: false,
  errors: null,
  isFormOpen: false,
  isDetailsOpen: false,
  formMode: "add",
};
const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = null;
    },
    openAddForm: (state) => {
      state.isFormOpen = true;
      state.formMode = "add";
      state.singleCar = null;
    },
    // Ouvrir le formulaire pour l'édition
    openEditForm: (state, action) => {
      state.isFormOpen = true;
      state.formMode = "edit";
      state.singleCar = action.payload; // On stocke la voiture à modifier
    },
    openDetails: (state, action) => {
      state.isDetailsOpen = true;
      state.singleCar = action.payload;
    },
    closeModals: (state) => {
      state.isFormOpen = false;
      state.isDetailsOpen = false;
      state.singleCar = null;
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH AGENCY CARS
      .addCase(fetchAgencyCarsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAgencyCarsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload;
      })
      .addCase(fetchAgencyCarsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // CREATE CAR
      // CREATE CAR
      .addCase(createCarThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(createCarThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars.unshift(action.payload); // Zid tonobil l-jdida f l-wel dyal l-array
      })
      .addCase(createCarThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload; // Hna ghadi i-kouno les erreurs d'validation dyal Laravel
      })

      // UPDATE CAR
      .addCase(updateCarThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(updateCarThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Modifi l-voiture f l-lista f blastha
        const index = state.cars.findIndex(
          (car) => car.id === action.payload.id,
        );
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        state.singleCar = action.payload;
      })
      .addCase(updateCarThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // DELETE CAR
      .addCase(deleteCarThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCarThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // 7iyyed tonobil men l-state b'l-ID (action.payload hwa l-ID li rj3nna f thunk)
        state.cars = state.cars.filter((car) => car.id !== action.payload);
      })
      .addCase(deleteCarThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      // FETCH SINGLE CAR
      .addCase(fetchSingleCarThunk.pending, (state) => {
        state.isLoading = true;
        state.singleCar = null;
      })
      .addCase(fetchSingleCarThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleCar = action.payload;
      })
      .addCase(fetchSingleCarThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export const {
  clearErrors,
  openAddForm,
  openEditForm,
  openDetails,
  closeModals,
} = carSlice.actions;
export default carSlice.reducer;
