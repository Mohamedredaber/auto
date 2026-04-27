export const selectDashboardStats = (state) => state.dashboard.data.stats;
export const selectRecentBookings = (state) => state.dashboard.data.recent_bookings;
export const selectChartData = (state) => state.dashboard.data.chart_data;
export const selectIsDashboardLoading = (state) => state.dashboard.loading;
export const selectTrimestreGrowth = (state) => 
    state.dashboard.data.performance?.trimestre_growth ?? 0;