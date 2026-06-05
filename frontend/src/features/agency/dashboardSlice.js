import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardThunks';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: {
      stats: {
        total_voitures: 0,
        voitures_disponibles: 0,
        reservations_actives: 0,
        revenu_mensuel: 0
      },
      recent_bookings: [],
      chart_data: [],
      performance: { trimestre_growth: 0 }
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;