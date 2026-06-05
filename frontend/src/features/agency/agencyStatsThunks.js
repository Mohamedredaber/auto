// src/features/agency/agencyStatsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import{ getstatisticsagency} from '../../api/agency/statistiqueApi';

export const fetchAgencyStatistics = createAsyncThunk(
  'agencyStats/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getstatisticsagency();
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);