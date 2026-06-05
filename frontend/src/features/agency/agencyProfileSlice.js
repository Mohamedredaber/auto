import { createSlice } from '@reduxjs/toolkit';
import { fetchAgencyProfile, updateAgencyProfile, updateAgencyLogo } from './agencyProfileThunks';

const agencyProfileSlice = createSlice({
    name: 'agencyProfile',
    initialState: {
        data: null,
        loading: false,
        error: null,
        updateSuccess: false
    },
    reducers: {
        resetStatus: (state) => {
            state.updateSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchAgencyProfile.pending, (state) => { state.loading = true; })
            .addCase(fetchAgencyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchAgencyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateAgencyProfile.fulfilled, (state, action) => {
                state.data = action.payload;
                state.updateSuccess = true;
            })
            // Update Logo
            .addCase(updateAgencyLogo.fulfilled, (state, action) => {
                if (state.data) state.data.logo_url = action.payload;
            });
    }
});

export const { resetStatus } = agencyProfileSlice.actions;
export default agencyProfileSlice.reducer;