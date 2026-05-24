import { createAsyncThunk } from '@reduxjs/toolkit';
import { AgencyClients ,AgencyRecentClients ,AgencyClientStats }from '../../api/agency/clientApi';

export const fetchAgencyClients = createAsyncThunk(
  'agencyClients/fetchClients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await AgencyClients(params);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAgencyRecentClients = createAsyncThunk( 
  'agencyClients/fetchRecentClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AgencyRecentClients();
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAgencyClientStats = createAsyncThunk( 
  'agencyClients/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AgencyClientStats();
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
