export const selectAllClients = (state) => state.agencyClients.items;
export const selectClientsLoading = (state) => state.agencyClients.loading;
export const selectClientsMeta = (state) => state.agencyClients.meta;
export const selectClientsFilters = (state) => state.agencyClients.filters;
export const selectTopClients = (state) => 
  state.agencyClients.items.filter(client => client.bookings_count >= 5);
export const selectRecentClients = (state) => state.agencyClients.recentItems;
export const selectClientStats = (state) => state.agencyClients.stats;