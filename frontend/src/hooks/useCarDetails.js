import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import { fetchCarById } from "../../features/catalog/catalogThunks";
=======
import { fetchCarById } from "../features/catalog/catalogThunks";
>>>>>>> filtragepulicwithback
import {
  selectSelectedCar,
  selectCatalogLoading,
  selectCatalogError,
<<<<<<< HEAD
} from "../../features/catalog/catalogSelectors";

/**
 * Hook personnalisé pour charger les détails d'une voiture
 * @param {number|string} carId - L'ID de la voiture
 * @returns {Object} { car, loading, error }
=======
} from "../features/catalog/catalogSelectors";

/**
 * Hook personnalisé pour charger les détails d'une voiture
 * @param {number|string} carId - L'ID de la voiture à charger
 * @returns {Object} {car, loading, error}
>>>>>>> filtragepulicwithback
 */
export function useCarDetails(carId) {
  const dispatch = useDispatch();
  const car = useSelector(selectSelectedCar);
  const loading = useSelector(selectCatalogLoading);
  const error = useSelector(selectCatalogError);

  useEffect(() => {
    if (carId) {
<<<<<<< HEAD
      console.log(`🚗 Chargement des détails de la voiture ${carId}`);
=======
>>>>>>> filtragepulicwithback
      dispatch(fetchCarById(carId));
    }
  }, [carId, dispatch]);

<<<<<<< HEAD
  return {
    car,
    loading,
    error,
  };
=======
  return { car, loading, error };
>>>>>>> filtragepulicwithback
}
