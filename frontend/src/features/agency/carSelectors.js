const selectCarState = (state) => state.cars;

export const selectAllCars = (state) => selectCarState(state).cars;
export const selectCars = (state) => selectAllCars(state);
export const selectSingleCar = (state) => selectCarState(state).singleCar;
export const selectCarLoading = (state) => selectCarState(state).isLoading;
export const selectCarIsLoading = (state) => selectCarLoading(state);
export const selectCarErrors = (state) => selectCarState(state).errors;

export const selectIsFormOpen = (state) => selectCarState(state).isFormOpen;
export const selectIsDetailsOpen = (state) => selectCarState(state).isDetailsOpen;
export const selectFormMode = (state) => selectCarState(state).formMode;

export const selectIsEditing = (state) => selectFormMode(state) === "edit";

export const selectCarById = (state, carId) =>
    selectCarState(state).cars.find((car) => car.id === carId);
