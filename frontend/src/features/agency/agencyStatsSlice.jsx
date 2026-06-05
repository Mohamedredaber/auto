// src/features/agency/agencyStatsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchAgencyStatistics } from './agencyStatsThunks';

const agencyStatsSlice = createSlice({
  name: 'agencyStats',
  initialState: {
    summary: {},
    charts: { bookings: [], revenue: [] },
    topCars: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgencyStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgencyStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data.summary;
        state.charts = action.payload.data.charts;
        state.topCars = action.payload.data.top_cars;
      })
      .addCase(fetchAgencyStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erreur stats';
      });
  }
});

export default agencyStatsSlice.reducer;