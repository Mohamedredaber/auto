const selectAdminCarsState = (state) => state.adminCars;

export const selectAdminCars = (state) => selectAdminCarsState(state).cars;

export const selectAdminCarsPagination = (state) =>
  selectAdminCarsState(state).pagination;

export const selectAdminCarsStats = (state) =>
  selectAdminCarsState(state).stats;

export const selectAdminCarsLoading = (state) =>
  selectAdminCarsState(state).listLoading;

export const selectAdminCarsError = (state) =>
  selectAdminCarsState(state).listError;

export const selectAdminCarsFilters = (state) =>
  selectAdminCarsState(state).filters;

export const selectAdminCarById = (state, carId) => {
  const cars = selectAdminCars(state);
  return cars.find((car) => car.id === Number(carId));
};

export const selectAdminCarsStatusLabels = (state) => {
  const stats = selectAdminCarsStats(state);

  return {
    available: `Disponible (${stats.total_available || 0})`,
    reserved: `Réservée (${stats.total_reserved || 0})`,
    maintenance: `Maintenance (${stats.total_maintenance || 0})`,
  };
};

export const selectAdminCarsStatusOptions = (state) => {
  const labels = selectAdminCarsStatusLabels(state);

  return [
    { value: "", label: "Tous les statuts" },
    { value: "available", label: labels.available },
    { value: "reserved", label: labels.reserved },
    { value: "maintenance", label: labels.maintenance },
  ];
};

export const selectAdminFormOpen = (state) => state.adminCars.isFormOpen;
export const selectAdminFormMode = (state) => state.adminCars.formMode;
export const selectAdminSelectedCar = (state) => state.adminCars.selectedCar;

export const selectAdminAgenciesNames = (state) =>
  state.adminCars.agencies;
export const selectAdminAgenciesLoading = (state) =>
  state.adminCars.agenciesLoading;
export const selectAdminAgenciesError = (state) =>
  state.adminCars.agenciesError;