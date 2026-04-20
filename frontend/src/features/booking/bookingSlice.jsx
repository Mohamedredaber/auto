import { createSlice } from "@reduxjs/toolkit";
import { fetchcarselected  , createBookingThunk} from "./bookingThunks";

const initialState = {
  list: [],
  currentBooking: null,
  carselected: null,
  isLoading: false,
  error: null,
  success: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.currentBooking = action.payload;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchcarselected.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchcarselected.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carselected = action.payload;
      })
      .addCase(fetchcarselected.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
