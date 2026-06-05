import { createSlice } from "@reduxjs/toolkit";
import {
    updateUserProfile,
    fetchUserProfile,
} from "./profileThunks";

const initialState = {
    profile: null,
    loading: false,
    error: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Tu peux ajouter des reducers synchrones ici si besoin (ex: clearError)
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- Fetch Profile --- */
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // On stocke les données reçues
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Update Profile --- */
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;  // ✅ action.payload est déjà le profil
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;