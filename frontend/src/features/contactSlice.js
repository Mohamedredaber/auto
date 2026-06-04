// src/store/slices/contactSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendContactMessage = createAsyncThunk(
  'contact/send',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/contact', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || 'Erreur envoi');
    }
  }
);

export const fetchContactMessages = createAsyncThunk(
  'contact/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/admin/contact');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const replyToMessage = createAsyncThunk(
  'contact/reply',
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/admin/contact/${id}/reply`, { reply });
      return { id, reply, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'contact/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/contact/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    messages:  [],
    loading:   false,
    sending:   false,
    success:   false,
    errors:    null,
  },
  reducers: {
    resetContactState: (state) => {
      state.success = false;
      state.errors  = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // send
      .addCase(sendContactMessage.pending,   (s) => { s.sending = true;  s.errors = null; })
      .addCase(sendContactMessage.fulfilled, (s) => { s.sending = false; s.success = true; })
      .addCase(sendContactMessage.rejected,  (s, a) => { s.sending = false; s.errors = a.payload; })
      // fetchAll
      .addCase(fetchContactMessages.pending,   (s) => { s.loading = true; })
      .addCase(fetchContactMessages.fulfilled, (s, a) => { s.loading = false; s.messages = a.payload.data; })
      .addCase(fetchContactMessages.rejected,  (s) => { s.loading = false; })
      // reply
      .addCase(replyToMessage.fulfilled, (s, a) => {
        const msg = s.messages.find(m => m.id === a.payload.id);
        if (msg) { msg.status = 'replied'; msg.reply = a.payload.reply; }
      })
      // delete
      .addCase(deleteMessage.fulfilled, (s, a) => {
        s.messages = s.messages.filter(m => m.id !== a.payload);
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;