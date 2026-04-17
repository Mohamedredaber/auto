import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCars, getCarById } from "../../api/catalogApi";

export const fetchCars = createAsyncThunk(
  "catalog/fetchCars",
  async (params, { rejectWithValue }) => {
    try {
      console.log("🚀 [fetchCars] Appel API avec params:", params);

      const response = await getCars(params);

      // Log structure analysis
      if (Array.isArray(response.data)) {
        console.log(
          "📦 fetchCars: Structure TABLEAU SIMPLE (data est un array)",
        );
      } else if (response.data?.data && response.data?.meta) {
        console.log("📦 fetchCars: Structure PAGINÉE (data + meta)", {
          count: response.data.data.length,
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          total: response.data.meta.total,
        });
      } else {
        console.warn(
          "⚠️  fetchCars: Structure INATTENDUE",
          Object.keys(response.data || {}),
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ fetchCars: Erreur", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchCarById = createAsyncThunk(
  "catalog/fetchCarById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🚀 [fetchCarById] id=${id}`);

      const response = await getCarById(id);

      console.log(
        `✅ [fetchCarById] Voiture chargée:`,
        response.data.brand,
        response.data.model,
      );

      return response.data;
    } catch (error) {
      console.error(`❌ [fetchCarById] Erreur pour id=${id}:`, error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
