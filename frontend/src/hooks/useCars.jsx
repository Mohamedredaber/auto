import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars, fetchCarById } from "../features/catalog/catalogThunks";
import { clearSelectedCar } from "../features/catalog/catalogSlice";
import {
  selectAllCars,
  selectCatalogLoading,
  selectCatalogError,
  selectCatalogPagination,
  selectSelectedCar,
} from "../features/catalog/catalogSelectors";

/**
 * Hook principal pour la page Cars.
 * Encapsule tout ce qui touche au store catalog.
 *
 * @param {Object} filters - filtres actifs (search, brand, fuel, page...)
 */
export function useCars(filters = {}) {
  const dispatch = useDispatch();
  const cars       = useSelector(selectAllCars);
  const loading    = useSelector(selectCatalogLoading);
  const error      = useSelector(selectCatalogError);
  const pagination = useSelector(selectCatalogPagination);

  useEffect(() => {
    dispatch(fetchCars(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const refetch = useCallback(
    (params) => dispatch(fetchCars(params ?? filters)),
    [dispatch, filters]
  );

  return { cars, loading, error, pagination, refetch };
}

/**
 * Hook pour le détail d'une voiture (modal ou page détail).
 */
export function useCarDetail(id) {
  const dispatch    = useDispatch();
  const selectedCar = useSelector(selectSelectedCar);
  const loading     = useSelector(selectCatalogLoading);

  useEffect(() => {
    if (id) dispatch(fetchCarById(id));
    return () => { dispatch(clearSelectedCar()); };
  }, [id, dispatch]);

  return { car: selectedCar, loading };
}