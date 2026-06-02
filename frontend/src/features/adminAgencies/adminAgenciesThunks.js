import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdminAgencies,
  fetchAdminAgenciesStats,
  fetchAdminAgenciesCities,
  deleteAdminAgency,
  createAdminAgency,
  updateAdminAgency,
 
} from "../../api/adminAgenciesApi";

export const fetchAdminAgenciesThunk = createAsyncThunk(
  "adminAgencies/fetchAgencies",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminAgencies(params);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const fetchAdminAgenciesStatsThunk = createAsyncThunk(
  "adminAgencies/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminAgenciesStats();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const fetchAdminAgenciesCitiesThunk = createAsyncThunk(
  "adminAgencies/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminAgenciesCities();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const deleteAdminAgencyThunk = createAsyncThunk(
  "adminAgencies/deleteAgency",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAdminAgency(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const createAdminAgencyThunk = createAsyncThunk(
  "adminAgencies/createAgency",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createAdminAgency(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

export const updateAdminAgencyThunk = createAsyncThunk(
  "adminAgencies/updateAgency",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateAdminAgency(id, payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? { message: error.message },
      );
    }
  },
);

