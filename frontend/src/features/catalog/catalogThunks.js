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

      console.log("✅ [Thunk] Réponse brute reçue:", response);
      console.log("✅ [Thunk] response.data:", response.data);
      console.log("✅ [Thunk] response.status:", response.status);

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
      console.error("❌ [Thunk] Erreur lors du fetch cars:");
      console.error("  ├─ error.message:", error.message);
      console.error("  ├─ error.response?.status:", error.response?.status);
      console.error("  ├─ error.response?.data:", error.response?.data);
      console.error("  └─ error stack:", error);

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
      console.log(`✅ [Thunk] Car ${id} reçu:`, response.data);

      return response.data;
    } catch (error) {
      console.error(`❌ [Thunk] Erreur lors du fetch car ${id}:`, error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
