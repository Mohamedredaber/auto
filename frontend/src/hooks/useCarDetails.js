import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarById } from "../features/catalog/catalogThunks";
import {
  selectSelectedCar,
  selectCatalogLoading,
  selectCatalogError,
} from "../features/catalog/catalogSelectors";

/**
 * Hook personnalisé pour charger les détails d'une voiture
 * @param {number|string} carId - L'ID de la voiture à charger
 * @returns {Object} {car, loading, error}
 */
export function useCarDetails(carId) {
  const dispatch = useDispatch();
  const car = useSelector(selectSelectedCar);
  const loading = useSelector(selectCatalogLoading);
  const error = useSelector(selectCatalogError);

  useEffect(() => {
    if (carId) {
      dispatch(fetchCarById(carId));
    }
  }, [carId, dispatch]);

  return { car, loading, error };
}
