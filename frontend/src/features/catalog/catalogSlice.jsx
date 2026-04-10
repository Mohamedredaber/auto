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
                state.cars = action.payload.data; 
                state.pagination = {
                    currentPage: action.payload.meta.current_page,
                    lastPage: action.payload.meta.last_page,
                    total: action.payload.meta.total,
                };
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