<<<<<<< HEAD
export const selectCarErrors = (state) => state.car.errors;
export const selectCarIsLoading = (state) => state.car.isLoading;
export const selectCars = (state) => state.car.cars;
export const selectSingleCar = (state) => state.car.singleCar;
=======
// Sélecteur de base pour récupérer la branche 'cars' du state
const selectCarState = (state) => state.cars;

// Sélecteurs de données
export const selectAllCars = (state) => selectCarState(state).cars;
export const selectSingleCar = (state) => selectCarState(state).singleCar;
export const selectCarLoading = (state) => selectCarState(state).isLoading;
export const selectCarErrors = (state) => selectCarState(state).errors;

// Sélecteurs de l'UI (Affichage conditionnel)
export const selectIsFormOpen = (state) => selectCarState(state).isFormOpen;
export const selectIsDetailsOpen = (state) => selectCarState(state).isDetailsOpen;
export const selectFormMode = (state) => selectCarState(state).formMode;

// Sélecteurs mémoïsés ou dérivés (Optionnel mais puissant)
export const selectIsEditing = (state) => selectFormMode(state) === "edit";

export const selectCarById = (state, carId) => 
    selectCarState(state).cars.find(car => car.id === carId);
>>>>>>> dashagency
