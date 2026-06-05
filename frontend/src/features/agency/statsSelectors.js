
export const selectStatsSummary = (state) => state.agencyStats.summary;
export const selectStatsCharts = (state) => state.agencyStats.charts;
export const selectTopCars = (state) => state.agencyStats.topCars;
export const selectStatsLoading = (state) => state.agencyStats.loading;

export const selectBookingsChartData = (state) => 
  state.agencyStats.charts.bookings.map(item => ({
    name: `Mois ${item.month}`, 
    total: item.total
  }));