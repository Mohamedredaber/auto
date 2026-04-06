import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import carReducer from "../features/agency/carSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    
    car: carReducer,
  },
});
