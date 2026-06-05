import { createSlice } from '@reduxjs/toolkit';
import { fetchAgencyClients  , fetchAgencyRecentClients ,fetchAgencyClientStats} from './agencyClientsThunks';

const agencyClientsSlice = createSlice({
  name: 'agencyClients',
  initialState: {
    items: [],
    recentItems: [],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 0
    },
    stats: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      filter: 'all'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', filter: 'all' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgencyClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyClients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAgencyClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erreur lors du chargement';
      })  

      .addCase(fetchAgencyRecentClients.fulfilled, (state, action) => {
        state.recentItems = action.payload;
      })
      .addCase(fetchAgencyClientStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

export const { setFilters, clearFilters } = agencyClientsSlice.actions;
export default agencyClientsSlice.reducer;