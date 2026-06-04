import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdminUsers,
  fetchAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../../api/adminUserApi";

export const fetchAdminUsersThunk = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

export const fetchAdminUserThunk = createAsyncThunk(
  "adminUsers/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await fetchAdminUser(userId);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

export const createAdminUserThunk = createAsyncThunk(
  "adminUsers/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await createAdminUser(userData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

export const updateAdminUserThunk = createAsyncThunk(
  "adminUsers/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const { data } = await updateAdminUser(userId, userData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

export const deleteAdminUserThunk = createAsyncThunk(
  "adminUsers/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await deleteAdminUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);