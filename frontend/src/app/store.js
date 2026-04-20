import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import carReducer from "../features/agency/carSlice";
import catalogReducer from "../features/catalog/catalogSlice";
import bookingReducer from "../features/booking/bookingSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    cars: carReducer,
    booking: bookingReducer
  },
});
