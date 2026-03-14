import { createSlice } from "@reduxjs/toolkit";
import { login, register, logout, me } from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(me.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;