import { createSlice } from '@reduxjs/toolkit';
import { getAgencyProfile } from './agencyPublicThunk';
const agencyPublicSlice = createSlice({
    name: 'agencyPublic',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAgencyProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAgencyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getAgencyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = agencyPublicSlice.actions;
export default agencyPublicSlice.reducer