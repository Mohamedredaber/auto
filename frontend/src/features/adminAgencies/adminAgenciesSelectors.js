const selectAdminAgenciesState = (state) => state.adminAgencies;

export const selectAdminAgencies = (state) => selectAdminAgenciesState(state).agencies;
export const selectAdminAgenciesPagination = (state) =>
  selectAdminAgenciesState(state).pagination;
export const selectAdminAgenciesStats = (state) => selectAdminAgenciesState(state).stats;
export const selectAdminAgenciesCities = (state) => selectAdminAgenciesState(state).cities;
export const selectAdminAgenciesLoading = (state) =>
  selectAdminAgenciesState(state).listLoading;
export const selectAdminAgenciesError = (state) =>
  selectAdminAgenciesState(state).listError;
export const selectAdminAgenciesDeleting = (state) =>
  selectAdminAgenciesState(state).deleting;
export const selectAdminAgenciesSaving = (state) =>
  selectAdminAgenciesState(state).saving;
export const selectAdminAgenciesSaveError = (state) =>
  selectAdminAgenciesState(state).saveError;
export const selectAdminAgenciesFilters = (state) =>
  selectAdminAgenciesState(state).filters;
