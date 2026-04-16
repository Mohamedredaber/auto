import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCars, getCarById } from "../../api/catalogApi";

export const fetchCars = createAsyncThunk(
  "catalog/fetchCars",
  async (params, { rejectWithValue }) => {
    try {
      console.log(
        "🚀 [Thunk] fetchCars - Appel API getCars avec params:",
        params,
      );

      const response = await getCars(params);



      // Log structure analysis
      if (Array.isArray(response.data)) {
        console.log("📦 Structure: TABLEAU SIMPLE (data est un array)");
      } else if (response.data?.data) {
        console.log("📦 Structure: RÉPONSE PAGINÉE (data.data + data.meta)");
      } else {
        console.log("📦 Structure: AUTRE", Object.keys(response.data || {}));
      }

      return response.data;
    } catch (error) {
     
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchCarById = createAsyncThunk(
  "catalog/fetchCarById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🚀 [Thunk] fetchCarById - id=${id}`);

      const response = await getCarById(id);

      return response.data;
    } catch (error) {
      console.error(`❌ [Thunk] Erreur lors du fetch car ${id}:`, error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
