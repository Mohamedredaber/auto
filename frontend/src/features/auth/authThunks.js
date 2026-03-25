import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, me ,completeAgencyProfile } from "../../api/auth";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchMeThunk = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const data = await me();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userInfo, { rejectWithValue }) => {
    try {
      const data = await register(userInfo);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const registerAgencyThunk = createAsyncThunk(
  'auth/registerAgency',
  async (data, { rejectWithValue }) => {
    try {
      const res = await completeAgencyProfile(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)
