import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAdminCars, fetchAdminCarsStats ,
     insertAdminCar , updateAdminCar , 
     deleteAdminCar , fetchAdminCar  } from "../../api/adminCarsApi";

import {
    fetchAdminAgenciesNames,
} from "../../api/adminAgenciesApi";

export const fetchAdminCarsThunk = createAsyncThunk(
  "adminCars/fetchCars",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminCars(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const fetchAdminCarsStatsThunk = createAsyncThunk(
  "adminCars/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminCarsStats();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const insertAdminCarThunk = createAsyncThunk(
  "adminCars/insertCar",
  async (carData, { rejectWithValue }) => {
    try {
      const { data } = await insertAdminCar(carData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message }
      );
    }
  }
);

export const updateAdminCarThunk = createAsyncThunk(
  "adminCars/updateCar",
  async ({ carId, carData }, { rejectWithValue }) => {
    try {
      const { data } = await updateAdminCar(carId, carData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message }
      );
    }
  }
);

export const deleteAdminCarThunk = createAsyncThunk(
  "adminCars/deleteCar",
  async (carId, { rejectWithValue }) => {
    try {
      await deleteAdminCar(carId);
      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
    },
);

export const fetchAdminCarThunk = createAsyncThunk(
    "adminCars/fetchCar",
    async (carId, { rejectWithValue }) => {
      try {
        const { data } = await fetchAdminCar(carId);    
        return data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data ?? { message: error.message },
        );
      }
    },
);

export const fetchAdminAgenciesNamesThunk = createAsyncThunk(
  "adminCars/fetchAgenciesNames",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminAgenciesNames();

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message }
      );
    }
  }
);