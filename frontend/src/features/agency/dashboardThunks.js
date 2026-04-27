import { createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardData } from '../../api/agency/dashboardApi'; // تأكد من المسار فين حطيتي الدالة ديالك

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DashboardData();
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur de connexion");
    }
  }
);